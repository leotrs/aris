<template>
  <section class="three-innovations-section" aria-labelledby="innovations-heading">
    <div class="innovations-content-wrapper">
      <div class="section-header">
        <h2 id="innovations-heading" class="section-title">Three Core Innovations</h2>
        <p class="section-subtitle">
          The breakthrough technologies that make Aris uniquely powerful for modern research
          communication.
        </p>
      </div>

      <div class="innovations-grid">
        <div class="innovation-card" data-innovation="networks">
          <div class="innovation-visual">
            <div class="network-preview">
              <div class="central-node">
                <IconServer :size="24" />
              </div>
              <div class="connected-nodes">
                <div class="node node-1">
                  <IconBuilding :size="16" />
                </div>
                <div class="node node-2">
                  <IconBuilding :size="16" />
                </div>
                <div class="node node-3">
                  <IconBuilding :size="16" />
                </div>
              </div>
            </div>
          </div>
          <div class="innovation-content">
            <h3 class="innovation-title">Institutional Reviewer Networks</h3>
            <p class="innovation-description">
              Transform every researcher into a potential reviewer. AI-powered expertise matching
              across institutional boundaries creates the largest, most qualified reviewer pool in
              academic publishing.
            </p>
            <div class="innovation-benefits">
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Smart reviewer matching</span>
              </div>
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Transparent conflict screening</span>
              </div>
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Growing network effects</span>
              </div>
            </div>
          </div>
        </div>

        <div class="innovation-card" data-innovation="web-native">
          <div class="innovation-visual">
            <div class="paper-preview">
              <div class="paper-header">
                <div class="paper-title"></div>
                <div class="paper-authors"></div>
              </div>
              <div class="paper-content">
                <div class="interactive-figure">
                  <div class="figure-chart">
                    <IconChartLine :size="24" />
                  </div>
                  <div class="figure-controls">
                    <div class="control-dot"></div>
                    <div class="control-dot"></div>
                    <div class="control-dot"></div>
                  </div>
                </div>
                <div class="paper-text">
                  <div class="text-line"></div>
                  <div class="text-line short"></div>
                  <div class="text-line"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="innovation-content">
            <h3 class="innovation-title">Web-Native Research Papers</h3>
            <p class="innovation-description">
              Interactive visualizations, embedded data, and responsive design make research papers
              that adapt to any device. Beautiful typography and smart navigation create reading
              experiences researchers actually enjoy.
            </p>
            <div class="innovation-benefits">
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Interactive figures and data</span>
              </div>
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Responsive, accessible design</span>
              </div>
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Beautiful reading experience</span>
              </div>
            </div>
          </div>
        </div>

        <div class="innovation-card" data-innovation="workflow">
          <div class="innovation-visual">
            <div class="workflow-preview">
              <div class="workflow-step active">
                <IconEdit :size="16" />
                <span>Write</span>
              </div>
              <div class="workflow-arrow">→</div>
              <div class="workflow-step">
                <IconEye :size="16" />
                <span>Review</span>
              </div>
              <div class="workflow-arrow">→</div>
              <div class="workflow-step">
                <IconGlobe :size="16" />
                <span>Publish</span>
              </div>
            </div>
          </div>
          <div class="innovation-content">
            <h3 class="innovation-title">Integrated Workflow Platform</h3>
            <p class="innovation-description">
              Write, review, and publish in one place. Version control meets academic publishing
              with real-time collaboration tools that respect the research process while eliminating
              administrative overhead.
            </p>
            <div class="innovation-benefits">
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>End-to-end workflow</span>
              </div>
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Real-time collaboration</span>
              </div>
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Version control built-in</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="innovations-cta">
        <h3 class="cta-title">Experience All Three Innovations Together</h3>
        <p class="cta-description">
          See how institutional networks, web-native papers, and integrated workflows transform
          research communication.
        </p>
        <div class="cta-buttons">
          <a href="/demo" class="btn btn-primary">Try the Platform</a>
          <a href="/institutions" class="btn btn-secondary">Join Your Institution</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconServer,
    IconBuilding,
    IconCheck,
    IconChartLine,
    IconEdit,
    IconEye,
    IconGlobe,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Three Innovations Section - Overall Container */
  .three-innovations-section {
    background: linear-gradient(135deg, var(--primary-25) 0%, var(--primary-50) 100%);
    padding: var(--space-4xl) 0;
    position: relative;
  }

  .innovations-content-wrapper {
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

  /* Innovations Grid */
  .innovations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  /* Innovation Cards */
  .innovation-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .innovation-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .innovation-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-large);
  }

  .innovation-card:hover::before {
    opacity: 1;
  }

  .innovation-card[data-innovation="networks"]::before {
    background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
  }

  .innovation-card[data-innovation="web-native"]::before {
    background: linear-gradient(90deg, var(--success-500), var(--success-600));
  }

  .innovation-card[data-innovation="workflow"]::before {
    background: linear-gradient(90deg, var(--warning-500), var(--warning-600));
  }

  /* Innovation Visual */
  .innovation-visual {
    height: 120px;
    margin-bottom: var(--space-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gray-25);
    border-radius: 12px;
    border: 1px solid var(--border-primary);
  }

  /* Network Preview */
  .network-preview {
    position: relative;
    width: 120px;
    height: 80px;
  }

  .central-node {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    z-index: 2;
  }

  .connected-nodes {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .node {
    position: absolute;
    width: 28px;
    height: 28px;
    background: var(--surface-page);
    border: 2px solid var(--primary-200);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
  }

  .node-1 {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .node-2 {
    bottom: 0;
    left: 10px;
  }

  .node-3 {
    bottom: 0;
    right: 10px;
  }

  /* Paper Preview */
  .paper-preview {
    width: 140px;
    height: 90px;
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    padding: var(--space-sm);
    display: flex;
    flex-direction: column;
  }

  .paper-header {
    margin-bottom: var(--space-xs);
  }

  .paper-title {
    height: 8px;
    background: var(--gray-300);
    border-radius: 2px;
    margin-bottom: 4px;
  }

  .paper-authors {
    height: 4px;
    background: var(--gray-200);
    border-radius: 2px;
    width: 60%;
  }

  .paper-content {
    display: flex;
    gap: var(--space-xs);
    flex: 1;
  }

  .interactive-figure {
    width: 40px;
    background: var(--primary-25);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .figure-chart {
    color: var(--primary-500);
  }

  .figure-controls {
    display: flex;
    gap: 2px;
  }

  .control-dot {
    width: 4px;
    height: 4px;
    background: var(--primary-400);
    border-radius: 50%;
  }

  .paper-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: center;
  }

  .text-line {
    height: 3px;
    background: var(--gray-200);
    border-radius: 2px;
  }

  .text-line.short {
    width: 70%;
  }

  /* Workflow Preview */
  .workflow-preview {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .workflow-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: var(--space-xs);
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  .workflow-step.active {
    background: var(--warning-25);
    color: var(--warning-700);
  }

  .workflow-step span {
    font-family: "Source Sans 3", sans-serif;
    font-size: 10px;
    font-weight: 600;
  }

  .workflow-arrow {
    font-size: 14px;
    color: var(--gray-400);
    font-weight: bold;
  }

  /* Innovation Content */
  .innovation-content {
    text-align: center;
  }

  .innovation-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .innovation-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  /* Innovation Benefits */
  .innovation-benefits {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    align-items: center;
  }

  .benefit-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-700);
  }

  .benefit-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Innovations CTA */
  .innovations-cta {
    text-align: center;
    padding: var(--space-2xl);
    background: var(--surface-page);
    border-radius: 16px;
    border: 1px solid var(--border-primary);
    box-shadow: var(--shadow-soft);
  }

  .cta-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .cta-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-buttons {
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
    .three-innovations-section {
      padding: var(--space-3xl) 0;
    }

    .innovations-grid {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .innovation-card {
      padding: var(--space-xl);
    }

    .innovation-visual {
      height: 100px;
    }

    .cta-title {
      font-size: 24px;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 200px;
    }
  }

  @media (max-width: 480px) {
    .innovation-card {
      padding: var(--space-lg);
    }

    .innovation-visual {
      height: 80px;
    }

    .innovations-cta {
      padding: var(--space-xl);
    }

    .cta-title {
      font-size: 20px;
    }
  }
</style>
