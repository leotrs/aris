import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import ContextMenu from '@/components/ContextMenu.vue';

// Mock the useFloatingUI composable
vi.mock('@/composables/useFloatingUI.js', () => ({
  useFloatingUI: vi.fn(() => ({
    floatingStyles: ref('transform: translate(100px, 200px)'),
    placement: ref('bottom'),
    update: vi.fn()
  }))
}));

// Mock other composables
vi.mock('@/composables/useClosable.js', () => ({
  default: vi.fn(() => ({
    isOpen: ref(false),
    open: vi.fn(),
    close: vi.fn()
  }))
}));

vi.mock('@/composables/useKeyboardShortcuts.js', () => ({
  useKeyboardShortcuts: vi.fn()
}));

describe('ContextMenu.vue (Refactored)', () => {
  let mockUseFloatingUI;

  beforeEach(async () => {
    mockUseFloatingUI = (await vi.importMock('@/composables/useFloatingUI.js')).useFloatingUI;
  });

  describe('Simplified Props Interface', () => {
    it('should work with only required props (simplified from 6 to 4 props)', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          // Old interface had: icon, text, btnComponent, iconClass, placement + complex logic
          // New simplified interface should have: variant, placement, trigger, content
          variant: 'dots',
          placement: 'bottom'
        },
        slots: {
          default: '<div>Menu content</div>'
        }
      });

      expect(wrapper.exists()).toBe(true);
      // Should use useFloatingUI composable
      expect(mockUseFloatingUI).toHaveBeenCalled();
    });

    it('should support variant prop instead of separate icon/text/btnComponent props', () => {
      // Test dots variant
      const dotsWrapper = mount(ContextMenu, {
        props: {
          variant: 'dots',
          placement: 'bottom'
        }
      });

      expect(dotsWrapper.find('[data-testid="trigger-button"]').exists()).toBe(true);
      expect(dotsWrapper.find('[data-testid="trigger-button"]').classes()).toContain('variant-dots');

      // Test close variant
      const closeWrapper = mount(ContextMenu, {
        props: {
          variant: 'close',
          placement: 'top'
        }
      });

      expect(closeWrapper.find('[data-testid="trigger-button"]').classes()).toContain('variant-close');
    });

    it('should support custom trigger slot (replaces complex btnComponent logic)', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: 'custom'
        },
        slots: {
          trigger: '<button data-testid="custom-trigger">Custom Trigger</button>',
          default: '<div>Menu content</div>'
        }
      });

      expect(wrapper.find('[data-testid="custom-trigger"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="trigger-button"]').exists()).toBe(false);
    });

    it('should use simplified placement prop with better defaults', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: 'dots'
          // placement should default to 'bottom-start' for better UX
        }
      });

      expect(mockUseFloatingUI).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.objectContaining({
          placement: 'bottom-start' // Should use better default
        })
      );
    });
  });

  describe('useFloatingUI Integration', () => {
    it('should use the useFloatingUI composable instead of direct useFloating', () => {
      mount(ContextMenu, {
        props: {
          variant: 'dots',
          placement: 'top'
        }
      });

      expect(mockUseFloatingUI).toHaveBeenCalledWith(
        expect.any(Object), // reference
        expect.any(Object), // floating
        expect.objectContaining({
          placement: 'top'
        })
      );
    });

    it('should pass custom floating options when provided', () => {
      mount(ContextMenu, {
        props: {
          variant: 'dots',
          placement: 'bottom',
          floatingOptions: {
            offset: 8,
            strategy: 'absolute'
          }
        }
      });

      expect(mockUseFloatingUI).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.objectContaining({
          placement: 'bottom',
          offset: 8,
          strategy: 'absolute'
        })
      );
    });

    it('should apply floating styles from the composable', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: 'dots'
        },
        slots: {
          default: '<div>Menu content</div>'
        }
      });

      // Simulate opening the menu
      wrapper.vm.open();
      nextTick();

      const menu = wrapper.find('[data-testid="context-menu"]');
      expect(menu.attributes('style')).toContain('transform: translate(100px, 200px)');
    });
  });

  describe('Computed Properties for Styling', () => {
    it('should compute trigger button classes based on variant', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: 'dots',
          size: 'sm'
        }
      });

      const button = wrapper.find('[data-testid="trigger-button"]');
      expect(button.classes()).toContain('context-menu-trigger');
      expect(button.classes()).toContain('variant-dots');
      expect(button.classes()).toContain('size-sm');
    });

    it('should compute menu classes based on placement and state', async () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: 'dots',
          placement: 'bottom-start'
        },
        slots: {
          default: '<div>Menu content</div>'
        }
      });

      // Open menu to see classes
      await wrapper.vm.open();
      await nextTick();

      const menu = wrapper.find('[data-testid="context-menu"]');
      expect(menu.classes()).toContain('context-menu');
      expect(menu.classes()).toContain('placement-bottom-start');
      expect(menu.classes()).toContain('is-open');
    });

    it('should compute different styles for mobile vs desktop', () => {
      // Test desktop mode
      const desktopWrapper = mount(ContextMenu, {
        props: {
          variant: 'dots'
        },
        global: {
          provide: {
            mobileMode: ref(false)
          }
        }
      });

      expect(desktopWrapper.vm.menuClasses).toContain('desktop-mode');

      // Test mobile mode
      const mobileWrapper = mount(ContextMenu, {
        props: {
          variant: 'dots'
        },
        global: {
          provide: {
            mobileMode: ref(true)
          }
        }
      });

      expect(mobileWrapper.vm.menuClasses).toContain('mobile-mode');
    });
  });

  describe('Backwards Compatibility', () => {
    it('should still work with old prop names but show deprecation warning', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mount(ContextMenu, {
        props: {
          // Old props that should still work but be deprecated
          icon: 'Dots',
          text: 'Menu',
          placement: 'bottom'
        }
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('deprecated'),
        expect.stringContaining('icon')
      );

      consoleSpy.mockRestore();
    });

    it('should map old icon prop to new variant prop', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          icon: 'Dots' // Should map to variant: 'dots'
        }
      });

      expect(wrapper.vm.computedVariant).toBe('dots');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid variant gracefully', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: 'invalid-variant'
        }
      });

      // Should fallback to default variant
      expect(wrapper.vm.computedVariant).toBe('dots');
    });

    it('should handle missing floating element gracefully', () => {
      mockUseFloatingUI.mockReturnValue({
        floatingStyles: ref(''),
        placement: ref('bottom'),
        update: vi.fn()
      });

      const wrapper = mount(ContextMenu, {
        props: {
          variant: 'dots'
        }
      });

      // Should not throw when trying to position
      expect(() => wrapper.vm.open()).not.toThrow();
    });
  });
});