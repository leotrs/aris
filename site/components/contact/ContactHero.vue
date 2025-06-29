<template>
  <section class="contact-hero-section" aria-labelledby="contact-hero-heading">
    <div class="hero-content-wrapper">
      <div class="hero-content">
        <h1 id="contact-hero-heading" class="hero-headline">Get Support & Connect</h1>
        <p class="hero-subheadline">
          Our community-driven platform means you're never alone. From quick questions to
          institutional consultations, we're here to support your research publishing journey.
        </p>
        <div class="hero-highlights">
          <div class="highlight-item">
            <IconClock :size="20" />
            <span>24h Response Time</span>
          </div>
          <div class="highlight-item">
            <IconUsers :size="20" />
            <span>Active Community</span>
          </div>
          <div class="highlight-item">
            <IconBook :size="20" />
            <span>Comprehensive Docs</span>
          </div>
          <div class="highlight-item">
            <IconCalendar :size="20" />
            <span>Office Hours Available</span>
          </div>
        </div>
        <div class="hero-cta">
          <a href="#contact-form" class="btn btn-primary">
            <IconMail :size="18" />
            <span>Send Message</span>
          </a>
          <a href="#community-channels" class="btn btn-secondary">
            <IconMessageCircle :size="18" />
            <span>Join Discussion</span>
          </a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="support-diagram">
          <div class="central-hub">
            <div class="hub-icon">
              <IconHeart :size="32" />
            </div>
            <div class="hub-label">Community Support</div>
          </div>
          <div class="support-channels">
            <div class="channel-item email">
              <div class="channel-icon">
                <IconMail :size="24" />
              </div>
              <div class="channel-label">Direct Support</div>
            </div>
            <div class="channel-item forum">
              <div class="channel-icon">
                <IconMessageSquare :size="24" />
              </div>
              <div class="channel-label">Community Forum</div>
            </div>
            <div class="channel-item docs">
              <div class="channel-icon">
                <IconBook :size="24" />
              </div>
              <div class="channel-label">Documentation</div>
            </div>
            <div class="channel-item github">
              <div class="channel-icon">
                <IconBrandGithub :size="24" />
              </div>
              <div class="channel-label">GitHub</div>
            </div>
          </div>
          <div class="connection-lines">
            <div class="line line-1"></div>
            <div class="line line-2"></div>
            <div class="line line-3"></div>
            <div class="line line-4"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconClock,
    IconUsers,
    IconBook,
    IconCalendar,
    IconMail,
    IconMessageCircle,
    IconHeart,
    IconMessageSquare,
    IconBrandGithub,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Contact Hero Section */
  .contact-hero-section {
    background: linear-gradient(135deg, var(--primary-25) 0%, var(--gray-25) 100%);
    padding: var(--space-4xl) 0;
    min-height: 70vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .hero-content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: var(--space-4xl);
  }

  /* Hero Content */
  .hero-content {
    flex: 1;
    max-width: 600px;
  }

  .hero-headline {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(32px, 8vw, 52px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.1;
  }

  .hero-subheadline {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 20px);
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  /* Hero Highlights */
  .hero-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
  }

  .highlight-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    background: var(--surface-page);
    border: 1px solid var(--primary-200);
    border-radius: 20px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-700);
    box-shadow: var(--shadow-soft);
  }

  .highlight-item svg {
    color: var(--primary-600);
    flex-shrink: 0;
  }

  /* Hero CTA */
  .hero-cta {
    display: flex;
    gap: var(--space-lg);
    flex-wrap: wrap;
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
    background: var(--primary-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
  }

  .btn-secondary {
    background: var(--white);
    color: var(--primary-600);
    border: 2px solid var(--primary-300);
  }

  .btn-secondary:hover {
    background: var(--primary-50);
    border-color: var(--primary-400);
    transform: translateY(-2px);
  }

  /* Hero Visual */
  .hero-visual {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 500px;
  }

  .support-diagram {
    position: relative;
    width: 400px;
    height: 400px;
  }

  .central-hub {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border: 3px solid var(--primary-400);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    color: var(--primary-700);
    z-index: 5;
    box-shadow: var(--shadow-medium);
  }

  .hub-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hub-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    color: var(--primary-700);
  }

  .support-channels {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .channel-item {
    position: absolute;
    width: 80px;
    height: 80px;
    background: var(--surface-page);
    border: 2px solid var(--border-primary);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
  }

  .channel-item:hover {
    transform: scale(1.05);
    border-color: var(--primary-300);
  }

  .channel-item.email {
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .channel-item.forum {
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .channel-item.docs {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .channel-item.github {
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
  }

  .channel-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
  }

  .channel-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 9px;
    font-weight: 600;
    text-align: center;
    color: var(--gray-700);
  }

  .connection-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .line {
    position: absolute;
    background: linear-gradient(45deg, var(--primary-200), var(--primary-300));
    opacity: 0.6;
    animation: pulse-line 3s ease-in-out infinite;
  }

  .line-1 {
    width: 2px;
    height: 80px;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 0s;
  }

  .line-2 {
    width: 80px;
    height: 2px;
    top: 50%;
    right: 80px;
    transform: translateY(-50%);
    animation-delay: 0.75s;
  }

  .line-3 {
    width: 2px;
    height: 80px;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 1.5s;
  }

  .line-4 {
    width: 80px;
    height: 2px;
    top: 50%;
    left: 80px;
    transform: translateY(-50%);
    animation-delay: 2.25s;
  }

  @keyframes pulse-line {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .contact-hero-section {
      padding: var(--space-3xl) 0;
      min-height: 60vh;
    }

    .hero-content-wrapper {
      flex-direction: column;
      gap: var(--space-2xl);
    }

    .hero-content {
      text-align: center;
      max-width: 100%;
    }

    .hero-visual {
      min-height: 350px;
    }

    .support-diagram {
      width: 300px;
      height: 300px;
    }

    .central-hub {
      width: 100px;
      height: 100px;
    }

    .channel-item {
      width: 70px;
      height: 70px;
    }

    .channel-item.email {
      top: 15px;
    }

    .channel-item.forum {
      right: 15px;
    }

    .channel-item.docs {
      bottom: 15px;
    }

    .channel-item.github {
      left: 15px;
    }

    .line-1,
    .line-3 {
      height: 70px;
    }

    .line-2,
    .line-4 {
      width: 70px;
    }

    .line-1 {
      top: 70px;
    }

    .line-2 {
      right: 70px;
    }

    .line-3 {
      bottom: 70px;
    }

    .line-4 {
      left: 70px;
    }

    .hero-cta {
      justify-content: center;
    }

    .hero-highlights {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .hero-highlights {
      flex-direction: column;
      align-items: center;
    }

    .highlight-item {
      width: 100%;
      max-width: 250px;
      justify-content: center;
    }

    .hero-cta {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 250px;
    }

    .support-diagram {
      width: 250px;
      height: 250px;
    }

    .central-hub {
      width: 80px;
      height: 80px;
    }

    .hub-icon {
      width: 32px;
      height: 32px;
    }

    .channel-item {
      width: 60px;
      height: 60px;
    }

    .channel-icon {
      width: 24px;
      height: 24px;
    }

    .channel-label {
      font-size: 8px;
    }

    .line-1,
    .line-3 {
      height: 60px;
    }

    .line-2,
    .line-4 {
      width: 60px;
    }

    .line-1 {
      top: 60px;
    }

    .line-2 {
      right: 60px;
    }

    .line-3 {
      bottom: 60px;
    }

    .line-4 {
      left: 60px;
    }
  }
</style>
