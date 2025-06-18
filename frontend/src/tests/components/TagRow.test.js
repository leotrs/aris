import { describe, it, expect } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import TagRow from '@/components/TagRow.vue';

describe('TagRow.vue', () => {
  const tags = [
    { id: 1, name: 'A', color: 'red' },
    { id: 2, name: 'B', color: 'green' },
    { id: 3, name: 'C', color: 'purple' },
    { id: 4, name: 'D', color: 'orange' },
  ];
  const file = { tags };

  const TagStub = defineComponent({ name: 'Tag', props: ['tag', 'active'], setup() { return () => null; } });
  const MultiSelectTagsStub = defineComponent({ name: 'MultiSelectTags', props: ['modelValue', 'file'], setup() { return () => null; } });

  it('renders all tags when count <= maxTags and hides overflow controls', () => {
    const small = { tags: tags.slice(0, 3) };
    const wrapper = mount(TagRow, {
      props: { file: small },
      global: { stubs: { Tag: TagStub, MultiSelectTags: MultiSelectTagsStub } },
    });
    expect(wrapper.findAllComponents(TagStub)).toHaveLength(3);
    expect(wrapper.find('button.overflow-tag').exists()).toBe(false);
    const ms = wrapper.getComponent(MultiSelectTagsStub);
    expect(ms.props('file')).toEqual(small);
  });

  it('limits visible tags to maxTags and toggles overflow controls', async () => {
    const wrapper = mount(TagRow, {
      props: { file },
      global: { stubs: { Tag: TagStub, MultiSelectTags: MultiSelectTagsStub } },
    });
    // default maxTags = 3
    expect(wrapper.findAllComponents(TagStub)).toHaveLength(3);
    const more = wrapper.get('button.overflow-tag');
    expect(more.text()).toBe('+1 more');
    expect(more.attributes('title')).toBe('Show 1 more tags');
    await more.trigger('click');
    expect(wrapper.findAllComponents(TagStub)).toHaveLength(4);
    const less = wrapper.get('button.overflow-tag.show-less');
    expect(less.text()).toBe('show less');
    expect(less.attributes('title')).toBe('Show less');
    await less.trigger('click');
    expect(wrapper.findAllComponents(TagStub)).toHaveLength(3);
  });

  it('updates tag list when file.tags prop changes', async () => {
    const initial = [{ id: 1, name: 'A', color: 'red' }];
    const wrapper = mount(TagRow, {
      props: { file: { tags: initial } },
      global: { stubs: { Tag: TagStub, MultiSelectTags: MultiSelectTagsStub } },
    });
    expect(wrapper.findAllComponents(TagStub)).toHaveLength(1);
    await wrapper.setProps({ file });
    await wrapper.vm.$nextTick();
    // still limited to maxTags (3) when showAll is false
    expect(wrapper.findAllComponents(TagStub)).toHaveLength(3);
    const more = wrapper.get('button.overflow-tag');
    expect(more.text()).toBe('+1 more');
  });
});
