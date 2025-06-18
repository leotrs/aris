import { describe, it, expect, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import Tag from '@/components/Tag.vue';

describe('Tag.vue', () => {
  const tag = { id: 1, name: 'TestTag', color: 'purple' };
  let startEditingMock;
  const EditableTextStub = defineComponent({
    name: 'EditableText',
    props: ['modelValue', 'editOnClick', 'clearOnStart', 'preserveWidth'],
    emits: ['update:modelValue', 'save'],
    setup(props, { expose }) {
      startEditingMock = vi.fn();
      expose({ startEditing: startEditingMock });
      return () => h('div', props.modelValue);
    },
  });

  it('renders name inside span and applies correct classes and attributes', () => {
    const wrapper = mount(Tag, {
      props: { tag, active: true },
      global: { stubs: { EditableText: EditableTextStub } },
    });
    const btn = wrapper.get('button');
    expect(btn.classes()).toContain('tag');
    expect(btn.classes()).toContain('on');
    expect(btn.classes()).toContain('purple');
    expect(btn.classes()).not.toContain('editable');
    expect(btn.attributes('role')).toBe('checkbox');
    expect(btn.attributes('aria-checked')).toBe('true');
    expect(wrapper.get('span').text()).toBe('TestTag');
  });

  it('applies off class and aria-checked false when inactive', () => {
    const wrapper = mount(Tag, {
      props: { tag, active: false },
      global: { stubs: { EditableText: EditableTextStub } },
    });
    const btn = wrapper.get('button');
    expect(btn.classes()).toContain('off');
    expect(btn.attributes('aria-checked')).toBe('false');
  });

  it('renders EditableText when editable and emits rename event', async () => {
    const wrapper = mount(Tag, {
      props: {
        tag,
        editable: true,
        editOnClick: true,
        clearOnStartRenaming: true,
      },
      global: { stubs: { EditableText: EditableTextStub } },
    });
    const editable = wrapper.getComponent(EditableTextStub);
    expect(editable.props()).toMatchObject({
      modelValue: tag.name,
      editOnClick: true,
      clearOnStart: true,
      preserveWidth: true,
    });
    await editable.vm.$emit('save', 'NewName');
    expect(wrapper.emitted('rename')).toEqual([['NewName']]);
  });

  it('startEditing calls child startEditing when editable', () => {
    const wrapper = mount(Tag, {
      props: { tag, editable: true },
      global: { stubs: { EditableText: EditableTextStub } },
    });
    wrapper.vm.startEditing();
    expect(startEditingMock).toHaveBeenCalled();
  });

  it('startEditing does nothing when not editable', () => {
    // reset mock
    startEditingMock = vi.fn();
    const wrapper = mount(Tag, {
      props: { tag, editable: false },
      global: { stubs: { EditableText: EditableTextStub } },
    });
    wrapper.vm.startEditing();
    expect(startEditingMock).not.toHaveBeenCalled();
  });
});
