<template>
  <section id="faq-contact" class="faq-contact-section" aria-labelledby="faq-contact-heading">
    <div class="contact-content-wrapper">
      <div class="contact-header">
        <h2 id="faq-contact-heading" class="contact-title">Still Have Questions?</h2>
        <p class="contact-subtitle">
          Our team is here to help. Get personalized answers from the people building Aris.
        </p>
      </div>

      <div class="contact-options">
        <div class="contact-card">
          <div class="card-icon">
            <IconMail :size="32" />
          </div>
          <h3 class="card-title">Email Support</h3>
          <p class="card-description">
            Get detailed answers to technical questions, implementation guidance, and platform
            support.
          </p>
          <a href="mailto:support@aris-platform.org" class="contact-btn">
            <IconSend :size="16" />
            support@aris-platform.org
          </a>
        </div>

        <div class="contact-card">
          <div class="card-icon">
            <IconCalendar :size="32" />
          </div>
          <h3 class="card-title">Schedule a Demo</h3>
          <p class="card-description">
            See Aris in action with a personalized demo tailored to your research needs.
          </p>
          <a href="/demo" class="contact-btn">
            <IconVideo :size="16" />
            Book Demo Call
          </a>
        </div>

        <div class="contact-card">
          <div class="card-icon">
            <IconUsers :size="32" />
          </div>
          <h3 class="card-title">Community Forum</h3>
          <p class="card-description">
            Join discussions with other researchers using Aris and share your experiences.
          </p>
          <a href="https://github.com/aris-platform/discussions" class="contact-btn">
            <IconMessageCircle :size="16" />
            Join Discussions
          </a>
        </div>
      </div>

      <div class="additional-resources">
        <div class="resources-content">
          <h3 class="resources-title">Additional Resources</h3>
          <div class="resources-grid">
            <a href="/getting-started" class="resource-link">
              <IconRocket :size="20" />
              <span>Getting Started Guide</span>
            </a>
            <a href="/docs" class="resource-link">
              <IconBook :size="20" />
              <span>Documentation</span>
            </a>
            <a href="/api" class="resource-link">
              <IconCode :size="20" />
              <span>API Reference</span>
            </a>
            <a href="/security" class="resource-link">
              <IconShield :size="20" />
              <span>Security & Privacy</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconMail,
    IconCalendar,
    IconUsers,
    IconSend,
    IconVideo,
    IconMessageCircle,
    IconRocket,
    IconBook,
    IconCode,
    IconShield,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  .faq-contact-section {
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    padding: var(--space-4xl) 0;
  }

  .contact-content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  .contact-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
  }

  .contact-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(28px, 6vw, 36px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.2;
  }

  .contact-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: var(--gray-700);
    max-width: 600px;
    margin: 0 auto;
  }

  .contact-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .contact-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-2xl);
    text-align: center;
    transition: all 0.3s ease;
  }

  .contact-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--primary-600);
  }

  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .contact-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-xl);
    background: var(--primary-500);
    color: var(--white);
    text-decoration: none;
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.2s ease;
  }

  .contact-btn:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 154, 233, 0.35);
  }

  .additional-resources {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .resources-content {
    text-align: center;
  }

  .resources-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xl);
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-lg);
  }

  .resource-link {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    text-decoration: none;
    color: var(--gray-700);
    font-family: "Source Sans 3", sans-serif;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s ease;
    justify-content: center;
  }

  .resource-link:hover {
    background: var(--primary-50);
    border-color: var(--primary-300);
    color: var(--primary-700);
    transform: translateY(-2px);
  }

  .resource-link svg {
    color: var(--primary-600);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .faq-contact-section {
      padding: var(--space-3xl) 0;
    }

    .contact-options {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .contact-card {
      padding: var(--space-xl);
    }

    .additional-resources {
      padding: var(--space-xl);
    }

    .resources-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .contact-card {
      padding: var(--space-lg);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .card-title {
      font-size: 18px;
    }
  }
</style>
