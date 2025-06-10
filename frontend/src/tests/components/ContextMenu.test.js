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
});