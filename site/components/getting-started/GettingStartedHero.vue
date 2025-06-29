<template>
  <section class="getting-started-hero-section" aria-labelledby="getting-started-hero-heading">
    <div class="hero-content-wrapper">
      <div class="hero-content">
        <h1 id="getting-started-hero-heading" class="hero-headline">Get Started with Aris</h1>
        <p class="hero-subheadline">
          Start writing and sharing research in 2 minutes. Choose your path below.
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">2</div>
            <div class="stat-label">Minutes to Start</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Open Source</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">∞</div>
            <div class="stat-label">Data Export</div>
          </div>
        </div>
        <div class="hero-cta">
          <a href="#user-paths" class="btn btn-primary">
            <IconRocket :size="18" />
            <span>Choose Your Path</span>
          </a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="setup-flow">
          <div class="flow-step active">
            <div class="step-number">1</div>
            <div class="step-content">
              <IconUserCheck :size="24" />
              <span>Choose Your Path</span>
            </div>
          </div>
          <div class="flow-arrow">
            <IconArrowRight :size="20" />
          </div>
          <div class="flow-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <IconSettings :size="24" />
              <span>Quick Setup</span>
            </div>
          </div>
          <div class="flow-arrow">
            <IconArrowRight :size="20" />
          </div>
          <div class="flow-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <IconEdit :size="24" />
              <span>Start Writing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconRocket,
    IconUserCheck,
    IconSettings,
    IconEdit,
    IconArrowRight,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Getting Started Hero Section */
  .getting-started-hero-section {
    background: linear-gradient(135deg, var(--primary-25) 0%, var(--success-25) 100%);
    padding: var(--space-4xl) 0;
    min-height: 60vh;
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
    font-size: clamp(32px, 8vw, 48px);
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

  /* Hero Stats */
  .hero-stats {
    display: flex;
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
  }

  .stat-item {
    text-align: center;
    padding: var(--space-md);
    background: var(--surface-page);
    border: 1px solid var(--success-200);
    border-radius: 12px;
    min-width: 100px;
    box-shadow: var(--shadow-soft);
  }

  .stat-number {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--success-600);
    margin-bottom: var(--space-xs);
  }

  .stat-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
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

  /* Hero Visual */
  .hero-visual {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
  }

  .setup-flow {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    background: var(--surface-page);
    padding: var(--space-2xl);
    border-radius: 16px;
    border: 1px solid var(--border-primary);
    box-shadow: var(--shadow-medium);
  }

  .flow-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    border-radius: 12px;
    transition: all 0.3s ease;
    min-width: 120px;
  }

  .flow-step.active {
    background: linear-gradient(135deg, var(--success-50), var(--success-100));
    border: 2px solid var(--success-300);
  }

  .flow-step:not(.active) {
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
  }

  .step-number {
    width: 32px;
    height: 32px;
    background: var(--success-500);
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
  }

  .flow-step:not(.active) .step-number {
    background: var(--gray-400);
  }

  .step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    text-align: center;
  }

  .step-content span {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-700);
  }

  .step-content svg {
    color: var(--success-600);
  }

  .flow-step:not(.active) .step-content svg {
    color: var(--gray-500);
  }

  .flow-arrow {
    color: var(--gray-400);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .getting-started-hero-section {
      padding: var(--space-3xl) 0;
      min-height: 50vh;
    }

    .hero-content-wrapper {
      flex-direction: column;
      gap: var(--space-2xl);
    }

    .hero-content {
      text-align: center;
      max-width: 100%;
    }

    .hero-stats {
      justify-content: center;
    }

    .hero-visual {
      min-height: 250px;
    }

    .setup-flow {
      flex-direction: column;
      gap: var(--space-md);
      padding: var(--space-xl);
    }

    .flow-arrow {
      transform: rotate(90deg);
    }

    .flow-step {
      min-width: 200px;
    }
  }

  @media (max-width: 480px) {
    .hero-stats {
      flex-direction: column;
      align-items: center;
    }

    .stat-item {
      min-width: 120px;
    }

    .setup-flow {
      padding: var(--space-lg);
    }

    .flow-step {
      min-width: 150px;
      padding: var(--space-md);
    }
  }
</style>
