<template>
  <section class="transparency-section" aria-labelledby="transparency-heading">
    <div class="transparency-content-wrapper">
      <div class="section-header">
        <div class="section-icon">
          <IconInfoCircle :size="32" />
        </div>
        <h2 id="transparency-heading" class="section-title">Early Stage Commitment</h2>
        <p class="section-subtitle">
          We're building Aris in the open with the research community. Here's what that means for
          pricing and your data.
        </p>
      </div>

      <div class="transparency-grid">
        <div class="transparency-card">
          <div class="card-icon">
            <IconLock :size="24" />
          </div>
          <h3 class="card-title">Pricing Lock Guarantee</h3>
          <p class="card-description">
            Early adopters get locked-in pricing for 2 years, even as we add features and improve
            the platform. Your trust in our early stage gets rewarded.
          </p>
        </div>

        <div class="transparency-card">
          <div class="card-icon">
            <IconDownload :size="24" />
          </div>
          <h3 class="card-title">Complete Data Ownership</h3>
          <p class="card-description">
            Full export of all your data in standard formats (LaTeX, Word, JSON) at any time. No
            vendor lock-in, no data hostage situations. Your research belongs to you.
          </p>
        </div>

        <div class="transparency-card">
          <div class="card-icon">
            <IconHeart :size="24" />
          </div>
          <h3 class="card-title">Academic-First Principles</h3>
          <p class="card-description">
            Individual researchers stay free forever. Institutional pricing designed for academic
            budgets, not corporate profit maximization.
          </p>
        </div>

        <div class="transparency-card">
          <div class="card-icon">
            <IconCode :size="24" />
          </div>
          <h3 class="card-title">Open Development</h3>
          <p class="card-description">
            Feature development guided by researcher feedback. Request features, report bugs, and
            influence our roadmap directly.
          </p>
        </div>
      </div>

      <div class="beta-notice">
        <div class="beta-content">
          <h3 class="beta-title">Currently in Beta</h3>
          <p class="beta-description">
            Aris is actively under development. Some features are still being refined, and we're
            continuously improving based on user feedback. <strong>Beta users get:</strong>
          </p>
          <div class="beta-benefits">
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Extended free trial periods</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Direct access to the development team</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Influence over feature prioritization</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Locked-in early adopter pricing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconInfoCircle,
    IconLock,
    IconDownload,
    IconHeart,
    IconCode,
    IconCheck,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Transparency Section */
  .transparency-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--primary-25) 100%);
    padding: var(--space-4xl) 0;
  }

  .transparency-content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
  }

  .section-icon {
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
    max-width: 600px;
    margin: 0 auto;
  }

  /* Transparency Grid */
  .transparency-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .transparency-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    text-align: center;
    transition: all 0.3s ease;
  }

  .transparency-card:hover {
    box-shadow: var(--shadow-soft);
    transform: translateY(-2px);
  }

  .card-icon {
    width: 48px;
    height: 48px;
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
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: var(--gray-700);
    margin: 0;
  }

  /* Beta Notice */
  .beta-notice {
    background: linear-gradient(135deg, var(--warning-25), var(--warning-50));
    border: 2px solid var(--warning-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
  }

  .beta-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .beta-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .beta-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .beta-benefits {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
    text-align: left;
  }

  .benefit-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .benefit-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .transparency-section {
      padding: var(--space-3xl) 0;
    }

    .transparency-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .beta-notice {
      padding: var(--space-xl);
    }

    .beta-benefits {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .benefit-item {
      justify-content: center;
    }
  }
</style>
