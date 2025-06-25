<script setup>
  import { ref } from "vue";
  import axios from "axios";

  // Create API instance with base URL and error handling
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
  });

  const formData = ref({
    email: "",
    name: "",
    institution: "",
    researchArea: "",
    interestLevel: "",
  });

  const isSubmitting = ref(false);
  const message = ref("");
  const messageType = ref(""); // 'success' or 'error'

  const interestOptions = [
    { value: "", label: "Select your interest level" },
    { value: "exploring", label: "Just exploring options" },
    { value: "planning", label: "Planning to try soon" },
    { value: "ready", label: "Ready to start using Aris" },
    { value: "migrating", label: "Looking to migrate existing work" },
  ];

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!formData.value.email) {
      showMessage("Please enter your email address", "error");
      return;
    }

    if (!validateEmail(formData.value.email)) {
      showMessage("Please enter a valid email address", "error");
      return;
    }

    if (!formData.value.name.trim()) {
      showMessage("Please enter your name", "error");
      return;
    }

    isSubmitting.value = true;
    message.value = "";

    try {
      const response = await api.post("/signup/", {
        email: formData.value.email,
        name: formData.value.name,
        institution: formData.value.institution || null,
        research_area: formData.value.researchArea || null,
        interest_level: formData.value.interestLevel || null,
      });

      // Success state
      showMessage(
        "Thank you for your interest! We'll be in touch with early access details.",
        "success"
      );

      // Reset form
      formData.value = {
        email: "",
        name: "",
        institution: "",
        researchArea: "",
        interestLevel: "",
      };
    } catch (error) {
      if (error.response?.status === 409) {
        showMessage("This email is already registered for early access.", "error");
      } else if (error.response?.data?.message) {
        showMessage(error.response.data.message, "error");
      } else {
        showMessage("Something went wrong. Please try again.", "error");
      }
    } finally {
      isSubmitting.value = false;
    }
  };

  const showMessage = (text, type) => {
    message.value = text;
    messageType.value = type;
  };
</script>

<template>
  <section id="signup" class="section-container">
    <div class="signup-header text-center">
      <h2 class="section-heading">Get early access to Aris</h2>
      <p class="section-text">
        Join researchers who are already exploring the future of web-native publishing. We'll keep
        you updated on our progress and let you know when early access is available.
      </p>
    </div>

    <div class="signup-form-container">
      <form class="signup-form" @submit="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label for="signup-email" class="form-label">Email Address *</label>
            <input
              id="signup-email"
              v-model="formData.email"
              type="email"
              class="form-input"
              :disabled="isSubmitting"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="signup-name" class="form-label">Name *</label>
            <input
              id="signup-name"
              v-model="formData.name"
              type="text"
              class="form-input"
              :disabled="isSubmitting"
              required
              autocomplete="name"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="signup-institution" class="form-label">Institution or Affiliation</label>
            <input
              id="signup-institution"
              v-model="formData.institution"
              type="text"
              class="form-input"
              :disabled="isSubmitting"
              autocomplete="organization"
              placeholder="University, Research Institute, etc."
            />
          </div>

          <div class="form-group">
            <label for="signup-research" class="form-label">Research Area</label>
            <input
              id="signup-research"
              v-model="formData.researchArea"
              type="text"
              class="form-input"
              :disabled="isSubmitting"
              placeholder="e.g., Computational Biology, Physics, etc."
            />
          </div>
        </div>

        <div class="form-group form-group-full">
          <label for="signup-interest" class="form-label">Interest Level</label>
          <select
            id="signup-interest"
            v-model="formData.interestLevel"
            class="form-select"
            :disabled="isSubmitting"
          >
            <option v-for="option in interestOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div v-if="message" class="form-message" :class="`form-message--${messageType}`">
          {{ message }}
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-large" :disabled="isSubmitting">
            {{ isSubmitting ? "Joining waitlist..." : "Join the waitlist" }}
          </button>
          <p class="form-note">
            We respect your privacy. No spam, and you can unsubscribe at any time.
          </p>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
  .signup-header {
    margin-bottom: 3rem;
  }

  .signup-form-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .signup-form {
    background: var(--gray-0);
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--gray-200);
  }

  .form-row {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .form-group-full {
    margin-bottom: 1.5rem;
  }

  .form-label {
    font-weight: var(--weight-semi);
    color: var(--gray-800);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .form-input,
  .form-select {
    padding: 0.875rem;
    border: 2px solid var(--gray-300);
    border-radius: 6px;
    font-size: 1rem;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    background: var(--gray-0);
    font-family: inherit;
  }

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
  }

  .form-input:disabled,
  .form-select:disabled {
    background: var(--gray-100);
    color: var(--gray-500);
    cursor: not-allowed;
  }

  .form-select {
    cursor: pointer;
  }

  .form-select:disabled {
    cursor: not-allowed;
  }

  .form-message {
    margin-bottom: 1.5rem;
    padding: 0.875rem;
    border-radius: 6px;
    font-size: 0.9rem;
    border: 1px solid;
  }

  .form-message--success {
    background: var(--green-50);
    color: var(--green-700);
    border-color: var(--green-200);
  }

  .form-message--error {
    background: var(--red-50);
    color: var(--red-700);
    border-color: var(--red-200);
  }

  .form-actions {
    text-align: center;
  }

  .btn-large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    min-width: 200px;
  }

  .form-note {
    margin-top: 1rem;
    font-size: 0.85rem;
    color: var(--gray-600);
    max-width: none;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .signup-form {
      padding: 2rem;
      margin: 0 1rem;
    }

    .form-row {
      flex-direction: column;
      gap: 1rem;
    }

    .signup-header {
      margin-bottom: 2rem;
    }
  }

  @media (max-width: 480px) {
    .signup-form {
      padding: 1.5rem;
    }

    .btn-large {
      width: 100%;
      min-width: unset;
    }
  }
</style>
