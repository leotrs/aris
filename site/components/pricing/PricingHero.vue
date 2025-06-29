<template>
  <section class="pricing-hero-section" aria-labelledby="pricing-hero-heading">
    <div class="hero-content-wrapper">
      <div class="hero-content">
        <h1 id="pricing-hero-heading" class="hero-headline">
          Simple, Transparent Pricing for Research
        </h1>
        <p class="hero-subheadline">
          Always free for individual researchers. Institutional plans that scale with your team. No
          vendor lock-in, with complete data export at any time.
        </p>
        <div class="hero-badges">
          <div class="badge">
            <IconCheck :size="16" />
            <span>Free for individual use</span>
          </div>
          <div class="badge">
            <IconCheck :size="16" />
            <span>Complete data export</span>
          </div>
          <div class="badge">
            <IconCheck :size="16" />
            <span>Academic-friendly pricing</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconCheck } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Pricing Hero Section */
  .pricing-hero-section {
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--success-25) 100%);
    padding: var(--space-4xl) 0;
    position: relative;
  }

  .hero-content-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    text-align: center;
  }

  /* Hero Content */
  .hero-content {
    position: relative;
    z-index: 2;
  }

  /* Headline Styling */
  .hero-headline {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(32px, 8vw, 48px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.1;
  }

  /* Sub-headline Styling */
  .hero-subheadline {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 20px);
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-2xl);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Hero Badges */
  .hero-badges {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-lg);
    margin-top: var(--space-xl);
  }

  .badge {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--surface-page);
    border: 1px solid var(--success-200);
    border-radius: 20px;
    padding: var(--space-sm) var(--space-lg);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-800);
    box-shadow: var(--shadow-soft);
  }

  .badge svg {
    color: var(--success-600);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .pricing-hero-section {
      padding: var(--space-3xl) 0;
    }

    .hero-badges {
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);
    }

    .badge {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }
  }
</style>
