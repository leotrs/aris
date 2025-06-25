<template>
  <section class="section-two">
    <div class="content-wrapper">
      <h2 class="section-heading">The Research Experience, Reimagined by Aris</h2>

      <div class="problem-solution-grid">
        <div class="problem-solution-card">
          <div class="card-icon-container">
            <IconGitFork />
          </div>
          <h3 class="card-problem">Fragmented Tools, Disconnected Workflows</h3>
          <p class="card-problem-description">
            Switching between word processors, reference managers, and collaboration tools leads to
            friction and errors.
          </p>
          <h3 class="card-solution">→ Unified Platform, Seamless Flow</h3>
          <p class="card-solution-description">
            Aris integrates every stage of research, from drafting to peer review, on a single
            web-native platform.
          </p>
        </div>

        <div class="problem-solution-card">
          <div class="card-icon-container">
            <IconMessagesOff />
          </div>
          <h3 class="card-problem">Isolated Collaboration, Version Chaos</h3>
          <p class="card-problem-description">
            Sharing files back and forth, losing track of changes, and manual merging costs valuable
            time.
          </p>
          <h3 class="card-solution">→ Real-Time Collaboration, Semantic Diffs</h3>
          <p class="card-solution-description">
            Work together in real-time with granular change tracking and semantic version control,
            eliminating chaos.
          </p>
        </div>

        <div class="problem-solution-card">
          <div class="card-icon-container">
            <IconHourglassHigh />
          </div>
          <h3 class="card-problem">Tedious Formatting, Compliance Headaches</h3>
          <p class="card-problem-description">
            Manually adjusting citations, references, and manuscript styles for different journal
            requirements.
          </p>
          <h3 class="card-solution">→ Automated Formatting, Instant Compliance</h3>
          <p class="card-solution-description">
            Aris automates formatting, citations, and reference management, ensuring instant
            compliance with publication standards.
          </p>
        </div>

        <div class="problem-solution-card">
          <div class="card-icon-container">
            <IconFileOff />
          </div>
          <h3 class="card-problem">Limited Discoverability, Static Formats</h3>
          <p class="card-problem-description">
            PDFs and static documents restrict engagement, limiting impact and understanding of
            complex data.
          </p>
          <h3 class="card-solution">→ Enhanced Discoverability, Interactive Narratives</h3>
          <p class="card-solution-description">
            Publish interactive, web-native manuscripts that allow deep engagement with your
            research and data.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconGitFork, IconMessagesOff, IconHourglassHigh, IconFileOff } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Section Container */
  .section-two {
    background-color: var(--gray-75);
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

  /* Problem-Solution Grid */
  .problem-solution-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-xl);
    align-items: stretch;
  }

  /* Individual Card Styling */
  .problem-solution-card {
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

  .problem-solution-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  /* Card Icon Container */
  .card-icon-container {
    margin-bottom: var(--space-lg);
    width: 48px;
    height: 48px;
    color: var(--primary-500);
    flex-shrink: 0;
  }

  /* Problem & Solution Headings within Card */
  .card-problem,
  .card-solution {
    font-family: "Montserrat", sans-serif;
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: var(--space-sm);
    line-height: 1.3;
  }

  /* Problem Description */
  .card-problem-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: var(--text-base);
    line-height: 1.5;
    color: var(--gray-600);
    margin-bottom: var(--space-lg);
  }

  /* Solution Description */
  .card-solution-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: var(--text-base);
    line-height: 1.5;
    color: var(--gray-700);
    margin-top: auto;
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .section-two {
      padding: var(--space-3xl) 0;
    }

    .content-wrapper {
      padding: 0 var(--space-md);
    }

    .section-heading {
      font-size: 40px;
      margin-bottom: var(--space-2xl);
    }

    .problem-solution-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .problem-solution-card {
      padding: var(--space-xl);
    }
  }

  @media (max-width: 480px) {
    .section-heading {
      font-size: 32px;
    }

    .problem-solution-card {
      padding: var(--space-lg);
    }

    .card-icon-container {
      width: 40px;
      height: 40px;
    }
  }

  .tabler-icon {
    height: 48px;
    width: 48px;
    color: var(--extra-dark);
  }
</style>
