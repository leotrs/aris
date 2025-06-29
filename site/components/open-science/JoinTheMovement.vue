<template>
  <section class="join-movement-section" aria-labelledby="join-movement-heading">
    <div class="movement-content-wrapper">
      <div class="section-header">
        <h2 id="join-movement-heading" class="section-title">Join the Open Science Movement</h2>
        <p class="section-subtitle">
          Be part of transforming academic publishing from an extractive industry into a
          community-owned public good. Every contribution matters.
        </p>
      </div>

      <div class="participation-paths">
        <div class="path-card featured">
          <div class="path-icon">
            <IconCode :size="32" />
          </div>
          <h3 class="path-title">Contribute Code</h3>
          <p class="path-description">
            Help build the platform that serves the research community. From bug fixes to new
            features, every contribution makes Aris better for everyone.
          </p>
          <div class="path-actions">
            <a href="https://github.com/aris-platform" class="btn btn-primary">
              <IconBrandGithub :size="16" />
              <span>View on GitHub</span>
            </a>
            <a href="/contributing" class="link">Contributing Guide</a>
          </div>
        </div>

        <div class="path-card">
          <div class="path-icon">
            <IconUsers :size="32" />
          </div>
          <h3 class="path-title">Join the Community</h3>
          <p class="path-description">
            Participate in discussions, propose features, and help shape the future of research
            publishing through active community engagement.
          </p>
          <div class="path-actions">
            <a href="/community" class="btn btn-secondary">Join Discussions</a>
            <a href="/beta-signup" class="link">Beta Access</a>
          </div>
        </div>

        <div class="path-card">
          <div class="path-icon">
            <IconBuilding :size="32" />
          </div>
          <h3 class="path-title">Institutional Partnership</h3>
          <p class="path-description">
            Bring your institution into the movement. Founding institutional members help build
            sustainable infrastructure for the academic community.
          </p>
          <div class="path-actions">
            <a href="/institutions" class="btn btn-secondary">Learn More</a>
            <a href="/contact" class="link">Schedule Discussion</a>
          </div>
        </div>

        <div class="path-card">
          <div class="path-icon">
            <IconMegaphone :size="32" />
          </div>
          <h3 class="path-title">Spread the Word</h3>
          <p class="path-description">
            Help other researchers discover the alternative. Share our mission, explain the
            benefits, and advocate for open science in your community.
          </p>
          <div class="path-actions">
            <a href="/press-kit" class="btn btn-secondary">Press Kit</a>
            <a href="/advocacy" class="link">Advocacy Resources</a>
          </div>
        </div>
      </div>

      <div class="movement-call-to-action">
        <div class="cta-content">
          <h3 class="cta-title">The Future is in Our Hands</h3>
          <p class="cta-description">
            Academic publishing will change. The question is whether researchers will control that
            change or be subject to it. Join us in building the infrastructure the research
            community deserves.
          </p>
          <div class="cta-stats">
            <div class="stat-item">
              <div class="stat-number">100%</div>
              <div class="stat-label">Open Source</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">0%</div>
              <div class="stat-label">Profit Extraction</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">∞</div>
              <div class="stat-label">Community Control</div>
            </div>
          </div>
          <div class="cta-buttons">
            <a href="/beta-signup" class="btn btn-primary btn-large">Join the Beta</a>
            <a href="https://github.com/aris-platform" class="btn btn-secondary btn-large">
              <IconBrandGithub :size="18" />
              <span>Start Contributing</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconCode,
    IconUsers,
    IconBuilding,
    IconMegaphone,
    IconBrandGithub,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  .join-movement-section {
    background: linear-gradient(135deg, var(--success-600) 0%, var(--primary-600) 100%);
    padding: var(--space-4xl) 0;
    color: var(--white);
    position: relative;
    overflow: hidden;
  }

  .join-movement-section::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.3;
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(3deg);
    }
  }

  .movement-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(28px, 6vw, 42px);
    font-weight: 700;
    color: var(--white);
    margin-bottom: var(--space-lg);
    line-height: 1.2;
  }

  .section-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
  }

  .participation-paths {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .path-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: var(--space-xl);
    text-align: center;
    transition: all 0.3s ease;
  }

  .path-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .path-card.featured {
    border: 2px solid rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
  }

  .path-icon {
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--white);
  }

  .path-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: var(--space-md);
  }

  .path-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: var(--space-lg);
  }

  .path-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    align-items: center;
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
    min-width: 140px;
    justify-content: center;
  }

  .btn-primary {
    background: var(--white);
    color: var(--primary-600);
  }

  .btn-primary:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: transparent;
    color: var(--white);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  .btn-large {
    padding: var(--space-lg) var(--space-2xl);
    font-size: 18px;
    min-width: 180px;
  }

  .link {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: underline;
    transition: color 0.2s ease;
  }

  .link:hover {
    color: var(--white);
  }

  .movement-call-to-action {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
  }

  .cta-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .cta-title {
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: var(--space-md);
  }

  .cta-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: var(--space-xl);
  }

  .cta-stats {
    display: flex;
    justify-content: center;
    gap: var(--space-2xl);
    margin-bottom: var(--space-xl);
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    font-family: "Montserrat", sans-serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--white);
    line-height: 1;
    margin-bottom: var(--space-xs);
  }

  .stat-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .cta-buttons {
    display: flex;
    gap: var(--space-lg);
    justify-content: center;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .join-movement-section {
      padding: var(--space-3xl) 0;
    }

    .participation-paths {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .path-card {
      padding: var(--space-lg);
    }

    .movement-call-to-action {
      padding: var(--space-xl);
    }

    .cta-stats {
      gap: var(--space-lg);
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .btn-large {
      width: 100%;
      max-width: 250px;
    }
  }

  @media (max-width: 480px) {
    .path-card {
      padding: var(--space-md);
    }

    .path-icon {
      width: 56px;
      height: 56px;
    }

    .cta-title {
      font-size: 28px;
    }

    .cta-stats {
      flex-direction: column;
      gap: var(--space-md);
    }

    .stat-number {
      font-size: 32px;
    }
  }
</style>
