import { describe, it, expect, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { mount, defineComponent } from '@vue/test-utils';
import { useFormField } from '@/composables/useFormField.js';

// Test component that uses the composable
const TestFormComponent = defineComponent({
  props: {
    modelValue: { type: String, default: '' },
    direction: { type: String, default: 'row' },
    required: { type: Boolean, default: false },
    validator: { type: Function, default: null }
  },
  emits: ['update:modelValue', 'focus', 'blur', 'validation'],
  setup(props, { emit }) {
    const fieldOptions = {
      direction: props.direction,
      required: props.required,
      validator: props.validator
    };

    const {
      value,
      focused,
      error,
      inputClass,
      validate,
      setFocus,
      setBlur,
      clearError
    } = useFormField(fieldOptions);

    return {
      value,
      focused,
      error,
      inputClass,
      validate,
      setFocus,
      setBlur,
      clearError
    };
  },
  template: `
    <div :class="inputClass">
      <input
        v-model="value"
        @focus="setFocus"
        @blur="setBlur"
        data-testid="input"
      />
      <span v-if="error" data-testid="error">{{ error }}</span>
      <span data-testid="focused">{{ focused ? 'focused' : 'blurred' }}</span>
    </div>
  `
});

describe('useFormField composable', () => {
  it('should initialize with default values', () => {
    const wrapper = mount(TestFormComponent);

    expect(wrapper.vm.value).toBe('');
    expect(wrapper.vm.focused).toBe(false);
    expect(wrapper.vm.error).toBe('');
  });

  it('should initialize with custom default value from props', () => {
    const wrapper = mount(TestFormComponent, {
      props: { modelValue: 'initial value' }
    });

    expect(wrapper.vm.value).toBe('initial value');
  });

  it('should manage focus state correctly', async () => {
    const wrapper = mount(TestFormComponent);

    expect(wrapper.vm.focused).toBe(false);
    expect(wrapper.find('[data-testid="focused"]').text()).toBe('blurred');

    wrapper.vm.setFocus();
    await nextTick();

    expect(wrapper.vm.focused).toBe(true);
    expect(wrapper.find('[data-testid="focused"]').text()).toBe('focused');

    wrapper.vm.setBlur();
    await nextTick();

    expect(wrapper.vm.focused).toBe(false);
    expect(wrapper.find('[data-testid="focused"]').text()).toBe('blurred');
  });

  it('should emit focus and blur events', async () => {
    const wrapper = mount(TestFormComponent);

    wrapper.vm.setFocus();
    await nextTick();
    expect(wrapper.emitted('focus')).toBeTruthy();

    wrapper.vm.setBlur();
    await nextTick();
    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('should compute input classes based on state and direction', async () => {
    const wrapper = mount(TestFormComponent, {
      props: { direction: 'column' }
    });

    expect(wrapper.vm.inputClass).toEqual({
      focused: false,
      error: false,
      column: true
    });

    wrapper.vm.setFocus();
    await nextTick();

    expect(wrapper.vm.inputClass).toEqual({
      focused: true,
      error: false,
      column: true
    });
  });

  it('should handle validation with custom validator', async () => {
    const mockValidator = vi.fn().mockReturnValue('Field is invalid');

    const wrapper = mount(TestFormComponent, {
      props: {
        validator: mockValidator,
        required: true
      }
    });

    await wrapper.vm.$nextTick();
    wrapper.vm.validate();
    await nextTick();

    expect(mockValidator).toHaveBeenCalledWith('');
    expect(wrapper.vm.error).toBe('Field is invalid');
    expect(wrapper.find('[data-testid="error"]').text()).toBe('Field is invalid');
  });

  it('should handle required field validation', async () => {
    const wrapper = mount(TestFormComponent, {
      props: { required: true }
    });

    wrapper.vm.validate();
    await nextTick();

    expect(wrapper.vm.error).toBe('This field is required');
    expect(wrapper.vm.inputClass.error).toBe(true);
  });

  it('should clear validation errors', async () => {
    const wrapper = mount(TestFormComponent, {
      props: { required: true }
    });

    wrapper.vm.validate();
    await nextTick();
    expect(wrapper.vm.error).toBe('This field is required');

    wrapper.vm.clearError();
    await nextTick();
    expect(wrapper.vm.error).toBe('');
  });

  it('should emit validation events', async () => {
    const wrapper = mount(TestFormComponent, {
      props: { required: true }
    });

    wrapper.vm.validate();
    await nextTick();

    expect(wrapper.emitted('validation')).toBeTruthy();
    expect(wrapper.emitted('validation')[0]).toEqual([{
      isValid: false,
      error: 'This field is required'
    }]);
  });

  it('should validate on blur if validateOnBlur is enabled', async () => {
    const wrapper = mount(TestFormComponent, {
      props: {
        required: true,
        validateOnBlur: true
      }
    });

    wrapper.vm.setBlur();
    await nextTick();

    expect(wrapper.vm.error).toBe('This field is required');
  });

  it('should support different input directions', () => {
    const rowWrapper = mount(TestFormComponent, {
      props: { direction: 'row' }
    });
    expect(rowWrapper.vm.inputClass.row).toBe(true);

    const columnWrapper = mount(TestFormComponent, {
      props: { direction: 'column' }
    });
    expect(columnWrapper.vm.inputClass.column).toBe(true);
  });

  it('should bind v-model correctly', async () => {
    const wrapper = mount(TestFormComponent, {
      props: { modelValue: 'test' }
    });

    expect(wrapper.vm.value).toBe('test');

    // Simulate input change
    await wrapper.find('[data-testid="input"]').setValue('new value');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['new value']);
  });

  it('should handle complex validation scenarios', async () => {
    const emailValidator = (value) => {
      if (!value.includes('@')) return 'Invalid email format';
      return null;
    };

    const wrapper = mount(TestFormComponent, {
      props: {
        validator: emailValidator,
        required: true
      }
    });

    // Test empty value (required error takes precedence)
    wrapper.vm.validate();
    await nextTick();
    expect(wrapper.vm.error).toBe('This field is required');

    // Test invalid email
    wrapper.vm.value = 'invalid-email';
    wrapper.vm.validate();
    await nextTick();
    expect(wrapper.vm.error).toBe('Invalid email format');

    // Test valid email
    wrapper.vm.value = 'test@example.com';
    wrapper.vm.validate();
    await nextTick();
    expect(wrapper.vm.error).toBe('');
  });
});