import { describe, it, expect, vi } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';

// Mock Tabler icons
const FooIcon = defineComponent({
  name: 'IconFoo',
  template: '<div data-test="icon-foo"><slot/></div>',
});
vi.mock('@tabler/icons-vue', () => ({ IconFoo: FooIcon }));

// Mock specialized IconTherefore component
const ThereforeIcon = defineComponent({
  name: 'IconTherefore',
  template: '<div data-test="icon-therefore"><slot/></div>',
});
vi.mock('@/components/IconTherefore.vue', () => ThereforeIcon);

import Icon from '@/components/Icon.vue';

describe('Icon.vue', () => {
  it('renders a Tabler icon component based on the name prop', () => {
    const wrapper = mount(Icon, {
      props: { name: 'Foo', iconClass: 'custom-class' },
    });
    const icon = wrapper.find('[data-test="icon-foo"]');
    expect(icon.exists()).toBe(true);
    expect(icon.classes()).toContain('tabler-icon');
    expect(icon.classes()).toContain('custom-class');
    expect(icon.text()).toBe('Foo');
  });

  it('renders the IconTherefore component when name is "Therefore"', () => {
    const wrapper = mount(Icon, {
      props: { name: 'Therefore' },
    });
    const icon = wrapper.find('[data-test="icon-therefore"]');
    expect(icon.exists()).toBe(true);
    expect(icon.classes()).toContain('tabler-icon');
    expect(icon.text()).toBe('Therefore');
  });
});