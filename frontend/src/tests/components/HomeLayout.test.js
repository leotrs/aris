import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { shallowMount } from "@vue/test-utils";

let push;
let route;
vi.mock("vue-router", () => ({
  useRouter: () => ({ push }),
  useRoute: () => route,
}));

import HomeLayout from "@/components/layout/HomeLayout.vue";

// Helper to flush pending promise callbacks
const flushPromises = () => Promise.resolve();

describe("HomeLayout.vue", () => {
  beforeEach(() => {
    push = vi.fn();
    route = { fullPath: "/" };
  });

  it("renders HomeSidebar with active and fab props", () => {
    const wrapper = shallowMount(HomeLayout, {
      props: { active: "TestActive", fab: false },
      global: {
        provide: {
          mobileMode: false,
          fileStore: ref({}),
          user: ref({ id: "u1" }),
        },
        stubs: ["HomeSidebar", "Button", "UserMenu", "UploadFile"],
      },
    });
    const sidebar = wrapper.find("home-sidebar-stub");
    expect(sidebar.exists()).toBe(true);
    expect(sidebar.attributes("active")).toBe("TestActive");
    expect(sidebar.attributes("fab")).toBe("false");
  });

  it("toggles mobile class based on mobileMode", () => {
    const wrapper = shallowMount(HomeLayout, {
      props: { active: "", fab: true },
      global: {
        provide: {
          mobileMode: true,
          fileStore: ref({}),
          user: ref({ id: "u2" }),
        },
        stubs: ["HomeSidebar", "Button", "UserMenu", "UploadFile"],
      },
    });
    expect(wrapper.classes()).toContain("mobile");
    expect(wrapper.find("div.menus").classes()).toContain("mobile");
  });

  it("renders Home button in mobile mode when not at root and hides at root", () => {
    // when not at root
    route.fullPath = "/not-root";
    let wrapper = shallowMount(HomeLayout, {
      props: { active: "", fab: true },
      global: {
        provide: {
          mobileMode: true,
          fileStore: ref({}),
          user: ref({ id: "u3" }),
        },
        stubs: ["HomeSidebar", "Button", "UserMenu", "UploadFile"],
      },
    });
    expect(wrapper.find('button-stub[kind="tertiary"][icon="Home"]').exists()).toBe(true);

    // when at root
    route.fullPath = "/";
    wrapper = shallowMount(HomeLayout, {
      props: { active: "", fab: true },
      global: {
        provide: {
          mobileMode: true,
          fileStore: ref({}),
          user: ref({ id: "u3" }),
        },
        stubs: ["HomeSidebar", "Button", "UserMenu", "UploadFile"],
      },
    });
    expect(wrapper.find('button-stub[kind="tertiary"][icon="Home"]').exists()).toBe(false);
  });

  it("shows and hides UploadFile modal on event", async () => {
    const wrapper = shallowMount(HomeLayout, {
      props: { active: "", fab: true },
      global: {
        provide: {
          mobileMode: false,
          fileStore: ref({}),
          user: ref({ id: "u4" }),
        },
        stubs: ["HomeSidebar", "Button", "UserMenu", "UploadFile"],
      },
    });
    expect(wrapper.find("upload-file-stub").exists()).toBe(false);

    await wrapper.findComponent({ name: "HomeSidebar" }).vm.$emit("show-file-upload-modal");
    await flushPromises();
    expect(wrapper.find("upload-file-stub").exists()).toBe(true);

    await wrapper.findComponent({ name: "UploadFile" }).vm.$emit("close");
    await flushPromises();
    expect(wrapper.find(".modal").exists()).toBe(false);
  });

  it("calls createFile and routes to new file on new-empty-file", async () => {
    const createFile = vi.fn().mockResolvedValue({ id: "123" });
    const fileStore = ref({ createFile });
    const user = ref({ id: "owner1" });
    const wrapper = shallowMount(HomeLayout, {
      props: { active: "", fab: true },
      global: {
        provide: { mobileMode: false, fileStore, user },
        stubs: ["HomeSidebar", "Button", "UserMenu", "UploadFile"],
      },
    });
    await wrapper.findComponent({ name: "HomeSidebar" }).vm.$emit("new-empty-file");
    await flushPromises();
    expect(createFile).toHaveBeenCalledWith({
      ownerId: "owner1",
      title: "New File",
      source: expect.stringContaining("# New File"),
    });
    expect(push).toHaveBeenCalledWith("/file/123");
  });
});
