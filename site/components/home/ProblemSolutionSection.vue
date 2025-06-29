<template>
  <section class="section-two">
    <div class="content-wrapper">
      <h2 class="section-heading">The Research Experience, Reimagined by Aris</h2>

      <div class="problem-solution-grid">
        <div class="problem-solution-card">
          <div class="card-header">
            <div class="card-icon-container">
              <IconGitFork />
            </div>
            <h3 class="card-problem">Fragmented Tools</h3>
          </div>
          <p class="card-problem-description">
            Disconnected tools fragment workflows and waste valuable research time.
          </p>
          <h3 class="card-solution">Aris provides an integrated platform</h3>
          <p class="card-solution-description">
            Eliminates friction, regains version control, and lets you focus on discoveries rather
            than tool management.
          </p>
        </div>

        <div class="problem-solution-card">
          <div class="card-header">
            <div class="card-icon-container">
              <IconMessageOff />
            </div>
            <h3 class="card-problem">Clunky Collaboration</h3>
          </div>
          <p class="card-problem-description">
            Traditional tools obscure context and hinder precise, meaningful feedback.
          </p>
          <h3 class="card-solution">Aris elevates collaboration with intelligent assistance</h3>
          <p class="card-solution-description">
            Semantic diffs and AI Copilot invite human interaction, empowering human agency in the
            research process.
          </p>
        </div>

        <div class="problem-solution-card">
          <div class="card-header">
            <div class="card-icon-container">
              <IconHourglass />
            </div>
            <h3 class="card-problem">Peer Review Bottleneck</h3>
          </div>
          <p class="card-problem-description">
            Current systems are opaque, slow, and often lack depth or meaningful feedback.
          </p>
          <h3 class="card-solution">Aris redefines peer review with built-in efficiency</h3>
          <p class="card-solution-description">
            AI-powered reviewer recommendations ensure quality and integrity while maintaining human
            oversight and empathy.
          </p>
        </div>

        <div class="problem-solution-card">
          <div class="card-header">
            <div class="card-icon-container">
              <IconFileOff />
            </div>
            <h3 class="card-problem">Impersonal Digital Engagement</h3>
          </div>
          <p class="card-problem-description">
            Static formats limit engagement and create barriers to understanding complex concepts.
          </p>
          <h3 class="card-solution">Aris transforms research into dynamic experiences</h3>
          <p class="card-solution-description">
            Web-native publishing makes research more discoverable, understandable, and deeply
            engaging for all audiences.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconGitFork, IconMessageOff, IconHourglass, IconFileOff } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Section Container */
  .section-two {
    background: linear-gradient(45deg, var(--gray-75) 0%, var(--gray-100) 100%);
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
    background: linear-gradient(135deg, var(--surface-page) 0%, var(--gray-50) 100%);
  }

  /* Card Header - Icon + Problem Heading Row */
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: var(--space-md);
    gap: var(--space-md);
  }

  /* Card Icon Container */
  .card-icon-container {
    width: 40px;
    height: 40px;
    color: var(--primary-500);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Problem & Solution Headings within Card */
  .card-problem,
  .card-solution {
    font-family: "Montserrat", sans-serif;
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--gray-800);
    line-height: 1.3;
  }

  /* Problem heading when in header */
  .card-header .card-problem {
    margin: 0;
  }

  /* Solution heading standalone */
  .card-solution {
    margin-bottom: var(--space-sm);
    margin-top: var(--space-lg);
  }

  /* Problem Description */
  .card-problem-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: var(--text-base);
    line-height: 1.5;
    color: var(--gray-600);
    margin-bottom: var(--space-xl);
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
