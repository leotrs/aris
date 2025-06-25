<template>
  <section class="section-three">
    <div class="content-wrapper">
      <h2 class="section-heading">How Aris Transforms Your Research Experience</h2>

      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-visual">
            <img
              src="@/assets/screen1.png"
              alt="Unified Research Environment Demo"
              class="feature-gif"
            />
            <div class="video-placeholder">
              <p>Demo Video: Unified Environment</p>
            </div>
          </div>
          <div class="feature-content">
            <h3 class="card-title">The Unified Research Environment</h3>
            <p class="card-description">
              Aris integrates writing, collaboration, review, and publishing into a single, cohesive
              environment, solving fragmentation and reclaiming time lost to tool-juggling and email
              exchanges.
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-visual">
            <img
              src="@/assets/feature3.png"
              alt="Intelligent Human-First Collaboration Demo"
              class="feature-gif"
            />
            <div class="video-placeholder">
              <p>Demo Video: AI Collaboration</p>
            </div>
          </div>
          <div class="feature-content">
            <h3 class="card-title">Intelligent, Human-First Collaboration</h3>
            <p class="card-description">
              Focuses on semantic diffs for meaningful change tracking, and the AI Copilot's role in
              facilitating human interaction by suggesting feedback requests and proposing
              collaborators (not generating content).
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-visual">
            <img
              src="@/assets/screen1.png"
              alt="Streamlined Peer Review Demo"
              class="feature-gif"
            />
            <div class="video-placeholder">
              <p>Demo Video: Peer Review</p>
            </div>
          </div>
          <div class="feature-content">
            <h3 class="card-title">Streamlined Peer Review, Focused on Quality</h3>
            <p class="card-description">
              Explains the built-in system for peer review, highlighting how AI recommendations for
              reviewers lead to more relevant, insightful, and robust evaluations, emphasizing
              quality and integrity.
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-visual">
            <img src="@/assets/feature3.png" alt="Interactive Science Demo" class="feature-gif" />
            <div class="video-placeholder">
              <p>Demo Video: Interactive Publishing</p>
            </div>
          </div>
          <div class="feature-content">
            <h3 class="card-title">Interactive Science for Deeper Engagement</h3>
            <p class="card-description">
              Describes the power of web-native content (embedding data/multimedia), how it boosts
              discoverability (intelligent tagging/search), understandability (tooltips/smart
              navigation), and engagement (layered reading, annotations, direct feedback).
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
    position: relative; /* For video placeholder positioning */
  }

  .feature-gif,
  .feature-video {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensures the visual covers the container, cropping if necessary */
    display: block; /* Removes extra space below images */
  }

  .video-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: var(--white);
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .feature-visual:hover .video-placeholder {
    opacity: 1;
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
