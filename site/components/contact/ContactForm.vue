<template>
  <section id="contact-form" class="contact-form-section" aria-labelledby="contact-form-heading">
    <div class="contact-form-content-wrapper">
      <div class="section-header">
        <h2 id="contact-form-heading" class="section-title">Send Us a Message</h2>
        <p class="section-subtitle">
          Whether you have questions about features, need technical support, or want to discuss
          institutional adoption, we're here to help.
        </p>
      </div>

      <div class="form-container">
        <div class="form-content">
          <form class="contact-form" @submit.prevent="submitForm">
            <div class="form-row">
              <div class="form-group">
                <label for="name" class="form-label">Full Name *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  required
                  placeholder="Your full name"
                />
              </div>
              <div class="form-group">
                <label for="email" class="form-label">Email Address *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  required
                  placeholder="your.email@university.edu"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="role" class="form-label">Your Role</label>
                <select id="role" v-model="form.role" class="form-select">
                  <option value="">Select your role</option>
                  <option value="researcher">Researcher/Postdoc</option>
                  <option value="faculty">Faculty/Professor</option>
                  <option value="graduate-student">Graduate Student</option>
                  <option value="it-admin">IT Administrator</option>
                  <option value="librarian">Librarian</option>
                  <option value="administrator">Academic Administrator</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label for="institution" class="form-label">Institution/Organization</label>
                <input
                  id="institution"
                  v-model="form.institution"
                  type="text"
                  class="form-input"
                  placeholder="University or organization name"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="inquiry-type" class="form-label">Type of Inquiry *</label>
              <select id="inquiry-type" v-model="form.inquiryType" class="form-select" required>
                <option value="">Select inquiry type</option>
                <option value="general">General Questions</option>
                <option value="technical">Technical Support</option>
                <option value="institutional">Institutional Adoption</option>
                <option value="feature">Feature Request</option>
                <option value="partnership">Partnership/Collaboration</option>
                <option value="press">Press/Media</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="subject" class="form-label">Subject *</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                class="form-input"
                required
                placeholder="Brief description of your inquiry"
              />
            </div>

            <div class="form-group">
              <label for="message" class="form-label">Message *</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form-textarea"
                rows="6"
                required
                placeholder="Please provide details about your question or request..."
              ></textarea>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="form.updates" type="checkbox" class="checkbox-input" />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  I'd like to receive updates about Aris development and community events
                </span>
              </label>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
                :class="{ submitting: isSubmitting }"
              >
                <IconLoader v-if="isSubmitting" :size="16" class="spinner" />
                <IconSend v-else :size="16" />
                <span>{{ isSubmitting ? "Sending..." : "Send Message" }}</span>
              </button>
              <p class="form-note">
                <IconShield :size="14" />
                Your information is secure and will never be shared with third parties.
              </p>
            </div>
          </form>
        </div>

        <div class="form-sidebar">
          <div class="response-info">
            <div class="info-item">
              <div class="info-icon">
                <IconClock :size="24" />
              </div>
              <div class="info-content">
                <h4 class="info-title">Response Time</h4>
                <p class="info-text">We typically respond within 24 hours during business days</p>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">
                <IconCalendar :size="24" />
              </div>
              <div class="info-content">
                <h4 class="info-title">Office Hours</h4>
                <p class="info-text">
                  Weekly office hours available for institutional consultations
                </p>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">
                <IconHeart :size="24" />
              </div>
              <div class="info-content">
                <h4 class="info-title">Community First</h4>
                <p class="info-text">Open source project with community-driven development</p>
              </div>
            </div>
          </div>

          <div class="alternative-contacts">
            <h4 class="alternatives-title">Prefer Other Channels?</h4>
            <div class="alternative-item">
              <IconMail :size="16" />
              <div class="alternative-content">
                <span class="alternative-label">General Inquiries</span>
                <span class="alternative-value">hello@aris-platform.org</span>
              </div>
            </div>
            <div class="alternative-item">
              <IconMessage :size="16" />
              <div class="alternative-content">
                <span class="alternative-label">Community Forum</span>
                <a href="https://forum.aris-platform.org" class="alternative-link"
                  >Join Discussion</a
                >
              </div>
            </div>
            <div class="alternative-item">
              <IconBrandGithub :size="16" />
              <div class="alternative-content">
                <span class="alternative-label">GitHub Issues</span>
                <a
                  href="https://github.com/aris-platform/aris/discussions"
                  class="alternative-link"
                >
                  Report Issues
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref } from "vue";
  import {
    IconSend,
    IconLoader,
    IconShield,
    IconClock,
    IconCalendar,
    IconHeart,
    IconMail,
    IconMessage,
    IconBrandGithub,
  } from "@tabler/icons-vue";

  const form = ref({
    name: "",
    email: "",
    role: "",
    institution: "",
    inquiryType: "",
    subject: "",
    message: "",
    updates: false,
  });

  const isSubmitting = ref(false);

  const submitForm = async () => {
    isSubmitting.value = true;

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would send the form data to your backend
      console.log("Form submitted:", form.value);

      // Reset form or show success message
      alert("Thank you for your message! We'll get back to you within 24 hours.");

      // Reset form
      form.value = {
        name: "",
        email: "",
        role: "",
        institution: "",
        inquiryType: "",
        subject: "",
        message: "",
        updates: false,
      };
    } catch (error) {
      console.error("Form submission error:", error);
      alert("There was an error sending your message. Please try again or email us directly.");
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<style scoped>
  /* Contact Form Section */
  .contact-form-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .contact-form-content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(28px, 6vw, 36px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.2;
  }

  .section-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: var(--gray-700);
  }

  /* Form Container */
  .form-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-4xl);
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Contact Form */
  .contact-form {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
    margin-bottom: var(--space-lg);
  }

  .form-group {
    margin-bottom: var(--space-lg);
  }

  .form-label {
    display: block;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: var(--space-md);
    border: 2px solid var(--border-primary);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    color: var(--gray-900);
    background: var(--surface-page);
    transition: all 0.2s ease;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-input::placeholder,
  .form-textarea::placeholder {
    color: var(--gray-500);
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }

  /* Checkbox */
  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
    cursor: pointer;
  }

  .checkbox-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .checkbox-custom {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-primary);
    border-radius: 4px;
    background: var(--surface-page);
    position: relative;
    flex-shrink: 0;
    margin-top: 2px;
    transition: all 0.2s ease;
  }

  .checkbox-input:checked + .checkbox-custom {
    background: var(--primary-500);
    border-color: var(--primary-500);
  }

  .checkbox-input:checked + .checkbox-custom::after {
    content: "";
    position: absolute;
    top: 1px;
    left: 5px;
    width: 4px;
    height: 8px;
    border: solid var(--white);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .checkbox-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    line-height: 1.4;
  }

  /* Form Actions */
  .form-actions {
    text-align: center;
    margin-top: var(--space-xl);
  }

  .btn {
    padding: var(--space-md) var(--space-2xl);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    min-width: 180px;
    justify-content: center;
  }

  .btn-primary {
    background: var(--primary-500);
    color: var(--white);
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--primary-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
  }

  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .form-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
    margin-top: var(--space-md);
  }

  .form-note svg {
    color: var(--success-600);
  }

  /* Form Sidebar */
  .form-sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
  }

  .response-info {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-xl);
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .info-item:last-child {
    margin-bottom: 0;
  }

  .info-icon {
    width: 48px;
    height: 48px;
    background: var(--primary-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .info-content {
    flex: 1;
  }

  .info-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .info-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  /* Alternative Contacts */
  .alternative-contacts {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-xl);
  }

  .alternatives-title {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
  }

  .alternative-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
  }

  .alternative-item:last-child {
    margin-bottom: 0;
  }

  .alternative-item svg {
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .alternative-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  .alternative-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .alternative-value {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .alternative-link {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-600);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .alternative-link:hover {
    color: var(--primary-700);
    text-decoration: underline;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .contact-form-section {
      padding: var(--space-3xl) 0;
    }

    .form-container {
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .contact-form {
      padding: var(--space-xl);
    }

    .response-info,
    .alternative-contacts {
      padding: var(--space-lg);
    }

    .info-item {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }

    .info-icon {
      width: 40px;
      height: 40px;
    }
  }

  @media (max-width: 480px) {
    .contact-form {
      padding: var(--space-lg);
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: var(--space-sm);
    }

    .btn {
      width: 100%;
      min-width: auto;
    }

    .alternative-item {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }
  }
</style>
