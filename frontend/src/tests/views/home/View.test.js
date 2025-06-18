import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeView from '@/views/home/View.vue';

describe('HomeView', () => {
  it('renders HomeLayout with active prop and FilesPane present', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          HomeLayout: { name: 'HomeLayout', template: '<div><slot/></div>' },
          FilesPane: { name: 'FilesPane', template: '<div data-test="files-pane" />' },
        },
      },
    });
    const layout = wrapper.findComponent({ name: 'HomeLayout' });
    expect(layout.exists()).toBe(true);
    expect(layout.attributes('active')).toBe('Home');
    expect(wrapper.find('[data-test="files-pane"]').exists()).toBe(true);
  });
});
