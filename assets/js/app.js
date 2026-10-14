/**
 * Odoo Academy - Main Application Bootstrap
 */
(function () {
  'use strict';

  function init() {
    AppState.init();

    // Register routes
    Router.register('/landing', () => UI.renderLanding());
    Router.register('/dashboard', () => UI.renderDashboard());
    Router.register('/paths', () => UI.renderPaths());
    Router.register('/path/:id', (parts) => UI.renderPath(parts[1]));
    Router.register('/lesson/:id', (parts) => UI.renderLesson(parts[1]));
    Router.register('/quiz/:id', (parts) => UI.renderQuiz(parts[1]));
    Router.register('/practice', () => UI.renderPractice());
    Router.register('/lab/:id', (parts) => UI.renderLab(parts[1]));
    Router.register('/quizzes', () => UI.renderQuizzes());
    Router.register('/achievements', () => UI.renderAchievements());
    Router.register('/progress', () => UI.renderProgress());
    Router.register('/settings', () => UI.renderSettings());
    Router.register('/pricing', () => UI.renderPricing());
    Router.register('/glossary', () => UI.renderGlossary());
    Router.register('/certificate/:id', (parts) => UI.renderCertificate(parts[1]));

    Router.init();

    // Header events
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => UI.handleSearch(e.target.value));
      searchInput.addEventListener('focus', (e) => UI.handleSearch(e.target.value));
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-search')) {
          const r = document.getElementById('search-results');
          if (r) r.classList.remove('active');
        }
      });
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AppState.setLanguage(btn.dataset.lang);
        UI.renderShell();
        Router.handle();
      });
    });

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const next = AppState.get().settings.theme === 'dark' ? 'light' : 'dark';
        AppState.setTheme(next);
        UI.renderShell();
      });
    }

    // Sidebar toggle (mobile)
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        if (overlay) overlay.classList.toggle('active');
      });
      if (overlay) {
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('mobile-open');
          overlay.classList.remove('active');
        });
      }
    }

    // Collapse sidebar desktop
    const collapseBtn = document.getElementById('sidebar-collapse');
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Modal ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') UI.hideModal();
    });
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) UI.hideModal();
      });
    }

    // Subscribe to state changes for header
    AppState.subscribe(() => UI.renderShell());

    // First visit → landing if no significant progress
    const hash = window.location.hash;
    if (!hash || hash === '#' || hash === '#/') {
      const s = AppState.get();
      if (s.progress.completedLessons.length === 0 && s.user.xp <= 120) {
        Router.navigate('/landing');
      } else {
        Router.navigate('/dashboard');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
