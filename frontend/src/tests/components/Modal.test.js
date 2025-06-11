import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

describe('Modal.vue', () => {
  let useClosableStub, closableOptions;

  beforeEach(() => {
    vi.resetModules();
    useClosableStub = vi.fn((options) => {
      closableOptions = options;
      return {};
    });
    vi.doMock('@/composables/useClosable.js', () => ({
      default: useClosableStub,
    }));
  });

  it('uses useClosable with proper options and emits close on onClose', async () => {
    const { default: Modal } = await import('@/components/Modal.vue');
    const wrapper = mount(Modal, {
      global: {
        stubs: {
          Pane: { template: '<div><slot name="header"/><slot/></div>' },
        },
      },
    });
    expect(useClosableStub).toHaveBeenCalledWith({
      onClose: expect.any(Function),
      closeOnEsc: true,
      closeOnOutsideClick: true,
      closeOnCloseButton: true,
      autoActivate: true,
    });
    closableOptions.onClose();
    await nextTick();
    expect(wrapper.emitted('close')).toBeDefined();
  });

  it('renders header and default slot content', async () => {
    const { default: Modal } = await import('@/components/Modal.vue');
    const wrapper = mount(Modal, {
      global: {
        stubs: {
          Pane: {
            template: '<div><slot name="header"/><slot/></div>',
          },
        },
      },
      slots: {
        header: '<h3>Custom Header</h3>',
        default: '<p>Body text</p>',
      },
    });
    expect(wrapper.html()).toContain('<h3>Custom Header</h3>');
    expect(wrapper.html()).toContain('<p>Body text</p>');
  });
});