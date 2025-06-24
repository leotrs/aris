<template>
  <section class="hero-section">
    <div class="hero-content-wrapper">
      <h1 class="hero-headline">Experience what research should feel like.</h1>
      <p class="hero-subheadline">
        Aris is a web-native platform that unifies writing, collaboration, and review, transforming
        fragmented workflows into a seamless, human-first research journey.
      </p>
      <div class="hero-ctas">
        <button class="btn btn-primary">Try the Demo</button>
        <a href="/signup" class="text-link">Or, sign up for the beta waitlist</a>
      </div>
      <div class="hero-visual-placeholder"></div>
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
    background-color: var(--gray-0);
    padding: var(--space-4xl) 0;
    min-height: 70vh;
    display: flex;
    align-items: center;
  }

  /* Content Wrapper - Max-width & Left-alignment */
  .hero-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
    text-align: left;
    width: 100%;
  }

  /* Headline Styling */
  .hero-headline {
    font-family: "Montserrat", sans-serif;
    font-size: 52px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.1;
    max-width: 800px;
  }

  /* Sub-headline Styling */
  .hero-subheadline {
    font-family: "Source Sans 3", sans-serif;
    font-size: var(--text-lg);
    line-height: 1.6;
    color: var(--gray-700);
    max-width: 700px;
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
    font-size: var(--text-lg);
    cursor: pointer;
    border: none;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    display: inline-block;
  }

  /* Primary Button Specifics */
  .btn-primary {
    background-color: var(--primary-500); /* Your brand's primary action color */
    color: var(--white); /* White text for contrast on primary color */
  }

  .btn-primary:hover {
    background-color: var(--primary-600); /* Darker shade on hover */
    transform: translateY(-2px); /* Subtle upward lift on hover */
  }

  /* Secondary Text Link Styling */
  .text-link {
    font-family: "Source Sans 3", sans-serif;
    font-size: var(--text-base);
    color: var(--primary-600);
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }

  .text-link:hover {
    color: var(--link-hover); /* Link hover color */
    text-decoration: underline; /* Underline on hover for clear indication */
  }

  /* Placeholder for the Isometric Visual */
  .hero-visual-placeholder {
    width: 100%;
    height: 240px;
    background-color: var(--gray-100);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-500);
    font-size: var(--text-base);
    text-align: center;
    border: 2px dashed var(--gray-300);
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .hero-section {
      padding: var(--space-3xl) 0;
      min-height: auto;
    }

    .hero-headline {
      font-size: 40px;
      text-align: center;
    }

    .hero-subheadline {
      font-size: var(--text-base);
      text-align: center;
      margin-left: auto;
      margin-right: auto;
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

    .hero-content-wrapper {
      padding: 0 var(--space-md);
      text-align: center;
    }

    .hero-visual-placeholder {
      height: 200px;
      margin-top: var(--space-xl);
    }
  }

  @media (max-width: 480px) {
    .hero-headline {
      font-size: 32px;
    }

    .hero-visual-placeholder {
      height: 160px;
    }
  }
</style>
