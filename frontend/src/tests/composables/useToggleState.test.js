import { describe, it, expect, vi } from 'vitest';
import { nextTick, watch, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { useToggleState } from '@/composables/useToggleState.js';

// Test component that uses the composable
const TestComponent = defineComponent({
  props: {
    modelValue: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'on', 'off'],
  setup(props, { emit }) {
    const { active, toggle } = useToggleState({ 
      defaultValue: props.modelValue, 
      props, 
      emit 
    });

    // Expose for testing
    return {
      active,
      toggle,
      manualEmit: (event, value) => emit(event, value)
    };
  },
  template: `
    <div>
      <button @click="toggle" data-testid="toggle-btn">Toggle</button>
      <span data-testid="state">{{ active ? 'on' : 'off' }}</span>
    </div>
  `
});

describe('useToggleState composable', () => {
  it('should initialize with default value false', () => {
    const wrapper = mount(TestComponent);

    expect(wrapper.find('[data-testid="state"]').text()).toBe('off');
    expect(wrapper.vm.active).toBe(false);
  });

  it('should initialize with custom default value', () => {
    const wrapper = mount(TestComponent, {
      props: { modelValue: true }
    });

    expect(wrapper.find('[data-testid="state"]').text()).toBe('on');
    expect(wrapper.vm.active).toBe(true);
  });

  it('should toggle state when toggle function is called', async () => {
    const wrapper = mount(TestComponent);

    expect(wrapper.vm.active).toBe(false);

    wrapper.vm.toggle();
    await nextTick();

    expect(wrapper.vm.active).toBe(true);
    expect(wrapper.find('[data-testid="state"]').text()).toBe('on');
  });

  it('should emit "on" event when toggled to true', async () => {
    const wrapper = mount(TestComponent);

    wrapper.vm.toggle();
    await nextTick();

    expect(wrapper.emitted('on')).toBeTruthy();
    expect(wrapper.emitted('on')).toHaveLength(1);
  });

  it('should emit "off" event when toggled to false', async () => {
    const wrapper = mount(TestComponent, {
      props: { modelValue: true }
    });

    wrapper.vm.toggle();
    await nextTick();

    expect(wrapper.emitted('off')).toBeTruthy();
    expect(wrapper.emitted('off')).toHaveLength(1);
  });

  it('should emit model update events', async () => {
    const wrapper = mount(TestComponent);

    wrapper.vm.toggle();
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([true]);
  });

  it('should handle multiple toggles correctly', async () => {
    const wrapper = mount(TestComponent);

    // Initial state: false
    expect(wrapper.vm.active).toBe(false);

    // First toggle: false -> true
    wrapper.vm.toggle();
    await nextTick();
    expect(wrapper.vm.active).toBe(true);
    expect(wrapper.emitted('on')).toHaveLength(1);

    // Second toggle: true -> false
    wrapper.vm.toggle();
    await nextTick();
    expect(wrapper.vm.active).toBe(false);
    expect(wrapper.emitted('off')).toHaveLength(1);

    // Third toggle: false -> true
    wrapper.vm.toggle();
    await nextTick();
    expect(wrapper.vm.active).toBe(true);
    expect(wrapper.emitted('on')).toHaveLength(2);
  });

  it('should work with external model value changes', async () => {
    const wrapper = mount(TestComponent, {
      props: { modelValue: false }
    });

    // Change from parent
    await wrapper.setProps({ modelValue: true });

    expect(wrapper.vm.active).toBe(true);
    expect(wrapper.emitted('on')).toBeTruthy();
  });

  it('should provide reactive state that can be watched', async () => {
    const mockWatcher = vi.fn();

    const TestWatcherComponent = defineComponent({
      setup() {
        const { active, toggle } = useToggleState({ defaultValue: false });

        // Watch the active state
        watch(active, mockWatcher);

        return { active, toggle };
      },
      template: '<div @click="toggle">{{ active }}</div>'
    });

    const wrapper = mount(TestWatcherComponent);

    wrapper.vm.toggle();
    await nextTick();

    expect(mockWatcher).toHaveBeenCalledWith(true, false, expect.any(Function));
  });
});