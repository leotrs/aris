import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ContextMenu from '@/components/ContextMenu.vue';

describe('ContextMenu Icon Fixes - Integration Tests', () => {
  
  describe('Bug Fix 1: Tag Icon Should Use Custom Variant', () => {
    it('should render custom component when icon is "Tag"', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          icon: 'Tag',
          btnComponent: 'ButtonToggle'
        },
        global: {
          stubs: {
            ButtonToggle: {
              template: '<button data-testid="custom-button">Tag Button</button>',
              props: ['icon']
            },
            ButtonDots: {
              template: '<button data-testid="dots-button">Dots Button</button>'
            },
            Teleport: true
          }
        }
      });

      // Should use custom variant for Tag icon, not dots variant
      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      expect(triggerButton.text()).toBe('Tag Button');
      expect(triggerButton.classes()).toContain('variant-custom');
    });

    it('should render custom component when icon is "CirclePlus"', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          icon: 'CirclePlus',
          btnComponent: 'Button'
        },
        global: {
          stubs: {
            Button: {
              template: '<button data-testid="custom-button" :class="kind">{{ icon }}</button>',
              props: ['icon', 'kind']
            },
            ButtonDots: {
              template: '<button data-testid="dots-button">Dots</button>'
            },
            Teleport: true
          }
        }
      });

      // Should render the custom Button component, not ButtonDots
      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      expect(triggerButton.text()).toBe('CirclePlus');
      expect(triggerButton.classes()).toContain('variant-custom');
    });

    it('should still render ButtonDots for "Dots" icon', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          icon: 'Dots'
        },
        global: {
          stubs: {
            ButtonDots: {
              template: '<button data-testid="dots-button">Dots</button>'
            },
            Button: {
              template: '<button data-testid="custom-button">Custom</button>'
            },
            Teleport: true
          }
        }
      });

      // Should still render ButtonDots for "Dots" icon
      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      expect(triggerButton.text()).toBe('Dots');
      expect(triggerButton.classes()).toContain('variant-dots');
    });
  });

  describe('Bug Fix 2: CSS Class Structure Update', () => {
    it('should have context-menu-trigger class on trigger button', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          icon: 'Dots'
        },
        global: {
          stubs: {
            ButtonDots: {
              template: '<button data-testid="trigger-button" :class="$attrs.class">Dots</button>'
            },
            Teleport: true
          }
        }
      });

      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      
      // Should have the new context-menu-trigger class
      const classes = triggerButton.classes();
      expect(classes).toContain('context-menu-trigger');
      expect(classes).toContain('variant-dots');
      expect(classes).toContain('size-md'); // default size
    });

    it('should have context-menu-trigger class on custom button component', () => {
      const wrapper = mount(ContextMenu, {
        props: {
          icon: 'Tag',
          btnComponent: 'Button'
        },
        global: {
          stubs: {
            Button: {
              template: '<button data-testid="trigger-button" :class="$attrs.class">Tag</button>',
              props: ['icon']
            },
            Teleport: true
          }
        }
      });

      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      
      // Should have the new context-menu-trigger class for CSS targeting
      const classes = triggerButton.classes();
      expect(classes).toContain('context-menu-trigger');
      expect(classes).toContain('variant-custom');
    });
  });

  describe('Backwards Compatibility', () => {
    it('should show deprecation warnings for old icon prop', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      mount(ContextMenu, {
        props: {
          icon: 'Tag' // Using deprecated icon prop
        },
        global: {
          stubs: {
            ButtonToggle: {
              template: '<button>Tag</button>',
              props: ['icon']
            },
            Teleport: true
          }
        }
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'ContextMenu: "icon" prop is deprecated. Use "variant" instead.'
      );
      
      consoleSpy.mockRestore();
    });

    it('should work with new variant prop without warnings', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      mount(ContextMenu, {
        props: {
          variant: 'dots'
        },
        global: {
          stubs: {
            ButtonDots: {
              template: '<button>Dots</button>'
            },
            Teleport: true
          }
        }
      });

      // Should not show deprecation warnings for new API
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});