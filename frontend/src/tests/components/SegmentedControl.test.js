import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import SegmentedControl from '@/components/SegmentedControl.vue';

const IconStub = defineComponent({
  name: 'Icon',
  props: ['name'],
  template: '<div />',
});
const TooltipStub = defineComponent({
  name: 'Tooltip',
  props: ['anchor', 'content'],
  template: '<div />',
});

describe('SegmentedControl.vue', () => {
  let consoleErrorSpy;
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('logs error and renders no items when neither icons nor labels provided', () => {
    const wrapper = mount(SegmentedControl, {
      global: { stubs: { Icon: IconStub, Tooltip: TooltipStub } },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Must provide one of icons or labels');
    expect(wrapper.findAll('button')).toHaveLength(0);
    expect(wrapper.findComponent(TooltipStub).exists()).toBe(false);
  });

  it('logs error and renders no items when icons and labels lengths mismatch', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        icons: ['a', 'b'],
        labels: ['alpha'],
      },
      global: { stubs: { Icon: IconStub, Tooltip: TooltipStub } },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Lengths of icons and labels must match');
    expect(wrapper.findAll('button')).toHaveLength(0);
  });

  it('renders buttons with labels only and applies defaultActive correctly', async () => {
    const labels = ['One', 'Two', 'Three'];
    const defaultActive = 1;
    const wrapper = mount(SegmentedControl, {
      props: { labels, defaultActive },
      global: { stubs: { Icon: IconStub, Tooltip: TooltipStub } },
    });
    await nextTick();
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(labels.length);
    expect(buttons[defaultActive].classes()).toContain('active');
    buttons.forEach((btn, i) => {
      expect(btn.find('span.sc-label').text()).toBe(labels[i]);
      expect(btn.classes()).toContain('sc-item');
    });
  });

  it('emits update:modelValue when clicking items', async () => {
    const labels = ['X', 'Y', 'Z'];
    const wrapper = mount(SegmentedControl, {
      props: { labels },
      global: { stubs: { Icon: IconStub, Tooltip: TooltipStub } },
    });
    await nextTick();
    const buttons = wrapper.findAll('button');
    await buttons[2].trigger('click');
    await nextTick();
    expect(buttons[2].classes()).toContain('active');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
  });

  it('renders buttons with icons only', async () => {
    const icons = ['i1', 'i2'];
    const wrapper = mount(SegmentedControl, {
      props: { icons },
      global: { stubs: { Icon: IconStub, Tooltip: TooltipStub } },
    });
    await nextTick();
    const iconStubs = wrapper.findAllComponents(IconStub);
    expect(iconStubs).toHaveLength(icons.length);
    iconStubs.forEach((cmp, i) => {
      expect(cmp.props('name')).toBe(icons[i]);
    });
    wrapper.findAll('span.sc-label').forEach((lbl) => {
      expect(lbl.exists()).toBe(false);
    });
  });

  it('renders tooltips when provided and anchors to button refs', async () => {
    const icons = ['a', 'b', 'c'];
    const tips = ['tipA', '', 'tipC'];
    const wrapper = mount(SegmentedControl, {
      props: { icons, tooltips: tips },
      global: { stubs: { Icon: IconStub, Tooltip: TooltipStub } },
    });
    await nextTick();
    await nextTick();
    const tt = wrapper.findAllComponents(TooltipStub);
    expect(tt).toHaveLength(2);
    const rendered = tips
      .map((t, i) => (t && wrapper.vm.buttonRefs[i] ? [t, i] : null))
      .filter(Boolean);
    rendered.forEach(([content, idx]) => {
      const stub = tt.shift();
      expect(stub.props('content')).toBe(content);
      const anchor = stub.props('anchor');
      expect(anchor.tagName).toBe('BUTTON');
    });
  });

  it('does not set any active class when defaultActive is out of range', async () => {
    const labels = ['A', 'B'];
    const wrapper = mount(SegmentedControl, {
      props: { labels, defaultActive: 5 },
      global: { stubs: { Icon: IconStub, Tooltip: TooltipStub } },
    });
    await nextTick();
    const buttons = wrapper.findAll('button');
    expect(buttons.some((btn) => btn.classes().includes('active'))).toBe(false);
  });
});