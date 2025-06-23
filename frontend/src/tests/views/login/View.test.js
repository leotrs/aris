import { describe, it, expect, beforeEach, vi } from "vitest";
import { nextTick, ref } from "vue";
import { mount, RouterLinkStub } from "@vue/test-utils";
import LoginView from "@/views/login/View.vue";
import Button from "@/components/base/Button.vue";

// Utility to wait for pending promises (e.g. auto-focus flow in dev mode)
const flushPromises = () => new Promise((res) => setTimeout(res, 0));

// Stub useRouter to capture navigation calls
const pushMock = vi.fn();
vi.mock("vue-router", () => ({ useRouter: () => ({ push: pushMock }) }));

describe("LoginView", () => {
  let wrapper;

  beforeEach(() => {
    pushMock.mockClear();
    wrapper = mount(LoginView, {
      global: {
        components: { Button },
        stubs: { RouterLink: RouterLinkStub },
      },
    });
  });

  it("shows an error message when attempting to login with empty fields", async () => {
    const loginBtn = wrapper.findComponent(Button);
    await loginBtn.trigger("click");
    await nextTick();
    expect(wrapper.find(".error-message").text()).toBe("Please fill in all fields");
  });

  it("navigates to register page on register button click", async () => {
    const buttons = wrapper.findAllComponents(Button);
    const registerBtn = buttons.find((btn) => btn.text() === "Register");
    await registerBtn.trigger("click");
    expect(pushMock).toHaveBeenCalledWith("/register");
  });
});
