'use strict';

const cacheEngine = require('../cache/cacheEngine');
const cacheStore = require('../storage/cacheStore');
const config = require('../config');

describe('Cache Engine Functional Tests', () => {
  beforeEach(() => {
    cacheStore.clear(); // Reset in-memory cache before each test
  });

  describe('SET Operation', () => {
    it('should successfully store a valid cache entry', () => {
      const result = cacheEngine.setEntry('testKey', { data: 'testValue' }, 300);
      expect(result.success).toBe(true);
      expect(cacheStore.has('testKey')).toBe(true);
    });

    it('should handle invalid requests (missing key or value)', () => {
      const resultNoKey = cacheEngine.setEntry(null, 'value', 300);
      expect(resultNoKey.success).toBe(false);
      expect(resultNoKey.statusCode).toBe(400);

      const resultNoValue = cacheEngine.setEntry('key', null, 300);
      expect(resultNoValue.success).toBe(false);
      expect(resultNoValue.statusCode).toBe(400);
    });

    it('should return 507 when MAX_CACHE_SIZE is reached', () => {
      // Mock max cache size for this test
      const originalMax = config.maxCacheSize;
      config.maxCacheSize = 2;
      
      cacheEngine.setEntry('key1', 'val1');
      cacheEngine.setEntry('key2', 'val2');
      
      const resultFull = cacheEngine.setEntry('key3', 'val3');
      expect(resultFull.success).toBe(false);
      expect(resultFull.statusCode).toBe(507);
      
      config.maxCacheSize = originalMax; // Restore
    });
  });

  describe('GET Operation', () => {
    it('should retrieve an existing cache entry', () => {
      cacheEngine.setEntry('key1', 'val1', 300);
      
      const result = cacheEngine.getEntry('key1');
      expect(result.success).toBe(true);
      expect(result.data.value).toBe('val1');
    });

    it('should handle cache miss (key not found)', () => {
      const result = cacheEngine.getEntry('missingKey');
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
    });

    it('should handle lazy TTL expiration on GET', () => {
      jest.useFakeTimers();
      cacheEngine.setEntry('expKey', 'val', 1); // 1 second TTL
      
      // Advance time by 2 seconds
      jest.advanceTimersByTime(2000);
      
      const result = cacheEngine.getEntry('expKey');
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(cacheStore.has('expKey')).toBe(false); // Lazy delete check
      
      jest.useRealTimers();
    });
  });

  describe('DELETE Operation', () => {
    it('should delete an existing entry', () => {
      cacheEngine.setEntry('delKey', 'val');
      const result = cacheEngine.deleteEntry('delKey');
      expect(result.success).toBe(true);
      expect(cacheStore.has('delKey')).toBe(false);
    });

    it('should return 404 when deleting a non-existent entry', () => {
      const result = cacheEngine.deleteEntry('missingKey');
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
    });
  });
});
