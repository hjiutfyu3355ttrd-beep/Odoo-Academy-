/**
 * UI Rendering & Interactions
 */
const UI = {
  lang() { return i18n.getLang(); },
  t(key) { return i18n.t(key); },
  txt(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[this.lang()] || obj.en || obj.ar || '';
  },

  formatContent(text) {
    if (!text) return '';
    let s = String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Numbered steps → ordered list when lines start with 1) 2) etc.
    const lines = s.split(/\n|\\n/);
    const stepRe = /^\s*(\d+)[\)\.]\s+/;
    if (lines.length > 1 && lines.filter(l => stepRe.test(l)).length >= 2) {
      const items = [];
      const before = [];
      let inSteps = false;
      for (const line of lines) {
        if (stepRe.test(line)) {
          inSteps = true;
          items.push('<li>' + line.replace(stepRe, '') + '</li>');
        } else if (inSteps && line.trim() === '') {
          continue;
        } else if (inSteps) {
          items.push('<li>' + line + '</li>');
        } else {
          before.push(line);
        }
      }
      const head = before.join('<br>').replace(/(<br>)+$/, '');
      return (head ? head + '<br>' : '') + '<ol class="steps-list">' + items.join('') + '</ol>';
    }
    return s.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
  },

  pathIcon(icon, color) {
    if (!icon) return '';
    if (icon.endsWith('.svg') || icon.endsWith('.png')) {
      return `<img class="path-icon-img" src="assets/icons/${icon}" alt="" width="40" height="40">`;
    }
    return `<div class="path-icon" style="background:${color || '#714B67'};color:#fff">${icon}</div>`;
  },



  /** Render Odoo-like UI mock screenshots for lessons */
  renderOdooMock(mock) {
    if (!mock || !mock.type) return '';
    const t = mock.type;

    if (t === 'apps-home') {
      const apps = [
        { name: 'CRM', file: 'crm.svg' },
        { name: 'Sales', file: 'sales.svg' },
        { name: 'Inventory', file: 'inventory.svg' },
        { name: 'Accounting', file: 'accounting.svg' },
        { name: 'Contacts', file: 'contacts.svg' },
        { name: 'Purchase', file: 'purchase.svg' },
        { name: 'Website', file: 'website.svg' },
        { name: 'POS', file: 'pos.svg' }
      ];
      return `
        <div class="odoo-mock" role="img" aria-label="Odoo Apps Home">
          <div class="odoo-mock-topbar"><span class="apps-icon">⊞</span> Odoo</div>
          <div class="odoo-mock-apps-grid">
            ${apps.map(a => `
              <div class="odoo-mock-app">
                <img class="odoo-app-icon-img" src="assets/icons/${a.file}" alt="${a.name}" width="48" height="48">
                <span>${a.name}</span>
              </div>
            `).join('')}
          </div>
        </div>`;
    }

    if (t === 'sales-list') {
      return `
        <div class="odoo-mock" role="img" aria-label="Odoo Sales Quotations List">
          <div class="odoo-mock-topbar"><span class="apps-icon">⊞</span> Sales</div>
          <div class="odoo-mock-menubar">
            <span class="active">Orders</span><span>To Invoice</span><span>Products</span><span>Reporting</span><span>Configuration</span>
          </div>
          <div class="odoo-mock-body">
            <div class="odoo-mock-side">
              <div class="active">Quotations</div>
              <div>Orders</div>
              <div>Customers</div>
            </div>
            <div class="odoo-mock-main">
              <div class="odoo-mock-toolbar">
                <span class="odoo-mock-btn">New</span>
                <span class="odoo-mock-search">🔍 Search... (Customer, Product...)</span>
              </div>
              <table class="odoo-mock-table">
                <thead><tr><th>Number</th><th>Customer</th><th>Salesperson</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>S00012</td><td>ABC Company</td><td>Admin</td><td>9,000.00</td><td>Quotation</td></tr>
                  <tr><td>S00011</td><td>Tech Solutions</td><td>Admin</td><td>1,500.00</td><td>Sales Order</td></tr>
                  <tr><td>S00010</td><td>Global Trade</td><td>Admin</td><td>420.00</td><td>Quotation</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>`;
    }

    if (t === 'quotation-form') {
      return `
        <div class="odoo-mock" role="img" aria-label="Odoo Quotation Form">
          <div class="odoo-mock-topbar"><span class="apps-icon">⊞</span> Sales · New</div>
          <div class="odoo-mock-menubar">
            <span class="active">Orders</span><span>To Invoice</span><span>Products</span>
          </div>
          <div class="odoo-mock-body">
            <div class="odoo-mock-main">
              <div class="odoo-mock-toolbar">
                <span class="odoo-mock-btn">Confirm</span>
                <span class="odoo-mock-btn secondary">Preview</span>
                <span class="odoo-mock-btn secondary">Cancel</span>
              </div>
              <div class="odoo-mock-form">
                <div class="odoo-mock-field">
                  <label>Customer *</label>
                  <div class="field-box required">ABC Company</div>
                </div>
                <div class="odoo-mock-field">
                  <label>Order Date</label>
                  <div class="field-box">2026-09-19</div>
                </div>
                <div class="odoo-mock-field">
                  <label>Payment Terms</label>
                  <div class="field-box">Immediate Payment</div>
                </div>
                <table class="odoo-mock-table" style="margin-top:12px">
                  <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
                  <tbody>
                    <tr><td>Laptop</td><td>3</td><td>3,000.00</td><td>9,000.00</td></tr>
                  </tbody>
                </table>
                <div style="text-align:end;margin-top:10px;font-weight:600">Total: 9,000.00</div>
              </div>
            </div>
          </div>
        </div>`;
    }

    if (t === 'crm-kanban') {
      return `
        <div class="odoo-mock" role="img" aria-label="Odoo CRM Pipeline Kanban">
          <div class="odoo-mock-topbar"><span class="apps-icon">⊞</span> CRM</div>
          <div class="odoo-mock-menubar">
            <span class="active">Sales</span><span>Reporting</span><span>Configuration</span>
          </div>
          <div class="odoo-mock-body">
            <div class="odoo-mock-main">
              <div class="odoo-mock-toolbar">
                <span class="odoo-mock-btn">New</span>
                <span class="odoo-mock-search">🔍 Search...</span>
              </div>
              <div class="odoo-mock-kanban">
                <div class="odoo-mock-kanban-col">
                  <h5>New</h5>
                  <div class="odoo-mock-card"><strong>Lead — Website</strong><span class="muted">Interest in Laptop</span></div>
                </div>
                <div class="odoo-mock-kanban-col">
                  <h5>Qualified</h5>
                  <div class="odoo-mock-card"><strong>ABC Company</strong><span class="muted">15,000 · Call done</span></div>
                </div>
                <div class="odoo-mock-kanban-col">
                  <h5>Proposition</h5>
                  <div class="odoo-mock-card"><strong>Tech Solutions</strong><span class="muted">Quotation sent</span></div>
                </div>
                <div class="odoo-mock-kanban-col">
                  <h5>Won</h5>
                  <div class="odoo-mock-card"><strong>Global Trade</strong><span class="muted">4,200 ✓</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }

    if (t === 'inventory-receipt') {
      return `
        <div class="odoo-mock" role="img" aria-label="Odoo Inventory Receipt">
          <div class="odoo-mock-topbar"><span class="apps-icon">⊞</span> Inventory</div>
          <div class="odoo-mock-menubar">
            <span class="active">Operations</span><span>Products</span><span>Reporting</span><span>Configuration</span>
          </div>
          <div class="odoo-mock-body">
            <div class="odoo-mock-side">
              <div class="active">Receipts</div>
              <div>Delivery Orders</div>
              <div>Internal Transfers</div>
            </div>
            <div class="odoo-mock-main">
              <div class="odoo-mock-toolbar">
                <span class="odoo-mock-btn">Validate</span>
                <span class="odoo-mock-btn secondary">Check Availability</span>
              </div>
              <div class="odoo-mock-form">
                <div class="odoo-mock-field">
                  <label>Receive From</label>
                  <div class="field-box">Vendor · Main Supplier</div>
                </div>
                <div class="odoo-mock-field">
                  <label>Destination Location</label>
                  <div class="field-box required">WH/Stock</div>
                </div>
                <table class="odoo-mock-table" style="margin-top:12px">
                  <thead><tr><th>Product</th><th>Demand</th><th>Done</th></tr></thead>
                  <tbody>
                    <tr><td>Laptop</td><td>10</td><td>10</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>`;
    }

    if (t === 'list-form') {
      return `
        <div class="odoo-mock" role="img" aria-label="Odoo List and Form views">
          <div class="odoo-mock-topbar"><span class="apps-icon">⊞</span> Contacts</div>
          <div class="odoo-mock-body">
            <div class="odoo-mock-main">
              <div class="odoo-mock-toolbar">
                <span class="odoo-mock-btn">New</span>
                <span class="odoo-mock-btn secondary">☰ List</span>
                <span class="odoo-mock-btn secondary">▢ Kanban</span>
                <span class="odoo-mock-search">🔍 Search...</span>
              </div>
              <table class="odoo-mock-table">
                <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>City</th></tr></thead>
                <tbody>
                  <tr style="background:#f3e8ff"><td><strong>ABC Company</strong></td><td>+966 11 000</td><td>info@abc.com</td><td>Riyadh</td></tr>
                  <tr><td>Tech Solutions</td><td>+966 12 000</td><td>hello@tech.com</td><td>Jeddah</td></tr>
                </tbody>
              </table>
              <p style="margin-top:10px;font-size:11px;color:#6c757d">↑ List view — click a row to open Form view</p>
            </div>
          </div>
        </div>`;
    }

    if (t === 'search-filters') {
      return `
        <div class="odoo-mock" role="img" aria-label="Odoo Search and Filters">
          <div class="odoo-mock-topbar"><span class="apps-icon">⊞</span> Sales</div>
          <div class="odoo-mock-body">
            <div class="odoo-mock-main">
              <div class="odoo-mock-toolbar" style="flex-direction:column;align-items:stretch">
                <div class="odoo-mock-search" style="width:100%">🔍 Customer contains "ABC" · Filters · Group By · Favorites ▾</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
                  <span class="odoo-mock-btn secondary" style="font-size:11px">Filters ▾</span>
                  <span class="odoo-mock-btn" style="font-size:11px;background:#e9ecef;color:#714B67">My Quotations ✕</span>
                  <span class="odoo-mock-btn secondary" style="font-size:11px">Group By ▾</span>
                  <span class="odoo-mock-btn secondary" style="font-size:11px">Favorites ▾</span>
                </div>
              </div>
              <table class="odoo-mock-table">
                <thead><tr><th>Number</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>S00012</td><td>ABC Company</td><td>9,000.00</td><td>Quotation</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>`;
    }

    return '';
  },

  showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  showAchievement(a) {
    this.showModal(`
      <div style="text-align:center">
        <div style="font-size:3rem;margin-bottom:0.5rem">${a.icon}</div>
        <h3>${this.t('achievementUnlocked')}</h3>
        <p class="font-semibold mt-2">${this.txt(a.title)}</p>
        <p class="text-muted text-sm mt-1">${this.txt(a.description)}</p>
        ${a.xp ? `<p class="mt-2" style="color:var(--xp)">+${a.xp} XP</p>` : ''}
      </div>
    `, () => {});
    this.showToast(`${a.icon} ${this.txt(a.title)}`, 'achievement');
  },

  showModal(content, onConfirm, confirmLabel) {
    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    const actions = document.getElementById('modal-actions');
    if (!overlay || !body) return;
    body.innerHTML = content;
    actions.innerHTML = '';
    if (onConfirm) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn-secondary';
      cancelBtn.textContent = this.t('cancel');
      cancelBtn.onclick = () => this.hideModal();
      const okBtn = document.createElement('button');
      okBtn.className = 'btn btn-primary';
      okBtn.textContent = confirmLabel || this.t('reset');
      okBtn.onclick = () => { onConfirm(); this.hideModal(); };
      actions.appendChild(cancelBtn);
      actions.appendChild(okBtn);
    } else {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'btn btn-primary';
      closeBtn.textContent = 'OK';
      closeBtn.onclick = () => this.hideModal();
      actions.appendChild(closeBtn);
    }
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
  },

  hideModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }
  },

  renderShell() {
    const s = AppState.get();
    const name = s.user.name || 'Odoo Learner';
    const initial = name.charAt(0).toUpperCase();
    document.getElementById('user-name-display').textContent = name;
    document.getElementById('user-avatar').textContent = initial;
    document.getElementById('xp-display').textContent = s.user.xp;
    document.getElementById('search-input').placeholder = this.t('searchPlaceholder');

    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === s.settings.language);
    });

    // Theme icon
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.innerHTML = s.settings.theme === 'dark' ? '☀️' : '🌙';

    // Nav labels
    const navMap = {
      dashboard: this.t('dashboard'),
      paths: this.t('learning'),
      practice: this.t('practice'),
      quizzes: this.t('quizzes'),
      achievements: this.t('achievements'),
      progress: this.t('progress'),
      pricing: this.t('pricing'),
      settings: this.t('settings'),
      glossary: this.t('glossary')
    };
    Object.keys(navMap).forEach(k => {
      const item = document.querySelector(`[data-route="${k}"]`);
      if (!item) return;
      // Update only the text label span, never the icon span
      const label = item.querySelector('span:not(.nav-icon)');
      if (label) label.textContent = navMap[k];
    });
  },

  // ========== LANDING ==========
  renderLanding() {
    document.getElementById('app-shell').classList.add('hidden');
    document.getElementById('landing-page').classList.remove('hidden');
    const el = document.getElementById('landing-page');
    el.innerHTML = `
      <div class="landing">
        <header class="app-header" style="position:relative">
          <div class="logo"><div class="logo-icon">OA</div> Odoo Academy</div>
          <div class="header-right">
            <div class="lang-switch">
              <button class="lang-btn ${this.lang()==='ar'?'active':''}" data-lang="ar">العربية</button>
              <button class="lang-btn ${this.lang()==='en'?'active':''}" data-lang="en">English</button>
            </div>
            <button class="theme-toggle" id="theme-toggle-landing" aria-label="Toggle theme">${AppState.get().settings.theme==='dark'?'☀️':'🌙'}</button>
          </div>
        </header>
        <div class="landing-hero">
          <div class="flex gap-3" style="justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary btn-lg" onclick="Router.navigate('/dashboard')">${this.t('startLearning')}</button>
            <button class="btn btn-secondary btn-lg" onclick="Router.navigate('/paths')">${this.t('explorePathsBtn')}</button>
          </div>
        </div>
        <h2 style="text-align:center;margin-bottom:1.5rem">${this.t('whyAcademy')}</h2>
        <div class="landing-features">
          <div class="feature-card card"><div class="feature-icon"><img src="assets/icons/sales.svg" alt="" width="40" height="40"></div><h4>${this.t('learnByDoing')}</h4><p class="text-sm text-muted">Interactive lessons with real scenarios</p></div>
          <div class="feature-card card"><div class="feature-icon"><img src="assets/icons/inventory.svg" alt="" width="40" height="40"></div><h4>${this.t('interactiveSims')}</h4><p class="text-sm text-muted">Practice on simulated Odoo interface</p></div>
          <div class="feature-card card"><div class="feature-icon"><img src="assets/icons/project.svg" alt="" width="40" height="40"></div><h4>${this.t('practicalScenarios')}</h4><p class="text-sm text-muted">Labs and challenges based on real work</p></div>
          <div class="feature-card card"><div class="feature-icon"><img src="assets/icons/accounting.svg" alt="" width="40" height="40"></div><h4>${this.t('trackProgress')}</h4><p class="text-sm text-muted">XP, levels, achievements and streaks</p></div>
        </div>
        <h2 style="text-align:center;margin:2rem 0 1rem">${this.t('learningPaths')}</h2>
        <div class="paths-grid" style="max-width:900px;margin:0 auto;padding:0 1.5rem 2rem">
          ${PathsData.map(p => `
            <div class="path-card" onclick="Router.navigate('/path/${p.id}')">
              ${this.pathIcon(p.icon, p.color)}
              <h3>${this.txt(p.title)}</h3>
              <p class="text-sm text-muted">${this.txt(p.description)}</p>
              <div class="path-meta">
                <span class="badge badge-${p.level}">${this.t(p.level)}</span>
                <span>${p.lessonsCount} ${this.t('lessons')}</span>
                <span>${p.duration}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="text-align:center;padding:2rem;background:var(--surface);border-top:1px solid var(--border)">
          <h2 style="margin-bottom:0.5rem">${this.t('ctaTitle')}</h2>
          <button class="btn btn-primary btn-lg mt-3" onclick="Router.navigate('/dashboard')">${this.t('startLearning')}</button>
        </div>
      </div>
    `;
    el.querySelectorAll('.lang-btn').forEach(btn => {
      btn.onclick = () => { AppState.setLanguage(btn.dataset.lang); UI.renderLanding(); };
    });
    const tb = document.getElementById('theme-toggle-landing');
    if (tb) tb.onclick = () => {
      const next = AppState.get().settings.theme === 'dark' ? 'light' : 'dark';
      AppState.setTheme(next);
      UI.renderLanding();
    };
  },

  // ========== DASHBOARD ==========
  renderDashboard() {
    this.showApp();
    const s = AppState.get();
    const progress = AppState.getOverallProgress();
    const completed = s.progress.completedLessons.length;
    const quizzesDone = Object.keys(s.progress.quizScores).length;

    // Continue learning
    let continueHtml = '';
    const lastId = s.progress.currentLesson || s.progress.completedLessons[s.progress.completedLessons.length - 1];
    let nextLesson = null;
    if (lastId) {
      const idx = LessonsData.findIndex(l => l.id === lastId);
      nextLesson = LessonsData[idx + 1] || LessonsData.find(l => !AppState.isLessonComplete(l.id));
    } else {
      nextLesson = LessonsData[0];
    }
    if (nextLesson) {
      const path = PathsData.find(p => p.id === nextLesson.path);
      continueHtml = `
        <div class="continue-card">
          <div>
            <p class="text-sm text-muted">${this.txt(path?.title) || ''}</p>
            <h3 class="mt-1">${this.txt(nextLesson.title)}</h3>
            <p class="text-sm text-muted mt-1">${nextLesson.duration} ${this.t('minutes')} · +${nextLesson.xp} XP</p>
          </div>
          <button class="btn btn-primary" onclick="Router.navigate('/lesson/${nextLesson.id}')">${this.t('resume')}</button>
        </div>
      `;
    } else {
      continueHtml = `<div class="empty-state"><h3>${this.t('journeyStarts')}</h3><p>${this.t('choosePath')}</p><button class="btn btn-primary mt-3" onclick="Router.navigate('/paths')">${this.t('explorePaths')}</button></div>`;
    }

    const recentAch = (s.achievements || []).slice(-3).reverse().map(id => {
      const a = AchievementsData.find(x => x.id === id);
      return a ? `<div class="achievement-card unlocked"><div class="achievement-icon">${a.icon}</div><div class="font-medium text-sm">${this.txt(a.title)}</div></div>` : '';
    }).join('');

    const certIds = Object.keys(s.certificates || {});
    const certsHtml = certIds.length ? `
      <div class="section-title mt-4">${this.t('certificate')}</div>
      <div class="paths-grid">
        ${certIds.map(pid => {
          const p = PathsData.find(x => x.id === pid);
          return `<div class="path-card" onclick="Router.navigate('/certificate/${pid}')">
            <div style="font-size:1.75rem">🎓</div>
            <h3>${p ? this.txt(p.title) : pid}</h3>
            <button class="btn btn-secondary btn-sm mt-2">${this.t('getCertificate')}</button>
          </div>`;
        }).join('')}
      </div>` : '';

    const totalLessons = LessonsData.length;

    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <div class="mb-4">
          <h1>${this.t('dashboard')}</h1>
        </div>
        <div class="card mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold">${this.t('overallProgress')}</span>
            <span class="font-semibold">${progress}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
        </div>
        <div class="stats-grid mb-4">
          <div class="stat-card"><div class="stat-value">${completed}/${totalLessons}</div><div class="stat-label">${this.t('lessonsCompleted')}</div></div>
          <div class="stat-card"><div class="stat-value">${s.user.xp}</div><div class="stat-label">${this.t('xpEarned')}</div></div>
          <div class="stat-card"><div class="stat-value">${quizzesDone}</div><div class="stat-label">${this.t('quizzesCompleted')}</div></div>
          <div class="stat-card"><div class="stat-value">🔥 ${s.user.streak}</div><div class="stat-label">${this.t('currentStreak')}</div></div>
        </div>
        <div class="section-title">${this.t('continueLearning')}</div>
        ${continueHtml}
        <div class="section-title mt-4">${this.t('learningPaths')}</div>
        <div class="paths-grid">
          ${PathsData.map(p => {
            const pct = s.pathProgress[p.id] || 0;
            return `
              <div class="path-card" onclick="Router.navigate('/path/${p.id}')">
                ${this.pathIcon(p.icon, p.color)}
                <h3>${this.txt(p.title)}</h3>
                <p class="text-sm text-muted">${this.txt(p.description)}</p>
                <div class="path-meta">
                  <span class="badge badge-${p.level}">${this.t(p.level)}</span>
                  <span>${p.lessonsCount} ${this.t('lessons')}</span>
                </div>
                <div class="progress-bar mt-2"><div class="progress-fill" style="width:${pct}%"></div></div>
                <p class="text-xs text-muted mt-1">${pct}%</p>
              </div>
            `;
          }).join('')}
        </div>
        ${recentAch ? `<div class="section-title mt-4">${this.t('recentAchievements')}</div><div class="achievements-grid">${recentAch}</div>` : ''}
        ${certsHtml}
      </div>
    `;
  },

  showApp() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    this.renderShell();
  },

  // ========== PATHS ==========
  renderPaths() {
    this.showApp();
    const s = AppState.get();
    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-4" style="flex-wrap:wrap;gap:0.75rem">
          <h1 style="margin:0">${this.t('learningPaths')}</h1>
          ${!AppState.isPro() ? `<button class="btn btn-primary btn-sm" onclick="Router.navigate('/pricing')">${this.t('upgradeToPro')}</button>` : `<span class="badge" style="background:#00A09D;color:#fff">${this.t('pro')}</span>`}
        </div>
        <div class="paths-grid">
          ${PathsData.map(p => {
            const pct = s.pathProgress[p.id] || 0;
            const locked = AppState.isPathLocked(p.id);
            const btn = locked ? this.t('unlockPro') : (pct > 0 && pct < 100 ? this.t('continue') : pct >= 100 ? this.t('completed') : this.t('start'));
            const click = locked
              ? `UI.showUpgradeModal(UI.t('lockedPathMsg'))`
              : `Router.navigate('/path/${p.id}')`;
            return `
              <div class="path-card ${locked ? 'locked' : ''}" onclick="${click}">
                ${this.pathIcon(p.icon, p.color)}
                <h3>${this.txt(p.title)} ${locked ? '<span class="lock-badge">🔒 Pro</span>' : ''}</h3>
                <p class="text-sm text-muted">${this.txt(p.description)}</p>
                <div class="path-meta">
                  <span class="badge badge-${p.level}">${this.t(p.level)}</span>
                  <span>${p.lessonsCount} ${this.t('lessons')}</span>
                  <span>${p.duration}</span>
                </div>
                <div class="progress-bar mt-2"><div class="progress-fill" style="width:${pct}%"></div></div>
                <p class="text-xs text-muted mt-1">${pct}% · <button class="btn ${locked ? 'btn-secondary' : 'btn-primary'} btn-sm mt-2" onclick="event.stopPropagation();${click}">${btn}</button></p>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderPath(pathId) {
    this.showApp();
    const path = PathsData.find(p => p.id === pathId);
    if (!path) { Router.navigate('/paths'); return; }
    if (AppState.isPathLocked(pathId)) {
      this.showUpgradeModal(this.t('lockedPathMsg'));
      Router.navigate('/paths');
      return;
    }
    const lessons = LessonsData.filter(l => l.path === pathId).sort((a,b) => a.order - b.order);
    const s = AppState.get();
    const pct = s.pathProgress[pathId] || 0;

    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <button class="btn btn-ghost btn-sm mb-3" onclick="Router.navigate('/paths')">← ${this.t('back')}</button>
        <div class="flex items-center gap-3 mb-4">
          ${this.pathIcon(path.icon, path.color)}
          <div>
            <h1>${this.txt(path.title)}</h1>
            <p class="text-muted">${this.txt(path.description)}</p>
          </div>
        </div>
        <div class="card mb-4">
          <div class="flex justify-between mb-2"><span>${this.t('overallProgress')}</span><span>${pct}%</span></div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          ${pct >= 100 ? `
            <div class="cert-cta mt-3">
              <p class="text-sm mb-2">${this.lang()==='ar'?'أحسنت! أكملت هذا المسار.':'Well done! You completed this path.'}</p>
              <button class="btn btn-primary btn-sm" onclick="Router.navigate('/certificate/${pathId}')">${this.t('getCertificate')} 🎓</button>
            </div>` : ''}
        </div>
        <ul class="lesson-list">
          ${lessons.map((l, i) => {
            const done = AppState.isLessonComplete(l.id);
            return `
              <li>
                <a class="lesson-list-item ${done ? 'completed' : ''}" href="#/lesson/${l.id}">
                  <span class="lesson-num">${done ? '✓' : i + 1}</span>
                  <div style="flex:1">
                    <div class="font-medium">${this.txt(l.title)}</div>
                    <div class="text-xs text-muted">${l.duration} ${this.t('minutes')} · +${l.xp} XP ${l.isQuiz ? '· Quiz' : ''}</div>
                  </div>
                </a>
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    `;
  },

  // ========== LESSON ==========
  renderLesson(lessonId) {
    this.showApp();
    const lesson = LessonsData.find(l => l.id === lessonId);
    if (!lesson) { Router.navigate('/paths'); return; }

    if (lesson.isQuiz && lesson.quizId) {
      this.renderQuiz(lesson.quizId, lessonId);
      return;
    }

    const done = AppState.isLessonComplete(lessonId);
    const labBanner = lesson.isLab
      ? `<div class="lab-banner"><strong>${this.lang()==='ar'?'🔬 مختبر عملي':'🔬 Hands-on Lab'}</strong>
         <span>${this.lang()==='ar'?'نفّذ الخطوات على قاعدة أودو تجريبية — ليس الإنتاج.':'Execute steps on a trial Odoo database — not production.'}</span></div>`
      : '';

    const kcDone = AppState.get().progress.knowledgeChecks[lessonId];
    const screenBadge = this.lang() === 'ar' ? 'شاشة من أودو' : 'Real Odoo screen';
    const lookLabel = this.lang() === 'ar' ? 'ما تراه على الشاشة' : 'What you see on screen';
    const sectionsHtml = (lesson.sections || []).map(sec => {
      if (sec.type === 'visual') {
        let media = '';
        if (sec.image) {
          media = `<figure class="odoo-screenshot" data-badge="${screenBadge}">
            <img src="assets/images/${sec.image}" alt="${this.txt(sec.caption) || this.txt(sec.title)}" loading="lazy">
            ${sec.caption ? `<figcaption>${this.txt(sec.caption)}</figcaption>` : ''}
          </figure>`;
        } else if (sec.mock) {
          media = `${this.renderOdooMock(sec.mock)}${sec.caption ? `<p class="odoo-mock-caption">${this.txt(sec.caption)}</p>` : ''}`;
        }
        const callout = sec.content
          ? `<div class="screen-callout"><span class="screen-callout-label">${lookLabel}</span><div class="lesson-body">${this.formatContent(this.txt(sec.content))}</div></div>`
          : '';
        return `
          <div class="lesson-section">
            <h3>${this.txt(sec.title)}</h3>
            ${callout}
            ${media}
          </div>
        `;
      }
      const typeClass = { tip: 'tip-box', mistake: 'mistake-box', example: 'example-box', concept: 'concept-box', why: 'why-box', practice: 'practice-box' }[sec.type] || '';
      const practiceLabel = sec.type === 'practice'
        ? `<span class="practice-label">${this.lang()==='ar'?'تمرين على الشاشة':'Try it on screen'}</span>`
        : '';
      return `
        <div class="lesson-section ${typeClass}">
          ${practiceLabel}
          <h3>${this.txt(sec.title)}</h3>
          <div class="lesson-body">${this.formatContent(this.txt(sec.content))}</div>
        </div>
      `;
    }).join('');

    let kcHtml = '';
    if (lesson.knowledgeCheck) {
      const kc = lesson.knowledgeCheck;
      const opts = this.txt(kc.options);
      const optsArr = Array.isArray(opts) ? opts : (kc.options[this.lang()] || kc.options.en || []);
      kcHtml = `
        <div class="knowledge-check" id="kc-box">
          <h4>${this.t('quickCheck')}</h4>
          <p class="mb-3">${this.txt(kc.question)}</p>
          <div id="kc-options">
            ${optsArr.map((opt, i) => `
              <button class="quiz-option" data-idx="${i}" onclick="UI.answerKC('${lessonId}', ${i})">${opt}</button>
            `).join('')}
          </div>
          <div id="kc-feedback"></div>
        </div>
      `;
    }

    const next = LessonsData.find(l => l.path === lesson.path && l.order === lesson.order + 1);

    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <button class="btn btn-ghost btn-sm mb-3" onclick="Router.navigate('/path/${lesson.path}')">← ${this.t('back')}</button>
        <div class="lesson-header">
          <h1>${this.txt(lesson.title)}</h1>
          <div class="lesson-meta">
            <span>⏱ ${lesson.duration} ${this.t('minutes')}</span>
            <span>⚡ +${lesson.xp} XP</span>
            ${done ? `<span style="color:var(--success)">✓ ${this.t('completed')}</span>` : ''}
          </div>
        </div>
        <div class="card mb-4">
          <h4 class="mb-2">${this.t('learningObjectives')}</h4>
          <ul style="padding-inline-start:1.25rem">
            ${(this.txt(lesson.objectives) || []).map(o => `<li class="text-sm">${o}</li>`).join('')}
          </ul>
          <p class="text-xs text-muted mt-2" style="border-top:1px dashed var(--border);padding-top:0.5rem">
            ${this.lang()==='ar'
              ? '💡 الدرس مدعوم بشاشات حقيقية من أودو — ركّز على ما تراه في كل صورة واربطه بالخطوات.'
              : '💡 This lesson is supported by real Odoo screens — focus on what you see in each image and map it to the steps.'}
          </p>
        </div>
        ${labBanner}${sectionsHtml}
        ${kcHtml}
        <div class="flex gap-3 mt-4" style="flex-wrap:wrap">
          ${!done ? `<button class="btn btn-success" id="btn-complete" onclick="UI.completeLesson('${lessonId}')" ${kcDone === false ? 'disabled' : ''}>${this.t('markComplete')}</button>` : ''}
          ${next ? `<button class="btn btn-primary" onclick="Router.navigate('/lesson/${next.id}')">${this.t('nextLesson')}</button>` : `<button class="btn btn-primary" onclick="Router.navigate('/path/${lesson.path}')">${this.t('back')}</button>`}
        </div>
      </div>
    `;
  },

  answerKC(lessonId, idx) {
    const lesson = LessonsData.find(l => l.id === lessonId);
    if (!lesson || !lesson.knowledgeCheck) return;
    const kc = lesson.knowledgeCheck;
    const correct = idx === kc.answer;
    const opts = document.querySelectorAll('#kc-options .quiz-option');
    opts.forEach((o, i) => {
      o.disabled = true;
      if (i === kc.answer) o.classList.add('correct');
      else if (i === idx && !correct) o.classList.add('incorrect');
    });
    const fb = document.getElementById('kc-feedback');
    if (fb) {
      fb.className = `quiz-feedback ${correct ? 'correct' : 'incorrect'}`;
      fb.innerHTML = correct
        ? `✓ ${this.t('correct')}<br>${this.txt(kc.explanation)}`
        : `✕ ${this.t('notQuite')}<br>${this.txt(kc.explanation)}`;
    }
    AppState.setKnowledgeCheck(lessonId, correct);
    if (correct) {
      const btn = document.getElementById('btn-complete');
      if (btn) btn.disabled = false;
    }
  },

  completeLesson(lessonId) {
    const lesson = LessonsData.find(l => l.id === lessonId);
    if (!lesson) return;
    if (lesson.knowledgeCheck && AppState.get().progress.knowledgeChecks[lessonId] !== true) {
      this.showToast(this.t('notQuite'), 'incorrect');
      return;
    }
    AppState.completeLesson(lessonId, lesson.xp || 20);
    this.renderLesson(lessonId);
  },

  // ========== QUIZ ==========
  renderQuiz(quizId, lessonId) {
    this.showApp();
    const quiz = QuizzesData[quizId];
    if (!quiz) { Router.navigate('/dashboard'); return; }
    this._quizState = { quizId, lessonId, current: 0, answers: {}, score: 0, finished: false };

    const renderQ = () => {
      const q = quiz.questions[this._quizState.current];
      if (!q) return this.finishQuiz();
      const opts = q.type === 'true-false'
        ? [{ ar: 'صحيح (True)', en: 'True' }, { ar: 'خطأ (False)', en: 'False' }]
        : (q.options[this.lang()] || q.options.en || []);
      const isTF = q.type === 'true-false';

      document.getElementById('main-content').innerHTML = `
        <div class="page-content">
          <h1 class="mb-2">${this.txt(quiz.title)}</h1>
          <p class="text-muted mb-4">${this._quizState.current + 1} / ${quiz.questions.length}</p>
          <div class="knowledge-check">
            <h4 class="mb-3">${this.txt(q.question)}</h4>
            <div id="quiz-opts">
              ${opts.map((opt, i) => {
                const label = typeof opt === 'object' ? this.txt(opt) : opt;
                const val = isTF ? (i === 0) : i;
                return `<button class="quiz-option" data-val="${val}" onclick="UI.selectQuizOpt(this, ${JSON.stringify(val)})">${label}</button>`;
              }).join('')}
            </div>
            <button class="btn btn-primary mt-3" id="quiz-submit" disabled onclick="UI.submitQuizAnswer()">${this.t('submitAnswer')}</button>
          </div>
        </div>
      `;
    };
    renderQ();
    this._renderQuizQ = renderQ;
  },

  selectQuizOpt(el, val) {
    document.querySelectorAll('#quiz-opts .quiz-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    this._quizState.selected = val;
    document.getElementById('quiz-submit').disabled = false;
  },

  submitQuizAnswer() {
    const quiz = QuizzesData[this._quizState.quizId];
    const q = quiz.questions[this._quizState.current];
    const selected = this._quizState.selected;
    let correct = false;
    if (q.type === 'true-false') correct = selected === q.answer;
    else correct = selected === q.answer;

    if (correct) this._quizState.score++;
    this._quizState.answers[this._quizState.current] = { selected, correct };

    this._quizState.current++;
    if (this._quizState.current >= quiz.questions.length) this.finishQuiz();
    else this._renderQuizQ();
  },

  finishQuiz() {
    const quiz = QuizzesData[this._quizState.quizId];
    const score = this._quizState.score;
    const total = quiz.questions.length;
    const pct = Math.round((score / total) * 100);
    const xp = Math.round(quiz.xp * (score / total));
    AppState.setQuizScore(quiz.id, score, total, xp);
    if (this._quizState.lessonId) AppState.completeLesson(this._quizState.lessonId, 0);

    document.getElementById('main-content').innerHTML = `
      <div class="page-content" style="text-align:center;max-width:480px;margin:0 auto">
        <div style="font-size:3rem">🎉</div>
        <h1 class="mt-2">${this.t('quizComplete')}</h1>
        <p class="text-lg mt-2">${score} / ${total}</p>
        <p class="font-semibold" style="font-size:1.5rem">${pct}%</p>
        <p class="mt-2" style="color:var(--xp)">+${xp} XP</p>
        <div class="flex gap-3 mt-4" style="justify-content:center;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="UI.renderQuiz('${quiz.id}','${this._quizState.lessonId || ''}')">${this.t('retryQuiz')}</button>
          <button class="btn btn-primary" onclick="Router.navigate('/dashboard')">${this.t('continue')}</button>
        </div>
      </div>
    `;
  },

  // ========== PRACTICE ==========
  renderPractice() {
    this.showApp();
    const locked = !AppState.isPro();
    const clickSales = locked ? "UI.showUpgradeModal(UI.t('lockedFeatureMsg'))" : "Router.navigate('/lab/sales')";
    const clickInv = locked ? "UI.showUpgradeModal(UI.t('lockedFeatureMsg'))" : "Router.navigate('/lab/inventory')";
    const clickPos = locked ? "UI.showUpgradeModal(UI.t('lockedFeatureMsg'))" : "Router.navigate('/lab/pos')";
    const clickCust = locked ? "UI.showUpgradeModal(UI.t('lockedFeatureMsg'))" : "Router.navigate('/lab/customer')";
    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-4" style="flex-wrap:wrap;gap:0.75rem">
          <h1 style="margin:0">${this.t('practiceLabs')}</h1>
          ${locked ? `<button class="btn btn-primary btn-sm" onclick="Router.navigate('/pricing')">${this.t('upgradeToPro')}</button>` : ''}
        </div>
        <div class="paths-grid">
          <div class="path-card ${locked ? 'locked' : ''}" onclick="${clickSales}">
            <img class="path-icon-img" src="assets/icons/sales.svg" alt="Sales" width="40" height="40">
            <h3>${this.t('salesSimulator')} ${locked ? '<span class="lock-badge">🔒 Pro</span>' : ''}</h3>
            <p class="text-sm text-muted">Create a quotation for ABC Company — 3 Laptops — Confirm</p>
            <button class="btn ${locked ? 'btn-secondary' : 'btn-primary'} btn-sm mt-2">${locked ? this.t('unlockPro') : this.t('startLab')}</button>
          </div>
          
          <div class="path-card ${locked ? 'locked' : ''}" onclick="${clickPos}">
            <img class="path-icon-img" src="assets/icons/pos.svg" alt="POS" width="40" height="40">
            <h3>${this.lang()==='ar'?'محاكي نقطة البيع':'POS Simulator'} ${locked ? '<span class="lock-badge">🔒 Pro</span>' : ''}</h3>
            <p class="text-sm text-muted">${this.lang()==='ar'?'جلسة → منتجات → دفع → إغلاق':'Session → products → pay → close'}</p>
          </div>
<div class="path-card ${locked ? 'locked' : ''}" onclick="${clickInv}">
            <img class="path-icon-img" src="assets/icons/inventory.svg" alt="Inventory" width="40" height="40">
            <h3>${this.t('inventorySimulator')} ${locked ? '<span class="lock-badge">🔒 Pro</span>' : ''}</h3>
            <p class="text-sm text-muted">Receive 10 units of Laptop into Main Warehouse</p>
            <button class="btn ${locked ? 'btn-secondary' : 'btn-primary'} btn-sm mt-2">${locked ? this.t('unlockPro') : this.t('startLab')}</button>
          </div>
          <div class="path-card ${locked ? 'locked' : ''}" onclick="${clickCust}">
            <img class="path-icon-img" src="assets/icons/contacts.svg" alt="Contacts" width="40" height="40">
            <h3>Create a Customer ${locked ? '<span class="lock-badge">🔒 Pro</span>' : ''}</h3>
            <p class="text-sm text-muted">Practice creating a customer record</p>
            <button class="btn ${locked ? 'btn-secondary' : 'btn-primary'} btn-sm mt-2">${locked ? this.t('unlockPro') : this.t('startLab')}</button>
          </div>
          <div class="path-card ${locked ? 'locked' : ''}" onclick="${locked ? `UI.showUpgradeModal(UI.t('lockedFeatureMsg'))` : `Router.navigate('/lab/purchase')`}">
            <img class="path-icon-img" src="assets/icons/purchase.svg" alt="Purchase" width="40" height="40">
            <h3>${this.lang()==='ar'?'محاكي المشتريات':'Purchase Simulator'} ${locked ? '<span class="lock-badge">🔒 Pro</span>' : ''}</h3>
            <p class="text-sm text-muted">${this.lang()==='ar'?'RFQ للمورد ABC Supplier — Laptop × 5 — Confirm':'RFQ for ABC Supplier — Laptop × 5 — Confirm'}</p>
            <button class="btn ${locked ? 'btn-secondary' : 'btn-primary'} btn-sm mt-2">${locked ? this.t('unlockPro') : this.t('startLab')}</button>
          </div>
        </div>
      </div>
    `;
  },

  renderLab(labId) {
    this.showApp();
    if (!AppState.isPro()) {
      this.showUpgradeModal(this.t('lockedFeatureMsg'));
      Router.navigate('/practice');
      return;
    }
    if (labId === 'sales') this.renderSalesSimulator();
    else if (labId === 'inventory') this.renderInventorySimulator();
    else if (labId === 'customer') this.renderCustomerLab();
    else if (labId === 'purchase') this.renderPurchaseSimulator();
    else if (labId === 'pos') this.renderPOSSimulator();
    else Router.navigate('/practice');
  },

  renderSalesSimulator() {
    Simulator.reset();
    Simulator.setModule('sales');
    const render = () => {
      const st = Simulator.state;
      document.getElementById('main-content').innerHTML = `
        <div class="page-content">
          <button class="btn btn-ghost btn-sm mb-3" onclick="Router.navigate('/practice')">← ${this.t('back')}</button>
          <h1 class="mb-3">${this.t('salesSimulator')}</h1>
          <div class="mission-box">
            <h4>${this.t('mission')}</h4>
            <p>${this.lang()==='ar' ? 'أنشئ عرض سعر للعميل ABC Company، المنتج Laptop، الكمية 3، ثم أكّد العرض.' : 'Create a quotation for Customer: ABC Company, Product: Laptop, Quantity: 3, then Confirm.'}</p>
          </div>
          <div class="sim-steps">
            <div class="sim-step ${st.selectedCustomer?'done':''} ${!st.selectedCustomer?'active':''}">1. ${this.lang()==='ar'?'العميل':'Customer'}</div>
            <div class="sim-step ${st.selectedProduct && st.quantity===3?'done':''} ${st.selectedCustomer && !(st.selectedProduct&&st.quantity===3)?'active':''}">2. ${this.lang()==='ar'?'المنتج والكمية':'Product & Qty'}</div>
            <div class="sim-step ${st.orderCreated?'done':''} ${st.selectedProduct && st.quantity===3 && !st.orderCreated?'active':''}">3. ${this.lang()==='ar'?'حفظ':'Save'}</div>
            <div class="sim-step ${st.orderConfirmed?'done':''} ${st.orderCreated && !st.orderConfirmed?'active':''}">4. ${this.lang()==='ar'?'تأكيد':'Confirm'}</div>
          </div>
          <div class="simulator">
            <div class="sim-header">Odoo · Sales</div>
            <div class="sim-menu">
              <button class="sim-menu-item active">Quotations</button>
              <button class="sim-menu-item">Sales Orders</button>
              <button class="sim-menu-item">Customers</button>
            </div>
            <div class="sim-body">
              <div class="sim-sidebar">
                <button class="sim-nav-item active">Quotations</button>
                <button class="sim-nav-item">Orders</button>
              </div>
              <div class="sim-content">
                <div class="sim-form">
                  <h4 class="mb-3">New Quotation</h4>
                  <div class="sim-form-row">
                    <label>${this.t('customer')}</label>
                    <select id="sim-customer" onchange="Simulator.selectCustomer(this.value);UI._refreshSalesSim()">
                      <option value="">-- Select --</option>
                      ${Simulator.customers.map(c => `<option value="${c.id}" ${st.selectedCustomer?.id===c.id?'selected':''}>${c.name}</option>`).join('')}
                    </select>
                  </div>
                  <div class="sim-form-row">
                    <label>${this.t('product')}</label>
                    <select id="sim-product" onchange="Simulator.selectProduct(this.value);UI._refreshSalesSim()">
                      <option value="">-- Select --</option>
                      ${Simulator.products.map(p => `<option value="${p.id}" ${st.selectedProduct?.id===p.id?'selected':''}>${p.name}</option>`).join('')}
                    </select>
                  </div>
                  <div class="sim-form-row">
                    <label>${this.t('quantity')}</label>
                    <input type="number" min="1" value="${st.quantity}" onchange="Simulator.setQuantity(this.value)">
                  </div>
                  <div class="sim-form-row">
                    <label>${this.t('unitPrice')}</label>
                    <input type="number" value="${st.unitPrice}" readonly>
                  </div>
                  <div class="sim-form-actions">
                    <button class="btn btn-secondary" onclick="Simulator.saveOrder();UI._refreshSalesSim();UI.showToast('${this.t('save')}')">${this.t('save')}</button>
                    <button class="btn btn-primary" onclick="Simulator.confirmOrder();UI._refreshSalesSim()">${this.t('confirm')}</button>
                    <button class="btn btn-success" onclick="UI.checkSalesMission()">${this.lang()==='ar'?'تحقق من المهمة':'Validate Mission'}</button>
                  </div>
                  ${st.orderCreated ? `<p class="text-sm mt-2" style="color:var(--success)">✓ Order saved</p>` : ''}
                  ${st.orderConfirmed ? `<p class="text-sm" style="color:var(--success)">✓ Order confirmed</p>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    };
    this._refreshSalesSim = render;
    render();
  },

  checkSalesMission() {
    const result = Simulator.validateSalesChallenge();
    if (result.valid) {
      AppState.completeSimulator('sales', 100);
      AppState.completeLab('sales', 0);
      this.showToast(this.t('missionComplete') + ' +100 XP', 'xp');
      this.showModal(`<div style="text-align:center"><div style="font-size:3rem">🎉</div><h3>${this.t('missionComplete')}</h3><p>+100 XP</p>
        <p class="text-sm text-muted mt-2">${this.lang()==='ar'?'أحسنت: Customer → بنود → Save → Confirm كما على شاشة Quotation في أودو.':'Well done: Customer → lines → Save → Confirm as on the Quotation screen in Odoo.'}</p></div>`);
    } else {
      const msg = result.errors.map(e => '• ' + this.txt(e)).join('<br>');
      this.showModal(`<div><h4>${this.t('notQuite')}</h4><p class="text-sm text-muted mb-2">${this.lang()==='ar'?'راجع الحقول على الشاشة:':'Check the fields on screen:'}</p><p class="mt-2">${msg}</p></div>`);
    }
  },

  renderInventorySimulator() {
    Simulator.reset();
    Simulator.setModule('inventory');
    const render = () => {
      const st = Simulator.state;
      document.getElementById('main-content').innerHTML = `
        <div class="page-content">
          <button class="btn btn-ghost btn-sm mb-3" onclick="Router.navigate('/practice')">← ${this.t('back')}</button>
          <h1 class="mb-3">${this.t('inventorySimulator')}</h1>
          <div class="mission-box">
            <h4>${this.t('mission')}</h4>
            <p>${this.lang()==='ar' ? 'استلم 10 وحدات من Laptop في Main Warehouse ثم Validate.' : 'Receive 10 units of Laptop into Main Warehouse, then Validate.'}</p>
          </div>
          <div class="sim-steps">
            <div class="sim-step ${st.selectedProduct?'done':''} ${!st.selectedProduct?'active':''}">1. ${this.lang()==='ar'?'المنتج':'Product'}</div>
            <div class="sim-step ${st.receiptQty===10?'done':''} ${st.selectedProduct && st.receiptQty!==10?'active':''}">2. ${this.lang()==='ar'?'الكمية 10':'Qty 10'}</div>
            <div class="sim-step ${st.warehouse==='Main Warehouse'?'done':''}">3. ${this.lang()==='ar'?'المستودع':'Warehouse'}</div>
            <div class="sim-step ${st.receiptValidated?'done':''} ${st.selectedProduct && st.receiptQty===10 && !st.receiptValidated?'active':''}">4. Validate</div>
          </div>
          <div class="simulator">
            <div class="sim-header">Odoo · Inventory</div>
            <div class="sim-menu">
              <button class="sim-menu-item active">Receipts</button>
              <button class="sim-menu-item">Deliveries</button>
            </div>
            <div class="sim-body">
              <div class="sim-sidebar">
                <button class="sim-nav-item active">Receipts</button>
              </div>
              <div class="sim-content">
                <div class="sim-form">
                  <h4 class="mb-3">New Receipt</h4>
                  <div class="sim-form-row">
                    <label>${this.t('product')}</label>
                    <select onchange="Simulator.selectProduct(this.value);UI._refreshInvSim()">
                      <option value="">-- Select --</option>
                      ${Simulator.products.map(p => `<option value="${p.id}" ${st.selectedProduct?.id===p.id?'selected':''}>${p.name}</option>`).join('')}
                    </select>
                  </div>
                  <div class="sim-form-row">
                    <label>${this.t('quantity')}</label>
                    <input type="number" min="1" value="${st.receiptQty}" onchange="Simulator.setReceiptQty(this.value)">
                  </div>
                  <div class="sim-form-row">
                    <label>${this.t('warehouse')}</label>
                    <select onchange="Simulator.setWarehouse(this.value)">
                      ${Simulator.warehouses.map(w => `<option value="${w}" ${st.warehouse===w?'selected':''}>${w}</option>`).join('')}
                    </select>
                  </div>
                  <div class="sim-form-actions">
                    <button class="btn btn-primary" onclick="Simulator.validateReceipt();UI._refreshInvSim()">${this.t('validate')}</button>
                    <button class="btn btn-success" onclick="UI.checkInvMission()">${this.lang()==='ar'?'تحقق من المهمة':'Validate Mission'}</button>
                  </div>
                  ${st.receiptValidated ? `<p class="text-sm mt-2" style="color:var(--success)">✓ Receipt validated</p>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    };
    this._refreshInvSim = render;
    render();
  },

  checkInvMission() {
    const result = Simulator.validateInventoryChallenge();
    if (result.valid) {
      AppState.completeSimulator('inventory', 100);
      AppState.completeLab('inventory', 0);
      this.showToast(this.t('missionComplete') + ' +100 XP', 'xp');
      this.showModal(`<div style="text-align:center"><div style="font-size:3rem">🎉</div><h3>${this.t('missionComplete')}</h3><p>+100 XP</p></div>`);
    } else {
      const msg = result.errors.map(e => this.txt(e)).join('<br>');
      this.showModal(`<div><h4>${this.t('notQuite')}</h4><p class="mt-2">${msg}</p></div>`);
    }
  },


  renderPurchaseSimulator() {
    Simulator.reset();
    Simulator.setModule('purchase');
    const render = () => {
      const st = Simulator.state;
      document.getElementById('main-content').innerHTML = `
        <div class="page-content">
          <button class="btn btn-ghost btn-sm mb-3" onclick="Router.navigate('/practice')">← ${this.t('back')}</button>
          <h1 class="mb-3">${this.lang()==='ar'?'محاكي المشتريات':'Purchase Simulator'}</h1>
          <div class="mission-box">
            <h4>${this.t('mission')}</h4>
            <p>${this.lang()==='ar' ? 'أنشئ RFQ للمورد ABC Supplier، المنتج Laptop، الكمية 5، ثم Confirm Order.' : 'Create an RFQ for Vendor: ABC Supplier, Product: Laptop, Quantity: 5, then Confirm Order.'}</p>
          </div>
          <div class="sim-steps">
            <div class="sim-step ${st.selectedVendor?'done':''} ${!st.selectedVendor?'active':''}">1. ${this.lang()==='ar'?'المورد':'Vendor'}</div>
            <div class="sim-step ${st.selectedProduct && st.purchaseQty===5?'done':''} ${st.selectedVendor && !(st.selectedProduct&&st.purchaseQty===5)?'active':''}">2. ${this.lang()==='ar'?'المنتج والكمية':'Product & Qty'}</div>
            <div class="sim-step ${st.rfqCreated?'done':''} ${st.selectedProduct && st.purchaseQty===5 && !st.rfqCreated?'active':''}">3. ${this.lang()==='ar'?'حفظ RFQ':'Save RFQ'}</div>
            <div class="sim-step ${st.rfqConfirmed?'done':''} ${st.rfqCreated && !st.rfqConfirmed?'active':''}">4. Confirm</div>
          </div>
          <div class="simulator">
            <div class="sim-header">Odoo · Purchase</div>
            <div class="sim-menu">
              <button class="sim-menu-item active">Requests for Quotation</button>
              <button class="sim-menu-item">Purchase Orders</button>
              <button class="sim-menu-item">Vendors</button>
            </div>
            <div class="sim-body">
              <div class="sim-sidebar">
                <button class="sim-nav-item active">RFQs</button>
                <button class="sim-nav-item">Orders</button>
              </div>
              <div class="sim-content">
                <div class="sim-form">
                  <h4 class="mb-3">New RFQ</h4>
                  <div class="sim-form-row">
                    <label>${this.lang()==='ar'?'المورد':'Vendor'}</label>
                    <select onchange="Simulator.selectVendor(this.value);UI._refreshPurchaseSim()">
                      <option value="">-- Select --</option>
                      ${Simulator.vendors.map(v => `<option value="${v.id}" ${st.selectedVendor?.id===v.id?'selected':''}>${v.name}</option>`).join('')}
                    </select>
                  </div>
                  <div class="sim-form-row">
                    <label>${this.t('product')}</label>
                    <select onchange="Simulator.selectProduct(this.value);UI._refreshPurchaseSim()">
                      <option value="">-- Select --</option>
                      ${Simulator.products.map(p => `<option value="${p.id}" ${st.selectedProduct?.id===p.id?'selected':''}>${p.name}</option>`).join('')}
                    </select>
                  </div>
                  <div class="sim-form-row">
                    <label>${this.t('quantity')}</label>
                    <input type="number" min="1" value="${st.purchaseQty}" onchange="Simulator.setPurchaseQty(this.value);UI._refreshPurchaseSim()">
                  </div>
                  <div class="sim-form-actions">
                    <button class="btn btn-secondary" onclick="Simulator.saveRfq();UI._refreshPurchaseSim();UI.showToast('${this.t('save')}')">${this.t('save')}</button>
                    <button class="btn btn-primary" onclick="Simulator.confirmRfq();UI._refreshPurchaseSim()">${this.t('confirm')}</button>
                    <button class="btn btn-success" onclick="UI.checkPurchaseMission()">${this.lang()==='ar'?'تحقق من المهمة':'Validate Mission'}</button>
                  </div>
                  ${st.rfqCreated ? `<p class="text-sm mt-2" style="color:var(--success)">✓ RFQ saved</p>` : ''}
                  ${st.rfqConfirmed ? `<p class="text-sm" style="color:var(--success)">✓ Order confirmed (PO)</p>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    };
    this._refreshPurchaseSim = render;
    render();
  },

  checkPurchaseMission() {
    const result = Simulator.validatePurchaseChallenge();
    if (result.valid) {
      if (!AppState.get().progress.simulator.purchase) AppState.get().progress.simulator.purchase = {};
      AppState.completeSimulator('purchase', 100);
      AppState.completeLab('purchase', 0);
      this.showToast(this.t('missionComplete') + ' +100 XP', 'xp');
      this.showModal(`<div style="text-align:center"><div style="font-size:3rem">🎉</div><h3>${this.t('missionComplete')}</h3><p>+100 XP</p>
        <p class="text-sm text-muted mt-2">${this.lang()==='ar'?'أحسنت: Vendor → بنود → Save → Confirm Order كما على شاشة RFQ.':'Well done: Vendor → lines → Save → Confirm Order as on the RFQ screen.'}</p></div>`);
    } else {
      const msg = result.errors.map(e => '• ' + this.txt(e)).join('<br>');
      this.showModal(`<div><h4>${this.t('notQuite')}</h4><p class="text-sm text-muted mb-2">${this.lang()==='ar'?'راجع شاشة RFQ:':'Review the RFQ screen:'}</p><p class="mt-2">${msg}</p></div>`);
    }
  },

  renderCustomerLab() {
    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <button class="btn btn-ghost btn-sm mb-3" onclick="Router.navigate('/practice')">← ${this.t('back')}</button>
        <h1 class="mb-3">Create a Customer</h1>
        <div class="mission-box">
          <h4>${this.t('mission')}</h4>
          <p>${this.lang()==='ar'?'أنشئ عميلًا باسم Demo Customer واحفظه.':'Create a customer named Demo Customer and save.'}</p>
        </div>
        <div class="card" style="max-width:400px">
          <div class="sim-form-row"><label>Name *</label><input id="cust-name" placeholder="Demo Customer"></div>
          <div class="sim-form-row"><label>Email</label><input id="cust-email" type="email" placeholder="demo@example.com"></div>
          <div class="sim-form-row"><label>Phone</label><input id="cust-phone" placeholder="+966..."></div>
          <button class="btn btn-primary mt-2" onclick="UI.saveCustomerLab()">${this.t('save')}</button>
        </div>
      </div>
    `;
  },

  saveCustomerLab() {
    const name = document.getElementById('cust-name')?.value?.trim();
    if (!name) { this.showToast('Name required', 'incorrect'); return; }
    AppState.completeLab('customer', 50);
    this.showToast(this.t('missionComplete') + ' +50 XP', 'xp');
    this.showModal(`<div style="text-align:center"><div style="font-size:3rem">🎉</div><h3>${this.t('missionComplete')}</h3><p>Customer "${name}" saved · +50 XP</p></div>`);
  },

  // ========== QUIZZES LIST ==========
  renderQuizzes() {
    this.showApp();
    const s = AppState.get();
    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <h1 class="mb-4">${this.t('quizzes')}</h1>
        <div class="paths-grid">
          ${Object.values(QuizzesData).map(q => {
            const score = s.progress.quizScores[q.id];
            return `
              <div class="path-card" onclick="Router.navigate('/quiz/${q.id}')">
                <img class="path-icon-img" src="assets/icons/project.svg" alt="Quiz" width="40" height="40">
                <h3>${this.txt(q.title)}</h3>
                <p class="text-sm text-muted">${q.questions.length} questions · +${q.xp} XP</p>
                ${score ? `<p class="text-sm mt-1" style="color:var(--success)">${score.score}/${score.total} (${score.percent}%)</p>` : ''}
                <button class="btn btn-primary btn-sm mt-2">${score ? this.t('retryQuiz') : this.t('start')}</button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // ========== ACHIEVEMENTS ==========
  renderAchievements() {
    this.showApp();
    const s = AppState.get();
    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <h1 class="mb-4">${this.t('achievements')}</h1>
        <div class="achievements-grid">
          ${AchievementsData.map(a => {
            const unlocked = s.achievements.includes(a.id);
            return `
              <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${unlocked ? a.icon : '🔒'}</div>
                <div class="font-medium">${this.txt(a.title)}</div>
                <p class="text-xs text-muted mt-1">${unlocked ? this.txt(a.description) : this.t('locked')}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // ========== PROGRESS ==========
  renderProgress() {
    this.showApp();
    const s = AppState.get();
    const overall = AppState.getOverallProgress();
    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <h1 class="mb-4">${this.t('progress')}</h1>
        <div class="card mb-4">
          <div class="flex justify-between mb-2"><span class="font-semibold">${this.t('overallProgress')}</span><span>${overall}%</span></div>
          <div class="progress-bar"><div class="progress-fill" style="width:${overall}%"></div></div>
        </div>
        <div class="stats-grid mb-4">
          <div class="stat-card"><div class="stat-value">${s.user.xp}</div><div class="stat-label">XP</div></div>
          <div class="stat-card"><div class="stat-value">${AppState.getLevelName(s.user.level)}</div><div class="stat-label">${this.t('level')} ${s.user.level}</div></div>
          <div class="stat-card"><div class="stat-value">${s.progress.completedLessons.length}/${LessonsData.length}</div><div class="stat-label">${this.t('lessonsCompleted')}</div></div>
          <div class="stat-card"><div class="stat-value">🔥 ${s.user.streak}</div><div class="stat-label">${this.t('dayStreak')}</div></div>
        </div>
        <h3 class="mb-3">${this.t('learningPaths')}</h3>
        ${PathsData.map(p => {
          const pct = s.pathProgress[p.id] || 0;
          const hasCert = !!(s.certificates || {})[p.id];
          return `
            <div class="card mb-2">
              <div class="flex justify-between mb-1" style="flex-wrap:wrap;gap:0.5rem">
                <span>${this.txt(p.title)}</span>
                <span>${pct}% ${hasCert ? '🎓' : ''}</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
              ${pct >= 100 ? `<button class="btn btn-secondary btn-sm mt-2" onclick="Router.navigate('/certificate/${p.id}')">${this.t('getCertificate')}</button>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // ========== SETTINGS ==========
  renderSettings() {
    this.showApp();
    const s = AppState.get();
    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <h1 class="mb-4">${this.t('settings')}</h1>
        <div class="card mb-4" style="max-width:420px">
          <div class="sim-form-row">
            <label>${this.t('userName')}</label>
            <input id="settings-name" value="${s.user.name}">
          </div>
          <div class="sim-form-row">
            <label>${this.t('language')}</label>
            <div class="lang-switch">
              <button class="lang-btn ${s.settings.language==='ar'?'active':''}" data-lang="ar" onclick="AppState.setLanguage('ar');UI.renderSettings()">العربية</button>
              <button class="lang-btn ${s.settings.language==='en'?'active':''}" data-lang="en" onclick="AppState.setLanguage('en');UI.renderSettings()">English</button>
            </div>
          </div>
          <div class="sim-form-row">
            <label>${this.t('theme')}</label>
            <div class="flex gap-2">
              <button class="btn ${s.settings.theme==='light'?'btn-primary':'btn-secondary'} btn-sm" onclick="AppState.setTheme('light');UI.renderSettings()">${this.t('lightMode')}</button>
              <button class="btn ${s.settings.theme==='dark'?'btn-primary':'btn-secondary'} btn-sm" onclick="AppState.setTheme('dark');UI.renderSettings()">${this.t('darkMode')}</button>
            </div>
          </div>
          <button class="btn btn-primary mt-3" onclick="UI.saveSettings()">${this.t('saveChanges')}</button>
        </div>
        <div class="card mb-4" style="max-width:420px">
          <h4 class="mb-2">${this.lang()==='ar'?'تصدير / استيراد التقدّم':'Export / Import Progress'}</h4>
          <p class="text-sm text-muted mb-3">${this.lang()==='ar'?'احفظ نسخة احتياطية من تقدّمك أو انقلها لجهاز آخر.':'Backup your progress or move it to another device.'}</p>
          <div class="flex gap-2" style="flex-wrap:wrap">
            <button class="btn btn-secondary btn-sm" onclick="UI.exportProgress()">${this.lang()==='ar'?'تصدير JSON':'Export JSON'}</button>
            <label class="btn btn-secondary btn-sm" style="cursor:pointer;margin:0">
              ${this.lang()==='ar'?'استيراد JSON':'Import JSON'}
              <input type="file" accept="application/json,.json" style="display:none" onchange="UI.importProgressFile(this)">
            </label>
          </div>
        </div>
        <div class="card" style="max-width:420px">
          <h4 class="mb-2">${this.t('resetProgress')}</h4>
          <p class="text-sm text-muted mb-3">${this.t('resetConfirm')}</p>
          <button class="btn btn-danger" onclick="UI.confirmReset()">${this.t('resetProgress')}</button>
        </div>
      </div>
    `;
  },

  saveSettings() {
    const name = document.getElementById('settings-name')?.value?.trim();
    if (name) AppState.setUserName(name);
    this.showToast(this.t('progressSaved'), 'success');
    this.renderShell();
  },

  confirmReset() {
    this.showModal(`<p>${this.t('resetConfirm')}</p>`, () => {
      AppState.resetProgress();
      this.showToast(this.t('progressSaved'), 'success');
      Router.navigate('/dashboard');
    }, this.t('reset'));
  },
  exportProgress() {
    const json = AppState.exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'odoo-academy-progress.json';
    a.click();
    URL.revokeObjectURL(url);
    this.showToast(this.lang()==='ar'?'تم تصدير التقدّم':'Progress exported', 'success');
  },

  importProgressFile(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = AppState.importProgress(String(reader.result || ''));
      if (result.ok) {
        this.showToast(this.lang()==='ar'?'تم استيراد التقدّم':'Progress imported', 'success');
        this.renderShell();
        Router.navigate('/dashboard');
      } else {
        this.showToast(this.lang()==='ar'?'ملف غير صالح':'Invalid file', 'incorrect');
      }
    };
    reader.readAsText(file);
  },



  // ========== SEARCH ==========
  
  renderGlossary() {
    const main = document.getElementById('main-content');
    if (!main) return;
    const lang = this.lang();
    const items = (typeof GlossaryData !== 'undefined' ? GlossaryData : []).map(g => `
      <article class="glossary-card" id="gloss-${g.id}">
        <h3>${this.txt(g.term)}</h3>
        <p>${this.txt(g.def)}</p>
        ${g.tech ? `<code class="glossary-tech">${g.tech}</code>` : ''}
        ${g.path ? `<a class="glossary-path" href="#/path/${g.path}">${g.path}</a>` : ''}
      </article>`).join('');
    main.innerHTML = `
      <div class="page-header">
        <h1>${lang==='ar' ? 'قاموس أودو' : 'Odoo Glossary'}</h1>
        <p class="text-muted">${lang==='ar' ? 'مصطلحات وظيفية وتقنية مع الأسماء التقنية — استخدم البحث في الأعلى.' : 'Functional and technical terms with technical names — use the top search.'}</p>
      </div>
      <div class="glossary-grid">${items}</div>`;
    this.renderShell();
  },

  handleSearch(query) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;
    if (!query || query.length < 2) {
      resultsEl.classList.remove('active');
      resultsEl.innerHTML = '';
      return;
    }
    const q = query.toLowerCase();
    const results = [];
    LessonsData.forEach(l => {
      const title = this.txt(l.title).toLowerCase();
      const desc = this.txt(l.description).toLowerCase();
      if (title.includes(q) || desc.includes(q) || l.id.includes(q)) {
        results.push({ title: this.txt(l.title), type: 'Lesson', path: l.path, route: `/lesson/${l.id}` });
      }
    });
    PathsData.forEach(p => {
      if (this.txt(p.title).toLowerCase().includes(q)) {
        results.push({ title: this.txt(p.title), type: 'Path', path: p.id, route: `/path/${p.id}` });
      }
    });
    if (q.includes('quotation') || q.includes('عرض')) {
      results.push({ title: this.t('salesSimulator'), type: 'Lab', path: 'practice', route: '/lab/sales' });
    }
    if (typeof GlossaryData !== 'undefined') {
      GlossaryData.forEach(g => {
        const term = this.txt(g.term).toLowerCase();
        const def = this.txt(g.def).toLowerCase();
        const tech = (g.tech || '').toLowerCase();
        if (term.includes(q) || def.includes(q) || tech.includes(q) || g.id.includes(q)) {
          results.push({ title: this.txt(g.term), type: 'Glossary', path: 'glossary', route: '/glossary' });
        }
      });
    }
    if (results.length === 0) {
      resultsEl.innerHTML = `<div class="search-result-item text-muted">${this.t('noResults')}</div>`;
    } else {
      resultsEl.innerHTML = results.slice(0, 8).map(r => `
        <button class="search-result-item" onclick="Router.navigate('${r.route}');document.getElementById('search-results').classList.remove('active')">
          <span class="search-result-type">${r.type}</span>
          <span>${r.title}</span>
        </button>
      `).join('');
    }
    resultsEl.classList.add('active');
  },

  // ========== PRICING / MONETIZATION ==========
  showUpgradeModal(reason) {
    const msg = reason || this.t('lockedFeatureMsg');
    const html = `
      <div style="text-align:center;max-width:360px">
        <div style="font-size:2.5rem;margin-bottom:0.5rem">🔒</div>
        <h3 style="margin-bottom:0.5rem">${this.t('lockedContent')}</h3>
        <p class="text-muted text-sm mb-3">${msg}</p>
        <ul class="text-sm" style="text-align:start;margin:0 auto 1rem;max-width:280px;line-height:1.7">
          <li>${this.t('proIncludes')}</li>
        </ul>
        <button class="btn btn-primary btn-lg" style="width:100%;margin-bottom:0.5rem" onclick="Router.navigate('/pricing');UI.hideModal()">${this.t('upgradeToPro')}</button>
        <button class="btn btn-secondary btn-sm" style="width:100%" onclick="UI.hideModal()">${this.t('cancel') || 'Cancel'}</button>
      </div>`;
    this.showModal(html);
  },


  renderCertificate(pathId) {
    this.showApp();
    const path = PathsData.find(p => p.id === pathId);
    if (!path) { Router.navigate('/paths'); return; }
    AppState.updatePathProgress();
    if (!AppState.isPathComplete(pathId)) {
      this.showToast(this.lang()==='ar'?'أكمل المسار أولاً للحصول على الشهادة':'Complete the path first to get the certificate', 'incorrect');
      Router.navigate('/path/' + pathId);
      return;
    }
    if (AppState.isFeatureLocked('certificates') && pathId !== 'fundamentals') {
      this.showUpgradeModal(this.t('certificateLocked'));
      Router.navigate('/path/' + pathId);
      return;
    }
    const cert = AppState.issueCertificate(pathId) || AppState.getCertificate(pathId);
    const name = (cert && cert.name) || AppState.get().user.name || 'Odoo Learner';
    const dateStr = cert && cert.issuedAt
      ? new Date(cert.issuedAt).toLocaleDateString(this.lang()==='ar'?'ar-EG':'en-GB', { year:'numeric', month:'long', day:'numeric' })
      : new Date().toLocaleDateString();
    const pathTitle = this.txt(path.title);
    document.getElementById('main-content').innerHTML = `
      <div class="page-content">
        <button class="btn btn-ghost btn-sm mb-3" onclick="Router.navigate('/path/${pathId}')">← ${this.t('back')}</button>
        <div class="certificate-actions mb-3 flex gap-2" style="flex-wrap:wrap">
          <button class="btn btn-primary" onclick="window.print()">${this.lang()==='ar'?'طباعة / حفظ PDF':'Print / Save PDF'}</button>
          <button class="btn btn-secondary" onclick="Router.navigate('/path/${pathId}')">${this.t('back')}</button>
        </div>
        <div class="certificate" id="certificate-sheet">
          <div class="certificate-border">
            <div class="certificate-header">
              <div class="certificate-logo">Odoo Academy</div>
              <div class="certificate-badge">🎓</div>
            </div>
            <p class="certificate-label">${this.lang()==='ar'?'شهادة إتمام مسار' : 'Certificate of Completion'}</p>
            <h2 class="certificate-title">${this.lang()==='ar'?'يُشهد بأن':'This is to certify that'}</h2>
            <p class="certificate-name">${name}</p>
            <p class="certificate-body">${this.lang()==='ar'
              ? 'قد أتمّ بنجاح مسار التعلّم:'
              : 'has successfully completed the learning path:'}</p>
            <p class="certificate-path">${pathTitle}</p>
            <p class="certificate-meta">${this.lang()==='ar'?'التاريخ:':'Date:'} ${dateStr}</p>
            <div class="certificate-footer">
              <div class="certificate-sign">
                <div class="sign-line"></div>
                <span>${this.lang()==='ar'?'Odoo Academy — تعلّم مستقل':'Odoo Academy — Independent Learning'}</span>
              </div>
            </div>
            <p class="certificate-note">${this.lang()==='ar'
              ? 'منتج تعليمي مستقل وغير تابع لـ Odoo S.A.'
              : 'Independent educational product, not affiliated with Odoo S.A.'}</p>
          </div>
        </div>
      </div>
    `;
  },

  renderPricing() {
    this.showApp();
    const s = AppState.get();
    const isPro = AppState.isPro();
    const plan = s.user.plan || 'free';
    const el = document.getElementById('main-content');
    if (!el) return;

    el.innerHTML = `
      <div class="page pricing-page">
        <h1 class="mb-2">${this.t('pricing')}</h1>
        <p class="text-muted mb-4">${this.t('choosePlan')}</p>

        <div class="pricing-grid">
          <!-- Free -->
          <div class="pricing-card card ${plan === 'free' && !isPro ? 'current' : ''}">
            <div class="pricing-badge">${this.t('freePlan')}</div>
            <div class="pricing-price">$0</div>
            <p class="text-sm text-muted mb-3">${this.t('freeIncludes')}</p>
            <ul class="pricing-features text-sm">
              <li>✓ ${this.t('fundamentals') || 'Fundamentals path'}</li>
              <li>✓ ${this.t('quizzes') || 'Basic quizzes'}</li>
              <li class="muted">✗ Sales & Inventory paths</li>
              <li class="muted">✗ Simulators & Labs</li>
              <li class="muted">✗ Certificates</li>
            </ul>
            ${!isPro ? `<button class="btn btn-secondary" disabled>${this.t('currentPlan')}</button>` : `<button class="btn btn-secondary" disabled>${this.t('freePlan')}</button>`}
          </div>

          <!-- Pro Monthly -->
          <div class="pricing-card card popular ${plan === 'pro_monthly' ? 'current' : ''}">
            <div class="pricing-badge popular-badge">${this.t('mostPopular')}</div>
            <div class="pricing-price">$9<span class="pricing-period">${this.t('perMonth')}</span></div>
            <p class="text-sm text-muted mb-3">${this.t('proIncludes')}</p>
            <ul class="pricing-features text-sm">
              <li>✓ All learning paths</li>
              <li>✓ Sales & Inventory simulators</li>
              <li>✓ Practice labs</li>
              <li>✓ Certificates</li>
              <li>✓ Priority updates</li>
            </ul>
            ${isPro && plan === 'pro_monthly'
              ? `<button class="btn btn-secondary" disabled>${this.t('currentPlan')}</button>`
              : `<button class="btn btn-primary" onclick="UI.activatePro('pro_monthly')">${this.t('buyNow')}</button>`}
          </div>

          <!-- Pro Lifetime -->
          <div class="pricing-card card ${plan === 'pro_lifetime' ? 'current' : ''}">
            <div class="pricing-badge">${this.t('proLifetime')}</div>
            <div class="pricing-price">$49<span class="pricing-period">${this.t('oneTime')}</span></div>
            <p class="text-sm text-muted mb-3">${this.t('proIncludes')}</p>
            <ul class="pricing-features text-sm">
              <li>✓ Everything in Pro Monthly</li>
              <li>✓ Lifetime access</li>
              <li>✓ All future paths</li>
              <li>✓ Certificates</li>
              <li>✓ Best value</li>
            </ul>
            ${isPro && plan === 'pro_lifetime'
              ? `<button class="btn btn-secondary" disabled>${this.t('currentPlan')}</button>`
              : `<button class="btn btn-primary" onclick="UI.activatePro('pro_lifetime')">${this.t('buyNow')}</button>`}
          </div>
        </div>

        <div class="card mt-4" style="max-width:640px;margin:1.5rem auto 0;padding:1rem 1.25rem">
          <p class="text-sm text-muted mb-2">${this.t('paymentNote')}</p>
          <button class="btn btn-secondary btn-sm" onclick="UI.activatePro('pro_lifetime')">${this.t('activateDemo')}</button>
          ${isPro ? `<button class="btn btn-secondary btn-sm" style="margin-inline-start:0.5rem" onclick="AppState.clearPro();UI.renderPricing();UI.renderShell()">${this.t('freePlan')} (reset)</button>` : ''}
        </div>
      </div>
    `;
  },

  activatePro(plan) {
    AppState.setPro(plan);
    this.hideModal();
    this.showToast(this.t('upgradeToPro') + ' ✓', 'success');
    this.renderPricing();
    this.renderShell();
  },

};