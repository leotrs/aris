<template>
  <section class="security-hero-section" aria-labelledby="security-hero-heading">
    <div class="hero-content-wrapper">
      <div class="hero-content">
        <h1 id="security-hero-heading" class="hero-headline">Security & Privacy</h1>
        <p class="hero-subheadline">
          Transparent about where we are and where we're going. Security and privacy built one, with
          open source accountability.
        </p>
        <div class="hero-status">
          <div class="status-badge">
            <IconAlertTriangle :size="20" />
            <span>Pre-Launch: Security Framework in Development</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="security-illustration">
          <div class="shield-icon">
            <IconShield :size="64" />
          </div>
          <div class="transparency-indicators">
            <div class="indicator">
              <IconEye :size="24" />
              <span>Open Source</span>
            </div>
            <div class="indicator">
              <IconCode :size="24" />
              <span>Transparent</span>
            </div>
            <div class="indicator">
              <IconUsers :size="24" />
              <span>Community Reviewed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconShield, IconAlertTriangle, IconEye, IconCode, IconUsers } from "@tabler/icons-vue";
</script>

<style scoped>
  .security-hero-section {
    background: linear-gradient(135deg, var(--warning-25) 0%, var(--gray-25) 100%);
    padding: var(--space-4xl) 0;
    min-height: 60vh;
    display: flex;
    align-items: center;
  }

  .hero-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4xl);
  }

  .hero-content {
    flex: 1;
    max-width: 600px;
  }

  .hero-headline {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(32px, 8vw, 48px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
  }

  .hero-subheadline {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 20px);
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .hero-status {
    display: flex;
    align-items: center;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-lg);
    background: var(--warning-100);
    border: 2px solid var(--warning-300);
    border-radius: 8px;
    color: var(--warning-800);
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 14px;
  }

  .hero-visual {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .security-illustration {
    text-align: center;
  }

  .shield-icon {
    color: var(--primary-500);
    margin-bottom: var(--space-xl);
  }

  .transparency-indicators {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .indicator {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 6px;
    color: var(--gray-700);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
  }

  .indicator svg {
    color: var(--success-600);
  }

  @media (max-width: 768px) {
    .security-hero-section {
      padding: var(--space-3xl) 0;
      min-height: auto;
    }

    .hero-content-wrapper {
      flex-direction: column;
      text-align: center;
    }

    .hero-content {
      max-width: none;
    }

    .transparency-indicators {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
