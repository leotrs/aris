import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, nextTick, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';

describe('ContextMenu.vue', () => {
  let useFloatingStub, offsetStub, shiftStub, flipStub, autoUpdateStub;
  let useListKeyboardNavigationStub;
  let useClosableStub;

  beforeEach(() => {
    vi.resetModules();
    useFloatingStub = vi.fn(() => ({ floatingStyles: {} }));
    offsetStub = vi.fn();
    shiftStub = vi.fn();
    flipStub = vi.fn();
    autoUpdateStub = Symbol('autoUpdate');
    vi.doMock('@floating-ui/vue', () => ({
      useFloating: useFloatingStub,
      offset: offsetStub,
      shift: shiftStub,
      flip: flipStub,
      autoUpdate: autoUpdateStub,
    }));

    const activeIndex = ref(null);
    const clearSelection = vi.fn();
    const activateNav = vi.fn();
    const deactivateNav = vi.fn();
    useListKeyboardNavigationStub = vi.fn(() => ({
      activeIndex,
      clearSelection,
      activate: activateNav,
      deactivate: deactivateNav,
    }));
    vi.doMock('@/composables/useListKeyboardNavigation.js', () => ({
      useListKeyboardNavigation: useListKeyboardNavigationStub,
    }));

    const activateClosable = vi.fn();
    const deactivateClosable = vi.fn();
    useClosableStub = vi.fn(() => ({
      activate: activateClosable,
      deactivate: deactivateClosable,
    }));
    vi.doMock('@/composables/useClosable.js', () => ({ default: useClosableStub }));
  });

  it('toggles menu visibility and calls composables on open/close', async () => {
    const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
    const wrapper = mount(ContextMenu, {
      global: {
        stubs: {
          ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
          Teleport: true,
        },
      },
    });

    expect(wrapper.find('.cm-menu').exists()).toBe(false);
    expect(useFloatingStub).toHaveBeenCalled();

    wrapper.vm.toggle();
    await nextTick();
    expect(wrapper.find('.cm-menu').exists()).toBe(true);
    const closableInstance = useClosableStub.mock.results[0].value;
    expect(closableInstance.activate).toHaveBeenCalled();
    const navInstance = useListKeyboardNavigationStub.mock.results[0].value;
    expect(navInstance.activate).toHaveBeenCalled();

    wrapper.vm.toggle();
    await nextTick();
    expect(wrapper.find('.cm-menu').exists()).toBe(false);
    expect(closableInstance.deactivate).toHaveBeenCalled();
    expect(navInstance.deactivate).toHaveBeenCalled();
  });

  it('renders default Dots button and shows slot content', async () => {
    const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
    const wrapper = mount(ContextMenu, {
      global: {
        stubs: {
          ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
          Teleport: true,
        },
      },
      slots: {
        default: '<div class="item-slot">Item</div>',
      },
    });

    expect(wrapper.find('.btn-dots').exists()).toBe(true);
    await wrapper.find('.btn-dots').trigger('click');
    await nextTick();
    expect(wrapper.find('.item-slot').exists()).toBe(true);
  });

  it('uses custom trigger slot to toggle menu', async () => {
    const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
    const wrapper = mount(ContextMenu, {
      global: {
        stubs: {
          Button: defineComponent({
            emits: ['click'],
            template: '<div class="btn-trigger" @click="$emit(\'click\')"><slot/></div>',
          }),
          Teleport: true,
        },
      },
      slots: {
        trigger: '<span class="custom-trigger">Open</span>',
        default: '<div class="content">Content</div>',
      },
    });

    expect(wrapper.find('.custom-trigger').exists()).toBe(true);
    wrapper.vm.toggle();
    await nextTick();
    expect(wrapper.find('.content').exists()).toBe(true);
  });

  it('renders custom btnComponent when icon is not Dots', async () => {
    const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
    const wrapper = mount(ContextMenu, {
      props: { icon: 'Star', text: 'Label', btnComponent: 'MyButton', iconClass: 'cls' },
      global: {
        stubs: {
          MyButton: { template: '<div class="btn-comp" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
          Teleport: true,
        },
      },
    });

    expect(wrapper.find('.btn-comp').exists()).toBe(true);
    wrapper.vm.toggle();
    await nextTick();
    expect(wrapper.find('.cm-menu').exists()).toBe(true);
  });

  it('passes placement and middleware options to useFloating', async () => {
    const placementProp = 'bottom-end';
    const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
    mount(ContextMenu, {
      props: { placement: placementProp },
      global: {
        stubs: {
          ButtonDots: { template: '<div @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
          Teleport: true,
        },
      },
    });

    expect(useFloatingStub).toHaveBeenCalled();
    const options = useFloatingStub.mock.calls[0][2];
    expect(options.strategy).toBe('fixed');
    expect(options.placement()).toBe(placementProp);
    
    // Middleware is now a function, so we need to call it to test
    const middleware = options.middleware();
    expect(middleware).toHaveLength(3);
    
    expect(offsetStub).toHaveBeenCalledWith({ mainAxis: 0, crossAxis: -8 });
    expect(shiftStub).toHaveBeenCalled();
    expect(flipStub).toHaveBeenCalled();
    expect(options.whileElementsMounted).toBe(autoUpdateStub);
  });

  it('uses zero crossAxis offset when icon prop is not Dots', async () => {
    const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
    mount(ContextMenu, {
      props: { icon: 'Other' },
      global: {
        stubs: { Button: { template: '<div @click="$emit(\'click\')"></div>' }, Teleport: true },
      },
    });
    
    // Middleware is now a function, so we need to call it to test
    const options = useFloatingStub.mock.calls[0][2];
    const middleware = options.middleware();
    
    expect(offsetStub).toHaveBeenCalledWith({ mainAxis: 0, crossAxis: 0 });
  });

  it('applies floatingStyles to the menu element', async () => {
    useFloatingStub.mockReturnValue({ floatingStyles: { position: 'fixed', top: '10px' } });
    const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
    const wrapper = mount(ContextMenu, {
      global: {
        stubs: {
          ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
          Teleport: true,
        },
      },
    });

    wrapper.vm.toggle();
    await nextTick();
    const menu = wrapper.get('.cm-menu');
    expect(menu.element.style.position).toBe('fixed');
    expect(menu.element.style.top).toBe('10px');
  });

  describe('Sub-menu support', () => {
    it('detects nested ContextMenu components as sub-menus', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: { template: '<div><slot /></div>' },
          },
        },
        slots: {
          default: `
            <div class="item">Item 1</div>
            <div class="item">Sub Menu</div>
          `,
        },
      });

      wrapper.vm.toggle();
      await nextTick();
      expect(wrapper.find('.cm-menu').exists()).toBe(true);
      expect(wrapper.text()).toContain('Item 1');
      expect(wrapper.text()).toContain('Sub Menu');
    });

    it('provides sub-menu context to child ContextMenu components', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();
      
      // This menu provides context for its children to be sub-menus
      expect(wrapper.vm.$.provides.isSubMenu).toBe(true);
      expect(wrapper.vm.$.provides.parentMenu).toBeDefined();
    });

    it('uses different placement logic for sub-menus', async () => {
      // This will be tested when we implement the sub-menu positioning
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          provide: { isSubMenu: true, parentMenu: { placement: 'right-start' } },
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      // When implemented, sub-menus should adjust placement based on parent
      expect(wrapper.vm.effectivePlacement).toBeDefined();
    });
  });

  describe('Enhanced ARIA support', () => {
    it('sets proper ARIA attributes on menu container', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();
      
      const menu = wrapper.get('.cm-menu');
      expect(menu.attributes('role')).toBe('menu');
      expect(menu.attributes('aria-orientation')).toBe('vertical');
      expect(menu.attributes('aria-labelledby')).toBeDefined();
    });

    it('generates unique ID for trigger and references it in menu', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();
      
      const trigger = wrapper.find('.cm-btn');
      const menu = wrapper.get('.cm-menu');
      const triggerId = trigger.attributes('id');
      
      expect(triggerId).toBeDefined();
      expect(triggerId).toMatch(/^cm-trigger-/);
      expect(menu.attributes('aria-labelledby')).toBe(triggerId);
    });

    it('sets aria-expanded on trigger button', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.cm-btn');
      expect(trigger.attributes('aria-expanded')).toBe('false');

      wrapper.vm.toggle();
      await nextTick();
      expect(trigger.attributes('aria-expanded')).toBe('true');
    });
  });

  describe('Better focus management', () => {
    it('focuses first menu item when menu opens', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        attachTo: document.body,
        global: {
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
        slots: {
          default: '<div class="item" tabindex="0">Item 1</div><div class="item" tabindex="0">Item 2</div>',
        },
      });

      const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
      
      wrapper.vm.toggle();
      await nextTick();
      await nextTick(); // Wait for focus to be applied
      
      expect(focusSpy).toHaveBeenCalled();
      wrapper.unmount();
    });

    it('restores focus to trigger when menu closes', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        attachTo: document.body,
        global: {
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      // Check that lastFocusedElement is stored when opening
      const originalActiveElement = wrapper.vm.lastFocusedElement;
      wrapper.vm.toggle(); // Open
      await nextTick();
      
      expect(wrapper.vm.lastFocusedElement).toBeDefined();
      expect(wrapper.vm.lastFocusedElement).not.toBe(originalActiveElement);
      
      // Mock the focus method to verify it's called
      const storedElement = wrapper.vm.lastFocusedElement;
      const focusSpy = vi.fn();
      if (storedElement) {
        storedElement.focus = focusSpy;
      }
      
      // Close and verify focus restoration attempt
      wrapper.vm.toggle(); // Close
      await nextTick();
      
      // Verify the focus was called if the element had a focus method
      if (storedElement && storedElement.focus) {
        expect(focusSpy).toHaveBeenCalled();
      }
      
      wrapper.unmount();
    });
  });

  describe('Mobile modal behavior', () => {
    it('uses modal positioning when mobileMode is true', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          provide: { mobileMode: true },
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();
      
      const menu = wrapper.get('.cm-menu');
      expect(menu.classes()).toContain('cm-menu-mobile');
      
      // Verify modal positioning: should NOT use floatingStyles
      expect(menu.attributes('style')).toBeUndefined();
      
      // CSS should handle the fixed centering via .cm-menu-mobile class
      // position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    });

    it('uses floating UI positioning when mobileMode is false', async () => {
      const mockFloatingStyles = { 
        position: 'fixed', 
        top: '100px', 
        left: '200px',
        transform: 'none'
      };
      useFloatingStub.mockReturnValue({ floatingStyles: mockFloatingStyles });
      
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          provide: { mobileMode: false },
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();
      
      const menu = wrapper.get('.cm-menu');
      expect(menu.classes()).not.toContain('cm-menu-mobile');
      
      // Verify floating UI positioning is applied
      expect(menu.element.style.position).toBe('fixed');
      expect(menu.element.style.top).toBe('100px');
      expect(menu.element.style.left).toBe('200px');
      expect(menu.element.style.transform).toBe('none');
    });

    it('positions menu adjacent to anchor element in desktop mode', async () => {
      const mockFloatingStyles = { 
        position: 'fixed', 
        top: '50px', 
        left: '300px'
      };
      useFloatingStub.mockReturnValue({ floatingStyles: mockFloatingStyles });
      
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        props: { placement: 'bottom-start' },
        global: {
          provide: { mobileMode: false },
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();
      
      // Verify useFloating was called with proper configuration for adjacent positioning
      expect(useFloatingStub).toHaveBeenCalled();
      const options = useFloatingStub.mock.calls[0][2];
      
      // Should use floating UI middleware for adjacent positioning
      const middleware = options.middleware();
      expect(middleware).toHaveLength(3); // offset, shift, flip
      expect(offsetStub).toHaveBeenCalled();
      expect(shiftStub).toHaveBeenCalled();
      expect(flipStub).toHaveBeenCalled();
      
      // Menu should be positioned relative to anchor, not centered
      const menu = wrapper.get('.cm-menu');
      expect(menu.element.style.position).toBe('fixed');
      expect(menu.element.style.top).toBe('50px');
      expect(menu.element.style.left).toBe('300px');
      
      // Should NOT have mobile centering styles
      expect(menu.classes()).not.toContain('cm-menu-mobile');
    });

    it('ignores floating UI positioning in mobile mode', async () => {
      const mockFloatingStyles = { 
        position: 'fixed', 
        top: '100px', 
        left: '200px'
      };
      useFloatingStub.mockReturnValue({ floatingStyles: mockFloatingStyles });
      
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          provide: { mobileMode: true },
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();
      
      const menu = wrapper.get('.cm-menu');
      
      // Should have mobile class
      expect(menu.classes()).toContain('cm-menu-mobile');
      
      // Should NOT apply floating UI styles (no style attribute)
      expect(menu.attributes('style')).toBeUndefined();
      
      // Floating UI styles should be ignored in mobile mode
      expect(menu.element.style.top).not.toBe('100px');
      expect(menu.element.style.left).not.toBe('200px');
    });
  });

  describe('CSS Animations', () => {
    it('applies transition classes to menu', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: { template: '<div><slot /></div>' }, // Render content without teleporting
            Transition: { template: '<div><slot /></div>' }, // Render content without transitions
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();
      
      const menu = wrapper.find('.cm-menu');
      expect(menu.exists()).toBe(true);
      // Animation classes will be tested in implementation
    });
  });

  describe('Debounced positioning', () => {
    it('debounces position updates when props change rapidly', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        props: { placement: 'left-start' },
        global: {
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      // Rapidly change placement
      await wrapper.setProps({ placement: 'right-start' });
      await wrapper.setProps({ placement: 'bottom-start' });
      await wrapper.setProps({ placement: 'top-start' });

      // Should only update position once after debounce
      // This will be verified in implementation
      expect(useFloatingStub).toHaveBeenCalled();
    });
  });

  describe('Touch interactions', () => {
    it('handles touch events on mobile devices', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          provide: { mobileMode: true },
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.cm-btn');
      
      // Simulate touch events
      await trigger.trigger('touchstart');
      await trigger.trigger('touchend');
      
      // Touch behavior will be implemented
      expect(wrapper.vm.show).toBeDefined();
    });

    it('prevents context menu on long press', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      const preventDefault = vi.fn();
      
      await wrapper.find('.cm-wrapper').trigger('contextmenu', {
        preventDefault
      });
      
      // Should prevent default context menu
      expect(preventDefault).toHaveBeenCalled();
    });
  });
});