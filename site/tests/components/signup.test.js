import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import SignupPage from "../../pages/signup.vue";

// Mock the API composable
vi.mock("../../composables/useApi.js", () => ({
  signupUser: vi.fn(),
}));

import { signupUser } from "../../composables/useApi.js";
const mockSignupUser = vi.mocked(signupUser);

describe("Signup Page Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render signup form with all required fields", () => {
    const wrapper = mount(SignupPage);

    // Check form elements exist
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[name="name"]').exists()).toBe(true);
    expect(wrapper.find('input[name="institution"]').exists()).toBe(true);
    expect(wrapper.find('input[name="research_area"]').exists()).toBe(true);
    expect(wrapper.find('select[name="interest_level"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);

    // Check required field labels
    expect(wrapper.text()).toContain("Email Address *");
    expect(wrapper.text()).toContain("Full Name *");
  });

  it("should validate required fields before submission", async () => {
    const wrapper = mount(SignupPage);
    const form = wrapper.find("form");

    // Try to submit empty form
    await form.trigger("submit.prevent");

    // Should show validation error
    expect(wrapper.text()).toContain("Please enter your email address");
    expect(mockSignupUser).not.toHaveBeenCalled();
  });

  it("should validate name field", async () => {
    const wrapper = mount(SignupPage);

    // Set email but leave name empty
    await wrapper.find('input[type="email"]').setValue("test@example.com");
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.text()).toContain("Please enter your name");
    expect(mockSignupUser).not.toHaveBeenCalled();
  });

  it("should validate field length limits", async () => {
    const wrapper = mount(SignupPage);

    // Set a name that's too long
    const longName = "a".repeat(101);
    await wrapper.find('input[type="email"]').setValue("test@example.com");
    await wrapper.find('input[name="name"]').setValue(longName);
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.text()).toContain("Name must be 100 characters or less");
    expect(mockSignupUser).not.toHaveBeenCalled();
  });

  it("should show character warning when approaching limits", async () => {
    const wrapper = mount(SignupPage);

    // Set institution text approaching limit
    const longInstitution = "a".repeat(185);
    await wrapper.find('input[name="institution"]').setValue(longInstitution);

    // Should show character warning
    expect(wrapper.text()).toContain("185/200 characters");
  });

  it("should submit valid form data successfully", async () => {
    const mockResponse = { id: 1, email: "test@example.com" };
    mockSignupUser.mockResolvedValueOnce(mockResponse);

    const wrapper = mount(SignupPage);

    // Fill out the form
    await wrapper.find('input[type="email"]').setValue("test@example.com");
    await wrapper.find('input[name="name"]').setValue("Dr. Jane Doe");
    await wrapper.find('input[name="institution"]').setValue("University of Science");
    await wrapper.find('input[name="research_area"]').setValue("Computational Biology");
    await wrapper.find('select[name="interest_level"]').setValue("ready");

    // Submit form
    await wrapper.find("form").trigger("submit.prevent");

    // Check API was called with correct data
    expect(mockSignupUser).toHaveBeenCalledWith({
      email: "test@example.com",
      name: "Dr. Jane Doe",
      institution: "University of Science",
      research_area: "Computational Biology",
      interest_level: "ready",
    });

    // Check success message
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Successfully signed up for early access");
  });

  it("should handle duplicate email error", async () => {
    const error = {
      status: 409,
      error: "duplicate_email",
      message: "This email address is already registered for early access",
    };
    mockSignupUser.mockRejectedValueOnce(error);

    const wrapper = mount(SignupPage);

    // Fill and submit form
    await wrapper.find('input[type="email"]').setValue("existing@example.com");
    await wrapper.find('input[name="name"]').setValue("Dr. Jane Doe");
    await wrapper.find("form").trigger("submit.prevent");

    // Check error message
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("This email address is already registered for early access");
  });

  it("should handle network errors", async () => {
    const error = {
      status: 0,
      error: "network_error",
      message: "Unable to connect to server. Please check your internet connection.",
    };
    mockSignupUser.mockRejectedValueOnce(error);

    const wrapper = mount(SignupPage);

    // Fill and submit form
    await wrapper.find('input[type="email"]').setValue("test@example.com");
    await wrapper.find('input[name="name"]').setValue("Dr. Jane Doe");
    await wrapper.find("form").trigger("submit.prevent");

    // Check error message
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Unable to connect to server");
  });

  it("should clear form after successful submission", async () => {
    const mockResponse = { id: 1, email: "test@example.com" };
    mockSignupUser.mockResolvedValueOnce(mockResponse);

    const wrapper = mount(SignupPage);

    // Fill out the form
    await wrapper.find('input[type="email"]').setValue("test@example.com");
    await wrapper.find('input[name="name"]').setValue("Dr. Jane Doe");
    await wrapper.find('input[name="institution"]').setValue("University of Science");

    // Submit form
    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    // Check form is cleared
    expect(wrapper.find('input[type="email"]').element.value).toBe("");
    expect(wrapper.find('input[name="name"]').element.value).toBe("");
    expect(wrapper.find('input[name="institution"]').element.value).toBe("");
  });

  it("should disable submit button during loading", async () => {
    // Make the API call hang
    mockSignupUser.mockImplementationOnce(() => new Promise(() => {}));

    const wrapper = mount(SignupPage);

    // Fill and submit form
    await wrapper.find('input[type="email"]').setValue("test@example.com");
    await wrapper.find('input[name="name"]').setValue("Dr. Jane Doe");

    const submitButton = wrapper.find('button[type="submit"]');
    await wrapper.find("form").trigger("submit.prevent");

    // Button should be disabled during loading
    expect(submitButton.attributes("disabled")).toBeDefined();
    expect(submitButton.text()).toContain("Signing Up...");
  });
});
