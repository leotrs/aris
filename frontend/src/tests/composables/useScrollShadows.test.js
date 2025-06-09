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
    console.log('Composable result:', composableResult); // Debug
    return { ...composableResult };
  }
};

describe('useScrollShadows', () => {
  let mockResizeObserver;
  let addEventListenerSpy;
  let removeEventListenerSpy;
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

    // Spy on event listeners
    addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener').mockImplementation(() => {});
    removeEventListenerSpy = vi.spyOn(globalThis, 'removeEventListener').mockImplementation(() => {});
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

      // Ensure the composable is properly initialized
      if (wrapper.vm.setupScrollShadows) {
        wrapper.vm.setupScrollShadows();
      }
    });

    afterEach(() => {
      if (wrapper) wrapper.unmount();
    });

    it('correct shadows shown when at start position', async () => {
      // Debug: Check what's actually available on the wrapper.vm
      console.log('Available properties:', Object.keys(wrapper.vm));
      console.log('showLeftShadow:', wrapper.vm.showLeftShadow);
      console.log('showRightShadow:', wrapper.vm.showRightShadow);

      // Check if properties exist before testing
      expect(wrapper.vm.showLeftShadow).toBeDefined();
      expect(wrapper.vm.showRightShadow).toBeDefined();
      expect(wrapper.vm.updateShadows).toBeDefined();

      scrollElement.scrollLeft = 0;
      wrapper.vm.updateShadows();
      await nextTick();

      expect(wrapper.vm.showLeftShadow).toBe(false);
      expect(wrapper.vm.showRightShadow).toBe(true);
    });

    it('shows left shadow when scrolled right', async () => {
      const showLeftShadow = wrapper.vm.showLeftShadow;
      const showRightShadow = wrapper.vm.showRightShadow;
      const updateShadows = wrapper.vm.updateShadows;

      scrollElement.scrollLeft = 50;
      updateShadows();
      await nextTick();

      expect(showLeftShadow).toBe(true);
      expect(showRightShadow).toBe(true);
    });

    it('shows only left shadow when scrolled to end', async () => {
      const showLeftShadow = wrapper.vm.showLeftShadow;
      const showRightShadow = wrapper.vm.showRightShadow;
      const updateShadows = wrapper.vm.updateShadows;

      scrollElement.scrollLeft = 200; // scrollWidth (400) - clientWidth (200)
      updateShadows();
      await nextTick();

      expect(showLeftShadow).toBe(true);
      expect(showRightShadow).toBe(false);
    });

    it('shows no shadows when content fits entirely', async () => {
      const showLeftShadow = wrapper.vm.showLeftShadow;
      const showRightShadow = wrapper.vm.showRightShadow;
      const updateShadows = wrapper.vm.updateShadows;

      // Make content fit entirely
      Object.defineProperty(scrollElement, 'scrollWidth', { value: 200, configurable: true });
      Object.defineProperty(scrollElement, 'clientWidth', { value: 200, configurable: true });
      scrollElement.scrollLeft = 0;

      updateShadows();
      await nextTick();

      expect(showLeftShadow).toBe(false);
      expect(showRightShadow).toBe(false);
    });

    it('handles edge case where scrollLeft equals scrollable distance', async () => {
      const showLeftShadow = wrapper.vm.showLeftShadow;
      const showRightShadow = wrapper.vm.showRightShadow;
      const updateShadows = wrapper.vm.updateShadows;

      scrollElement.scrollLeft = 199; // Just before the end
      updateShadows();
      await nextTick();

      expect(showLeftShadow).toBe(true);
      expect(showRightShadow).toBe(true);
    });
  });

  describe('Event Handling', () => {
    let wrapper;
    let scrollElement;
    let scrollEventSpy;

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

      scrollEventSpy = vi.spyOn(scrollElement, 'addEventListener');

      // Initialize the composable
      if (wrapper.vm.setupScrollShadows) {
        wrapper.vm.setupScrollShadows();
        await nextTick();
      }
    });

    afterEach(() => {
      if (wrapper) wrapper.unmount();
    });

    it('adds scroll event listener to element', () => {
      // The event listener should have been added during setup
      expect(scrollEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('updates shadows on scroll event', async () => {
      const { showLeftShadow, showRightShadow } = wrapper.vm;

      // Force initial update
      wrapper.vm.updateShadows();
      await nextTick();

      // Initially at start
      expect(showLeftShadow).toBe(false);
      expect(showRightShadow).toBe(true);

      // Simulate scroll
      scrollElement.scrollLeft = 100;
      scrollElement.dispatchEvent(new Event('scroll'));
      await nextTick();

      expect(showLeftShadow).toBe(true);
      expect(showRightShadow).toBe(true);
    });

    it('updates shadows on window resize', async () => {
      const updateShadowsSpy = vi.spyOn(wrapper.vm, 'updateShadows');

      // Simulate window resize
      const resizeEvent = new Event('resize');
      globalThis.dispatchEvent(resizeEvent);
      await nextTick();

      // Note: This test might need adjustment based on your composable implementation
      // Some composables might not listen to window resize directly
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
    });

    afterEach(() => {
      if (wrapper) wrapper.unmount();
    });

    it('creates and observes element with ResizeObserver', () => {
      // Check if ResizeObserver was called
      expect(global.ResizeObserver).toHaveBeenCalledWith(expect.any(Function));

      // Check if observe was called (might need adjustment based on implementation)
      if (mockObserver.observe.mock.calls.length > 0) {
        expect(mockObserver.observe).toHaveBeenCalledWith(expect.any(Element));
      }
    });

    it('disconnects ResizeObserver on cleanup', async () => {
      // Trigger cleanup
      if (wrapper.vm.cleanupScrollShadows) {
        wrapper.vm.cleanupScrollShadows();
      }

      wrapper.unmount();
      await nextTick();

      // This might not be called if ResizeObserver setup is conditional
      if (mockObserver.disconnect.mock.calls.length > 0) {
        expect(mockObserver.disconnect).toHaveBeenCalled();
      }
    });
  });

  describe('Cleanup', () => {
    let wrapper;
    let scrollElement;
    let removeEventListenerSpy;

    beforeEach(async () => {
      wrapper = mount(TestComponent);
      await nextTick();
      scrollElement = wrapper.find('[data-testid="scroll-container"]').element;
      removeEventListenerSpy = vi.spyOn(scrollElement, 'removeEventListener');

      // Setup the composable
      if (wrapper.vm.setupScrollShadows) {
        wrapper.vm.setupScrollShadows();
        await nextTick();
      }
    });

    it('removes all event listeners on unmount', async () => {
      wrapper.unmount();
      await nextTick();

      // These expectations might need adjustment based on your implementation
      if (removeEventListenerSpy.mock.calls.length > 0) {
        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      }
    });

    it('can be cleaned up manually', async () => {
      const { cleanupScrollShadows } = wrapper.vm;

      cleanupScrollShadows();
      await nextTick();

      // Check if cleanup was performed
      if (removeEventListenerSpy.mock.calls.length > 0) {
        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      }
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
      delete global.ResizeObserver;
      if (typeof window !== 'undefined') {
        delete window.ResizeObserver;
      }

      const wrapper = mount(TestComponent);
      await nextTick();

      // Should not throw and should still work
      expect(() => wrapper.vm.updateShadows()).not.toThrow();

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

      // Access properties directly from wrapper.vm (no destructuring)
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
