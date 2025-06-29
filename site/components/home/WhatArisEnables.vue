<template>
  <section class="what-aris-enables-section">
    <div class="content-wrapper">
      <h2 class="section-heading">What Aris Enables</h2>
      <p class="section-subtitle">
        Four breakthrough capabilities that transform how research gets written, reviewed, and
        shared.
      </p>

      <div class="capabilities-grid">
        <div class="capability-card">
          <div class="card-header">
            <div class="card-icon-container">
              <IconUsers :size="40" />
            </div>
            <h3 class="card-title">Intelligent Reviewer Networks</h3>
          </div>
          <p class="card-description">
            Build qualified reviewer pools from institutional members. AI-powered matching based on
            expertise and availability with transparent conflict of interest tracking.
          </p>
          <div class="capability-highlights">
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Expert matching across institutions</span>
            </div>
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Automated conflict screening</span>
            </div>
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Quality and speed metrics</span>
            </div>
          </div>
        </div>

        <div class="capability-card">
          <div class="card-header">
            <div class="card-icon-container">
              <IconGlobe :size="40" />
            </div>
            <h3 class="card-title">Living Research Documents</h3>
          </div>
          <p class="card-description">
            Web-native papers with interactive figures and data. Real-time collaboration with
            semantic versioning and beautiful reading experience on any device.
          </p>
          <div class="capability-highlights">
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Interactive visualizations</span>
            </div>
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Responsive, accessible design</span>
            </div>
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Real-time collaboration</span>
            </div>
          </div>
        </div>

        <div class="capability-card">
          <div class="card-header">
            <div class="card-icon-container">
              <IconGitBranch :size="40" />
            </div>
            <h3 class="card-title">Streamlined Review Workflows</h3>
          </div>
          <p class="card-description">
            Track every review stage in one place. Threaded discussions on specific paragraphs with
            version control for iterative improvements.
          </p>
          <div class="capability-highlights">
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Real-time review tracking</span>
            </div>
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Contextual discussions</span>
            </div>
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Semantic versioning</span>
            </div>
          </div>
        </div>

        <div class="capability-card">
          <div class="card-header">
            <div class="card-icon-container">
              <IconHeart :size="40" />
            </div>
            <h3 class="card-title">Community-Driven Development</h3>
          </div>
          <p class="card-description">
            Open source with academic governance. Contribute features your research community needs
            with a sustainable non-profit model.
          </p>
          <div class="capability-highlights">
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Open source codebase</span>
            </div>
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Academic governance</span>
            </div>
            <div class="highlight-item">
              <IconCheck :size="16" />
              <span>Community contributions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconUsers, IconGlobe, IconGitBranch, IconHeart, IconCheck } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Section Container */
  .what-aris-enables-section {
    background: linear-gradient(45deg, var(--gray-25) 0%, var(--gray-50) 100%);
    padding: var(--space-4xl) 0;
  }

  /* Content Wrapper - Max-width & Centering */
  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  /* Section Heading */
  .section-heading {
    font-family: "Montserrat", sans-serif;
    font-size: var(--text-5xl);
    font-weight: 700;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-lg);
    line-height: 1.2;
  }

  .section-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: var(--text-xl);
    line-height: 1.6;
    color: var(--gray-700);
    text-align: center;
    margin-bottom: var(--space-3xl);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Capabilities Grid */
  .capabilities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xl);
    align-items: stretch;
  }

  /* Individual Capability Card Styling */
  .capability-card {
    background-color: var(--surface-page);
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    padding: var(--space-2xl);
    display: flex;
    flex-direction: column;
    height: 100%;
    transition:
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  .capability-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
    background: linear-gradient(135deg, var(--surface-page) 0%, var(--gray-25) 100%);
  }

  /* Card Header - Icon + Title Row */
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: var(--space-lg);
    gap: var(--space-md);
  }

  /* Card Icon Container */
  .card-icon-container {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    color: var(--primary-600);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .capability-card:hover .card-icon-container {
    transform: scale(1.05);
    background: linear-gradient(135deg, var(--primary-200), var(--primary-300));
  }

  /* Card Title */
  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--gray-900);
    line-height: 1.3;
    margin: 0;
    flex: 1;
  }

  /* Card Description */
  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: var(--text-base);
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
    flex-grow: 1;
  }

  /* Capability Highlights */
  .capability-highlights {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .highlight-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-700);
    line-height: 1.3;
  }

  .highlight-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .what-aris-enables-section {
      padding: var(--space-3xl) 0;
    }

    .content-wrapper {
      padding: 0 var(--space-md);
    }

    .section-heading {
      font-size: 40px;
      margin-bottom: var(--space-md);
    }

    .section-subtitle {
      font-size: var(--text-lg);
      margin-bottom: var(--space-2xl);
    }

    .capabilities-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .capability-card {
      padding: var(--space-xl);
    }

    .card-icon-container {
      width: 56px;
      height: 56px;
    }
  }

  @media (max-width: 480px) {
    .section-heading {
      font-size: 32px;
    }

    .capability-card {
      padding: var(--space-lg);
    }

    .card-header {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }

    .card-icon-container {
      width: 48px;
      height: 48px;
    }

    .card-title {
      text-align: center;
    }
  }
</style>
