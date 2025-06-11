import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';

describe('ModalShortcuts.vue', () => {
  let getRegisteredComponentsStub, getComponentMetadataStub;

  beforeEach(() => {
    vi.resetModules();
    getRegisteredComponentsStub = vi.fn();
    getComponentMetadataStub = vi.fn();
    vi.doMock('@/composables/useKeyboardShortcuts.js', () => ({
      getRegisteredComponents: getRegisteredComponentsStub,
      getComponentMetadata: getComponentMetadataStub,
    }));
  });

  it('renders shortcut sections and propagates close event', async () => {
    const { default: ModalShortcuts } = await import('@/components/ModalShortcuts.vue');
    // Prepare stub data
    getRegisteredComponentsStub.mockReturnValue({
      comp1: { a: { description: 'Desc A' }, b: { fn: () => {} }, escape: { description: 'ignored' } },
      comp2: { x: {} },
      comp3: {},
    });
    getComponentMetadataStub.mockReturnValue({
      comp1: { name: 'Component One' },
      comp2: { name: 'Component Two' },
    });
    const ModalStub = {
      name: 'Modal',
      emits: ['close'],
      template: '<div><slot name="header"/><slot/></div>',
    };
    const wrapper = shallowMount(ModalShortcuts, {
      global: {
        stubs: {
          Modal: ModalStub,
          ButtonClose: { template: '<button @click="$emit(\'close\')"/>' },
        },
      },
    });
    // Wait for mounted hook to run
    await nextTick();
    // comp1 has two keys (a,b) after filtering, comp2 has one, comp3 empty => two sections
    const sections = wrapper.findAll('.component-section');
    expect(sections).toHaveLength(2);
    // Verify first section title
    expect(sections[0].find('.component-title').text()).toBe('Component One');
    // Verify keys and descriptions for comp1
    const keys = sections[0].findAll('kbd');
    expect(keys.map((k) => k.text())).toEqual(['a', 'b']);
    const descs = sections[0].findAll('.description-text');
    expect(descs[0].text()).toBe('Desc A');
    expect(descs[1].text()).toContain('fn');
    // Verify second section (comp2)
    expect(sections[1].find('.component-title').text()).toBe('Component Two');
    expect(sections[1].findAll('kbd')).toHaveLength(1);
    // Test close propagation
    const modal = wrapper.findComponent(ModalStub);
    modal.vm.$emit('close');
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});