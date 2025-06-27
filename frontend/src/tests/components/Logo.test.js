import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Logo from "@/components/base/Logo.vue";

const mockApi = {
  getUri: vi.fn(() => "http://localhost:8000"),
};

describe("Logo.vue", () => {
  const createWrapper = (props = {}) => {
    return mount(Logo, {
      props,
      global: {
        provide: {
          api: mockApi,
        },
      },
    });
  };

  it("renders small logo by default", () => {
    const wrapper = createWrapper();
    const img = wrapper.find("img");

    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("http://localhost:8000/design-assets/logos/logo-32px.svg");
    expect(img.attributes("alt")).toBe("Aris logo");
    expect(img.classes()).toContain("logo");
    expect(img.classes()).toContain("logo--small");
  });

  it("renders full logo when type is full", () => {
    const wrapper = createWrapper({ type: "full" });
    const img = wrapper.find("img");

    expect(img.attributes("src")).toBe("http://localhost:8000/design-assets/logos/logotype.svg");
    expect(img.classes()).toContain("logo--full");
  });

  it("renders gray logo when type is gray", () => {
    const wrapper = createWrapper({ type: "gray" });
    const img = wrapper.find("img");

    expect(img.attributes("src")).toBe(
      "http://localhost:8000/design-assets/logos/logo-32px-gray.svg"
    );
    expect(img.classes()).toContain("logo--gray");
  });

  it("accepts custom alt text", () => {
    const wrapper = createWrapper({ alt: "Custom alt text" });
    const img = wrapper.find("img");

    expect(img.attributes("alt")).toBe("Custom alt text");
  });

  it("accepts custom CSS classes", () => {
    const wrapper = createWrapper({ class: "custom-class" });
    const img = wrapper.find("img");

    expect(img.classes()).toContain("custom-class");
  });
});
