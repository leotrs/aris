<template>
  <section class="security-hero-section" aria-labelledby="security-hero-heading">
    <div class="hero-content-wrapper">
      <div class="hero-content">
        <h1 id="security-hero-heading" class="hero-headline">Security & Privacy by Design</h1>
        <p class="hero-subheadline">
          Your research deserves enterprise-grade protection. Built from the ground up with
          security, privacy, and compliance at the core—because academic freedom depends on data
          security.
        </p>
        <div class="security-highlights">
          <div class="highlight-item">
            <IconShield :size="20" />
            <span>SOC 2 Type II Certified</span>
          </div>
          <div class="highlight-item">
            <IconLock :size="20" />
            <span>End-to-End Encryption</span>
          </div>
          <div class="highlight-item">
            <IconGlobe :size="20" />
            <span>GDPR & FERPA Compliant</span>
          </div>
          <div class="highlight-item">
            <IconEye :size="20" />
            <span>Zero Trust Architecture</span>
          </div>
        </div>
        <div class="hero-cta">
          <a href="#security-overview" class="btn btn-primary">
            <IconFileText :size="18" />
            <span>View Security Details</span>
          </a>
          <a href="/contact?type=security" class="btn btn-secondary">
            <IconMail :size="18" />
            <span>Security Questions</span>
          </a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="security-diagram">
          <div class="shield-container">
            <div class="shield-core">
              <IconShieldCheck :size="48" />
            </div>
            <div class="protection-layers">
              <div class="layer layer-1">
                <span>Application Security</span>
              </div>
              <div class="layer layer-2">
                <span>Data Encryption</span>
              </div>
              <div class="layer layer-3">
                <span>Infrastructure Protection</span>
              </div>
              <div class="layer layer-4">
                <span>Compliance Framework</span>
              </div>
            </div>
          </div>
          <div class="security-metrics">
            <div class="metric-card">
              <div class="metric-number">99.9%</div>
              <div class="metric-label">Uptime SLA</div>
            </div>
            <div class="metric-card">
              <div class="metric-number">256-bit</div>
              <div class="metric-label">AES Encryption</div>
            </div>
            <div class="metric-card">
              <div class="metric-number">24/7</div>
              <div class="metric-label">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconShield,
    IconLock,
    IconGlobe,
    IconEye,
    IconFileText,
    IconMail,
    IconShieldCheck,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Security Hero Section */
  .security-hero-section {
    background: linear-gradient(135deg, var(--success-25) 0%, var(--gray-25) 100%);
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

  /* Security Highlights */
  .security-highlights {
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
    border: 1px solid var(--success-200);
    border-radius: 20px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--success-700);
    box-shadow: var(--shadow-soft);
  }

  .highlight-item svg {
    color: var(--success-600);
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
    background: var(--success-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--success-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.35);
  }

  .btn-secondary {
    background: var(--white);
    color: var(--success-600);
    border: 2px solid var(--success-300);
  }

  .btn-secondary:hover {
    background: var(--success-50);
    border-color: var(--success-400);
    transform: translateY(-2px);
  }

  /* Hero Visual */
  .hero-visual {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2xl);
    min-height: 500px;
  }

  .security-diagram {
    position: relative;
    width: 400px;
    height: 400px;
  }

  .shield-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .shield-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    border: 3px solid var(--success-400);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--success-700);
    z-index: 5;
    box-shadow: var(--shadow-medium);
  }

  .protection-layers {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .layer {
    position: absolute;
    border: 2px solid var(--success-300);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--success-700);
    text-align: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    animation: pulse 4s ease-in-out infinite;
  }

  .layer-1 {
    width: 140px;
    height: 140px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 0s;
  }

  .layer-2 {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 1s;
  }

  .layer-3 {
    width: 260px;
    height: 260px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 2s;
  }

  .layer-4 {
    width: 320px;
    height: 320px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 3s;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1.02);
    }
  }

  .security-metrics {
    display: flex;
    gap: var(--space-md);
    margin-top: var(--space-xl);
  }

  .metric-card {
    text-align: center;
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 1px solid var(--success-200);
    border-radius: 12px;
    box-shadow: var(--shadow-soft);
    min-width: 100px;
  }

  .metric-number {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--success-600);
    margin-bottom: var(--space-xs);
  }

  .metric-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .security-hero-section {
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

    .security-diagram {
      width: 300px;
      height: 300px;
    }

    .shield-core {
      width: 80px;
      height: 80px;
    }

    .layer-1 {
      width: 110px;
      height: 110px;
    }
    .layer-2 {
      width: 150px;
      height: 150px;
    }
    .layer-3 {
      width: 190px;
      height: 190px;
    }
    .layer-4 {
      width: 230px;
      height: 230px;
    }

    .security-metrics {
      flex-direction: column;
      align-items: center;
      gap: var(--space-sm);
    }

    .hero-cta {
      justify-content: center;
    }

    .security-highlights {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .security-highlights {
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

    .security-diagram {
      width: 250px;
      height: 250px;
    }

    .shield-core {
      width: 60px;
      height: 60px;
    }

    .layer-1 {
      width: 90px;
      height: 90px;
    }
    .layer-2 {
      width: 120px;
      height: 120px;
    }
    .layer-3 {
      width: 150px;
      height: 150px;
    }
    .layer-4 {
      width: 180px;
      height: 180px;
    }

    .layer {
      font-size: 9px;
    }

    .metric-card {
      min-width: 80px;
      padding: var(--space-md);
    }

    .metric-number {
      font-size: 16px;
    }
  }
</style>
