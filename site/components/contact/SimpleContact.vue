<template>
  <section class="contact-section">
    <div class="contact-wrapper">
      <div class="contact-header">
        <h1 class="contact-title">Contact Us</h1>
        <p class="contact-subtitle">Get in touch with the Aris team</p>
      </div>

      <div class="contact-content">
        <div class="contact-form-container">
          <form class="contact-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name" class="form-label">Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="subject" class="form-label">Subject</label>
              <select id="subject" v-model="form.subject" class="form-input" required>
                <option value="">Select a subject</option>
                <option value="general">General inquiry</option>
                <option value="institution">Institutional setup</option>
                <option value="demo">Schedule demo</option>
                <option value="security">Security questions</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message" class="form-label">Message</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form-textarea"
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <IconSend :size="16" />
              <span v-if="isSubmitting">Sending...</span>
              <span v-else>Send Message</span>
            </button>
          </form>
        </div>

        <div class="contact-info">
          <h3 class="info-title">Quick Links</h3>
          
          <div class="contact-links">
            <a href="mailto:hello@aris-platform.org" class="contact-link">
              <IconMail :size="20" />
              <span>hello@aris-platform.org</span>
            </a>

            <a href="mailto:security@aris-platform.org" class="contact-link">
              <IconShield :size="20" />
              <span>security@aris-platform.org</span>
            </a>

            <a href="https://github.com/aris-platform" class="contact-link" target="_blank">
              <IconBrandGithub :size="20" />
              <span>GitHub</span>
            </a>

            <a href="/demo" class="contact-link">
              <IconVideo :size="20" />
              <span>Schedule Demo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref } from 'vue';
  import {
    IconSend,
    IconMail,
    IconShield,
    IconBrandGithub,
    IconVideo,
  } from "@tabler/icons-vue";

  const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const isSubmitting = ref(false);

  const submitForm = async () => {
    isSubmitting.value = true;
    
    // Simple form submission (replace with actual implementation)
    try {
      console.log('Form submitted:', form.value);
      // Add actual form submission logic here
      alert('Thank you! We\'ll get back to you soon.');
      
      // Reset form
      form.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    } catch (error) {
      alert('Sorry, there was an error sending your message. Please try emailing us directly.');
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<style scoped>
  .contact-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
    min-height: 70vh;
  }

  .contact-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  .contact-header {
    text-align: center;
    margin-bottom: var(--space-3xl);
  }

  .contact-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(32px, 8vw, 48px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .contact-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    color: var(--gray-700);
  }

  .contact-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-4xl);
    align-items: start;
  }

  /* Form Styles */
  .contact-form-container {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-2xl);
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .form-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .form-input,
  .form-textarea {
    padding: var(--space-md);
    border: 1px solid var(--border-primary);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    background: var(--surface-page);
    transition: border-color 0.2s ease;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--primary-400);
    box-shadow: 0 0 0 3px rgba(14, 154, 233, 0.1);
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }

  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-xl);
    background: var(--primary-500);
    color: var(--white);
    border: none;
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background: var(--primary-600);
    transform: translateY(-2px);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Contact Info */
  .contact-info {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
  }

  .info-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
  }

  .contact-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .contact-link {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    color: var(--gray-700);
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
  }

  .contact-link:hover {
    background: var(--primary-50);
    color: var(--primary-700);
    transform: translateX(4px);
  }

  .contact-link svg {
    color: var(--primary-500);
    flex-shrink: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .contact-section {
      padding: var(--space-3xl) 0;
    }

    .contact-content {
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    .contact-form-container {
      padding: var(--space-xl);
    }

    .contact-info {
      order: -1;
    }
  }

  @media (max-width: 480px) {
    .contact-form-container {
      padding: var(--space-lg);
    }

    .contact-info {
      padding: var(--space-lg);
    }
  }
</style>