/**
 * LocalStorage Abstraction
 * Centralized storage for Odoo Academy
 */
const storage = {
  PREFIX: 'odoo_academy_',

  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Storage get error:', key, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage set error:', key, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(this.PREFIX + key);
      return true;
    } catch (e) {
      return false;
    }
  },

  reset() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  },

  // Convenience methods
  getState() {
    return this.get('state', null);
  },

  setState(state) {
    return this.set('state', state);
  }
};
