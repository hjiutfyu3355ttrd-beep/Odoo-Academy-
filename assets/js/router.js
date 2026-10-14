/**
 * Hash Router - SPA navigation
 */
const Router = {
  routes: {},
  current: null,

  init() {
    window.addEventListener('hashchange', () => this.handle());
    this.handle();
  },

  register(path, handler) {
    this.routes[path] = handler;
  },

  navigate(path) {
    if (!path.startsWith('#')) path = '#' + path;
    window.location.hash = path;
  },

  handle() {
    const hash = window.location.hash.slice(1) || '/landing';
    const parts = hash.split('/').filter(Boolean);
    let matched = false;

    // Login required for everything except landing / login / register
    if (typeof Auth !== 'undefined' && !Auth.isLoggedIn() && !Auth.PUBLIC_ROUTES.includes(parts[0] || 'landing')) {
      this.navigate('/login');
      return;
    }

    // Exact match
    if (this.routes['/' + parts.join('/')]) {
      this.current = '/' + parts.join('/');
      this.routes[this.current](parts);
      matched = true;
    } else if (parts[0] === 'path' && parts[1] && this.routes['/path/:id']) {
      this.current = '/path/:id';
      this.routes['/path/:id'](parts);
      matched = true;
    } else if (parts[0] === 'lesson' && parts[1] && this.routes['/lesson/:id']) {
      this.current = '/lesson/:id';
      this.routes['/lesson/:id'](parts);
      matched = true;
    } else if (parts[0] === 'quiz' && parts[1] && this.routes['/quiz/:id']) {
      this.current = '/quiz/:id';
      this.routes['/quiz/:id'](parts);
      matched = true;
    } else if (parts[0] === 'lab' && parts[1] && this.routes['/lab/:id']) {
      this.current = '/lab/:id';
      this.routes['/lab/:id'](parts);
      matched = true;
    } else if (parts[0] === 'certificate' && parts[1] && this.routes['/certificate/:id']) {
      this.current = '/certificate/:id';
      this.routes['/certificate/:id'](parts);
      matched = true;
    } else if (this.routes['/' + (parts[0] || 'landing')]) {
      this.current = '/' + (parts[0] || 'landing');
      this.routes[this.current](parts);
      matched = true;
    }

    if (!matched && this.routes['/dashboard']) {
      this.navigate('/dashboard');
    }

    this.updateNav();
  },

  updateNav() {
    document.querySelectorAll('.nav-item').forEach(el => {
      const route = el.getAttribute('data-route');
      if (!route) return;
      const hash = window.location.hash.slice(1) || 'landing';
      const active = hash === route || hash.startsWith(route + '/');
      el.classList.toggle('active', active);
    });
  },

  getParam(parts, index) {
    return parts[index] || null;
  }
};
