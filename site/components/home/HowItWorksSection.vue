<template>
  <section class="how-it-works-section" aria-labelledby="how-it-works-heading">
    <div class="how-it-works-content-wrapper">
      <div class="section-header">
        <h2 id="how-it-works-heading" class="section-title">How It Works</h2>
        <p class="section-subtitle">
          Your complete research workflow in one integrated platform—from first draft to public
          discussion.
        </p>
      </div>

      <div class="workflow-steps">
        <div v-for="(step, index) in workflowSteps" :key="index" class="workflow-step">
          <div class="step-visual">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-icon">
              <component :is="step.icon" :size="32" />
            </div>
          </div>
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
            <div class="step-features">
              <div v-for="feature in step.features" :key="feature" class="feature-item">
                <IconCheck :size="14" />
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>
          <div v-if="index < workflowSteps.length - 1" class="workflow-arrow">
            <IconArrowDown :size="24" />
          </div>
        </div>
      </div>

      <div class="integration-highlight">
        <div class="highlight-content">
          <div class="highlight-icon">
            <IconUsers :size="40" />
          </div>
          <div class="highlight-text">
            <h3 class="highlight-title">All Happening in One Place</h3>
            <p class="highlight-description">
              Unlike traditional workflows that force you to switch between multiple tools and
              platforms, Aris keeps your entire research process connected. Your collaborators,
              reviewers, and readers all interact with the same living document.
            </p>
          </div>
        </div>
      </div>

      <div class="preprint-emphasis">
        <div class="preprint-content">
          <h3 class="preprint-title">A Modern Preprint Server—And So Much More</h3>
          <p class="preprint-description">
            While other preprint servers just host static PDFs, Aris lets you share interactive,
            living documents that continue to evolve. Your research stays connected to its review
            history and collaborative process.
          </p>
          <div class="preprint-benefits">
            <div class="benefit-item">
              <IconWorld :size="20" />
              <span>Share immediately while review continues</span>
            </div>
            <div class="benefit-item">
              <IconFileText :size="20" />
              <span>Compatible with all journal submission requirements</span>
            </div>
            <div class="benefit-item">
              <IconDownload :size="20" />
              <span>Import directly from arXiv with one click</span>
            </div>
            <div class="benefit-item">
              <IconGitBranch :size="20" />
              <span>Export with complete review history</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconPencil,
    IconUsers,
    IconEye,
    IconWorld,
    IconCheck,
    IconArrowDown,
    IconFileText,
    IconDownload,
    IconGitBranch,
  } from "@tabler/icons-vue";

  const workflowSteps = [
    {
      title: "Start Writing",
      description:
        "Import from arXiv, upload LaTeX, or start fresh with our templates. Real-time collaboration from day one.",
      icon: IconPencil,
      features: [
        "Import directly from arXiv",
        "LaTeX and RSM support",
        "Real-time collaborative editing",
        "Smart auto-completion",
      ],
    },
    {
      title: "Invite Review",
      description:
        "Transparent peer review with threaded discussions. Your reviewers work directly on your living document.",
      icon: IconEye,
      features: [
        "Transparent review workflows",
        "Contextual comments and suggestions",
        "Expert reviewer matching",
        "Real-time discussion threads",
      ],
    },
    {
      title: "Share as Preprint",
      description:
        "Publish immediately to our modern preprint server while peer review continues in parallel.",
      icon: IconWorld,
      features: [
        "Interactive web-native publication",
        "Continue review after publication",
        "Share immediately with the community",
        "Beautiful responsive design",
      ],
    },
    {
      title: "Journal Ready",
      description:
        "Export to any journal format with complete review history and collaboration data included.",
      icon: IconFileText,
      features: [
        "Export to all journal formats",
        "Include complete review history",
        "Maintain collaboration attribution",
        "One-click submission packages",
      ],
    },
  ];
</script>

<style scoped>
  /* How It Works Section */
  .how-it-works-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .how-it-works-content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(28px, 6vw, 36px);
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

  /* Workflow Steps */
  .workflow-steps {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .workflow-step {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: var(--space-xl);
    align-items: start;
    position: relative;
  }

  .step-visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
  }

  .step-number {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 16px;
    box-shadow: var(--shadow-soft);
  }

  .step-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--gray-50), var(--gray-100));
    border: 2px solid var(--gray-200);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
  }

  .step-content {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
  }

  .step-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .step-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  .step-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .feature-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  .workflow-arrow {
    position: absolute;
    left: 60px;
    bottom: -30px;
    color: var(--primary-400);
    z-index: 1;
  }

  /* Integration Highlight */
  .integration-highlight {
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .highlight-content {
    display: flex;
    align-items: center;
    gap: var(--space-xl);
    max-width: 800px;
    margin: 0 auto;
  }

  .highlight-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .highlight-text {
    flex: 1;
  }

  .highlight-title {
    font-family: "Montserrat", sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .highlight-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin: 0;
  }

  /* Preprint Emphasis */
  .preprint-emphasis {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
  }

  .preprint-content {
    max-width: 700px;
    margin: 0 auto;
  }

  .preprint-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .preprint-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .preprint-benefits {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-md);
  }

  .benefit-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--success-25);
    border: 1px solid var(--success-200);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-700);
    text-align: left;
  }

  .benefit-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .how-it-works-section {
      padding: var(--space-3xl) 0;
    }

    .workflow-step {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .step-visual {
      order: 1;
    }

    .step-content {
      order: 2;
    }

    .workflow-arrow {
      left: 50%;
      transform: translateX(-50%);
    }

    .highlight-content {
      flex-direction: column;
      text-align: center;
    }

    .preprint-benefits {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .step-content {
      padding: var(--space-lg);
    }

    .step-title {
      font-size: 20px;
    }

    .highlight-icon {
      width: 64px;
      height: 64px;
    }

    .preprint-title {
      font-size: 24px;
    }
  }
</style>
