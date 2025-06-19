import { describe, it, expect, beforeEach, vi } from "vitest";
import { nextTick, ref } from "vue";
import { mount, RouterLinkStub } from "@vue/test-utils";
import LoginView from "@/views/login/View.vue";
import Button from "@/components/Button.vue";

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

  it("renders email and password inputs and login/register buttons", () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    const buttons = wrapper.findAllComponents(Button);
    expect(buttons.length).toBe(2);
    expect(buttons[0].text()).toBe("Login");
    expect(buttons[1].text()).toBe("Register");
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

  it("auto-prefills inputs and focuses login button on mount when isDev=true", async () => {
    import.meta.env.VITE_DEV_LOGIN_EMAIL = "dev@example.com";
    import.meta.env.VITE_DEV_LOGIN_PASSWORD = "secret";
    const api = { post: vi.fn(), get: vi.fn() };
    const user = ref(null);
    const fileStore = { loadFiles: vi.fn(), loadTags: vi.fn() };
    localStorage.clear();
    wrapper = mount(LoginView, {
      attachTo: document.body,
      global: {
        provide: { isDev: true, api, user, fileStore },
        components: { Button },
        stubs: { RouterLink: RouterLinkStub },
      },
    });
    await flushPromises();
    const emailInput = wrapper.find('input[type="text"]');
    const pwInput = wrapper.find('input[type="password"]');
    expect(emailInput.element.value).toBe("dev@example.com");
    expect(pwInput.element.value).toBe("secret");
    const loginBtn = wrapper.findComponent(Button);
    expect(document.activeElement).toBe(loginBtn.element);
    expect(api.post).not.toHaveBeenCalled();
  });
});
