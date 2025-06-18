import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ContextMenuItem from '@/components/ContextMenuItem.vue';

describe('ContextMenuItem.vue', () => {
  let closeMenu;

  beforeEach(() => {
    closeMenu = vi.fn();
  });

  it('renders a menuitem button with icon and caption props', () => {
    const wrapper = mount(ContextMenuItem, {
      props: { icon: 'TestIcon', caption: 'Test Caption', iconClass: 'extra-class' },
      global: {
        provide: { closeMenu },
        stubs: ['Icon'],
      },
    });

    const button = wrapper.get('button');
    expect(button.attributes('role')).toBe('menuitem');
    expect(button.attributes('tabindex')).toBe('-1');
    expect(button.classes()).toContain('item');

    const icon = wrapper.get('icon-stub');
    expect(icon.exists()).toBe(true);
    expect(icon.classes()).toContain('cmi-icon');
    expect(icon.classes()).toContain('extra-class');
    expect(icon.attributes('name')).toBe('TestIcon');

    const caption = wrapper.get('span.cmi-caption');
    expect(caption.text()).toBe('Test Caption');
  });

  it('invokes closeMenu when clicked', async () => {
    const wrapper = mount(ContextMenuItem, {
      props: { icon: 'X', caption: 'Close' },
      global: {
        provide: { closeMenu },
        stubs: ['Icon'],
      },
    });
    await wrapper.get('button').trigger('click');
    expect(closeMenu).toHaveBeenCalled();
  });
});
