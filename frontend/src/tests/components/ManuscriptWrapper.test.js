import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';

// Stub dynamic imports for onBeforeMount hook
const onloadStub = vi.fn();
vi.mock('/static/jquery-3.6.0.js', () => ({}), { virtual: true });
vi.mock('/static/tooltipster.bundle.js', () => ({}), { virtual: true });
vi.mock('/static/onload.js', () => ({ onload: onloadStub }), { virtual: true });

import ManuscriptWrapper from '@/components/ManuscriptWrapper.vue';

// Helper to flush pending promise callbacks
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('ManuscriptWrapper.vue', () => {
  beforeEach(() => {
    vi.resetModules();
    onloadStub.mockReset();
  });

  it('renders Manuscript component with given htmlString and settings', async () => {
    const html = '<div>content</div>';
    const settings = { background: 'bg', fontSize: 'fs', lineHeight: 'lh', fontFamily: 'ff', marginWidth: 'mw' };
    const api = { getUri: () => '' };
    const stubManuscript = defineComponent({
      props: ['htmlString', 'settings'],
      template: '<div data-test="manuscript">{{ htmlString }}</div>',
    });
    const wrapper = mount(ManuscriptWrapper, {
      props: { htmlString: html, keys: true, settings },
      global: {
        provide: { api },
        stubs: { Manuscript: stubManuscript, Teleport: true },
      },
    });
    await flushPromises();
    await nextTick();
    const ms = wrapper.find('[data-test="manuscript"]');
    expect(ms.exists()).toBe(true);
    expect(ms.text()).toBe(html);
    expect(wrapper.findComponent(stubManuscript).props('htmlString')).toBe(html);
    expect(wrapper.findComponent(stubManuscript).props('settings')).toStrictEqual(settings);
  });

it.skip('calls onload with element and keys option', async () => {
    const html = '<p>test</p>';
    const api = { getUri: () => '' };
    const stubManuscript = defineComponent({ props: ['htmlString', 'settings'], template: '<div/>' });
    const wrapper = mount(ManuscriptWrapper, {
      props: { htmlString: html, keys: false },
      global: {
        provide: { api },
        stubs: { Manuscript: stubManuscript, Teleport: true },
      },
    });
    expect(onloadStub).toHaveBeenCalled();
    const [el, opts] = onloadStub.mock.calls[0];
    // The onload callback should be invoked with the root element of the component
    expect(el).toBe(wrapper.element);
    expect(opts).toEqual({ keys: false });
  });

  it('renders footer when showFooter is true', () => {
    const api = { getUri: () => '' };
    const wrapper = mount(ManuscriptWrapper, {
      props: { htmlString: '', keys: false, showFooter: true },
      global: {
        provide: { api },
        stubs: { Manuscript: true, Teleport: true },
      },
    });
    expect(wrapper.find('.middle-footer').exists()).toBe(true);
    expect(wrapper.find('.footer-logo img').attributes('src')).toContain('logo-32px.svg');
  });

  it('does not render footer when showFooter is false', () => {
    const api = { getUri: () => '' };
    const wrapper = mount(ManuscriptWrapper, {
      props: { htmlString: '', keys: false, showFooter: false },
      global: {
        provide: { api },
        stubs: { Manuscript: true, Teleport: true },
      },
    });
    expect(wrapper.find('.middle-footer').exists()).toBe(false);
  });
});
