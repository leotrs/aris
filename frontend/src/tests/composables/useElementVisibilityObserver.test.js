import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import useElementVisibilityObserver from "@/composables/useElementVisibilityObserver.js";

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

describe("useElementVisibilityObserver", () => {
  let mockElement;
  let observerCallback;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock IntersectionObserver globally
    global.IntersectionObserver = mockIntersectionObserver;

    // Create a mock DOM element
    mockElement = document.createElement("div");

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

  it("should initialize with isVisible as false", () => {
    const { isVisible } = useElementVisibilityObserver(mockElement);

    expect(isVisible.value).toBe(false);
  });

  it("should create IntersectionObserver with correct threshold", () => {
    useElementVisibilityObserver(mockElement);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      threshold: 0.25,
    });
  });

  it("should observe the provided element", () => {
    useElementVisibilityObserver(mockElement);

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it("should update isVisible when element becomes visible", () => {
    const { isVisible } = useElementVisibilityObserver(mockElement);

    // Simulate intersection observer callback with visible entry
    const mockEntry = { isIntersecting: true };
    observerCallback([mockEntry]);

    expect(isVisible.value).toBe(true);
  });

  it("should update isVisible when element becomes hidden", () => {
    const { isVisible } = useElementVisibilityObserver(mockElement);

    // First make it visible
    observerCallback([{ isIntersecting: true }]);
    expect(isVisible.value).toBe(true);

    // Then make it hidden
    observerCallback([{ isIntersecting: false }]);
    expect(isVisible.value).toBe(false);
  });

  it("should handle multiple visibility changes", () => {
    const { isVisible } = useElementVisibilityObserver(mockElement);

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

  it("should disconnect observer when tearDown is called", () => {
    const { tearDown } = useElementVisibilityObserver(mockElement);

    tearDown();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("should handle tearDown being called multiple times", () => {
    const { tearDown } = useElementVisibilityObserver(mockElement);

    tearDown();
    tearDown(); // Should not throw

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  describe("edge cases", () => {
    it("should handle null element gracefully", () => {
      expect(() => useElementVisibilityObserver(null)).not.toThrow();

      // Should not create observer or call observe
      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it("should handle undefined element gracefully", () => {
      expect(() => useElementVisibilityObserver(undefined)).not.toThrow();

      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it("should handle non-Element objects gracefully", () => {
      const notAnElement = { foo: "bar" };

      expect(() => useElementVisibilityObserver(notAnElement)).not.toThrow();

      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it("should return tearDown function even with invalid element", () => {
      const { tearDown } = useElementVisibilityObserver(null);

      expect(typeof tearDown).toBe("function");
      expect(() => tearDown()).not.toThrow();
    });
  });

  describe("reactive behavior", () => {
    it("should maintain reactivity when isVisible changes", () => {
      const { isVisible } = useElementVisibilityObserver(mockElement);

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

  describe("browser compatibility", () => {
    it("should handle environments without IntersectionObserver", () => {
      // Temporarily remove IntersectionObserver
      const temp = global.IntersectionObserver;
      delete global.IntersectionObserver;

      expect(() => useElementVisibilityObserver(mockElement)).toThrow();

      // Restore
      global.IntersectionObserver = temp;
    });
  });
});
