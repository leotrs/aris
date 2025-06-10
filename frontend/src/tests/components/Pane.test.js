import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import Pane from '@/components/Pane.vue';

describe('Pane.vue', () => {
  it('renders default slot content inside .content', () => {
    const wrapper = mount(Pane, {
      global: { stubs: { Header: { template: '<div v-bind="$attrs"><slot /></div>' } } },
      slots: { default: '<p>Body content</p>' },
    });

    const content = wrapper.get('.content');
    expect(content.html()).toContain('<p>Body content</p>');
  });

  it('does not apply mobile class when mobileMode is false or not provided', () => {
    const wrapper = mount(Pane, {
      global: { stubs: { Header: { template: '<div v-bind="$attrs"><slot /></div>' } } },
    });
    expect(wrapper.classes()).not.toContain('mobile');
  });

  it('applies mobile class when mobileMode is true', () => {
    const wrapper = mount(Pane, {
      global: { provide: { mobileMode: true }, stubs: { Header: { template: '<div v-bind="$attrs"><slot /></div>' } } },
    });
    expect(wrapper.classes()).toContain('mobile');
  });

  it('renders header slot inside Header wrapper when customHeader is false', () => {
    const wrapper = mount(Pane, {
      props: { customHeader: false },
      global: { stubs: { Header: { template: '<div v-bind="$attrs"><slot /></div>' } } },
      slots: { header: '<h1>Title</h1>' },
    });

    const header = wrapper.get('.text-h4');
    expect(header.text()).toBe('Title');
  });

  it('renders header slot content directly when customHeader is true', () => {
    const wrapper = mount(Pane, {
      props: { customHeader: true },
      global: { stubs: { Header: { template: '<div v-bind="$attrs"><slot /></div>' } } },
      slots: { header: '<h2>Custom</h2>' },
    });

    expect(wrapper.findComponent({ name: 'Header' }).exists()).toBe(false);
    const heading = wrapper.get('h2');
    expect(heading.text()).toBe('Custom');
  });
});