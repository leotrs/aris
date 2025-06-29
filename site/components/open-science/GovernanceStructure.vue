<template>
  <section class="governance-section" aria-labelledby="governance-heading">
    <div class="governance-content-wrapper">
      <div class="section-header">
        <h2 id="governance-heading" class="section-title">Democratic Governance</h2>
        <p class="section-subtitle">
          The academic community controls the platform's direction, priorities, and policies through
          transparent, democratic processes. No corporate shareholders, no hidden agendas.
        </p>
      </div>

      <div class="governance-structure">
        <div class="governance-visual">
          <div class="governance-diagram">
            <div class="community-layer">
              <div class="community-circle">
                <IconUsers :size="32" />
                <span>Research Community</span>
              </div>
            </div>
            <div class="board-layer">
              <div class="board-circle">
                <IconBuilding :size="24" />
                <span>Advisory Board</span>
              </div>
            </div>
            <div class="development-layer">
              <div class="dev-circle">
                <IconCode :size="20" />
                <span>Core Team</span>
              </div>
            </div>
          </div>
        </div>

        <div class="governance-details">
          <h3 class="details-title">How Decisions Are Made</h3>
          <div class="governance-process">
            <div class="process-step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4 class="step-title">Community Input</h4>
                <p class="step-description">
                  Researchers propose features, report issues, and discuss priorities through public
                  forums and GitHub discussions.
                </p>
              </div>
            </div>
            <div class="process-step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4 class="step-title">Advisory Review</h4>
                <p class="step-description">
                  Academic advisory board evaluates proposals for alignment with open science
                  principles and community benefit.
                </p>
              </div>
            </div>
            <div class="process-step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4 class="step-title">Implementation</h4>
                <p class="step-description">
                  Core development team implements approved changes with full transparency and
                  community oversight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="governance-principles">
        <h3 class="principles-title">Governance Principles</h3>
        <div class="principles-grid">
          <div class="principle-card">
            <IconVote :size="28" />
            <h4 class="principle-title">Democratic Decision Making</h4>
            <p class="principle-description">
              Major decisions require community input and consensus. No top-down mandates or
              corporate directives.
            </p>
          </div>
          <div class="principle-card">
            <IconEye :size="28" />
            <h4 class="principle-title">Full Transparency</h4>
            <p class="principle-description">
              All meetings, decisions, and financial information are publicly documented and
              accessible.
            </p>
          </div>
          <div class="principle-card">
            <IconUsers :size="28" />
            <h4 class="principle-title">Academic Representation</h4>
            <p class="principle-description">
              Governance includes diverse voices from across disciplines, institutions, and career
              stages.
            </p>
          </div>
          <div class="principle-card">
            <IconShield :size="28" />
            <h4 class="principle-title">Mission Protection</h4>
            <p class="principle-description">
              Structural safeguards prevent mission drift and ensure long-term commitment to open
              science.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconUsers,
    IconBuilding,
    IconCode,
    IconVote,
    IconEye,
    IconShield,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  .governance-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--primary-25) 100%);
    padding: var(--space-4xl) 0;
  }

  .governance-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

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

  .governance-structure {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4xl);
    margin-bottom: var(--space-4xl);
    align-items: center;
  }

  .governance-visual {
    display: flex;
    justify-content: center;
  }

  .governance-diagram {
    position: relative;
    width: 300px;
    height: 300px;
  }

  .community-layer,
  .board-layer,
  .development-layer {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .community-layer {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .board-layer {
    top: 25%;
    left: 25%;
    right: 25%;
    bottom: 25%;
  }

  .development-layer {
    top: 40%;
    left: 40%;
    right: 40%;
    bottom: 40%;
  }

  .community-circle,
  .board-circle,
  .dev-circle {
    width: 100%;
    height: 100%;
    border: 3px solid var(--primary-300);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    color: var(--primary-700);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }

  .details-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
  }

  .governance-process {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .process-step {
    display: flex;
    gap: var(--space-md);
    align-items: flex-start;
  }

  .step-number {
    width: 32px;
    height: 32px;
    background: var(--primary-500);
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }

  .step-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .step-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  .governance-principles {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .principles-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .principles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
  }

  .principle-card {
    text-align: center;
    padding: var(--space-lg);
    background: var(--gray-25);
    border-radius: 8px;
  }

  .principle-card svg {
    color: var(--primary-600);
    margin-bottom: var(--space-md);
  }

  .principle-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .principle-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  @media (max-width: 768px) {
    .governance-structure {
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    .governance-diagram {
      width: 250px;
      height: 250px;
    }

    .principles-grid {
      grid-template-columns: 1fr;
    }

    .governance-principles {
      padding: var(--space-xl);
    }
  }
</style>
