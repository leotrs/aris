<template>
  <section class="what-is-aris-section" aria-labelledby="what-is-aris-heading">
    <div class="what-is-aris-content-wrapper">
      <div class="section-header">
        <h2 id="what-is-aris-heading" class="section-title">What is Aris?</h2>
        <p class="section-tagline">
          Collaborative writing. Smart peer review workflows. Web-native publishing.
        </p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card" data-pillar="collaboration">
          <div class="pillar-visual">
            <div class="pillar-icon">
              <IconUsers :size="32" />
            </div>
            <div class="pillar-animation">
              <div class="collaboration-dots">
                <div class="dot active"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
          </div>
          <div class="pillar-content">
            <h3 class="pillar-title">Collaborative Writing</h3>
            <p class="pillar-description">
              Real-time co-authoring with version control. See who's working on what, track changes
              with semantic diffs, and collaborate without email chaos.
            </p>
            <div class="pillar-features">
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Real-time editing</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Version control built-in</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pillar-card" data-pillar="review">
          <div class="pillar-visual">
            <div class="pillar-icon">
              <IconGitBranch :size="32" />
            </div>
            <div class="pillar-animation">
              <div class="workflow-steps">
                <div class="step-dot complete"></div>
                <div class="step-line"></div>
                <div class="step-dot active"></div>
                <div class="step-line"></div>
                <div class="step-dot"></div>
              </div>
            </div>
          </div>
          <div class="pillar-content">
            <h3 class="pillar-title">Smart Peer Review Workflows</h3>
            <p class="pillar-description">
              Streamlined review processes with intelligent reviewer matching, transparent conflict
              screening, and automated administrative tasks.
            </p>
            <div class="pillar-features">
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Intelligent reviewer matching</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Transparent workflows</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pillar-card" data-pillar="publishing">
          <div class="pillar-visual">
            <div class="pillar-icon">
              <IconDevices :size="32" />
            </div>
            <div class="pillar-animation">
              <div class="device-preview">
                <div class="device desktop"></div>
                <div class="device tablet"></div>
                <div class="device mobile"></div>
              </div>
            </div>
          </div>
          <div class="pillar-content">
            <h3 class="pillar-title">Web-Native Publishing</h3>
            <p class="pillar-description">
              Beautiful, interactive manuscripts that adapt to any device. Interactive figures,
              embedded data, and typography that readers actually enjoy.
            </p>
            <div class="pillar-features">
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Interactive visualizations</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Responsive design</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="resops-explanation">
        <div class="resops-content">
          <h3 class="resops-title">Why ResOps? Why One Platform?</h3>
          <p class="resops-description">
            Just like DevOps revolutionized software development by integrating previously
            fragmented tools, <strong>ResOps transforms research workflows</strong>. No more
            switching between separate writing tools, clunky review portals, and static publishing
            systems.
          </p>
          <div class="workflow-comparison">
            <div class="workflow-before">
              <h4 class="workflow-label">Fragmented Tools</h4>
              <div class="fragmented-tools">
                <div class="tool-box">LaTeX Editor</div>
                <div class="arrow">→</div>
                <div class="tool-box">Email Reviews</div>
                <div class="arrow">→</div>
                <div class="tool-box">PDF Publisher</div>
              </div>
              <p class="workflow-pain">Context switching, version chaos, administrative overhead</p>
            </div>
            <div class="workflow-after">
              <h4 class="workflow-label">ResOps Integration</h4>
              <div class="integrated-platform">
                <div class="unified-box">Aris Platform</div>
              </div>
              <p class="workflow-benefit">
                Seamless workflow, intelligent automation, beautiful results
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="integration-message">
        <div class="integration-content">
          <h3 class="integration-title">Experience Research Operations</h3>
          <p class="integration-description">
            Join researchers who've discovered what happens when writing, reviewing, and publishing
            work together instead of against each other.
          </p>
          <a href="/demo" class="btn btn-primary">See ResOps in Action</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconUsers, IconGitBranch, IconDevices, IconCheck } from "@tabler/icons-vue";
</script>

<style scoped>
  /* What is Aris Section - Overall Container */
  .what-is-aris-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--primary-25) 100%);
    padding: var(--space-4xl) 0;
    position: relative;
  }

  .what-is-aris-content-wrapper {
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
    font-size: clamp(28px, 6vw, 36px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.2;
  }

  .section-tagline {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 600;
    color: var(--primary-700);
    line-height: 1.4;
  }

  /* Pillars Grid */
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  /* Pillar Cards */
  .pillar-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .pillar-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .pillar-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-large);
  }

  .pillar-card:hover::before {
    opacity: 1;
  }

  .pillar-card[data-pillar="collaboration"]::before {
    background: linear-gradient(90deg, var(--success-500), var(--success-600));
  }

  .pillar-card[data-pillar="review"]::before {
    background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
  }

  .pillar-card[data-pillar="publishing"]::before {
    background: linear-gradient(90deg, var(--warning-500), var(--warning-600));
  }

  /* Pillar Visual */
  .pillar-visual {
    height: 100px;
    margin-bottom: var(--space-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gray-25);
    border-radius: 12px;
    border: 1px solid var(--border-primary);
    position: relative;
  }

  .pillar-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    z-index: 2;
  }

  /* Pillar Animations */
  .pillar-animation {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Collaboration Animation */
  .collaboration-dots {
    display: flex;
    gap: 8px;
    position: absolute;
    bottom: 20px;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: var(--gray-300);
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .dot.active {
    background: var(--success-500);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }

  /* Review Workflow Animation */
  .workflow-steps {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 20px;
  }

  .step-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--gray-300);
    transition: all 0.3s ease;
  }

  .step-dot.complete {
    background: var(--success-500);
  }

  .step-dot.active {
    background: var(--primary-500);
    animation: pulse 2s ease-in-out infinite;
  }

  .step-line {
    width: 20px;
    height: 2px;
    background: var(--gray-200);
    margin: 0 4px;
  }

  /* Publishing Animation */
  .device-preview {
    display: flex;
    gap: 4px;
    align-items: flex-end;
    position: absolute;
    bottom: 20px;
  }

  .device {
    background: var(--primary-100);
    border-radius: 2px;
    animation: deviceScale 3s ease-in-out infinite;
  }

  .device.desktop {
    width: 20px;
    height: 12px;
    animation-delay: 0s;
  }

  .device.tablet {
    width: 14px;
    height: 16px;
    animation-delay: 0.5s;
  }

  .device.mobile {
    width: 8px;
    height: 14px;
    animation-delay: 1s;
  }

  @keyframes deviceScale {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
    33% {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  /* Pillar Content */
  .pillar-content {
    text-align: center;
  }

  .pillar-title {
    font-family: "Montserrat", sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .pillar-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  /* Pillar Features */
  .pillar-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    align-items: center;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-700);
  }

  .feature-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* ResOps Explanation */
  .resops-explanation {
    background: linear-gradient(135deg, var(--primary-50), var(--primary-75));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-2xl);
    text-align: center;
  }

  .resops-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .resops-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .resops-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .workflow-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
    margin-top: var(--space-xl);
  }

  .workflow-before,
  .workflow-after {
    background: var(--surface-page);
    border-radius: 12px;
    padding: var(--space-lg);
    border: 1px solid var(--border-primary);
  }

  .workflow-label {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: var(--space-md);
    text-align: center;
  }

  .fragmented-tools {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
    flex-wrap: wrap;
  }

  .tool-box {
    background: var(--warning-100);
    border: 1px solid var(--warning-200);
    color: var(--warning-700);
    padding: var(--space-xs) var(--space-sm);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  .arrow {
    color: var(--gray-400);
    font-weight: bold;
    font-size: 14px;
  }

  .integrated-platform {
    display: flex;
    justify-content: center;
    margin-bottom: var(--space-md);
  }

  .unified-box {
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    border: 2px solid var(--success-300);
    color: var(--success-700);
    padding: var(--space-sm) var(--space-lg);
    border-radius: 8px;
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
  }

  .workflow-pain {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--warning-600);
    margin: 0;
    font-style: italic;
    text-align: center;
  }

  .workflow-benefit {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--success-600);
    margin: 0;
    font-weight: 500;
    text-align: center;
  }

  /* Integration Message */
  .integration-message {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
    box-shadow: var(--shadow-soft);
  }

  .integration-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .integration-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .integration-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
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

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .what-is-aris-section {
      padding: var(--space-3xl) 0;
    }

    .pillars-grid {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .pillar-card {
      padding: var(--space-xl);
    }

    .pillar-visual {
      height: 80px;
    }

    .pillar-icon {
      width: 48px;
      height: 48px;
    }

    .resops-explanation {
      padding: var(--space-xl);
    }

    .resops-title {
      font-size: 24px;
    }

    .workflow-comparison {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .integration-message {
      padding: var(--space-xl);
    }

    .integration-title {
      font-size: 24px;
    }
  }

  @media (max-width: 480px) {
    .pillar-card {
      padding: var(--space-lg);
    }

    .pillar-visual {
      height: 70px;
    }

    .pillar-icon {
      width: 40px;
      height: 40px;
    }

    .pillar-title {
      font-size: 20px;
    }

    .resops-explanation {
      padding: var(--space-lg);
    }

    .resops-title {
      font-size: 22px;
    }

    .integration-title {
      font-size: 22px;
    }
  }
</style>
