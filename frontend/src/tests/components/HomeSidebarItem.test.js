import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import HomeSidebarItem from '@/components/HomeSidebarItem.vue';

describe('HomeSidebarItem.vue', () => {
  it('renders icon and text when not collapsed', () => {
    const wrapper = shallowMount(HomeSidebarItem, {
      props: { icon: 'TestIcon', text: 'MyText' },
      global: { provide: { collapsed: false }, stubs: ['Icon', 'Tooltip'] },
    });
    expect(wrapper.classes()).toContain('sb-item');
    expect(wrapper.classes()).not.toContain('collapsed');
    const icon = wrapper.find('icon-stub');
    expect(icon.exists()).toBe(true);
    expect(icon.attributes('name')).toBe('TestIcon');
    expect(wrapper.find('span.sb-text').text()).toBe('MyText');
    expect(wrapper.find('tooltip-stub').exists()).toBe(false);
  });

  it('renders collapsed iconCollapsed and shows tooltip when collapsed', () => {
    const wrapper = shallowMount(HomeSidebarItem, {
      props: { icon: 'X', iconCollapsed: 'Y', text: 'TT', tooltip: 'Tip' },
      global: { provide: { collapsed: true }, stubs: ['Icon', 'Tooltip'] },
    });
    expect(wrapper.classes()).toContain('collapsed');
    const icon = wrapper.find('icon-stub');
    expect(icon.attributes('name')).toBe('X');
    const tooltip = wrapper.find('tooltip-stub');
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.attributes('content')).toBe('Tip');
  });

  it('falls back to icon when iconCollapsed not provided', () => {
    const wrapper = shallowMount(HomeSidebarItem, {
      props: { icon: 'Foo', text: 'Bar' },
      global: { provide: { collapsed: true }, stubs: ['Icon', 'Tooltip'] },
    });
    expect(wrapper.find('icon-stub').attributes('name')).toBe('Foo');
  });

  it('always shows tooltip when tooltipAlways is true', () => {
    const wrapper = shallowMount(HomeSidebarItem, {
      props: { icon: 'X', text: 'Baz', tooltipAlways: true },
      global: { provide: { collapsed: false }, stubs: ['Icon', 'Tooltip'] },
    });
    const tooltip = wrapper.find('tooltip-stub');
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.attributes('content')).toBe('Baz');
  });

  it('applies active and not-clickable classes based on props', () => {
    const wrapper = shallowMount(HomeSidebarItem, {
      props: { icon: 'X', text: 'Baz', active: true, clickable: false },
      global: { provide: { collapsed: false }, stubs: ['Icon', 'Tooltip'] },
    });
    expect(wrapper.classes()).toContain('active');
    expect(wrapper.classes()).toContain('not-clickable');
  });
});
