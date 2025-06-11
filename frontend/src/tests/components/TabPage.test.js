import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TabPage from '@/components/TabPage.vue';

describe('TabPage.vue', () => {
  it('renders default slot inside wrapper with proper class', () => {
    const wrapper = mount(TabPage, {
      slots: { default: '<div class="content">Hello</div>' },
    });

    const page = wrapper.get('.tab-page-wrapper');
    expect(page.html()).toContain('<div class="content">Hello</div>');
  });
});