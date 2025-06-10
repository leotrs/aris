import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import createElementVisibilityObserver from '@/composables/createElementVisibilityObserver.js';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();

const mockIntersectionObserver = vi.fn(() => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  unobserve: mockUnobserve,
}));

// Store original IntersectionObserver
const originalIntersectionObserver = global.IntersectionObserver;

describe('createElementVisibilityObserver', () => {
  let mockElement;
  let observerCallback;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock IntersectionObserver globally
    global.IntersectionObserver = mockIntersectionObserver;

    // Create a mock DOM element
    mockElement = document.createElement('div');

    // Capture the callback passed to IntersectionObserver
    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: mockUnobserve,
      };
    });
  });

  afterEach(() => {
    // Restore original IntersectionObserver
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it('should initialize with isVisible as false', () => {
    const { isVisible } = createElementVisibilityObserver(mockElement);

    expect(isVisible.value).toBe(false);
  });

  it('should create IntersectionObserver with correct threshold', () => {
    createElementVisibilityObserver(mockElement);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.25 }
    );
  });

  it('should observe the provided element', () => {
    createElementVisibilityObserver(mockElement);

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it('should update isVisible when element becomes visible', () => {
    const { isVisible } = createElementVisibilityObserver(mockElement);

    // Simulate intersection observer callback with visible entry
    const mockEntry = { isIntersecting: true };
    observerCallback([mockEntry]);

    expect(isVisible.value).toBe(true);
  });

  it('should update isVisible when element becomes hidden', () => {
    const { isVisible } = createElementVisibilityObserver(mockElement);

    // First make it visible
    observerCallback([{ isIntersecting: true }]);
    expect(isVisible.value).toBe(true);

    // Then make it hidden
    observerCallback([{ isIntersecting: false }]);
    expect(isVisible.value).toBe(false);
  });

  it('should handle multiple visibility changes', () => {
    const { isVisible } = createElementVisibilityObserver(mockElement);

    // Initially false
    expect(isVisible.value).toBe(false);

    // Visible
    observerCallback([{ isIntersecting: true }]);
    expect(isVisible.value).toBe(true);

    // Hidden
    observerCallback([{ isIntersecting: false }]);
    expect(isVisible.value).toBe(false);

    // Visible again
    observerCallback([{ isIntersecting: true }]);
    expect(isVisible.value).toBe(true);
  });

  it('should disconnect observer when tearDown is called', () => {
    const { tearDown } = createElementVisibilityObserver(mockElement);

    tearDown();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should handle tearDown being called multiple times', () => {
    const { tearDown } = createElementVisibilityObserver(mockElement);

    tearDown();
    tearDown(); // Should not throw

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  describe('edge cases', () => {
    it('should handle null element gracefully', () => {
      expect(() => createElementVisibilityObserver(null)).not.toThrow();

      // Should not create observer or call observe
      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it('should handle undefined element gracefully', () => {
      expect(() => createElementVisibilityObserver(undefined)).not.toThrow();

      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it('should handle non-Element objects gracefully', () => {
      const notAnElement = { foo: 'bar' };

      expect(() => createElementVisibilityObserver(notAnElement)).not.toThrow();

      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it('should return tearDown function even with invalid element', () => {
      const { tearDown } = createElementVisibilityObserver(null);

      expect(typeof tearDown).toBe('function');
      expect(() => tearDown()).not.toThrow();
    });
  });

  describe('reactive behavior', () => {
    it('should maintain reactivity when isVisible changes', () => {
      const { isVisible } = createElementVisibilityObserver(mockElement);

      // Track changes
      const changes = [];

      // Watch the ref for changes (Vue 3 reactivity)

      // Simulate watching the ref value
      changes.push(isVisible.value); // Initial value

      // Trigger changes and manually track them
      observerCallback([{ isIntersecting: true }]);
      changes.push(isVisible.value);

      observerCallback([{ isIntersecting: false }]);
      changes.push(isVisible.value);

      expect(changes).toEqual([false, true, false]);
    });
  });

  describe('browser compatibility', () => {
    it('should handle environments without IntersectionObserver', () => {
      // Temporarily remove IntersectionObserver
      const temp = global.IntersectionObserver;
      delete global.IntersectionObserver;

      expect(() => createElementVisibilityObserver(mockElement)).toThrow();

      // Restore
      global.IntersectionObserver = temp;
    });
  });
});
