import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import ColorPicker from '@/components/ColorPicker.vue';

describe('ColorPicker.vue', () => {
  const colors = { red: '#f00', green: '#0f0', blue: '#00f' };

  it('renders a swatch for each color with correct classes, styles, and labels', () => {
    const wrapper = mount(ColorPicker, { props: { colors } });
    const swatches = wrapper.findAll('.swatch');
    expect(swatches).toHaveLength(Object.keys(colors).length);
    swatches.forEach((swatch, idx) => {
      const name = Object.keys(colors)[idx];
      expect(swatch.classes()).toContain(name);
      const circle = swatch.find('button.circle');
      expect(circle.exists()).toBe(true);
      expect(circle.attributes('style')).toMatch(/background-color:/);
      expect(circle.element.style.backgroundColor).toBeTruthy();
      const label = swatch.find('span.label');
      expect(label.text()).toBe(name);
    });
  });

  it('emits change and toggles active class on click', async () => {
    const wrapper = mount(ColorPicker, { props: { colors } });
    const swatches = wrapper.findAll('.swatch');

    await swatches[1].trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('change')?.[0]).toEqual(['green']);
    expect(swatches[1].classes()).toContain('active');
    expect(swatches[0].classes()).not.toContain('active');

    await swatches[2].trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('change')?.[1]).toEqual(['blue']);
    expect(swatches[1].classes()).not.toContain('active');
    expect(swatches[2].classes()).toContain('active');
  });

  it('emits change and toggles active class on keyboard Enter/Space', async () => {
    const wrapper = mount(ColorPicker, { props: { colors } });
    const circles = wrapper.findAll('button.circle');

    await circles[0].trigger('keydown.enter');
    expect(wrapper.emitted('change')?.[0]).toEqual(['red']);
    expect(wrapper.findAll('.swatch')[0].classes()).toContain('active');

    await circles[2].trigger('keydown.space');
    expect(wrapper.emitted('change')?.[1]).toEqual(['blue']);
    expect(wrapper.findAll('.swatch')[2].classes()).toContain('active');
  });

  it('does not set any active class initially even if defaultActive is provided', () => {
    const wrapper = mount(ColorPicker, { props: { colors, defaultActive: 'red' } });
    expect(wrapper.findAll('.swatch.active')).toHaveLength(0);
  });
});