// backend/services/cacheService.js

/**
 * Simple in-memory caching service with TTL expiration.
 * Compatible with controllers using:
 * - cacheService.get(key)
 * - cacheService.set(key, value, ttlSeconds)
 * - cacheService.del(key)
 * - cacheService.invalidate(key)
 * - cacheService.generateKey(object)
 */

class CacheService {
    constructor() {
        this.cache = new Map(); // key → { value, expiresAt }
    }

    /**
     * Generate a deterministic cache key from any object.
     * Useful when caching queries with filters, pagination, etc.
     */
    generateKey(obj = {}) {
        try {
            return `cache:${JSON.stringify(obj, Object.keys(obj).sort())}`;
        } catch (err) {
            // fallback for unusual objects
            return `cache:${Date.now()}`;
        }
    }

    /**
     * Save data to cache with TTL (seconds)
     */
    set(key, value, ttlSeconds = 300) {
        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { value, expiresAt });
    }

    /**
     * Retrieve data from cache if not expired.
     */
    get(key) {
        const entry = this.cache.get(key);

        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            // expired → delete
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    /**
     * Remove a single cache key.
     */
    del(key) {
        this.cache.delete(key);
    }

    /**
     * Alias for del()
     */
    invalidate(key) {
        this.del(key);
    }

    /**
     * Clear all cached keys.
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Internal cleanup: remove expired keys occasionally.
     */
    cleanupExpired() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}

// Create a singleton instance
const cacheService = new CacheService();

// Automatic cleanup every 1 minute
setInterval(() => cacheService.cleanupExpired(), 60 * 1000);

export default cacheService;
