/**
 * API Cache Manager
 * Implements simple time-to-live (TTL) based caching for API responses
 * Prevents duplicate API calls and improves performance
 */

class APICache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Get cached value if still valid
   */
  get(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return null;
  }

  /**
   * Set cache value with TTL (time-to-live in ms)
   */
  set(key, value, ttl = 300000) { // Default 5 min
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store value
    this.cache.set(key, value);

    // Set auto-expire timer
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  /**
   * Check if key exists and is still valid
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Clear specific cache key
   */
  clear(key) {
    this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.cache.forEach((_, key) => this.clear(key));
    this.cache.clear();
    this.timers.clear();
  }
}

// Global cache instance
const apiCache = new APICache();

export default apiCache;
