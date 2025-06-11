import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';

import FeedbackIcon from '@/components/FeedbackIcon.vue';

// Stub ContextMenu and its items for interaction
const ContextMenu = defineComponent({
  name: 'ContextMenu',
  props: ['icon', 'iconClass', 'placement'],
  methods: { toggle() {} },
  template: '<div><slot/></div>',
});
const ContextMenuItem = defineComponent({
  name: 'ContextMenuItem',
  emits: ['click'],
  template: '<button class="item" @click="$emit(\'click\')"></button>',
});
const Separator = defineComponent({ name: 'Separator', template: '<div/>' });

describe('FeedbackIcon.vue', () => {
  let file;
  beforeEach(() => {
    file = ref({ icons: {} });
  });

  it('is hidden by default', () => {
    const wrapper = mount(FeedbackIcon, {
      global: {
        provide: { file },
        stubs: { ContextMenu, ContextMenuItem, Separator },
      },
    });
    const el = wrapper.get('.feedback').element;
    expect(el.style.visibility).toBe('hidden');
  });

  it('activates icon and updates file icons on click', async () => {
    const wrapper = mount(FeedbackIcon, {
      global: {
        provide: { file },
        stubs: { ContextMenu, ContextMenuItem, Separator },
      },
    });
    const items = wrapper.findAll('.item');
    expect(items.length).toBe(8);
    await items[0].trigger('click');
    const keys = Object.keys(file.value.icons);
    expect(keys).toHaveLength(1);
    const entry = file.value.icons[keys[0]];
    expect(entry.class).toBe('bookmark');
    expect(entry.element).toBe(wrapper.get('.feedback').element.parentElement);
  });

  it('removes all icons on remove click', async () => {
    const wrapper = mount(FeedbackIcon, {
      global: {
        provide: { file },
        stubs: { ContextMenu, ContextMenuItem, Separator },
      },
    });
    const items = wrapper.findAll('.item');
    // activate one icon first
    await items[1].trigger('click');
    expect(Object.keys(file.value.icons)).toHaveLength(1);
    // remove all icons
    await items[items.length - 1].trigger('click');
    expect(file.value.icons).toEqual({});
  });
});