import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Logo from "../../components/Logo.vue";

// Mock the useApi composable
vi.mock("@/composables/useApi.js", () => ({
  default: {
    defaults: {
      baseURL: "http://localhost:8001"
    }
  }
}));

describe("Logo Component", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = null;
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("renders with default props (small logo)", () => {
    wrapper = mount(Logo);
    
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("http://localhost:8001/design-assets/logos/logo-32px.svg");
    expect(img.attributes("alt")).toBe("Aris logo");
  });

  it("renders full logo when type is 'full'", () => {
    wrapper = mount(Logo, {
      props: {
        type: "full"
      }
    });
    
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("http://localhost:8001/design-assets/logos/logotype.svg");
  });

  it("renders gray logo when type is 'gray'", () => {
    wrapper = mount(Logo, {
      props: {
        type: "gray"
      }
    });
    
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("http://localhost:8001/design-assets/logos/logo-32px-gray.svg");
  });

  it("accepts custom alt text", () => {
    wrapper = mount(Logo, {
      props: {
        alt: "Custom alt text"
      }
    });
    
    const img = wrapper.find("img");
    expect(img.attributes("alt")).toBe("Custom alt text");
  });

  it("accepts custom CSS classes", () => {
    wrapper = mount(Logo, {
      props: {
        class: "custom-class another-class"
      }
    });
    
    const img = wrapper.find("img");
    expect(img.attributes("class")).toBe("custom-class another-class");
  });

  it("validates type prop correctly", () => {
    // Valid types should not throw
    expect(() => mount(Logo, { props: { type: "small" } })).not.toThrow();
    expect(() => mount(Logo, { props: { type: "full" } })).not.toThrow();
    expect(() => mount(Logo, { props: { type: "gray" } })).not.toThrow();
  });

  it("falls back to small logo for invalid type", () => {
    wrapper = mount(Logo, {
      props: {
        type: "invalid"
      }
    });
    
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("http://localhost:8001/design-assets/logos/logo-32px.svg");
  });
});