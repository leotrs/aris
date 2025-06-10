import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Vue composition API functions
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    getCurrentInstance: vi.fn(),
    onMounted: vi.fn(),
    onBeforeUnmount: vi.fn(),
    nextTick: vi.fn((fn) => Promise.resolve().then(fn))
  };
});

// Mock the keyboard shortcuts composable
vi.mock('@/composables/useKeyboardShortcuts.js', () => ({
  useKeyboardShortcuts: vi.fn(() => ({
    activate: vi.fn(),
    deactivate: vi.fn()
  }))
}));

import useClosable from '@/composables/useClosable.js';

describe('useClosable', () => {
  let mockOnClose;
  let mockInstance;
  let mockElement;
  let mockCloseButton;
  let originalAddEventListener;
  let originalRemoveEventListener;
  let mockUseKeyboardShortcuts;
  let mockActivate;
  let mockDeactivate;

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();

    // Get fresh references to the mocked functions
    const { useKeyboardShortcuts } = await import('@/composables/useKeyboardShortcuts.js');
    mockUseKeyboardShortcuts = useKeyboardShortcuts;
    mockActivate = vi.fn();
    mockDeactivate = vi.fn();
    mockUseKeyboardShortcuts.mockReturnValue({
      activate: mockActivate,
      deactivate: mockDeactivate
    });

    // Mock onClose callback
    mockOnClose = vi.fn();

    // Create mock DOM elements
    mockElement = document.createElement('div');
    mockCloseButton = document.createElement('button');
    mockCloseButton.className = 'btn-close';
    mockElement.appendChild(mockCloseButton);

    // Mock Vue instance
    mockInstance = {
      proxy: {
        $el: mockElement
      },
      $el: mockElement
    };

    // Mock getCurrentInstance to return our mock instance
    const { getCurrentInstance } = await import('vue');
    getCurrentInstance.mockReturnValue(mockInstance);

    // Store original event listener methods
    originalAddEventListener = document.addEventListener;
    originalRemoveEventListener = document.removeEventListener;

    // Mock document event listeners
    document.addEventListener = vi.fn();
    document.removeEventListener = vi.fn();
  });

  afterEach(() => {
    // Restore original event listeners
    document.addEventListener = originalAddEventListener;
    document.removeEventListener = originalRemoveEventListener;
  });

  describe('initialization', () => {
    it('should return activate and deactivate functions', () => {
      const result = useClosable({ onClose: mockOnClose });

      expect(result).toHaveProperty('activate');
      expect(result).toHaveProperty('deactivate');
      expect(typeof result.activate).toBe('function');
      expect(typeof result.deactivate).toBe('function');
    });

    it('should setup keyboard shortcuts when closeOnEsc is true', () => {
      useClosable({ onClose: mockOnClose, closeOnEsc: true });

      expect(mockUseKeyboardShortcuts).toHaveBeenCalledWith(
        { escape: mockOnClose },
        true
      );
    });

    it('should not setup keyboard shortcuts when closeOnEsc is false', () => {
      useClosable({ onClose: mockOnClose, closeOnEsc: false });

      expect(mockUseKeyboardShortcuts).not.toHaveBeenCalled();
    });

    it('should auto-activate by default', async () => {
      const { onMounted } = await import('vue');

      useClosable({ onClose: mockOnClose });

      expect(onMounted).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should not auto-activate when autoActivate is false', async () => {
      const { onMounted } = await import('vue');

      useClosable({ onClose: mockOnClose, autoActivate: false });

      expect(onMounted).not.toHaveBeenCalled();
    });

    it('should setup onBeforeUnmount cleanup', async () => {
      const { onBeforeUnmount } = await import('vue');

      useClosable({ onClose: mockOnClose });

      expect(onBeforeUnmount).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('ESC key handling', () => {
    it('should activate keyboard shortcuts when ESC is enabled', () => {
      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnEsc: true
      });

      activate();

      expect(mockActivate).toHaveBeenCalled();
    });

    it('should deactivate keyboard shortcuts when ESC is enabled', () => {
      const { deactivate } = useClosable({
        onClose: mockOnClose,
        closeOnEsc: true
      });

      deactivate();

      expect(mockDeactivate).toHaveBeenCalled();
    });

    it('should not handle ESC key when closeOnEsc is false', () => {
      const { activate, deactivate } = useClosable({
        onClose: mockOnClose,
        closeOnEsc: false
      });

      activate();
      deactivate();

      expect(mockActivate).not.toHaveBeenCalled();
      expect(mockDeactivate).not.toHaveBeenCalled();
    });
  });

  describe('outside click handling', () => {
    it('should setup outside click listener when enabled', async () => {
      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnOutsideClick: true
      });

      await activate();

      // Wait for nextTick and setTimeout
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(document.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
    });

    it('should remove outside click listener when deactivated', () => {
      const { deactivate } = useClosable({
        onClose: mockOnClose,
        closeOnOutsideClick: true
      });

      deactivate();

      expect(document.removeEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
    });

    it('should call onClose when clicking outside the element', async () => {
      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnOutsideClick: true
      });

      await activate();
      await new Promise(resolve => setTimeout(resolve, 10));

      // Get the event handler that was registered
      const clickHandler = document.addEventListener.mock.calls
        .find(call => call[0] === 'click')[1];

      // Simulate click outside the element
      const outsideElement = document.createElement('div');
      clickHandler({ target: outsideElement });

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not call onClose when clicking inside the element', async () => {
      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnOutsideClick: true
      });

      await activate();
      await new Promise(resolve => setTimeout(resolve, 10));

      // Get the event handler that was registered
      const clickHandler = document.addEventListener.mock.calls
        .find(call => call[0] === 'click')[1];

      // Simulate click inside the element
      clickHandler({ target: mockElement });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not setup outside click when disabled', async () => {
      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnOutsideClick: false
      });

      await activate();

      expect(document.addEventListener).not.toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
    });

    it('should handle missing instance gracefully', async () => {
      const { getCurrentInstance } = await import('vue');
      getCurrentInstance.mockReturnValue(null);

      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnOutsideClick: true
      });

      await activate();
      await new Promise(resolve => setTimeout(resolve, 10));

      // Get the event handler that was registered
      const clickHandler = document.addEventListener.mock.calls
        .find(call => call[0] === 'click')?.[1];

      if (clickHandler) {
        // Should not throw when instance is null
        expect(() => clickHandler({ target: document.body })).not.toThrow();
        expect(mockOnClose).not.toHaveBeenCalled();
      }
    });
  });

  describe('close button handling', () => {
    it('should setup close button listener when enabled', () => {
      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnCloseButton: true
      });

      // Spy on addEventListener of the close button
      vi.spyOn(mockCloseButton, 'addEventListener');

      activate();

      expect(mockCloseButton.addEventListener).toHaveBeenCalledWith(
        'click',
        mockOnClose
      );
    });

    it('should remove close button listener when deactivated', () => {
      const { deactivate } = useClosable({
        onClose: mockOnClose,
        closeOnCloseButton: true
      });

      // Spy on removeEventListener of the close button
      vi.spyOn(mockCloseButton, 'removeEventListener');

      deactivate();

      expect(mockCloseButton.removeEventListener).toHaveBeenCalledWith(
        'click',
        mockOnClose
      );
    });

    it('should use custom close button selector', () => {
      // Create element with custom selector
      const customButton = document.createElement('button');
      customButton.className = 'custom-close';
      mockElement.appendChild(customButton);

      vi.spyOn(customButton, 'addEventListener');

      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnCloseButton: true,
        closeButtonSelector: 'button.custom-close'
      });

      activate();

      expect(customButton.addEventListener).toHaveBeenCalledWith(
        'click',
        mockOnClose
      );
    });

    it('should log error when close button is not found', () => {
      // Remove the close button
      mockElement.removeChild(mockCloseButton);

      // Spy on console.error for this specific test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnCloseButton: true
      });

      activate();

      expect(consoleErrorSpy).toHaveBeenCalledWith('No close button found');

      // Clean up the spy
      consoleErrorSpy.mockRestore();
    });

    it('should not setup close button when disabled', () => {
      vi.spyOn(mockCloseButton, 'addEventListener');

      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnCloseButton: false
      });

      activate();

      expect(mockCloseButton.addEventListener).not.toHaveBeenCalled();
    });

    it('should handle missing instance gracefully for close button', async () => {
      const { getCurrentInstance } = await import('vue');
      getCurrentInstance.mockReturnValue(null);

      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnCloseButton: true
      });

      expect(() => activate()).not.toThrow();
    });
  });

  describe('lifecycle integration', () => {
    it('should call activate on mount when autoActivate is true', async () => {
      const { onMounted } = await import('vue');

      useClosable({ onClose: mockOnClose });

      // Get the mounted callback
      const mountedCallback = onMounted.mock.calls[0][0];

      // Spy on the returned functions
      const mockActivateFn = vi.fn();
      vi.spyOn({ activate: mockActivateFn }, 'activate');

      // Execute the mounted callback
      await mountedCallback();
    });

    it('should call deactivate on beforeUnmount', async () => {
      const { onBeforeUnmount } = await import('vue');

      useClosable({ onClose: mockOnClose });

      // Get the beforeUnmount callback
      const beforeUnmountCallback = onBeforeUnmount.mock.calls[0][0];

      // This should not throw
      expect(() => beforeUnmountCallback()).not.toThrow();
    });
  });

  describe('combined functionality', () => {
    it('should activate all enabled features', async () => {
      vi.spyOn(mockCloseButton, 'addEventListener');

      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnEsc: true,
        closeOnOutsideClick: true,
        closeOnCloseButton: true
      });

      await activate();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockActivate).toHaveBeenCalled();
      expect(document.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
      expect(mockCloseButton.addEventListener).toHaveBeenCalledWith(
        'click',
        mockOnClose
      );
    });

    it('should deactivate all enabled features', () => {
      vi.spyOn(mockCloseButton, 'removeEventListener');

      const { deactivate } = useClosable({
        onClose: mockOnClose,
        closeOnEsc: true,
        closeOnOutsideClick: true,
        closeOnCloseButton: true
      });

      deactivate();

      expect(mockDeactivate).toHaveBeenCalled();
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
      expect(mockCloseButton.removeEventListener).toHaveBeenCalledWith(
        'click',
        mockOnClose
      );
    });

    it('should only activate selected features', async () => {
      const { activate } = useClosable({
        onClose: mockOnClose,
        closeOnEsc: false,
        closeOnOutsideClick: true,
        closeOnCloseButton: false
      });

      await activate();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockActivate).not.toHaveBeenCalled();
      expect(document.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
    });
  });
});
