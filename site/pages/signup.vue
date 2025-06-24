<template>
  <div class="waitlist-page">
    <div class="waitlist-container">
      <h1 class="waitlist-title">Join the Aris Waitlist</h1>
      <p class="waitlist-subtitle">
        Be among the first to experience the future of Research Operations with AI.
      </p>

      <form class="waitlist-form" @submit.prevent="handleWaitlistSignup">
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
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
          <label for="name" class="form-label">Your Name (Optional)</label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="form-input"
            placeholder="e.g., Jane Doe"
            autocomplete="name"
          />
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <button type="submit" class="btn btn-primary waitlist-button" :disabled="isLoading">
          <span v-if="isLoading">Joining Waitlist...</span>
          <span v-else>Join the Waitlist</span>
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

  // Form fields
  const email = ref("");
  const name = ref("");

  // UI state
  const isLoading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");

  const handleWaitlistSignup = async () => {
    // Reset messages
    errorMessage.value = "";
    successMessage.value = "";

    // Basic client-side validation
    if (!email.value) {
      errorMessage.value = "Please enter your email address.";
      return;
    }

    isLoading.value = true;

    try {
      // --- Here you would integrate with your backend API to add to waitlist ---
      // Example: Using fetch or an API client (e.g., axios)
      // const response = await fetch('/api/waitlist-signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: email.value,
      //     name: name.value, // Send name if provided
      //   }),
      // });

      // const data = await response.json();

      // if (response.ok) {
      //   successMessage.value = 'Thanks for joining! We\'ll notify you when Aris is ready.';
      //   // You might want to redirect to a 'Thank You' page
      //   // navigateTo('/waitlist-thanks');
      // } else {
      //   errorMessage.value = data.message || 'Failed to join waitlist. Please try again.';
      // }

      // --- Simulation of a successful waitlist signup for demonstration ---
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call delay

      // Simulate different responses based on email
      if (email.value === "test@example.com") {
        // Example for already on waitlist
        errorMessage.value = "You are already on the waitlist!";
      } else {
        successMessage.value = "Thanks for joining! We'll notify you when Aris is ready.";
        console.log("Waitlist signup successful:", { email: email.value, name: name.value });
        email.value = ""; // Clear form fields on success
        name.value = "";
      }
    } catch (error) {
      console.error("Waitlist signup error:", error);
      errorMessage.value = "An unexpected error occurred. Please try again later.";
    } finally {
      isLoading.value = false;
    }
  };
</script>

<style scoped>
  .waitlist-page {
    display: flex;
    justify-content: center;
    align-items: center;
    /* Min-height calculated to fill space below navbar and above footer */
    min-height: calc(100vh - 64px - 80px);
    padding: 40px var(--side-padding, 24px);
    background-color: var(--surface-bg); /* Light background for the page */
    font-family: "Source Sans 3", sans-serif;
  }

  .waitlist-container {
    background-color: var(--surface-page); /* White background for the form container */
    padding: 40px;
    border-radius: 12px;
    box-shadow: var(--shadow-medium); /* Medium shadow for depth */
    width: 100%;
    max-width: 450px; /* Max width for the form */
    text-align: center;
  }

  .waitlist-title {
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 15px;
  }

  .waitlist-subtitle {
    font-size: 18px;
    color: var(--gray-600);
    margin-bottom: 30px;
  }

  .waitlist-form {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Space between form groups */
    text-align: left; /* Align form elements left within the form */
  }

  .form-group {
    margin-bottom: 0; /* Already handled by gap in form */
  }

  .form-label {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-700);
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    font-size: 17px;
    color: var(--gray-900);
    background-color: var(--white);
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

  .waitlist-button {
    width: 100%; /* Full width button */
    padding: 14px 20px;
    font-size: 18px;
    font-weight: 700;
    margin-top: 10px; /* Space above button */
    cursor: pointer;
  }

  .waitlist-button:disabled {
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
    .waitlist-page {
      padding: 30px var(--side-padding-mobile, 16px);
    }

    .waitlist-container {
      padding: 30px 20px;
    }

    .waitlist-title {
      font-size: 28px;
    }

    .waitlist-subtitle {
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

    .waitlist-button {
      font-size: 16px;
      padding: 12px 18px;
    }

    .form-footer-text {
      font-size: 14px;
      margin-top: 20px;
    }
  }
</style>
