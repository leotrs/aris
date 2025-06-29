<template>
  <section class="next-steps-section" aria-labelledby="next-steps-heading">
    <div class="next-steps-content-wrapper">
      <div class="section-header">
        <h2 id="next-steps-heading" class="section-title">Your Next Steps</h2>
        <p class="section-subtitle">
          Ready to transform your research workflow? Choose your path and get started with the
          academic publishing platform built for the modern web.
        </p>
      </div>

      <div class="steps-grid">
        <div class="step-card primary">
          <div class="step-header">
            <div class="step-number">1</div>
            <h3 class="step-title">Sign Up & Get Started</h3>
          </div>
          <div class="step-content">
            <p class="step-description">
              Create your free account and join thousands of researchers already using Aris to
              transform their publishing workflow.
            </p>
            <div class="step-features">
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Free forever for individual researchers</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>No credit card required</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Access to all core features</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Complete data export anytime</span>
              </div>
            </div>
          </div>
          <div class="step-cta">
            <a href="/signup" class="btn btn-primary btn-large">
              <IconRocket :size="18" />
              <span>Create Free Account</span>
            </a>
          </div>
        </div>

        <div class="step-card">
          <div class="step-header">
            <div class="step-number">2</div>
            <h3 class="step-title">Explore & Learn</h3>
          </div>
          <div class="step-content">
            <p class="step-description">
              Take your time to explore the platform. Our comprehensive resources will help you
              master ResOps and maximize your productivity.
            </p>
            <div class="resource-links">
              <a href="/documentation" class="resource-link">
                <IconBook :size="16" />
                <span>Documentation</span>
              </a>
              <a href="/demo" class="resource-link">
                <IconPlayerPlay :size="16" />
                <span>Interactive Demos</span>
              </a>
              <a href="/blog" class="resource-link">
                <IconFileText :size="16" />
                <span>ResOps Blog</span>
              </a>
              <a href="/community" class="resource-link">
                <IconUsers :size="16" />
                <span>Community Forum</span>
              </a>
            </div>
          </div>
          <div class="step-cta">
            <a href="/documentation" class="btn btn-secondary">
              <IconBook :size="16" />
              <span>Start Learning</span>
            </a>
          </div>
        </div>

        <div class="step-card">
          <div class="step-header">
            <div class="step-number">3</div>
            <h3 class="step-title">Join the Community</h3>
          </div>
          <div class="step-content">
            <p class="step-description">
              Connect with fellow researchers, contribute to the platform, and help shape the future
              of academic publishing.
            </p>
            <div class="community-links">
              <a href="https://github.com/aris-platform" class="community-link">
                <IconBrandGithub :size="16" />
                <span>Contribute on GitHub</span>
              </a>
              <a href="/open-science" class="community-link">
                <IconHeart :size="16" />
                <span>Our Open Science Values</span>
              </a>
              <a href="/contact" class="community-link">
                <IconMail :size="16" />
                <span>Get in Touch</span>
              </a>
            </div>
          </div>
          <div class="step-cta">
            <a href="https://github.com/aris-platform" class="btn btn-secondary">
              <IconBrandGithub :size="16" />
              <span>Join on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div class="support-section">
        <div class="support-content">
          <h3 class="support-title">Need Help Getting Started?</h3>
          <p class="support-description">
            Our team is here to help you succeed. Whether you're an individual researcher or
            representing an institution, we're committed to your success.
          </p>
          <div class="support-options">
            <div class="support-option">
              <div class="support-icon">
                <IconMail :size="24" />
              </div>
              <div class="support-info">
                <h4 class="support-option-title">Email Support</h4>
                <p class="support-option-description">Get help via email within 24 hours</p>
                <a href="mailto:support@aris.com" class="support-link">support@aris.com</a>
              </div>
            </div>
            <div class="support-option">
              <div class="support-icon">
                <IconCalendar :size="24" />
              </div>
              <div class="support-info">
                <h4 class="support-option-title">1-on-1 Consultation</h4>
                <p class="support-option-description">Schedule a personal demo for institutions</p>
                <a href="/contact?type=consultation" class="support-link">Schedule Call</a>
              </div>
            </div>
            <div class="support-option">
              <div class="support-icon">
                <IconMessageCircle :size="24" />
              </div>
              <div class="support-info">
                <h4 class="support-option-title">Community Forum</h4>
                <p class="support-option-description">Get help from fellow researchers</p>
                <a href="/community" class="support-link">Join Discussion</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="final-cta">
        <div class="cta-content">
          <h3 class="cta-title">Ready to Transform Your Research Workflow?</h3>
          <p class="cta-description">
            Join the researchers who've already discovered the power of integrated ResOps. Your next
            breakthrough is waiting.
          </p>
          <div class="cta-buttons">
            <a href="/signup?source=getting-started" class="btn btn-primary btn-xlarge">
              <IconRocket :size="20" />
              <span>Start Your Free Account</span>
            </a>
            <a href="/contact?type=institution" class="btn btn-secondary btn-xlarge">
              <IconBuilding :size="20" />
              <span>Institutional Setup</span>
            </a>
          </div>
          <div class="cta-note">
            <IconInfoCircle :size="16" />
            <span>100% open source • Free forever for individuals • No vendor lock-in</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconCheck,
    IconRocket,
    IconBook,
    IconPlayerPlay,
    IconFileText,
    IconUsers,
    IconBrandGithub,
    IconHeart,
    IconMail,
    IconCalendar,
    IconMessageCircle,
    IconBuilding,
    IconInfoCircle,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Next Steps Section */
  .next-steps-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--primary-25) 100%);
    padding: var(--space-4xl) 0;
  }

  .next-steps-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 700px;
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

  /* Steps Grid */
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .step-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 400px;
  }

  .step-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .step-card.primary {
    border: 2px solid var(--success-300);
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
  }

  /* Step Header */
  .step-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .step-number {
    width: 48px;
    height: 48px;
    background: var(--primary-500);
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 20px;
    flex-shrink: 0;
  }

  .step-card.primary .step-number {
    background: var(--success-500);
  }

  .step-title {
    font-family: "Montserrat", sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gray-900);
    line-height: 1.3;
  }

  /* Step Content */
  .step-content {
    flex: 1;
    margin-bottom: var(--space-lg);
  }

  .step-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  .step-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .feature-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  .resource-links,
  .community-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .resource-link,
  .community-link {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .resource-link:hover,
  .community-link:hover {
    background: var(--gray-100);
    transform: translateX(2px);
  }

  .resource-link svg,
  .community-link svg {
    color: var(--primary-500);
    flex-shrink: 0;
  }

  /* Step CTA */
  .step-cta {
    text-align: center;
  }

  .btn {
    padding: var(--space-md) var(--space-xl);
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
    background: var(--success-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--success-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.35);
  }

  .btn-secondary {
    background: var(--gray-100);
    color: var(--gray-700);
    border: 1px solid var(--gray-300);
  }

  .btn-secondary:hover {
    background: var(--gray-200);
    transform: translateY(-2px);
  }

  .btn-large {
    padding: var(--space-lg) var(--space-2xl);
    font-size: 18px;
    min-width: 220px;
  }

  .btn-xlarge {
    padding: var(--space-xl) var(--space-3xl);
    font-size: 18px;
    min-width: 250px;
  }

  /* Support Section */
  .support-section {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .support-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .support-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .support-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .support-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
  }

  .support-option {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--gray-25);
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    text-align: left;
  }

  .support-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .support-info {
    flex: 1;
  }

  .support-option-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .support-option-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-700);
    margin-bottom: var(--space-xs);
  }

  .support-link {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--primary-600);
    text-decoration: none;
    font-weight: 600;
  }

  .support-link:hover {
    color: var(--primary-700);
    text-decoration: underline;
  }

  /* Final CTA */
  .final-cta {
    background: linear-gradient(135deg, var(--success-50), var(--success-100));
    border: 2px solid var(--success-300);
    border-radius: 20px;
    padding: var(--space-3xl);
    text-align: center;
  }

  .cta-content {
    max-width: 700px;
    margin: 0 auto;
  }

  .cta-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(24px, 5vw, 32px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.2;
  }

  .cta-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .cta-buttons {
    display: flex;
    gap: var(--space-lg);
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: var(--space-lg);
  }

  .cta-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-600);
    font-style: italic;
  }

  .cta-note svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .next-steps-section {
      padding: var(--space-3xl) 0;
    }

    .steps-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .step-card {
      padding: var(--space-xl);
      min-height: auto;
    }

    .support-section {
      padding: var(--space-xl);
    }

    .support-options {
      grid-template-columns: 1fr;
    }

    .support-option {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }

    .final-cta {
      padding: var(--space-2xl);
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .btn-xlarge {
      width: 100%;
      max-width: 280px;
    }

    .cta-note {
      flex-direction: column;
      text-align: center;
      gap: var(--space-xs);
    }
  }

  @media (max-width: 480px) {
    .step-card {
      padding: var(--space-lg);
    }

    .step-header {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }

    .step-number {
      width: 40px;
      height: 40px;
      font-size: 18px;
    }

    .step-title {
      font-size: 20px;
    }

    .support-section {
      padding: var(--space-lg);
    }

    .support-title {
      font-size: 24px;
    }

    .final-cta {
      padding: var(--space-xl);
    }

    .btn-xlarge {
      padding: var(--space-lg) var(--space-xl);
      font-size: 16px;
    }
  }
</style>
