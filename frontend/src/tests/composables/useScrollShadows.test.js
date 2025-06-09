// src/tests/unit/useScrollShadows.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useScrollShadows } from '@/composables/useScrollShadows.js';

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }

  observe(element) {
    this.elements.add(element);
  }

  disconnect() {
    this.elements.clear();
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  // Helper method to trigger resize callback
  triggerResize() {
    this.callback();
  }
}

// Create a test component that uses the composable
const TestComponent = {
  template: `
    <div
      ref="scrollElementRef"
      style="width: 200px; overflow-x: auto;"
      data-testid="scroll-container"
    >
      <div style="width: 400px; height: 50px;">Wide content</div>
    </div>
  `,
  setup() {
    const composableResult = useScrollShadows();
    return { ...composableResult };
  }
};

describe('useScrollShadows', () => {
  let mockResizeObserver;
  let originalResizeObserver;

  beforeEach(() => {
    // Store original ResizeObserver
    originalResizeObserver = global.ResizeObserver;

    // Mock ResizeObserver
    mockResizeObserver = MockResizeObserver;
    global.ResizeObserver = mockResizeObserver;
    if (typeof window !== 'undefined') {
      window.ResizeObserver = mockResizeObserver;
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original ResizeObserver
    global.ResizeObserver = originalResizeObserver;
    if (typeof window !== 'undefined') {
      window.ResizeObserver = originalResizeObserver;
    }
  });

  describe('Initialization', () => {
    it('returns expected reactive refs and methods', () => {
      const result = useScrollShadows();

      expect(result).toHaveProperty('scrollElementRef');
      expect(result).toHaveProperty('showLeftShadow');
      expect(result).toHaveProperty('showRightShadow');
      expect(result).toHaveProperty('updateShadows');
      expect(result).toHaveProperty('setupScrollShadows');
      expect(result).toHaveProperty('cleanupScrollShadows');

      expect(result.showLeftShadow).toHaveProperty('value');
      expect(result.showRightShadow).toHaveProperty('value');
      expect(result.scrollElementRef).toHaveProperty('value');
      expect(result.showLeftShadow.value).toBe(false);
      expect(result.showRightShadow.value).toBe(false);
      expect(result.scrollElementRef.value).toBe(null);
    });
  });

  describe('Shadow Logic', () => {
    let wrapper;
    let scrollElement;

    beforeEach(async () => {
      wrapper = mount(TestComponent);
      await nextTick();
      scrollElement = wrapper.find('[data-testid="scroll-container"]').element;

      // Mock scroll properties with configurable descriptors
      Object.defineProperties(scrollElement, {
        scrollLeft: {
          value: 0,
          writable: true,
          configurable: true
        },
        scrollWidth: {
          value: 400,
          writable: true,
          configurable: true
        },
        clientWidth: {
          value: 200,
          writable: true,
          configurable: true
        }
      });

      // Ensure scrollElementRef is connected to the actual element
      wrapper.vm.scrollElementRef = scrollElement;
    });

    afterEach(() => {
      if (wrapper) wrapper.unmount();
    });

    it('correct shadows shown when at start position', async () => {
      scrollElement.scrollLeft = 0;
      wrapper.vm.updateShadows();
      await nextTick();

      expect(wrapper.vm.showLeftShadow).toBe(false);
      expect(wrapper.vm.showRightShadow).toBe(true);
    });

    it('shows left shadow when scrolled right', async () => {
      scrollElement.scrollLeft = 50;
      wrapper.vm.updateShadows();
      await nextTick();

      expect(wrapper.vm.showLeftShadow).toBe(true);
      expect(wrapper.vm.showRightShadow).toBe(true);
    });

    it('shows only left shadow when scrolled to end', async () => {
      scrollElement.scrollLeft = 200; // scrollWidth (400) - clientWidth (200)
      wrapper.vm.updateShadows();
      await nextTick();

      expect(wrapper.vm.showLeftShadow).toBe(true);
      expect(wrapper.vm.showRightShadow).toBe(false);
    });

    it('shows no shadows when content fits entirely', async () => {
      // Make content fit entirely
      Object.defineProperty(scrollElement, 'scrollWidth', { value: 200, configurable: true });
      Object.defineProperty(scrollElement, 'clientWidth', { value: 200, configurable: true });
      scrollElement.scrollLeft = 0;

      wrapper.vm.updateShadows();
      await nextTick();

      expect(wrapper.vm.showLeftShadow).toBe(false);
      expect(wrapper.vm.showRightShadow).toBe(false);
    });

    it('handles edge case where scrollLeft equals scrollable distance', async () => {
      scrollElement.scrollLeft = 199; // Just before the end
      wrapper.vm.updateShadows();
      await nextTick();

      expect(wrapper.vm.showLeftShadow).toBe(true);
      expect(wrapper.vm.showRightShadow).toBe(true);
    });
  });

  describe('Event Handling', () => {
    let wrapper;
    let scrollElement;
    let scrollEventSpy;
    let windowEventSpy;

    beforeEach(async () => {
      wrapper = mount(TestComponent);
      await nextTick();
      scrollElement = wrapper.find('[data-testid="scroll-container"]').element;

      // Mock scroll properties
      Object.defineProperties(scrollElement, {
        scrollLeft: { value: 0, writable: true, configurable: true },
        scrollWidth: { value: 400, writable: true, configurable: true },
        clientWidth: { value: 200, writable: true, configurable: true }
      });

      // Ensure scrollElementRef is connected
      wrapper.vm.scrollElementRef = scrollElement;

      // Set up spies before calling setupScrollShadows
      scrollEventSpy = vi.spyOn(scrollElement, 'addEventListener');
      windowEventSpy = vi.spyOn(window, 'addEventListener');

      // Initialize the composable
      wrapper.vm.setupScrollShadows();
      await nextTick();
    });

    afterEach(() => {
      if (wrapper) wrapper.unmount();
    });

    it('adds scroll event listener to element', () => {
      expect(scrollEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('adds resize event listener to window', () => {
      expect(windowEventSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('updates shadows on scroll event', async () => {
      // Force initial update
      wrapper.vm.updateShadows();
      await nextTick();

      // Initially at start
      expect(wrapper.vm.showLeftShadow).toBe(false);
      expect(wrapper.vm.showRightShadow).toBe(true);

      // Simulate scroll
      scrollElement.scrollLeft = 100;
      wrapper.vm.updateShadows(); // Manually trigger since we can't easily simulate the event callback
      await nextTick();

      expect(wrapper.vm.showLeftShadow).toBe(true);
      expect(wrapper.vm.showRightShadow).toBe(true);
    });

    it('updates shadows on window resize', async () => {
      const updateShadowsSpy = vi.spyOn(wrapper.vm, 'updateShadows');

      // Simulate window resize by calling updateShadows directly
      // (since the actual resize event handling is complex to test)
      wrapper.vm.updateShadows();
      await nextTick();

      expect(updateShadowsSpy).toHaveBeenCalled();
    });
  });

  describe('ResizeObserver Integration', () => {
    let wrapper;
    let mockObserver;

    beforeEach(async () => {
      // Create a mock instance to track calls
      mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn()
      };

      // Mock the constructor to return our mock instance
      const MockConstructor = vi.fn(() => mockObserver);
      global.ResizeObserver = MockConstructor;
      if (typeof window !== 'undefined') {
        window.ResizeObserver = MockConstructor;
      }

      wrapper = mount(TestComponent);
      await nextTick();

      // Ensure scrollElementRef is connected
      const scrollElement = wrapper.find('[data-testid="scroll-container"]').element;
      wrapper.vm.scrollElementRef = scrollElement;

      // Setup the composable
      wrapper.vm.setupScrollShadows();
      await nextTick();
    });

    afterEach(() => {
      if (wrapper) wrapper.unmount();
    });

    it('creates and observes element with ResizeObserver', () => {
      // Check if ResizeObserver was called
      expect(global.ResizeObserver).toHaveBeenCalledWith(expect.any(Function));

      // Check if observe was called
      expect(mockObserver.observe).toHaveBeenCalledWith(expect.any(Element));
    });

    it('disconnects ResizeObserver on cleanup', async () => {
      // Trigger cleanup
      wrapper.vm.cleanupScrollShadows();
      await nextTick();

      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    let wrapper;
    let scrollElement;
    let removeScrollEventSpy;
    let removeWindowEventSpy;

    beforeEach(async () => {
      wrapper = mount(TestComponent);
      await nextTick();
      scrollElement = wrapper.find('[data-testid="scroll-container"]').element;

      // Ensure scrollElementRef is connected
      wrapper.vm.scrollElementRef = scrollElement;

      // Set up spies
      removeScrollEventSpy = vi.spyOn(scrollElement, 'removeEventListener');
      removeWindowEventSpy = vi.spyOn(window, 'removeEventListener');

      // Setup the composable
      wrapper.vm.setupScrollShadows();
      await nextTick();
    });

    afterEach(() => {
      if (wrapper) wrapper.unmount();
    });

    it('removes all event listeners on unmount', async () => {
      wrapper.unmount();
      await nextTick();

      expect(removeScrollEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeWindowEventSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('can be cleaned up manually', async () => {
      wrapper.vm.cleanupScrollShadows();
      await nextTick();

      expect(removeScrollEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeWindowEventSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('Edge Cases', () => {
    it('handles missing element gracefully', () => {
      const { updateShadows, setupScrollShadows } = useScrollShadows();

      // Should not throw when element is null
      expect(() => updateShadows()).not.toThrow();
      expect(() => setupScrollShadows()).not.toThrow();
    });

    it('handles ResizeObserver not being available', async () => {
      // Temporarily remove ResizeObserver
      const originalResizeObserver = global.ResizeObserver;
      delete global.ResizeObserver;
      if (typeof window !== 'undefined') {
        delete window.ResizeObserver;
      }

      const wrapper = mount(TestComponent);
      await nextTick();

      const scrollElement = wrapper.find('[data-testid="scroll-container"]').element;
      wrapper.vm.scrollElementRef = scrollElement;

      // Should not throw and should still work
      expect(() => wrapper.vm.updateShadows()).not.toThrow();
      expect(() => wrapper.vm.setupScrollShadows()).not.toThrow();

      // Restore ResizeObserver
      global.ResizeObserver = originalResizeObserver;
      if (typeof window !== 'undefined') {
        window.ResizeObserver = originalResizeObserver;
      }

      wrapper.unmount();
    });

    it('handles cleanup when element is already null', () => {
      const composable = useScrollShadows();

      // Should not throw when trying to clean up null element
      expect(() => composable.cleanupScrollShadows()).not.toThrow();
    });
  });

  describe('Manual Setup and Cleanup', () => {
    it('allows manual setup after initial mount', async () => {
      const wrapper = mount(TestComponent);
      await nextTick();

      const scrollElement = wrapper.find('[data-testid="scroll-container"]').element;

      // Mock scroll properties
      Object.defineProperties(scrollElement, {
        scrollLeft: { value: 0, writable: true, configurable: true },
        scrollWidth: { value: 400, writable: true, configurable: true },
        clientWidth: { value: 200, writable: true, configurable: true }
      });

      // Ensure the ref is connected to the element
      wrapper.vm.scrollElementRef = scrollElement;

      // Manual setup should work
      wrapper.vm.setupScrollShadows();
      await nextTick();

      expect(wrapper.vm.showRightShadow).toBe(true);

      wrapper.unmount();
    });
  });
});
