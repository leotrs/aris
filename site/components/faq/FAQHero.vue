<template>
  <section class="faq-hero-section" aria-labelledby="faq-hero-heading">
    <div class="hero-content-wrapper">
      <div class="hero-content">
        <h1 id="faq-hero-heading" class="hero-headline">Frequently Asked Questions</h1>
        <p class="hero-subheadline">
          Get answers to common questions about Aris, data ownership, platform comparisons, and
          technical details. Built transparently by researchers, for researchers.
        </p>
      </div>
      <div class="hero-visual">
        <div class="help-illustration">
          <div class="illustration-center">
            <IconQuestionMark :size="48" />
          </div>
          <div class="illustration-bubbles">
            <div class="bubble bubble-1">
              <IconCheck :size="16" />
            </div>
            <div class="bubble bubble-2">
              <IconBulb :size="16" />
            </div>
            <div class="bubble bubble-3">
              <IconHeart :size="16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconQuestionMark, IconCheck, IconBulb, IconHeart } from "@tabler/icons-vue";
</script>

<style scoped>
  /* FAQ Hero Section */
  .faq-hero-section {
    background: linear-gradient(135deg, var(--primary-25) 0%, var(--gray-25) 100%);
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
    max-width: 700px;
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

  /* Hero Visual */
  .hero-visual {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2xl);
    min-height: 400px;
  }

  /* Help Illustration */
  .help-illustration {
    position: relative;
    width: 200px;
    height: 200px;
  }

  .illustration-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border: 3px solid var(--primary-300);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    z-index: 2;
  }

  .illustration-bubbles {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .bubble {
    position: absolute;
    width: 40px;
    height: 40px;
    background: var(--surface-page);
    border: 2px solid var(--success-200);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--success-600);
    animation: float 4s ease-in-out infinite;
  }

  .bubble-1 {
    top: 20px;
    left: 20px;
    animation-delay: 0s;
  }

  .bubble-2 {
    top: 20px;
    right: 20px;
    animation-delay: 1.3s;
  }

  .bubble-3 {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 2.6s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-8px) scale(1.05);
    }
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .faq-hero-section {
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

    .hero-visual {
      min-height: 300px;
    }

    .help-illustration {
      width: 150px;
      height: 150px;
    }

    .illustration-center {
      width: 60px;
      height: 60px;
    }

    .bubble {
      width: 32px;
      height: 32px;
    }
  }

  @media (max-width: 480px) {
    .help-illustration {
      width: 120px;
      height: 120px;
    }

    .illustration-center {
      width: 50px;
      height: 50px;
    }

    .bubble {
      width: 28px;
      height: 28px;
    }
  }
</style>
