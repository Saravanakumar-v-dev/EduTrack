// server/services/cacheService.js

/**
 * Simple in-memory cache with TTL
 * --------------------------------
 * ✔ No external dependencies
 * ✔ Safe for development & small deployments
 * ✔ API-compatible with your controllers
 *
 * NOTE:
 * - This cache is process-local.
 * - For production scale, replace with Redis.
 */

class CacheService {
    constructor() {
      this.store = new Map();
    }
  
    /* ======================================================
       INTERNAL HELPERS
    ====================================================== */
  
    _isExpired(entry) {
      if (!entry) return true;
      if (!entry.expiry) return false;
      return Date.now() > entry.expiry;
    }
  
    _cleanup(key) {
      this.store.delete(key);
    }
  
    /* ======================================================
       BASIC OPERATIONS
    ====================================================== */
  
    get(key) {
      const entry = this.store.get(key);
      if (!entry) return null;
  
      if (this._isExpired(entry)) {
        this._cleanup(key);
        return null;
      }
  
      return entry.value;
    }
  
    set(key, value, ttlSeconds = 300) {
      if (!key) return;
  
      const expiry =
        typeof ttlSeconds === "number"
          ? Date.now() + ttlSeconds * 1000
          : null;
  
      this.store.set(key, {
        value,
        expiry,
      });
    }
  
    del(key) {
      if (!key) return;
      this.store.delete(key);
    }
  
    remove(key) {
      // alias for del (used by some controllers)
      this.del(key);
    }
  
    invalidate(key) {
      // alias for del (used by some controllers)
      this.del(key);
    }
  
    /* ======================================================
       WILDCARD INVALIDATION
    ====================================================== */
  
    invalidateByPrefix(prefix) {
      if (!prefix) return;
  
      for (const key of this.store.keys()) {
        if (key.startsWith(prefix)) {
          this.store.delete(key);
        }
      }
    }
  
    /* ======================================================
       KEY GENERATION
    ====================================================== */
  
    generateKey(params = {}) {
      try {
        return Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}:${v}`)
          .join("|");
      } catch (err) {
        return JSON.stringify(params);
      }
    }
  
    /* ======================================================
       DEBUG / MAINTENANCE
    ====================================================== */
  
    clear() {
      this.store.clear();
    }
  
    size() {
      return this.store.size;
    }
  }
  
  /* ======================================================
     EXPORT SINGLETON
  ====================================================== */
  
  const cacheService = new CacheService();
  export default cacheService;
  