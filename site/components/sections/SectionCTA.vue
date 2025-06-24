<template>
  <section class="cta-section">
    <div class="cta-content-wrapper">
      <h2 class="cta-headline">Experience what research should feel like.</h2>
      <div class="cta-buttons">
        <button class="btn btn-primary">Try the Demo</button>
        <a href="/signup" class="text-link">Or, sign up for the beta waitlist</a>
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
    background-color: var(--primary-100); /* light blue background as discussed */
    padding: 100px 0; /* Generous vertical padding for emphasis */
    text-align: center; /* Center aligns all inline-block/text content */
  }

  /* Content Wrapper - Max-width & Centering */
  .cta-content-wrapper {
    max-width: 800px; /* Max width for the content to keep it focused */
    margin: 0 auto; /* Centers the content wrapper */
    padding: 0 var(--side-padding, 24px); /* Side padding */
  }

  /* CTA Headline */
  .cta-headline {
    font-family: "Montserrat", sans-serif;
    font-size: 56px; /* Large, impactful headline */
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 40px; /* Space below the headline */
    line-height: 1.2;
  }

  /* CTA Buttons Container */
  .cta-buttons {
    display: flex;
    justify-content: center; /* Center the buttons within the flex container */
    align-items: center;
    gap: 24px; /* Space between buttons */
    flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
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
    background-color: var(--primary-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background-color: var(--primary-600);
    transform: translateY(-2px);
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
    .btn {
      width: 90%;
      max-width: 300px;
    }
  }
</style>
