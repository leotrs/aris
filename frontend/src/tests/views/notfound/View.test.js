import { describe, it, expect } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import NotFoundView from "@/views/notfound/View.vue";
import Button from "@/components/base/Button.vue";

describe("NotFoundView", () => {
  it("renders the 404 heading and message", () => {
    const wrapper = mount(NotFoundView, {
      global: {
        components: { Button },
        stubs: { RouterLink: RouterLinkStub },
      },
    });
    expect(wrapper.find("h1.text-h1").text()).toBe("404");
    expect(wrapper.find("h2.text-h2").text()).toBe("Page not found");
  });

  it("renders a button linking back to home", () => {
    const wrapper = mount(NotFoundView, {
      global: {
        components: { Button },
        stubs: { RouterLink: RouterLinkStub },
      },
    });
    const button = wrapper.findComponent(Button);
    expect(button.exists()).toBe(true);
    const link = button.findComponent(RouterLinkStub);
    expect(link.props("to")).toBe("/");
    expect(link.text()).toBe("Go back home");
  });
});
