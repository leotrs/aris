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
    
    // Mock API injection
    const mockApi = {
      post: vi.fn(),
      get: vi.fn(),
    };
    
    wrapper = mount(LoginView, {
      global: {
        components: { Button },
        stubs: { RouterLink: RouterLinkStub },
        provide: {
          api: mockApi,
          user: ref(null),
          fileStore: ref(null),
          isDev: false,
        },
      },
    });
  });

  it("uses browser native validation for empty fields", async () => {
    // Verify that email input has required attribute for browser validation
    const emailInput = wrapper.find('[data-testid="email-input"]');
    const passwordInput = wrapper.find('[data-testid="password-input"]');
    
    expect(emailInput.attributes("required")).toBeDefined();
    expect(passwordInput.attributes("required")).toBeDefined();
    expect(emailInput.attributes("type")).toBe("email");
  });

  it("navigates to register page on register button click", async () => {
    const buttons = wrapper.findAllComponents(Button);
    const registerBtn = buttons.find((btn) => btn.text() === "Register");
    await registerBtn.trigger("click");
    expect(pushMock).toHaveBeenCalledWith("/register");
  });
});
