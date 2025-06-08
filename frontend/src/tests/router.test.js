// src/tests/unit/router.test.js
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createMemoryHistory } from 'vue-router';
import router from '@/router.js';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Router', () => {
  beforeEach(async () => {
    // Reset localStorage mock
    vi.clearAllMocks();

    // Reset router to a clean state by pushing to a route that doesn't trigger guards
    // We'll use replace to avoid adding to history stack
    await router.replace('/login');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Route Configuration', () => {
    it('has correct route paths configured', () => {
      const routes = router.getRoutes();
      const paths = routes.map(route => route.path);

      expect(paths).toContain('/');
      expect(paths).toContain('/login');
      expect(paths).toContain('/register');
      expect(paths).toContain('/file/:file_id');
      expect(paths).toContain('/account');
      expect(paths).toContain('/settings');
      expect(paths).toContain('/:pathMatch(.*)*'); // 404 catch-all
    });

    it('has NotFound route as catch-all', () => {
      const notFoundRoute = router.getRoutes().find(route => route.name === 'NotFound');
      expect(notFoundRoute).toBeDefined();
      expect(notFoundRoute.path).toBe('/:pathMatch(.*)*');
    });
  });

  describe('Authentication Guard', () => {
    it('allows access to public pages without token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      await router.push('/login');
      expect(router.currentRoute.value.path).toBe('/login');

      await router.push('/register');
      expect(router.currentRoute.value.path).toBe('/register');
    });

    it('redirects to login when accessing protected route without token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      await router.push('/');
      expect(router.currentRoute.value.path).toBe('/login');

      await router.push('/account');
      expect(router.currentRoute.value.path).toBe('/login');

      await router.push('/settings');
      expect(router.currentRoute.value.path).toBe('/login');

      await router.push('/file/123');
      expect(router.currentRoute.value.path).toBe('/login');
    });

    it('allows access to protected routes with valid token', async () => {
      mockLocalStorage.getItem.mockReturnValue('valid-token');

      await router.push('/');
      expect(router.currentRoute.value.path).toBe('/');

      await router.push('/account');
      expect(router.currentRoute.value.path).toBe('/account');

      await router.push('/settings');
      expect(router.currentRoute.value.path).toBe('/settings');

      await router.push('/file/123');
      expect(router.currentRoute.value.path).toBe('/file/123');
    });

    it('allows access to public pages even with token', async () => {
      mockLocalStorage.getItem.mockReturnValue('valid-token');

      await router.push('/login');
      expect(router.currentRoute.value.path).toBe('/login');

      await router.push('/register');
      expect(router.currentRoute.value.path).toBe('/register');
    });

    it('handles dynamic routes correctly', async () => {
      mockLocalStorage.getItem.mockReturnValue('valid-token');

      await router.push('/file/456');
      expect(router.currentRoute.value.path).toBe('/file/456');
      expect(router.currentRoute.value.params.file_id).toBe('456');
    });

    it('redirects dynamic routes to login without token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      await router.push('/file/456');
      expect(router.currentRoute.value.path).toBe('/login');
    });
  });

  describe('Navigation Behavior', () => {
    it('calls localStorage.getItem with correct key', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      await router.push('/');

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('accessToken');
    });

    it('checks authentication on every navigation', async () => {
      mockLocalStorage.getItem.mockReturnValue('token');

      // Clear the mock to start fresh after beforeEach
      mockLocalStorage.getItem.mockClear();

      await router.push('/');
      await router.push('/account');
      await router.push('/settings');

      expect(mockLocalStorage.getItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string token as no token', async () => {
      mockLocalStorage.getItem.mockReturnValue('');

      await router.push('/');
      expect(router.currentRoute.value.path).toBe('/login');
    });

    it('handles whitespace-only token as no token', async () => {
      mockLocalStorage.getItem.mockReturnValue('   ');

      await router.push('/');
      // Since your router code uses .trim(), whitespace-only tokens are treated as no token
      expect(router.currentRoute.value.path).toBe('/login');
    });

    it('handles non-existent routes', async () => {
      mockLocalStorage.getItem.mockReturnValue('token');

      await router.push('/nonexistent');
      expect(router.currentRoute.value.name).toBe('NotFound');
    });
  });
});
