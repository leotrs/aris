<template>
  <section class="hero-section">
    <div class="hero-content-wrapper">
      <h1 class="hero-headline">Experience what research should feel like.</h1>
      <p class="hero-subheadline">
        Aris is a web-native platform that unifies writing, collaboration, and review, transforming fragmented workflows into a seamless, human-first research journey.
      </p>
      <div class="hero-ctas">
        <button class="btn btn-primary">Try the Demo</button>
        <a href="/signup" class="text-link">Or, sign up for the beta waitlist</a>
      </div>
      <div class="hero-visual-placeholder">
        </div>
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
    background-color: var(--gray-0); /* As discussed, a white background for the Hero */
    padding: 80px 0; /* Top/bottom padding for vertical spacing */
    min-height: 600px; /* Ensures a decent initial height for the section */
    display: flex; /* Helps in vertically aligning content if needed */
    align-items: center; /* Vertically centers the content wrapper within the section */
  }

  /* Content Wrapper - Max-width & Left-alignment */
  .hero-content-wrapper {
    max-width: 960px; /* Limits the content width as per our design */
    margin: 0 auto; /* Centers the content wrapper on the page */
    padding: 0 var(--side-padding, 24px); /* Uses a CSS variable for side padding if available, fallback to 24px */
    text-align: left; /* Aligns text content to the left within this wrapper */
    width: 100%; /* Ensures the wrapper takes full available width up to max-width */
  }

  /* Headline Styling */
  .hero-headline {
    font-family: 'Montserrat', sans-serif; /* Uses your specified heading font */
    font-size: 64px; /* Large, impactful headline size */
    font-weight: 700; /* Bold for emphasis */
    color: var(--gray-900); /* Dark text for contrast */
    margin-bottom: 24px; /* Space below the headline */
    line-height: 1.1; /* Tighter line height for large headlines */
  }

  /* Sub-headline Styling */
  .hero-subheadline {
    font-family: 'Source Sans 3', sans-serif; /* Uses your specified body font */
    font-size: 20px; /* Slightly larger for readability and emphasis */
    line-height: var(--body-line-height); /* Uses your global body line height */
    color: var(--gray-700); /* Standard body text color */
    max-width: 600px; /* Constrains width for better readability */
    margin-bottom: 40px; /* Space below the sub-headline */
  }

  /* Call to Action Buttons Container */
  .hero-ctas {
    display: flex; /* Lays out buttons horizontally */
    align-items: center; /* Aligns items vertically in the flex container */
    gap: 24px; /* Space between the primary button and secondary link */
    flex-wrap: wrap; /* Allows buttons to wrap to the next line on smaller screens */
  }

  /* Base Button Styling */
  .btn {
    padding: 16px 32px; /* Generous padding for a prominent button */
    border-radius: 8px; /* Consistent border-radius with other design elements */
    font-family: 'Source Sans 3', sans-serif; /* Button text font */
    font-weight: 600; /* Semi-bold for button text */
    font-size: 18px; /* Button text size */
    cursor: pointer; /* Indicates interactivity */
    border: none; /* No default button border */
    transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out; /* Smooth transitions for hover effects */
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
    font-family: 'Source Sans 3', sans-serif; /* Uses your body font */
    font-size: 18px; /* Consistent font size with primary button */
    color: var(--link-default); /* Your default link color */
    text-decoration: none; /* No underline by default */
    transition: color 0.2s ease-in-out; /* Smooth color transition on hover */
  }

  .text-link:hover {
    color: var(--link-hover); /* Link hover color */
    text-decoration: underline; /* Underline on hover for clear indication */
  }

  /* Placeholder for the Isometric Visual */
  .hero-visual-placeholder {
    /* This div is a placeholder for your detailed isometric illustration. */
    /* You will replace its content and adjust its styling once the visual is ready. */
    width: 100%; /* Example: takes full width of its container */
    height: 300px; /* Example: sets a height to reserve space */
    background-color: var(--gray-100); /* A light gray placeholder color */
    border-radius: 8px; /* Matches other border-radii */
    margin-top: 60px; /* Space below the CTA buttons */
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-500);
    font-size: 16px;
    text-align: center;
    border: 1px dashed var(--gray-300); /* Dashed border to indicate it's a placeholder */
  }

  /* --- Responsive Adjustments (Basic Example) --- */
  @media (max-width: 768px) {
    .hero-section {
      padding: 60px 0; /* Reduce padding on smaller screens */
      min-height: auto; /* Allow height to adjust based on content */
    }

    .hero-headline {
      font-size: 48px; /* Smaller headline for better fit on mobile */
      text-align: center; /* Center align headline on smaller screens */
    }

    .hero-subheadline {
      font-size: 18px;
      text-align: center; /* Center align sub-headline on smaller screens */
      margin-left: auto; /* Used with margin-right: auto for centering block elements */
      margin-right: auto;
    }

    .hero-ctas {
      flex-direction: column; /* Stack buttons vertically on small screens */
      align-items: center; /* Center the stacked buttons */
      width: 100%; /* Ensure the container takes full width */
    }

    .btn {
      width: 80%; /* Make buttons wider to fill space */
      max-width: 300px; /* Prevent buttons from becoming too wide on larger mobile devices */
    }

    .text-link {
      margin-top: 10px; /* Add some space above the text link when stacked */
    }

    .hero-content-wrapper {
      padding: 0 16px; /* Reduce horizontal padding on very small screens */
      text-align: center; /* Center all content within the wrapper on mobile */
    }
  }
</style>
