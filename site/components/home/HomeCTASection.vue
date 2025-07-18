<template>
  <section class="cta-section">
    <div class="cta-content-wrapper">
      <h2 class="cta-headline">Ready to start writing?</h2>
      <p class="cta-subtitle">
        Join researchers who are already collaborating and sharing their work on Aris.
      </p>
      <div class="cta-buttons">
        <a href="/getting-started" class="btn btn-primary">Get Started</a>
        <a href="/contact" class="text-link">Questions? Contact us</a>
      </div>
    </div>
  </section>
</template>

<script setup>
  // No specific script logic needed for this component's structure.
</script>

<style scoped>
  /* Section Container */
  .cta-section {
    background-color: var(--surface-page);
    padding: 100px 0;
    text-align: center;
  }

  /* Content Wrapper - Max-width & Centering */
  .cta-content-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 16px;
  }

  /* CTA Headline */
  .cta-headline {
    font-family: "Montserrat", sans-serif;
    font-size: 56px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 24px;
    line-height: 1.2;
  }

  /* CTA Subtitle */
  .cta-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 20px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: 40px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  /* CTA Buttons Container */
  .cta-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  /* Reusing Button Styles (from HeroSection or global CSS) */
  /* If these are global utility classes, you don't need to redeclare them here.
     However, for a scoped component, it's safer to include them if they aren't
     truly global or imported in some way. I'll include them for completeness. */
  .btn {
    padding: 18px 36px; /* Slightly larger padding for a prominent final CTA */
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 20px; /* Slightly larger text for final CTA */
    cursor: pointer;
    border: none;
    transition:
      background-color 0.2s ease-in-out,
      transform 0.2s ease-in-out;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    color: var(--white);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 154, 233, 0.35);
  }

  .text-link {
    font-family: "Source Sans 3", sans-serif;
    font-size: 20px; /* Consistent size with primary button */
    color: var(--link-default);
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }

  .text-link:hover {
    color: var(--link-hover);
    text-decoration: underline;
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .cta-section {
      padding: 80px 0;
    }

    .cta-headline {
      font-size: 42px; /* Smaller headline on mobile */
      margin-bottom: 20px;
    }

    .cta-subtitle {
      font-size: 18px;
      margin-bottom: 30px;
    }

    .cta-buttons {
      flex-direction: column; /* Stack buttons vertically on small screens */
      width: 100%;
    }

    .btn {
      width: 80%; /* Make buttons wider */
      max-width: 350px; /* Max width for buttons */
      padding: 16px 32px; /* Adjust padding */
      font-size: 18px; /* Adjust font size */
    }

    .text-link {
      margin-top: 10px; /* Space below button */
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    .cta-section {
      padding: 60px 0;
    }
    .cta-headline {
      font-size: 32px;
    }
    .cta-subtitle {
      font-size: 16px;
    }
    .btn {
      width: 90%;
      max-width: 300px;
    }
  }
</style>
