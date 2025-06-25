<template>
  <section class="section-three">
    <div class="content-wrapper">
      <h2 class="section-heading">How Aris Transforms Your Research Experience</h2>

      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-visual">
            <!-- <img src="/path/to/your/interactive-drafting.gif" alt="Interactive Drafting Demo" class="feature-gif"> -->
          </div>
          <div class="feature-content">
            <h3 class="card-title">Interactive Drafting</h3>
            <p class="card-description">
              Draft your manuscripts with rich media, interactive figures, and live data
              connections, transcending static documents.
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-visual">
            <!-- <img src="/path/to/your/dynamic-peer-review.gif" alt="Dynamic Peer Review Demo" class="feature-gif"> -->
          </div>
          <div class="feature-content">
            <h3 class="card-title">Dynamic Peer Review</h3>
            <p class="card-description">
              Streamline the review process with in-context comments, version comparisons, and
              collaborative editing tools.
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-visual">
            <!-- <img src="/path/to/your/collaborative-data-viz.gif" alt="Collaborative Data Visualization Demo" class="feature-gif"> -->
          </div>
          <div class="feature-content">
            <h3 class="card-title">Collaborative Data Viz</h3>
            <p class="card-description">
              Co-create and embed interactive data visualizations directly within your manuscript,
              ensuring data integrity and clarity.
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-visual">
            <!-- <img src="/path/to/your/smart-publishing.gif" alt="Smart Publishing Demo" class="feature-gif"> -->
          </div>
          <div class="feature-content">
            <h3 class="card-title">Smart Publishing</h3>
            <p class="card-description">
              Seamlessly publish your work to web-native formats, optimizing for discoverability and
              engagement across platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  // No specific script logic needed for this component's structure.
  // If you had data for the cards, you might define an array here and use v-for.
</script>

<style scoped>
  /* Section Container */
  .section-three {
    background-color: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  /* Content Wrapper - Max-width & Centering */
  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
  }

  /* Section Heading */
  .section-heading {
    font-family: "Montserrat", sans-serif;
    font-size: var(--text-5xl);
    font-weight: 700;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-3xl);
    line-height: 1.2;
  }

  /* Feature Grid */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-xl);
    align-items: stretch;
  }

  /* Individual Feature Card Styling */
  .feature-card {
    background-color: var(--surface-page); /* White background for cards */
    border: 1px solid var(--border-primary); /* Thin border */
    border-radius: 8px; /* Rounded corners */
    box-shadow: var(--shadow-soft); /* Soft shadow */
    overflow: hidden; /* Ensures GIFs/images don't break border-radius */
    display: flex;
    flex-direction: column;
    transition:
      transform 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out; /* Smooth transition for hover effects */
  }

  /* Hover Effect for Cards */
  .feature-card:hover {
    transform: translateY(-5px); /* Subtle upward lift */
    box-shadow: var(
      --shadow-medium,
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05)
    ); /* Slightly stronger shadow on hover */
  }

  /* Feature Visual (GIF/Video) Container */
  .feature-visual {
    width: 100%;
    /* Maintain aspect ratio if GIFs/videos have consistent dimensions */
    /* For example, if 16:9 aspect ratio: padding-bottom: 56.25%; height: 0; position: relative; */
    /* For now, setting a fixed height for visual clarity. Adjust as needed. */
    height: 250px; /* Example height for the GIF/video area */
    background-color: var(--gray-100); /* Placeholder background */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; /* Ensure content inside doesn't spill */
  }

  .feature-gif,
  .feature-video {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensures the visual covers the container, cropping if necessary */
    display: block; /* Removes extra space below images */
  }

  /* Feature Content (Text) */
  .feature-content {
    padding: 32px; /* Padding for the text content within the card */
    flex-grow: 1; /* Allows content to take up remaining space if cards have different visual heights */
    display: flex;
    flex-direction: column;
  }

  /* Card Title */
  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 12px; /* Space below title */
    line-height: 1.3;
  }

  /* Card Description */
  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: var(--body-line-height);
    color: var(--gray-700);
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .section-three {
      padding: 60px 0;
    }

    .section-heading {
      font-size: 38px;
      margin-bottom: 40px;
    }

    .feature-grid {
      grid-template-columns: 1fr; /* Stack cards in a single column on mobile */
    }

    .feature-card {
      /* Padding is mostly handled by .feature-content now */
    }

    .feature-visual {
      height: 200px; /* Adjust visual height for smaller screens */
    }
  }

  @media (max-width: 480px) {
    .section-heading {
      font-size: 32px;
    }

    .feature-content {
      padding: 24px;
    }

    .card-title {
      font-size: 22px;
    }
  }
</style>
