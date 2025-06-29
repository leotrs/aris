<template>
  <section class="resops-revolution-section" aria-labelledby="resops-heading">
    <div class="resops-content-wrapper">
      <div class="section-header">
        <h2 id="resops-heading" class="section-title">The ResOps Revolution</h2>
        <p class="section-subtitle">
          Research deserves the same operational excellence that transformed software development.
          Welcome to the future of academic workflows.
        </p>
      </div>

      <div class="revolution-content">
        <div class="analogy-section">
          <div class="analogy-card">
            <div class="analogy-icon">
              <IconCode :size="40" />
            </div>
            <h3 class="analogy-title">DevOps Transformed Software</h3>
            <p class="analogy-description">
              Before DevOps, developers used separate tools for coding, testing, and deployment.
              Context switching slowed everything down. Then came integrated platforms that unified
              the entire software lifecycle.
            </p>
            <div class="transformation-visual">
              <div class="before-state">
                <span class="tool-badge">Code Editor</span>
                <span class="tool-badge">Testing Suite</span>
                <span class="tool-badge">Deployment Tool</span>
              </div>
              <div class="arrow-transform">
                <IconArrowRight :size="24" />
              </div>
              <div class="after-state">
                <span class="unified-badge">Integrated DevOps Platform</span>
              </div>
            </div>
          </div>

          <div class="analogy-card highlight">
            <div class="analogy-icon">
              <IconFlask :size="40" />
            </div>
            <h3 class="analogy-title">ResOps Transforms Research</h3>
            <p class="analogy-description">
              Research still suffers from the same fragmentation. Separate tools for writing,
              reviewing, and publishing create the same inefficiencies that DevOps solved. It's time
              for change.
            </p>
            <div class="transformation-visual">
              <div class="before-state">
                <span class="tool-badge">LaTeX Editor</span>
                <span class="tool-badge">Email Reviews</span>
                <span class="tool-badge">PDF Publisher</span>
              </div>
              <div class="arrow-transform">
                <IconArrowRight :size="24" />
              </div>
              <div class="after-state">
                <span class="unified-badge primary">Aris ResOps Platform</span>
              </div>
            </div>
          </div>
        </div>

        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">
              <IconBolt :size="28" />
            </div>
            <h3 class="benefit-title">Faster Research Cycles</h3>
            <p class="benefit-description">
              Eliminate context switching between tools. From first draft to published paper in a
              fraction of the time.
            </p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <IconTarget :size="28" />
            </div>
            <h3 class="benefit-title">Reduced Administrative Overhead</h3>
            <p class="benefit-description">
              Smart automation handles version control, reviewer matching, and workflow coordination
              so you can focus on research.
            </p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <IconUsers :size="28" />
            </div>
            <h3 class="benefit-title">Enhanced Collaboration</h3>
            <p class="benefit-description">
              Real-time collaboration with semantic awareness. See exactly what's changing and why,
              with full attribution.
            </p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <IconGlobe :size="28" />
            </div>
            <h3 class="benefit-title">Better Research Communication</h3>
            <p class="benefit-description">
              Interactive, web-native publications that readers actually want to engage with. Make
              your research accessible and impactful.
            </p>
          </div>
        </div>

        <div class="vision-statement">
          <div class="vision-content">
            <h3 class="vision-title">The Inevitable Future</h3>
            <p class="vision-description">
              Every industry has experienced this transformation. Finance moved from paper ledgers
              to integrated systems. Healthcare adopted electronic records. Software development
              embraced DevOps. Research is next.
            </p>
            <blockquote class="vision-quote">
              "The question isn't whether research workflows will become integrated—it's whether
              you'll be part of building that future or waiting for others to build it for you."
            </blockquote>
            <div class="vision-cta">
              <a href="/beta-signup" class="btn btn-primary">Join the ResOps Movement</a>
              <a href="/demo" class="btn btn-secondary">See the Future in Action</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconCode,
    IconFlask,
    IconArrowRight,
    IconBolt,
    IconTarget,
    IconUsers,
    IconGlobe,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* ResOps Revolution Section - Overall Container */
  .resops-revolution-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--primary-25) 100%);
    padding: var(--space-4xl) 0;
    position: relative;
  }

  .resops-content-wrapper {
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

  /* Revolution Content */
  .revolution-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4xl);
  }

  /* Analogy Section */
  .analogy-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
  }

  .analogy-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
    transition: all 0.3s ease;
  }

  .analogy-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .analogy-card.highlight {
    border: 2px solid var(--primary-300);
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
  }

  .analogy-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--gray-100), var(--gray-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--gray-600);
  }

  .analogy-card.highlight .analogy-icon {
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    color: var(--primary-600);
  }

  .analogy-title {
    font-family: "Montserrat", sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .analogy-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  /* Transformation Visual */
  .transformation-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .before-state,
  .after-state {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    align-items: center;
  }

  .tool-badge {
    background: var(--warning-100);
    border: 1px solid var(--warning-200);
    color: var(--warning-700);
    padding: var(--space-xs) var(--space-sm);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
  }

  .unified-badge {
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    border: 2px solid var(--success-300);
    color: var(--success-700);
    padding: var(--space-sm) var(--space-lg);
    border-radius: 8px;
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }

  .unified-badge.primary {
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-color: var(--primary-300);
    color: var(--primary-700);
  }

  .arrow-transform {
    color: var(--primary-500);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Benefits Grid */
  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-xl);
  }

  .benefit-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    text-align: center;
    transition: all 0.3s ease;
  }

  .benefit-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
  }

  .benefit-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--primary-600);
  }

  .benefit-title {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
    line-height: 1.3;
  }

  .benefit-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  /* Vision Statement */
  .vision-statement {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
    box-shadow: var(--shadow-soft);
  }

  .vision-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .vision-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .vision-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .vision-quote {
    font-family: "Source Sans 3", sans-serif;
    font-size: 20px;
    font-style: italic;
    line-height: 1.5;
    color: var(--primary-700);
    margin: var(--space-xl) 0;
    padding: var(--space-lg);
    background: var(--primary-25);
    border-left: 4px solid var(--primary-400);
    border-radius: 0 8px 8px 0;
  }

  .vision-cta {
    display: flex;
    gap: var(--space-lg);
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    padding: var(--space-md) var(--space-xl);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    display: inline-block;
    min-width: 160px;
    text-align: center;
  }

  .btn-primary {
    background: var(--primary-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 154, 233, 0.35);
  }

  .btn-secondary {
    background: var(--white);
    color: var(--primary-600);
    border: 2px solid var(--primary-300);
  }

  .btn-secondary:hover {
    background: var(--primary-50);
    border-color: var(--primary-400);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 154, 233, 0.15);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .resops-revolution-section {
      padding: var(--space-3xl) 0;
    }

    .analogy-section {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .benefits-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .analogy-card {
      padding: var(--space-xl);
    }

    .benefit-card {
      padding: var(--space-lg);
    }

    .vision-statement {
      padding: var(--space-xl);
    }

    .vision-cta {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 250px;
    }
  }

  @media (max-width: 480px) {
    .analogy-card {
      padding: var(--space-lg);
    }

    .analogy-icon {
      width: 64px;
      height: 64px;
    }

    .transformation-visual {
      flex-direction: column;
      gap: var(--space-sm);
    }

    .arrow-transform {
      transform: rotate(90deg);
    }

    .vision-title {
      font-size: 24px;
    }

    .vision-quote {
      font-size: 18px;
      padding: var(--space-md);
    }
  }
</style>
