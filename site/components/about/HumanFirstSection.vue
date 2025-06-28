<template>
  <section class="human-first-section" aria-labelledby="human-first-heading">
    <div class="human-first-content-wrapper">
      <div class="section-header">
        <h2 id="human-first-heading" class="section-title">The Human-First Philosophy</h2>
        <p class="section-subtitle">
          Technology should amplify human intelligence, not replace it. At Aris, we believe the
          researcher's mind is the source of all scientific breakthroughs.
        </p>
      </div>

      <div class="human-first-grid">
        <div class="philosophy-content">
          <div class="principle-block">
            <h3 class="principle-title">Amplification, Not Automation</h3>
            <p class="principle-description">
              Our AI tools enhance your thinking rather than think for you. From intelligent
              collaboration suggestions to semantic change tracking, every feature is designed to
              clear cognitive overhead so you can focus on what matters: your research.
            </p>
          </div>

          <div class="principle-block">
            <h3 class="principle-title">Agency & Control</h3>
            <p class="principle-description">
              You maintain complete control over your research process. Aris provides intelligent
              recommendations and streamlined workflows, but every decision remains yours. We
              eliminate friction, not autonomy.
            </p>
          </div>

          <div class="principle-block">
            <h3 class="principle-title">Meaningful Connections</h3>
            <p class="principle-description">
              Research is fundamentally collaborative. Our platform facilitates genuine human
              connections—between researchers, with reviewers, and with readers—creating spaces for
              empathy and understanding in scientific discourse.
            </p>
          </div>
        </div>

        <div class="philosophy-visual">
          <div class="human-centered-diagram">
            <div class="center-circle">
              <div class="center-icon">
                <IconUser :size="48" />
              </div>
              <span class="center-label">Researcher</span>
            </div>
            <div class="orbit-item orbit-1">
              <div class="orbit-icon">
                <IconUsers :size="28" />
              </div>
              <span class="orbit-label">Collaboration</span>
            </div>
            <div class="orbit-item orbit-2">
              <div class="orbit-icon">
                <IconSearch :size="28" />
              </div>
              <span class="orbit-label">Discovery</span>
            </div>
            <div class="orbit-item orbit-3">
              <div class="orbit-icon">
                <IconBulb :size="28" />
              </div>
              <span class="orbit-label">Innovation</span>
            </div>
            <div class="orbit-item orbit-4">
              <div class="orbit-icon">
                <IconChartLine :size="28" />
              </div>
              <span class="orbit-label">Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconUser, IconUsers, IconSearch, IconBulb, IconChartLine } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Human First Section - Overall Container */
  .human-first-section {
    background: var(--gray-75);
    padding: var(--space-4xl) 0;
    position: relative;
  }

  .human-first-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(28px, 6vw, 42px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.2;
  }

  .section-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: var(--gray-700);
  }

  /* Main Grid Layout */
  .human-first-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4xl);
    align-items: center;
  }

  /* Philosophy Content */
  .philosophy-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
  }

  .principle-block {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
  }

  .principle-block:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  .principle-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .principle-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin: 0;
  }

  /* Philosophy Visual */
  .philosophy-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .human-centered-diagram {
    position: relative;
    width: 400px;
    height: 400px;
  }

  .center-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-medium);
    z-index: 2;
  }

  .center-icon {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .center-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--white);
    text-align: center;
  }

  .orbit-item {
    position: absolute;
    width: 100px;
    height: 100px;
    background: var(--surface-page);
    border: 2px solid var(--primary-200);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
  }

  .orbit-item:hover {
    transform: scale(1.1);
    border-color: var(--primary-400);
  }

  .orbit-icon {
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .orbit-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-700);
    text-align: center;
    line-height: 1;
  }

  /* Orbit Positioning */
  .orbit-1 {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .orbit-2 {
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  .orbit-3 {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .orbit-4 {
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .human-first-section {
      padding: var(--space-3xl) 0;
    }

    .human-first-grid {
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    .philosophy-visual {
      order: -1;
      min-height: 300px;
    }

    .human-centered-diagram {
      width: 320px;
      height: 320px;
    }

    .center-circle {
      width: 100px;
      height: 100px;
    }

    .center-icon svg {
      width: 24px;
      height: 24px;
    }

    .center-label {
      font-size: 12px;
    }

    .orbit-item {
      width: 80px;
      height: 80px;
    }

    .orbit-icon svg {
      width: 16px;
      height: 16px;
    }

    .orbit-label {
      font-size: 10px;
    }
  }

  @media (max-width: 480px) {
    .human-centered-diagram {
      width: 280px;
      height: 280px;
    }

    .center-circle {
      width: 90px;
      height: 90px;
    }

    .orbit-item {
      width: 70px;
      height: 70px;
    }
  }
</style>
