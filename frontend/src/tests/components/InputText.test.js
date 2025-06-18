import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import InputText from '@/components/InputText.vue';

describe('InputText.vue', () => {
  it('renders label and input in row direction', () => {
    const wrapper = mount(InputText, {
      props: {
        modelValue: 'abc',
        label: 'Name',
        type: 'password',
        direction: 'row',
      },
      attrs: {
        placeholder: 'Enter name',
        disabled: true,
      },
    });
    const container = wrapper.get('.input-text');
    expect(container.classes()).toContain('row');
    const label = wrapper.get('label.text-label');
    expect(label.text()).toBe('Name:');
    const input = wrapper.get('input');
    expect(input.attributes('type')).toBe('password');
    expect(input.attributes('placeholder')).toBe('Enter name');
    expect(input.attributes('disabled')).toBeDefined();
  });

  it('renders without label in column direction with default type', () => {
    const wrapper = mount(InputText, {
      props: {
        modelValue: 'xyz',
        direction: 'column',
      },
    });
    const container = wrapper.get('.input-text');
    expect(container.classes()).toContain('column');
    expect(wrapper.find('label').exists()).toBe(false);
    const input = wrapper.get('input');
    expect(input.attributes('type')).toBe('text');
  });

  it('emits update:modelValue when input value changes', async () => {
    const wrapper = mount(InputText, {
      props: {
        modelValue: 'start',
      },
    });
    const input = wrapper.get('input');
    await input.setValue('changed');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['changed']);
  });
});
