<template>
  <section class="hero-section" aria-labelledby="hero-heading">
    <div class="hero-content-wrapper">
      <div class="hero-content">
        <h1 id="hero-heading" class="hero-headline">
          Aris: The Unified Platform for Human-First Scientific Research.
        </h1>
        <p class="hero-subheadline">
          Experience an integrated platform for collaborative writing, intelligent peer review, and
          interactive publishing, making your science more discoverable, understandable, and deeply
          engaging.
        </p>
        <div class="hero-ctas" role="group" aria-label="Call to action buttons">
          <a href="/demo" class="btn btn-primary" aria-describedby="hero-heading">
            Try the Demo
          </a>
          <a href="/signup" class="text-link">Or, sign up for the beta waitlist</a>
        </div>
      </div>
      <div class="hero-background" aria-hidden="true"></div>
    </div>
  </section>
</template>

<script setup>
  // No specific script logic needed for this basic structure.
  // If you later add interactivity (like a dynamic button state or props),
  // your script setup would go here.
</script>

<style scoped>
  /* Hero Section - Overall Container */
  .hero-section {
    background: linear-gradient(135deg, var(--gray-0) 0%, var(--gray-50) 100%);
    padding: var(--space-4xl) 0;
    min-height: 70vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  /* Content Wrapper - Full width container */
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

  /* Hero Content - Left Side */
  .hero-content {
    flex: 1;
    max-width: 600px;
    z-index: 2;
    position: relative;
  }

  /* Hero Background - Right Side */
  .hero-background {
    flex: 1;
    min-height: 500px;
    background-image: url("@/assets/isometric.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 1;
    z-index: 1;
  }

  /* Headline Styling */
  .hero-headline {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(32px, 8vw, 52px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.1;
  }

  /* Sub-headline Styling */
  .hero-subheadline {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-2xl);
  }

  /* Call to Action Buttons Container */
  .hero-ctas {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    flex-wrap: wrap;
    margin-bottom: var(--space-3xl);
  }

  /* Base Button Styling */
  .btn {
    padding: var(--space-md) var(--space-xl);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: clamp(16px, 3.5vw, 18px);
    cursor: pointer;
    border: none;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    display: inline-block;
  }

  /* Primary Button Specifics */
  .btn-primary {
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    color: var(--white);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 154, 233, 0.35);
  }

  .btn-primary:focus-visible {
    outline: 2px solid var(--primary-300);
    outline-offset: 2px;
  }

  .btn-primary:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(14, 154, 233, 0.3);
  }

  /* Secondary Text Link Styling */
  .text-link {
    font-family: "Source Sans 3", sans-serif;
    font-size: var(--text-base);
    color: var(--primary-600);
    text-decoration: none;
    transition: all 0.2s ease-in-out;
  }

  .text-link:hover {
    color: var(--link-hover);
    text-decoration: underline;
    transform: translateX(2px);
  }

  .text-link:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
    border-radius: 4px;
    background-color: var(--primary-50);
    padding: 2px 4px;
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .hero-section {
      padding: var(--space-3xl) 0;
      min-height: auto;
    }

    .hero-content-wrapper {
      flex-direction: column;
      gap: var(--space-xl);
      padding: 0 var(--space-md);
      text-align: center;
    }

    .hero-content {
      max-width: none;
      order: 1;
    }

    .hero-background {
      order: 2;
      min-height: 300px;
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }

    .hero-ctas {
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: var(--space-md);
    }

    .btn {
      width: 100%;
      max-width: 280px;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .hero-background {
      min-height: 250px;
    }
  }
</style>
