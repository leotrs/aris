import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { shallowMount } from '@vue/test-utils';

let push;
let route;
let openFile;
let HomeSidebar;
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => route,
}));
vi.mock('@/models/File.js', () => ({
  File: { openFile },
}));

describe('HomeSidebar.vue', () => {
  beforeEach(async () => {
    push = vi.fn();
    route = { fullPath: '/' };
    openFile = vi.fn();
    const mod = await import('@/components/HomeSidebar.vue');
    HomeSidebar = mod.default;
  });

  it('renders wrapper classes and logo based on collapsed and mobileMode', () => {
    const collapsed = ref(false);
    const fileStore = ref({ getRecentFiles: () => [] });
    const wrapper = shallowMount(HomeSidebar, {
      props: { active: 'Home', fab: false },
      global: {
        provide: { mobileMode: false, sidebarIsCollapsed: collapsed, fileStore },
        stubs: ['ContextMenu', 'ContextMenuItem', 'SidebarItem', 'Separator'],
      },
    });
    expect(wrapper.classes()).toContain('sb-wrapper');
    expect(wrapper.classes()).not.toContain('mobile');
    expect(wrapper.classes()).not.toContain('collapsed');
    expect(wrapper.get('#logo img').attributes('src')).toMatch(/logotype\.svg$/);

    // collapsed state is tested separately
  });

  it('applies collapsed class when collapsed is true', () => {
    const collapsed = ref(true);
    const fileStore = ref({ getRecentFiles: () => [] });
    const wrapper = shallowMount(HomeSidebar, {
      props: { active: 'Home', fab: false },
      global: {
        provide: { mobileMode: false, sidebarIsCollapsed: collapsed, fileStore },
        stubs: ['ContextMenu', 'ContextMenuItem', 'SidebarItem', 'Separator'],
      },
    });
    expect(wrapper.classes()).toContain('collapsed');
  });

  it('applies mobile class when mobileMode is true', () => {
    const collapsed = ref(false);
    const fileStore = ref({ getRecentFiles: () => [] });
    const wrapper = shallowMount(HomeSidebar, {
      props: { active: '', fab: false },
      global: {
        provide: { mobileMode: true, sidebarIsCollapsed: collapsed, fileStore },
        stubs: ['ContextMenu', 'ContextMenuItem', 'SidebarItem', 'Separator'],
      },
    });
    expect(wrapper.classes()).toContain('mobile');
  });

});