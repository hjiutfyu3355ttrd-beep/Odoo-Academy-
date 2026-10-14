/**
 * Auth + Admin + Cloud progress sync (Supabase RPC)
 * - الحساب: الاسم + رقم الهاتف + كلمة السر
 * - أول حساب يتم تسجيله يصبح مدير الموقع تلقائياً
 */
const Auth = {
  URL: 'https://umbhzyjrvievrebwxrxq.supabase.co',
  KEY: 'sb_publishable_yYoKljykMP7zPkhT0hu-ig_pPucdQHt',
  PUBLIC_ROUTES: ['landing', 'login', 'register'],
  session: null,      // { token, user:{id,name,phone,is_admin} }
  _syncTimer: null,
  _adminUsers: [],

  // ---------- helpers ----------
  ar() { return AppState.get().settings.language === 'ar'; },
  tr(ar, en) { return this.ar() ? ar : en; },
  esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },
  isLoggedIn() { return !!(this.session && this.session.token); },
  isAdmin() { return !!(this.session && this.session.user && this.session.user.is_admin); },

  errorText(code) {
    const m = {
      invalid_name: ['الاسم غير صالح (حرفان على الأقل)', 'Invalid name (min 2 characters)'],
      invalid_phone: ['رقم الهاتف غير صالح', 'Invalid phone number'],
      weak_password: ['كلمة السر يجب ألا تقل عن 6 أحرف', 'Password must be at least 6 characters'],
      phone_exists: ['رقم الهاتف مسجل بالفعل، سجّل الدخول بدلاً من ذلك', 'Phone already registered, please log in'],
      invalid_credentials: ['رقم الهاتف أو كلمة السر غير صحيحة', 'Wrong phone number or password'],
      too_many_attempts: ['محاولات كثيرة، حاول بعد 15 دقيقة', 'Too many attempts, try again in 15 minutes'],
      forbidden: ['غير مسموح لك بهذه العملية', 'Not allowed'],
      cannot_delete_self: ['لا يمكنك حذف حسابك', 'You cannot delete your own account'],
      network: ['تعذر الاتصال بالخادم، تأكد من الإنترنت', 'Cannot reach the server, check your connection']
    };
    const e = m[code];
    return e ? this.tr(e[0], e[1]) : this.tr('حدث خطأ غير متوقع', 'Unexpected error');
  },

  async rpc(fn, args, opts = {}) {
    let res;
    try {
      res = await fetch(`${this.URL}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: this.KEY, Authorization: `Bearer ${this.KEY}` },
        body: JSON.stringify(args || {}),
        keepalive: !!opts.keepalive
      });
    } catch (e) {
      const err = new Error('network'); err.code = 'network'; throw err;
    }
    let data = null;
    try { data = await res.json(); } catch (e) { /* void functions return empty body */ }
    if (!res.ok) {
      const code = (data && data.message) || 'error';
      if (code === 'unauthorized' && this.isLoggedIn()) this.expire();
      const err = new Error(code); err.code = code; throw err;
    }
    return data;
  },

  // ---------- session ----------
  saveSession() { storage.set('session', this.session); },
  clearSession() { this.session = null; storage.remove('session'); },

  expire() {
    this.clearSession();
    this.resetLocalState();
    this.updateChrome();
    if (window.UI) UI.showToast(this.tr('انتهت الجلسة، سجّل الدخول من جديد', 'Session expired, please log in again'), 'incorrect');
    Router.navigate('/login');
  },

  resetLocalState() {
    const st = AppState.state;
    const fresh = AppState.defaultState();
    fresh.user.xp = 0; fresh.user.level = 1; fresh.user.streak = 0;
    fresh.settings.language = st.settings.language;
    fresh.settings.theme = st.settings.theme;
    AppState.state = fresh;
    storage.setState(fresh);
    AppState.applySettings();
  },

  applyRemoteProgress(progress, user) {
    if (progress && typeof progress === 'object') {
      const cur = AppState.state.settings;
      AppState.state = AppState.mergeDeep(AppState.defaultState(), progress);
      // keep the device's current language/theme
      AppState.state.settings.language = cur.language;
      AppState.state.settings.theme = cur.theme;
    }
    AppState.state.user.name = user.name;
    AppState.updateStreak();
    AppState.applySettings();
    storage.setState(AppState.state);
  },

  async bootstrap() {
    const saved = storage.get('session', null);
    if (!saved || !saved.token) return;
    this.session = saved;
    try {
      const r = await this.rpc('academy_me', { p_token: saved.token });
      this.session.user = r.user;
      this.saveSession();
      this.applyRemoteProgress(r.progress, r.user);
    } catch (e) {
      if (e.code === 'unauthorized') { this.clearSession(); this.resetLocalState(); }
      // network error: keep the session, work from local copy
    }
    this.updateChrome();
  },

  async register(name, phone, password) {
    const r = await this.rpc('academy_register', { p_name: name, p_phone: phone, p_password: password });
    if (r.error) throw Object.assign(new Error(r.error), { code: r.error });
    this.session = { token: r.token, user: r.user };
    this.saveSession();
    AppState.state.user.name = r.user.name;   // keep any local progress and upload it
    this.syncNow();
    this.updateChrome();
  },

  async login(phone, password) {
    const r = await this.rpc('academy_login', { p_phone: phone, p_password: password });
    if (r.error) throw Object.assign(new Error(r.error), { code: r.error });
    this.session = { token: r.token, user: r.user };
    this.saveSession();
    this.applyRemoteProgress(r.progress, r.user);
    if (!r.progress) this.syncNow();
    this.updateChrome();
  },

  async logout() {
    const token = this.session && this.session.token;
    if (token) { try { await this.rpc('academy_logout', { p_token: token }); } catch (e) { /* ignore */ } }
    this.clearSession();
    this.resetLocalState();
    this.updateChrome();
    Router.navigate('/landing');
    UI.renderLanding();
  },

  // ---------- progress sync ----------
  scheduleSync() {
    if (!this.isLoggedIn()) return;
    clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this.syncNow(), 1500);
  },
  async syncNow(opts = {}) {
    if (!this.isLoggedIn()) return;
    clearTimeout(this._syncTimer);
    try {
      await this.rpc('academy_save_progress', { p_token: this.session.token, p_state: AppState.get() }, opts);
    } catch (e) { console.warn('sync failed', e.code); }
  },

  // ---------- chrome (header / sidebar) ----------
  updateChrome() {
    const nav = document.getElementById('nav-admin');
    if (nav) {
      nav.classList.toggle('hidden', !this.isAdmin());
      const lbl = nav.querySelector('span:not(.nav-icon)');
      if (lbl) lbl.textContent = this.tr('لوحة الإدارة', 'Admin');
    }
    const um = document.querySelector('.user-menu');
    if (um && !um._authBound) {
      um._authBound = true;
      um.addEventListener('click', () => {
        if (!this.isLoggedIn()) return;
        const u = this.session.user;
        UI.showModal(
          `<div style="text-align:center"><h3>${this.esc(u.name)}</h3>
           <p class="text-muted" dir="ltr">${this.esc(u.phone)}</p>
           <p class="mt-3">${this.tr('هل تريد تسجيل الخروج؟', 'Do you want to log out?')}</p></div>`,
          () => this.logout(), this.tr('تسجيل الخروج', 'Log out'));
      });
    }
  },

  landingButtons() {
    if (this.isLoggedIn()) {
      return `<button class="btn btn-primary btn-sm" onclick="Router.navigate('/dashboard')">${this.tr('متابعة التعلم', 'Continue')}</button>`;
    }
    return `<button class="btn btn-secondary btn-sm" onclick="Router.navigate('/login')">${this.tr('تسجيل الدخول', 'Log in')}</button>
            <button class="btn btn-primary btn-sm" onclick="Router.navigate('/register')">${this.tr('إنشاء حساب', 'Sign up')}</button>`;
  },

  // ---------- auth pages ----------
  renderAuth(mode) {
    if (this.isLoggedIn()) { Router.navigate('/dashboard'); return; }
    document.getElementById('app-shell').classList.add('hidden');
    const el = document.getElementById('landing-page');
    el.classList.remove('hidden');
    const isReg = mode === 'register';
    const lang = AppState.get().settings.language;
    el.innerHTML = `
      <div class="auth-wrap">
        <div class="auth-top">
          <a href="#/landing" class="logo"><div class="logo-icon">OA</div> Odoo Academy</a>
          <div class="lang-switch">
            <button class="lang-btn ${lang === 'ar' ? 'active' : ''}" data-lang="ar">العربية</button>
            <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en">English</button>
          </div>
        </div>
        <div class="card auth-card">
          <h2 class="mb-1">${isReg ? this.tr('إنشاء حساب جديد', 'Create your account') : this.tr('تسجيل الدخول', 'Log in')}</h2>
          <p class="text-sm text-muted mb-3">${isReg
            ? this.tr('سجّل لتحفظ تقدمك وتتابع تعلمك من أي جهاز.', 'Sign up to save your progress and learn from any device.')
            : this.tr('أهلاً بعودتك! أدخل رقم هاتفك وكلمة السر.', 'Welcome back! Enter your phone and password.')}</p>
          <div id="auth-error" class="auth-error" style="display:none"></div>
          <div id="auth-form">
            ${isReg ? `<div class="sim-form-row"><label>${this.tr('الاسم', 'Name')}</label>
              <input id="auth-name" autocomplete="name" maxlength="60"></div>` : ''}
            <div class="sim-form-row"><label>${this.tr('رقم الهاتف', 'Phone number')}</label>
              <input id="auth-phone" type="tel" inputmode="tel" dir="ltr" autocomplete="tel" placeholder="01XXXXXXXXX"></div>
            <div class="sim-form-row"><label>${this.tr('كلمة السر', 'Password')}</label>
              <div class="auth-pass">
                <input id="auth-pass" type="password" dir="ltr" autocomplete="${isReg ? 'new-password' : 'current-password'}">
                <button type="button" class="btn btn-secondary btn-sm" id="auth-eye" aria-label="show">👁</button>
              </div></div>
            <button class="btn btn-primary btn-lg" id="auth-submit" style="width:100%;margin-top:1rem">
              ${isReg ? this.tr('إنشاء الحساب', 'Create account') : this.tr('دخول', 'Log in')}</button>
          </div>
          <p class="text-sm text-muted" style="text-align:center;margin-top:1rem">
            ${isReg
              ? `${this.tr('لديك حساب؟', 'Already have an account?')} <a href="#/login">${this.tr('سجّل الدخول', 'Log in')}</a>`
              : `${this.tr('ليس لديك حساب؟', 'No account yet?')} <a href="#/register">${this.tr('إنشاء حساب', 'Sign up')}</a>`}
          </p>
        </div>
      </div>`;

    el.querySelectorAll('.lang-btn').forEach(b => b.onclick = () => { AppState.setLanguage(b.dataset.lang); this.renderAuth(mode); });
    const pass = document.getElementById('auth-pass');
    document.getElementById('auth-eye').onclick = () => { pass.type = pass.type === 'password' ? 'text' : 'password'; };
    const submit = () => this.submitAuth(isReg);
    document.getElementById('auth-submit').onclick = submit;
    el.querySelectorAll('#auth-form input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); }));
    const first = document.getElementById(isReg ? 'auth-name' : 'auth-phone');
    if (first) first.focus();
  },

  async submitAuth(isReg) {
    const btn = document.getElementById('auth-submit');
    const errBox = document.getElementById('auth-error');
    const name = (document.getElementById('auth-name') || {}).value || '';
    const phone = document.getElementById('auth-phone').value;
    const pass = document.getElementById('auth-pass').value;
    const fail = (code) => { errBox.textContent = this.errorText(code); errBox.style.display = 'block'; };
    errBox.style.display = 'none';

    if (isReg && name.trim().length < 2) return fail('invalid_name');
    if (phone.replace(/\D/g, '').length < 8) return fail('invalid_phone');
    if (pass.length < 6 && isReg) return fail('weak_password');
    if (!pass) return fail('invalid_credentials');

    btn.disabled = true;
    try {
      if (isReg) await this.register(name, phone, pass);
      else await this.login(phone, pass);
      Router.navigate('/dashboard');
      Router.handle();
    } catch (e) {
      fail(e.code || 'error');
    } finally {
      btn.disabled = false;
    }
  },

  // ---------- admin page ----------
  async renderAdmin() {
    if (!this.isAdmin()) { Router.navigate('/dashboard'); return; }
    UI.showApp();
    const main = document.getElementById('main-content');
    main.innerHTML = `<div class="page-content"><h1 class="mb-4">${this.tr('لوحة الإدارة', 'Admin dashboard')}</h1>
      <p class="text-muted">${this.tr('جارٍ التحميل...', 'Loading...')}</p></div>`;
    try {
      const r = await this.rpc('academy_admin_list', { p_token: this.session.token });
      this._adminUsers = r.users || [];
    } catch (e) {
      main.innerHTML = `<div class="page-content"><div class="auth-error">${this.esc(this.errorText(e.code))}</div></div>`;
      return;
    }
    this.drawAdmin('');
  },

  fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString(this.ar() ? 'ar-EG' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  },

  drawAdmin(q) {
    const all = this._adminUsers;
    const now = Date.now(), day = 86400000;
    const today = all.filter(u => now - new Date(u.created_at) < day).length;
    const active7 = all.filter(u => u.last_login_at && now - new Date(u.last_login_at) < 7 * day).length;
    const query = (q || '').trim().toLowerCase();
    const list = query ? all.filter(u => u.name.toLowerCase().includes(query) || u.phone.includes(query.replace(/\D/g, '') || '\u0000')) : all;

    const rows = list.map(u => `
      <tr>
        <td>${this.esc(u.name)} ${u.is_admin ? '<span class="badge badge-advanced">' + this.tr('مدير', 'Admin') + '</span>' : ''}</td>
        <td dir="ltr" style="text-align:start">${this.esc(u.phone)}</td>
        <td>${this.fmtDate(u.created_at)}</td>
        <td>${this.fmtDate(u.last_login_at)}</td>
        <td>${u.xp}</td>
        <td>${u.level}</td>
        <td>${u.lessons_completed}</td>
        <td class="admin-actions">
          <button class="btn btn-secondary btn-sm" data-act="reset" data-id="${u.id}">${this.tr('كلمة سر جديدة', 'Reset password')}</button>
          ${u.id === this.session.user.id ? '' : `<button class="btn btn-danger btn-sm" data-act="del" data-id="${u.id}">${this.tr('حذف', 'Delete')}</button>`}
        </td>
      </tr>`).join('');

    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-content">
        <h1 class="mb-4">${this.tr('لوحة الإدارة', 'Admin dashboard')}</h1>
        <div class="admin-stats">
          <div class="card"><div class="text-muted text-sm">${this.tr('إجمالي المسجلين', 'Total users')}</div><h2>${all.length}</h2></div>
          <div class="card"><div class="text-muted text-sm">${this.tr('سجّلوا آخر 24 ساعة', 'New in 24h')}</div><h2>${today}</h2></div>
          <div class="card"><div class="text-muted text-sm">${this.tr('نشطون آخر 7 أيام', 'Active in 7 days')}</div><h2>${active7}</h2></div>
        </div>
        <div class="card">
          <div class="flex gap-2 mb-3" style="flex-wrap:wrap;align-items:center">
            <input id="admin-search" class="admin-search" placeholder="${this.tr('بحث بالاسم أو رقم الهاتف...', 'Search name or phone...')}" value="${this.esc(q || '')}">
            <button class="btn btn-secondary btn-sm" id="admin-refresh">${this.tr('تحديث', 'Refresh')}</button>
            <button class="btn btn-secondary btn-sm" id="admin-csv">${this.tr('تصدير CSV', 'Export CSV')}</button>
          </div>
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead><tr>
                <th>${this.tr('الاسم', 'Name')}</th><th>${this.tr('الهاتف', 'Phone')}</th>
                <th>${this.tr('تاريخ التسجيل', 'Joined')}</th><th>${this.tr('آخر دخول', 'Last login')}</th>
                <th>XP</th><th>${this.tr('المستوى', 'Level')}</th><th>${this.tr('الدروس', 'Lessons')}</th><th></th>
              </tr></thead>
              <tbody>${rows || `<tr><td colspan="8" class="text-muted" style="text-align:center">${this.tr('لا توجد نتائج', 'No results')}</td></tr>`}</tbody>
            </table>
          </div>
        </div>
      </div>`;

    const search = document.getElementById('admin-search');
    search.addEventListener('input', () => {
      const pos = search.selectionStart;
      this.drawAdmin(search.value);
      const s2 = document.getElementById('admin-search'); s2.focus(); s2.setSelectionRange(pos, pos);
    });
    document.getElementById('admin-refresh').onclick = () => this.renderAdmin();
    document.getElementById('admin-csv').onclick = () => this.exportCsv();
    main.querySelectorAll('[data-act]').forEach(b => b.onclick = () => this.adminAction(b.dataset.act, b.dataset.id));
  },

  adminAction(act, id) {
    const u = this._adminUsers.find(x => x.id === id);
    if (!u) return;
    if (act === 'del') {
      UI.showModal(`<p>${this.tr('حذف حساب', 'Delete account')} <b>${this.esc(u.name)}</b>؟<br>
        <span class="text-muted text-sm">${this.tr('سيتم حذف الحساب وتقدمه نهائياً.', 'The account and its progress will be permanently deleted.')}</span></p>`,
        async () => {
          try {
            await this.rpc('academy_admin_delete_user', { p_token: this.session.token, p_user_id: id });
            UI.showToast(this.tr('تم الحذف', 'Deleted'), 'success');
            this.renderAdmin();
          } catch (e) { UI.showToast(this.errorText(e.code), 'incorrect'); }
        }, this.tr('حذف', 'Delete'));
    } else if (act === 'reset') {
      UI.showModal(`<p>${this.tr('كلمة سر جديدة لـ', 'New password for')} <b>${this.esc(u.name)}</b></p>
        <input id="admin-newpass" dir="ltr" style="width:100%;margin-top:.5rem" placeholder="${this.tr('6 أحرف على الأقل', 'At least 6 characters')}">`,
        async () => {
          const val = (document.getElementById('admin-newpass') || {}).value || '';
          try {
            await this.rpc('academy_admin_reset_password', { p_token: this.session.token, p_user_id: id, p_new_password: val });
            UI.showToast(this.tr('تم تغيير كلمة السر', 'Password changed'), 'success');
          } catch (e) { UI.showToast(this.errorText(e.code), 'incorrect'); }
        }, this.tr('حفظ', 'Save'));
    }
  },

  exportCsv() {
    const cell = v => {
      let s = String(v ?? '');
      if (/^[=+\-@]/.test(s)) s = "'" + s;           // neutralise spreadsheet formulas
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const head = ['Name', 'Phone', 'Joined', 'Last login', 'XP', 'Level', 'Lessons'];
    const lines = [head.map(cell).join(',')].concat(this._adminUsers.map(u =>
      [u.name, u.phone, u.created_at, u.last_login_at, u.xp, u.level, u.lessons_completed].map(cell).join(',')));
    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'odoo-academy-users.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }
};

// every progress save also syncs to the user's account
(function () {
  const origSave = AppState.save;
  AppState.save = function () { origSave.call(this); Auth.scheduleSync(); };
  window.addEventListener('pagehide', () => { if (Auth.isLoggedIn()) Auth.syncNow({ keepalive: true }); });
})();
