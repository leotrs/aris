import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '@/components/Button.vue';

describe('Button.vue', () => {
  it('renders slot content when neither icon nor text provided', () => {
    const wrapper = mount(Button, {
      props: { kind: 'primary' },
      slots: { default: '<span>Custom</span>' },
    });
    expect(wrapper.html()).toContain('<span>Custom</span>');
  });

  it('renders icon when icon prop is provided', () => {
    const wrapper = mount(Button, {
      props: { kind: 'secondary', icon: 'home' },
      global: { stubs: ['Icon'] },
    });
    expect(wrapper.findComponent({ name: 'Icon' }).exists()).toBe(true);
    expect(wrapper.classes()).toContain('secondary');
    expect(wrapper.classes()).toContain('btn-md');
  });

  it('renders text when text prop provided', () => {
    const wrapper = mount(Button, {
      props: { kind: 'tertiary', text: 'Click me' },
    });
    const span = wrapper.find('span.btn-text');
    expect(span.exists()).toBe(true);
    expect(span.text()).toBe('Click me');
    expect(span.classes()).toContain('text-h6');
  });

  it('renders both icon and text when both props are provided', () => {
    const wrapper = mount(Button, {
      props: { kind: 'primary', icon: 'star', text: 'Fav' },
      global: { stubs: ['Icon'] },
    });
    expect(wrapper.findComponent({ name: 'Icon' }).exists()).toBe(true);
    expect(wrapper.find('span.btn-text').text()).toBe('Fav');
  });

  it('applies text-float classes when textFloat prop provided', () => {
    const wrapper = mount(Button, {
      props: { kind: 'primary', text: 'Hint', textFloat: 'bottom' },
    });
    expect(wrapper.classes()).toContain('text-float-bottom');
    expect(wrapper.classes()).toContain('text-float');
    const span = wrapper.find('span.btn-text');
    expect(span.classes()).toContain('text-caption');
  });

  it('adds with-shadow and disabled classes when respective props are true', () => {
    const wrapper = mount(Button, {
      props: { kind: 'secondary', shadow: true, disabled: true },
    });
    expect(wrapper.classes()).toContain('with-shadow');
    expect(wrapper.classes()).toContain('disabled');
  });

  // The btn ref is exposed via defineExpose (template ref), but internal behavior tested elsewhere
});