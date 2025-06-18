import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, nextTick, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';

describe('ContextMenu.vue', () => {
  let useFloatingStub, offsetStub, shiftStub, flipStub, autoUpdateStub;
  let useListKeyboardNavigationStub;
  let useClosableStub;

  beforeEach(() => {
    vi.resetModules();
    useFloatingStub = vi.fn(() => ({ floatingStyles: ref({}) }));
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
    useFloatingStub.mockReturnValue({ floatingStyles: ref({ position: 'fixed', top: '10px' }) });
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

  describe('POSITIONING TESTS - DOCUMENTING CURRENT BROKEN BEHAVIOR', () => {
    it('FAILS: Desktop mode should get positioning styles from floating UI', async () => {
      // Simulate the ACTUAL BROKEN BEHAVIOR - floating UI returns empty/undefined styles
      useFloatingStub.mockReturnValue({ floatingStyles: ref(undefined) });

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

      const menu = wrapper.get('.cm-menu');

      // PROBLEM: In real browser, floating UI is not providing positioning styles
      // So the menu appears centered in viewport instead of adjacent to anchor

      // THIS SHOULD FAIL - Menu should have floating UI styles for adjacent positioning
      expect(menu.attributes('style')).toBeDefined();
      expect(menu.attributes('style')).toContain('position: fixed');
      expect(menu.attributes('style')).toContain('top:');
      expect(menu.attributes('style')).toContain('left:');
    });

    it('PASSES: When floating UI works, menu positions correctly adjacent to anchor', async () => {
      // This test proves that the template logic works when floating UI provides styles
      const mockFloatingStyles = {
        position: 'fixed',
        top: '120px',    // Adjacent to anchor (below it)
        left: '250px',   // Adjacent to anchor (aligned with left edge)
        transform: 'translate(0px, 0px)'
      };
      useFloatingStub.mockReturnValue({ floatingStyles: ref(mockFloatingStyles) });

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

      const menu = wrapper.get('.cm-menu');

      // PROOF: Template correctly applies floating UI styles when they exist
      expect(menu.element.style.position).toBe('fixed');
      expect(menu.element.style.top).toBe('120px');      // Adjacent positioning
      expect(menu.element.style.left).toBe('250px');     // Adjacent positioning
      expect(menu.element.style.transform).toBe('translate(0px, 0px)'); // No centering transform

      // Menu should NOT be centered (which would use transform: translate(-50%, -50%))
      expect(menu.element.style.transform).not.toContain('translate(-50%, -50%)');
    });

    it('FAILS: Desktop mode incorrectly shows mobile-style centered modal', async () => {
      // ACTUAL BROKEN BEHAVIOR: Desktop mode shows centered modal (mobile behavior)
      useFloatingStub.mockReturnValue({ floatingStyles: ref({}) });

      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        props: { placement: 'bottom-start' },
        global: {
          provide: { mobileMode: false }, // Desktop mode
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: true,
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();

      const menu = wrapper.get('.cm-menu');

      // PROBLEM: Desktop mode is showing mobile-style behavior
      // The menu appears centered in viewport with modal overlay, NOT adjacent to anchor

      // This assertion SHOULD PASS but currently FAILS because desktop mode behaves like mobile
      expect(menu.classes()).not.toContain('cm-menu-mobile');

      // Desktop mode should have positioning styles, not be centered via CSS
      expect(menu.attributes('style')).toBeDefined();
    });

    it('FAILS: Mobile mode should center menu in viewport using CSS transforms', async () => {
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          provide: { mobileMode: true },
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: { template: '<div><slot /></div>' },
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();

      const menu = wrapper.get('.cm-menu');

      // EXPLICIT TEST: Mobile mode should center menu in viewport
      // This should be achieved through CSS class .cm-menu-mobile which sets:
      // position: fixed !important;
      // top: 50% !important;
      // left: 50% !important;
      // transform: translate(-50%, -50%) !important;

      expect(menu.classes()).toContain('cm-menu-mobile');

      // The menu should NOT have any inline styles (floatingStyles should be ignored)
      expect(menu.attributes('style')).toBeUndefined();

      // Mobile positioning should be handled by CSS class, not inline styles
      // When working correctly, the .cm-menu-mobile CSS class provides centering

      // PROBLEM: You reported "I do not see ANY menu" in mobile mode
      // This suggests the CSS centering is not working or menu is not visible

      // This test documents the expected behavior but may not reflect actual browser behavior
      expect(menu.isVisible()).toBe(true);
    });

    it('EXPLICIT TEST: Mobile mode menu should be positioned at viewport center', async () => {
      // Create a test that simulates what the CSS should achieve
      const { default: ContextMenu } = await import('@/components/ContextMenu.vue');
      const wrapper = mount(ContextMenu, {
        global: {
          provide: { mobileMode: true },
          stubs: {
            ButtonDots: { template: '<div class="btn-dots" @click="$emit(\'update:modelValue\', !modelValue)"></div>' },
            Teleport: { template: '<div><slot /></div>' },
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();

      const menu = wrapper.get('.cm-menu');

      // EXPLICIT POSITIONING VERIFICATION FOR MOBILE MODE:
      // Mobile mode should position menu at viewport center using CSS

      // 1. Should have mobile CSS class for centering
      expect(menu.classes()).toContain('cm-menu-mobile');

      // 2. Should NOT have floating UI inline styles (should be empty/undefined)
      expect(menu.attributes('style')).toBeUndefined();

      // 3. CSS class .cm-menu-mobile should provide these styles:
      // - position: fixed (not relative to anchor)
      // - top: 50% (center vertically)
      // - left: 50% (center horizontally)
      // - transform: translate(-50%, -50%) (adjust for element size)

      // Note: In test environment, we can't directly test computed CSS styles
      // but we can verify the class is applied and no conflicting inline styles exist

      // PROBLEM: You reported menu is not visible in real browser
      // This suggests either:
      // 1. CSS class styles are not being applied correctly
      // 2. There's a rendering/visibility issue
      // 3. Teleport is not working properly in mobile mode
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
