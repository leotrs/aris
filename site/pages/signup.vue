<template>
  <div class="signup-page">
    <div class="signup-container">
      <h1 class="signup-title">Sign Up for Early Access</h1>
      <p class="signup-subtitle">
        Join researchers who are transforming how scientific work gets done.
      </p>

      <form class="signup-form" @submit.prevent="handleSignup">
        <div class="form-group">
          <label for="email" class="form-label">Email Address *</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="your.email@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="name" class="form-label">Full Name *</label>
          <input
            id="name"
            name="name"
            v-model="name"
            type="text"
            class="form-input"
            placeholder="e.g., Dr. Jane Doe"
            required
            minlength="1"
            maxlength="100"
            autocomplete="name"
          />
          <div v-if="name.length >= 90" class="field-warning">
            {{ name.length }}/100 characters
          </div>
        </div>

        <div class="form-group">
          <label for="institution" class="form-label">Institution or Affiliation</label>
          <input
            id="institution"
            name="institution"
            v-model="institution"
            type="text"
            class="form-input"
            placeholder="e.g., University of Science"
            maxlength="200"
            autocomplete="organization"
          />
          <div v-if="institution.length >= 180" class="field-warning">
            {{ institution.length }}/200 characters
          </div>
        </div>

        <div class="form-group">
          <label for="research_area" class="form-label">Research Area</label>
          <input
            id="research_area"
            name="research_area"
            v-model="researchArea"
            type="text"
            class="form-input"
            placeholder="e.g., Computational Biology, Materials Science"
            maxlength="200"
          />
          <div v-if="researchArea.length >= 180" class="field-warning">
            {{ researchArea.length }}/200 characters
          </div>
        </div>

        <div class="form-group">
          <label for="interest_level" class="form-label">How ready are you to get started?</label>
          <select
            id="interest_level"
            name="interest_level"
            v-model="interestLevel"
            class="form-select"
          >
            <option value="">Please select</option>
            <option value="exploring">Exploring - Just looking around</option>
            <option value="planning">Planning - Considering for future use</option>
            <option value="ready">Ready - Want to start using soon</option>
            <option value="migrating">Migrating - Moving from another platform</option>
          </select>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <button type="submit" class="btn btn-primary signup-button" :disabled="isLoading">
          <span v-if="isLoading">Signing Up...</span>
          <span v-else>Sign Up for Early Access</span>
        </button>
      </form>

      <p class="form-footer-text">
        We respect your privacy. Read our
        <a href="/privacy" class="text-link">Privacy Policy</a>.
      </p>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { signupUser } from "../composables/useApi.js";

  // Form fields
  const email = ref("");
  const name = ref("");
  const institution = ref("");
  const researchArea = ref("");
  const interestLevel = ref("");

  // UI state
  const isLoading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");

  const handleSignup = async () => {
    // Reset messages
    errorMessage.value = "";
    successMessage.value = "";

    // Basic client-side validation
    if (!email.value) {
      errorMessage.value = "Please enter your email address.";
      return;
    }
    if (!name.value || name.value.trim().length === 0) {
      errorMessage.value = "Please enter your name.";
      return;
    }
    if (name.value.length > 100) {
      errorMessage.value = "Name must be 100 characters or less.";
      return;
    }
    if (institution.value && institution.value.length > 200) {
      errorMessage.value = "Institution must be 200 characters or less.";
      return;
    }
    if (researchArea.value && researchArea.value.length > 200) {
      errorMessage.value = "Research area must be 200 characters or less.";
      return;
    }

    isLoading.value = true;

    try {
      // Prepare signup data
      const signupData = {
        email: email.value,
        name: name.value.trim(),
        institution: institution.value.trim() || null,
        research_area: researchArea.value.trim() || null,
        interest_level: interestLevel.value || null,
      };

      // Call API service
      await signupUser(signupData);
      
      // Success - clear form and show message
      successMessage.value = "Successfully signed up for early access! We'll notify you when Aris is ready.";
      email.value = "";
      name.value = "";
      institution.value = "";
      researchArea.value = "";
      interestLevel.value = "";
      
    } catch (error) {
      console.error("Signup error:", error);
      
      // Handle API errors
      if (error.error === 'duplicate_email') {
        errorMessage.value = "This email address is already registered for early access.";
      } else if (error.error === 'network_error') {
        errorMessage.value = "Unable to connect to server. Please check your internet connection.";
      } else if (error.message) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = "An unexpected error occurred. Please try again later.";
      }
    } finally {
      isLoading.value = false;
    }
  };
</script>

<style scoped>
  .signup-page {
    display: flex;
    justify-content: center;
    align-items: center;
    /* Min-height calculated to fill space below navbar and above footer */
    min-height: calc(100vh - 64px - 80px);
    padding: 40px 20px;
    background-color: var(--surface-bg); /* Light background for the page */
    font-family: "Source Sans 3", sans-serif;
  }

  .signup-container {
    background-color: var(--surface-page); /* White background for the form container */
    padding: 40px;
    border-radius: 12px;
    box-shadow: var(--shadow-medium); /* Medium shadow for depth */
    width: 100%;
    max-width: 600px; /* Increased max width for the form */
    text-align: center;
  }

  .signup-title {
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 15px;
  }

  .signup-subtitle {
    font-size: 18px;
    color: var(--gray-600);
    margin-bottom: 30px;
  }

  .signup-form {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Space between form groups */
    text-align: left; /* Align form elements left within the form */
    align-items: stretch;
  }

  .form-group {
    margin-bottom: 0; /* Already handled by gap in form */
    display: flex;
    flex-direction: column;
  }

  .form-label {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-700);
    margin-bottom: 8px;
    text-align: left;
  }

  .form-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    font-size: 17px;
    color: var(--gray-900);
    background-color: var(--white);
    box-sizing: border-box;
    transition:
      border-color 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
  }

  .form-input::placeholder {
    color: var(--gray-400);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.2); /* Light primary glow */
  }

  .error-message {
    color: var(--red-500);
    font-size: 15px;
    margin-top: -10px; /* Pull it closer to the form */
    text-align: center;
  }

  .success-message {
    color: var(--green-500);
    font-size: 15px;
    margin-top: -10px;
    text-align: center;
  }

  .signup-button {
    width: 100%; /* Full width button */
    padding: 14px 20px;
    font-size: 18px;
    font-weight: 700;
    margin-top: 10px; /* Space above button */
    cursor: pointer;
  }

  .signup-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Reusing general button styles from Navbar for consistency */
  .btn {
    border-radius: 8px;
    text-decoration: none;
    transition:
      background-color 0.2s ease-in-out,
      color 0.2s ease-in-out,
      border-color 0.2s ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn-primary {
    background-color: var(--primary-500);
    color: var(--white);
    border: 1px solid var(--primary-500);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--primary-600);
    border-color: var(--primary-600);
  }

  .form-footer-text {
    font-size: 16px;
    color: var(--gray-600);
    margin-top: 25px; /* Space above footer links */
  }

  .text-link {
    color: var(--primary-500);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease-in-out;
  }

  .text-link:hover {
    color: var(--primary-600);
    text-decoration: underline;
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 600px) {
    .signup-page {
      padding: 30px 16px;
    }

    .signup-container {
      padding: 30px 20px;
    }

    .signup-title {
      font-size: 28px;
    }

    .signup-subtitle {
      font-size: 16px;
      margin-bottom: 25px;
    }

    .form-label {
      font-size: 15px;
    }

    .form-input {
      font-size: 16px;
      padding: 10px 12px;
    }

    .signup-button {
      font-size: 16px;
      padding: 12px 18px;
    }

    .form-footer-text {
      font-size: 14px;
      margin-top: 20px;
    }
  }

  /* Field warning for character limits */
  .field-warning {
    font-size: 12px;
    color: var(--orange-600);
    margin-top: 4px;
    text-align: right;
  }

  /* Select dropdown */
  .form-select {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    font-size: 17px;
    color: var(--gray-900);
    background-color: var(--white);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 12px center;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    appearance: none;
    box-sizing: border-box;
    transition:
      border-color 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
  }

  .form-select:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.2);
  }

  @media (max-width: 600px) {
    .field-warning {
      font-size: 11px;
    }

    .form-select {
      font-size: 16px;
      padding: 10px 12px;
    }
  }
</style>
