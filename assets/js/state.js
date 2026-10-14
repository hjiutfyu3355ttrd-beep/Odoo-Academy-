/**
 * Central State Manager
 * All app state flows through here
 */
const AppState = {
  state: null,
  listeners: [],

  defaultState() {
    return {
      user: {
        name: 'Odoo Learner',
        xp: 120,
        level: 2,
        streak: 2,
        lastActiveDate: new Date().toISOString().slice(0, 10),
        isPro: false,
        plan: 'free'   // free | pro_monthly | pro_lifetime
      },
      progress: {
        completedLessons: [],
        currentLesson: null,
        quizScores: {},
        labs: {},
        simulator: {
          sales: { completed: false },
          inventory: { completed: false },
          purchase: { completed: false },
          pos: { completed: false },
          manufacturing: { completed: false }
        },
        knowledgeChecks: {}
      },
      achievements: [],
      settings: {
        language: 'ar',
        theme: 'light'
      },
      pathProgress: {
        fundamentals: 0,
        sales: 0,
        inventory: 0,
        purchase: 0,
        accounting: 0,
        manufacturing: 0,
        hr: 0,
        technical: 0,
        pos: 0,
        project: 0,
        integrations: 0
      },
      certificates: {}
    };
  },

  init() {
    const saved = storage.getState();
    if (saved) {
      this.state = this.mergeDeep(this.defaultState(), saved);
    } else {
      this.state = this.defaultState();
      this.save();
    }
    this.updateStreak();
    this.applySettings();
  },

  mergeDeep(target, source) {
    const out = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        out[key] = this.mergeDeep(target[key] || {}, source[key]);
      } else {
        out[key] = source[key];
      }
    }
    return out;
  },

  get() {
    return this.state;
  },

  save() {
    storage.setState(this.state);
    this.notify();
  },

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  },

  notify() {
    this.listeners.forEach(fn => {
      try { fn(this.state); } catch (e) { console.error(e); }
    });
  },

  // User
  setUserName(name) {
    this.state.user.name = name || 'Odoo Learner';
    this.save();
  },

  addXP(amount, reason) {
    if (!amount || amount <= 0) return;
    this.state.user.xp += amount;
    this.updateLevel();
    this.checkAchievements();
    this.save();
    if (window.UI) UI.showToast(`+${amount} XP`, 'xp');
  },

  updateLevel() {
    const xp = this.state.user.xp;
    let level = 1;
    if (xp >= 1500) level = 6;
    else if (xp >= 1000) level = 5;
    else if (xp >= 600) level = 4;
    else if (xp >= 300) level = 3;
    else if (xp >= 100) level = 2;
    this.state.user.level = level;
  },

  getLevelName(level) {
    const names = {
      1: { ar: 'مبتدئ', en: 'Beginner' },
      2: { ar: 'مستكشف', en: 'Explorer' },
      3: { ar: 'متعلم أودو', en: 'Odoo Learner' },
      4: { ar: 'ممارس أودو', en: 'Odoo Practitioner' },
      5: { ar: 'متخصص أودو', en: 'Odoo Specialist' },
      6: { ar: 'خبير أودو', en: 'Odoo Expert' }
    };
    const lang = this.state.settings.language;
    return (names[level] || names[1])[lang];
  },

  // Progress
  isLessonComplete(lessonId) {
    return this.state.progress.completedLessons.includes(lessonId);
  },

  completeLesson(lessonId, xp = 20) {
    if (this.isLessonComplete(lessonId)) return false;
    this.state.progress.completedLessons.push(lessonId);
    this.state.progress.currentLesson = lessonId;
    this.addXP(xp);
    this.updatePathProgress();
    this.checkAchievements();
    this.updateStreak();
    this.save();
    if (window.UI) UI.showToast(i18n.t('lessonCompleted'), 'success');
    return true;
  },

  setKnowledgeCheck(lessonId, correct) {
    this.state.progress.knowledgeChecks[lessonId] = correct;
    if (correct) this.addXP(10);
    this.save();
  },

  setQuizScore(quizId, score, total, xp) {
    this.state.progress.quizScores[quizId] = { score, total, percent: Math.round((score / total) * 100), date: new Date().toISOString() };
    this.addXP(xp || 50);
    this.checkAchievements();
    this.save();
  },

  completeLab(labId, xp = 100) {
    this.state.progress.labs[labId] = { completed: true, date: new Date().toISOString() };
    this.addXP(xp);
    this.checkAchievements();
    this.save();
  },

  completeSimulator(type, xp = 100) {
    if (!this.state.progress.simulator[type]) this.state.progress.simulator[type] = {};
    this.state.progress.simulator[type].completed = true;
    this.addXP(xp);
    this.checkAchievements();
    this.save();
  },

  updatePathProgress() {
    const paths = ['fundamentals', 'sales', 'inventory', 'purchase', 'accounting', 'manufacturing', 'hr', 'technical', 'pos', 'project', 'integrations'];
    paths.forEach(p => {
      const lessons = (window.LessonsData || []).filter(l => l.path === p);
      const completed = lessons.filter(l => this.isLessonComplete(l.id)).length;
      this.state.pathProgress[p] = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
    });
  },

  getOverallProgress() {
    const total = (window.LessonsData || []).length || 41;
    const done = this.state.progress.completedLessons.length;
    return total ? Math.round((done / total) * 100) : 0;
  },

  // Streak
  updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const last = this.state.user.lastActiveDate;
    if (!last) {
      this.state.user.streak = 1;
      this.state.user.lastActiveDate = today;
      return;
    }
    if (last === today) return;
    const lastDate = new Date(last);
    const todayDate = new Date(today);
    const diff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      this.state.user.streak += 1;
    } else if (diff > 1) {
      this.state.user.streak = 1;
    }
    this.state.user.lastActiveDate = today;
    this.save();
  },

  // Settings
  setLanguage(lang) {
    this.state.settings.language = lang;
    this.applySettings();
    this.save();
  },

  setTheme(theme) {
    this.state.settings.theme = theme;
    this.applySettings();
    this.save();
  },

  applySettings() {
    const { language, theme } = this.state.settings;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-theme', theme);
  },

  // Achievements
  checkAchievements() {
    const defs = window.AchievementsData || [];
    const unlocked = this.state.achievements;
    defs.forEach(a => {
      if (unlocked.includes(a.id)) return;
      if (a.condition(this.state)) {
        this.state.achievements.push(a.id);
        if (a.xp) this.state.user.xp += a.xp;
        this.updateLevel();
        if (window.UI) UI.showAchievement(a);
      }
    });
  },

  hasAchievement(id) {
    return this.state.achievements.includes(id);
  },

  // Reset
  resetProgress() {
    const lang = this.state.settings.language;
    const theme = this.state.settings.theme;
    const name = this.state.user.name;
    this.state = this.defaultState();
    this.state.user.name = name;
    this.state.user.xp = 0;
    this.state.user.level = 1;
    this.state.user.streak = 0;
    this.state.settings.language = lang;
    this.state.settings.theme = theme;
    this.save();
    this.applySettings();
  },

  isPro() {
    return !!(this.state && this.state.user && this.state.user.isPro);
  },

  setPro(plan) {
    if (!this.state) return;
    this.state.user.isPro = true;
    this.state.user.plan = plan || 'pro_lifetime';
    this.save();
  },

  clearPro() {
    if (!this.state) return;
    this.state.user.isPro = false;
    this.state.user.plan = 'free';
    this.save();
  },

  // Paths that require Pro
  isPathLocked(pathId) {
    if (this.isPro()) return false;
    return pathId === 'sales' || pathId === 'inventory' || pathId === 'purchase' || pathId === 'accounting' || pathId === 'manufacturing' || pathId === 'hr' || pathId === 'technical' || pathId === 'pos' || pathId === 'project' || pathId === 'integrations';
  },

  isFeatureLocked(feature) {
    if (this.isPro()) return false;
    // free: fundamentals lessons + basic quizzes only
    return ['simulators', 'labs', 'certificates', 'sales', 'inventory', 'purchase', 'accounting', 'manufacturing', 'hr', 'technical', 'pos', 'project', 'integrations'].includes(feature);
  },

  isPathComplete(pathId) {
    return (this.state.pathProgress[pathId] || 0) >= 100;
  },

  issueCertificate(pathId) {
    this.updatePathProgress();
    if (!this.isPathComplete(pathId)) return null;
    if (!this.state.certificates) this.state.certificates = {};
    if (!this.state.certificates[pathId]) {
      this.state.certificates[pathId] = {
        pathId,
        issuedAt: new Date().toISOString(),
        name: this.state.user.name || 'Odoo Learner'
      };
      this.addXP(50);
      this.checkAchievements();
      this.save();
    }
    return this.state.certificates[pathId];
  },

  getCertificate(pathId) {
    return (this.state.certificates || {})[pathId] || null;
  },

  exportProgress() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      state: this.state
    };
    return JSON.stringify(data, null, 2);
  },

  importProgress(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      const incoming = data.state || data;
      if (!incoming || !incoming.user || !incoming.progress) {
        return { ok: false, error: 'invalid' };
      }
      this.state = this.mergeDeep(this.defaultState(), incoming);
      this.updatePathProgress();
      this.save();
      this.applySettings();
      this.notify();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'parse' };
    }
  }

};
