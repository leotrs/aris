<template>
  <section class="platform-overview-section" aria-labelledby="platform-overview-heading">
    <div class="platform-content-wrapper">
      <div class="section-header">
        <h2 id="platform-overview-heading" class="section-title">What is Aris?</h2>
        <p class="section-tagline">
          Collaborative writing. Smart peer review workflows. Web-native publishing.
        </p>
        <p class="section-subtitle">
          The ResOps platform that transforms research workflows with integrated tools, transparent
          processes, and beautiful results.
        </p>
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

      <div class="capabilities-section">
        <h3 class="capabilities-title">Four Core Capabilities</h3>
        <div class="capabilities-grid">
          <div class="capability-card">
            <div class="card-header">
              <div class="card-icon-container">
                <IconUsers :size="32" />
              </div>
              <h4 class="card-title">Intelligent Reviewer Networks</h4>
            </div>
            <p class="card-description">
              Transform every researcher into a potential reviewer. AI-powered expertise matching
              across institutional boundaries creates the largest, most qualified reviewer pool in
              academic publishing.
            </p>
            <div class="capability-highlights">
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Expert matching across institutions</span>
              </div>
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Transparent conflict screening</span>
              </div>
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Quality and speed metrics</span>
              </div>
            </div>
          </div>

          <div class="capability-card">
            <div class="card-header">
              <div class="card-icon-container">
                <IconEdit :size="32" />
              </div>
              <h4 class="card-title">Real-time Collaborative Writing</h4>
            </div>
            <p class="card-description">
              Write together without email chaos. See exactly who's working on what, track changes
              with semantic diffs, and collaborate with co-authors seamlessly in RSM or LaTeX.
            </p>
            <div class="capability-highlights">
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Real-time co-authoring</span>
              </div>
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Version control built-in</span>
              </div>
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>RSM and LaTeX support</span>
              </div>
            </div>
          </div>

          <div class="capability-card">
            <div class="card-header">
              <div class="card-icon-container">
                <IconGitBranch :size="32" />
              </div>
              <h4 class="card-title">Smart Review Workflows</h4>
            </div>
            <p class="card-description">
              Streamlined review processes with intelligent automation. Track every stage, enable
              threaded discussions, and maintain transparency throughout the peer review process.
            </p>
            <div class="capability-highlights">
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Real-time review tracking</span>
              </div>
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Contextual discussions</span>
              </div>
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Transparent workflows</span>
              </div>
            </div>
          </div>

          <div class="capability-card">
            <div class="card-header">
              <div class="card-icon-container">
                <IconDevices :size="32" />
              </div>
              <h4 class="card-title">Web-Native Publishing</h4>
            </div>
            <p class="card-description">
              Beautiful, interactive manuscripts that adapt to any device. Interactive figures,
              embedded data, and typography that readers actually enjoy—beyond PDF limitations.
            </p>
            <div class="capability-highlights">
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Interactive visualizations</span>
              </div>
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Responsive design</span>
              </div>
              <div class="highlight-item">
                <IconCheck :size="14" />
                <span>Beautiful reading experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="platform-cta">
        <div class="cta-content">
          <h3 class="cta-title">Experience Research Operations</h3>
          <p class="cta-description">
            Join researchers who've discovered what happens when writing, reviewing, and publishing
            work together instead of against each other.
          </p>
          <div class="cta-buttons">
            <a href="/demo" class="btn btn-primary">See ResOps in Action</a>
            <a href="/getting-started" class="btn btn-secondary">Get Started</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconUsers, IconEdit, IconGitBranch, IconDevices, IconCheck } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Platform Overview Section - Overall Container */
  .platform-overview-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--primary-25) 100%);
    padding: var(--space-4xl) 0;
    position: relative;
  }

  .platform-content-wrapper {
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
    margin-bottom: var(--space-md);
  }

  .section-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: var(--gray-700);
  }

  /* ResOps Explanation */
  .resops-explanation {
    background: linear-gradient(135deg, var(--primary-50), var(--primary-75));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
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

  /* Capabilities Section */
  .capabilities-section {
    margin-bottom: var(--space-4xl);
  }

  .capabilities-title {
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-3xl);
  }

  .capabilities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-xl);
  }

  .capability-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    transition: all 0.3s ease;
    text-align: center;
  }

  .capability-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .card-header {
    margin-bottom: var(--space-lg);
  }

  .card-icon-container {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--primary-600);
    transition: all 0.3s ease;
  }

  .capability-card:hover .card-icon-container {
    transform: scale(1.1);
  }

  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin: 0;
    line-height: 1.3;
  }

  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  .capability-highlights {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    align-items: center;
  }

  .highlight-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-700);
  }

  .highlight-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Platform CTA */
  .platform-cta {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
    box-shadow: var(--shadow-soft);
  }

  .cta-content {
    max-width: 600px;
    margin: 0 auto;
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
    .platform-overview-section {
      padding: var(--space-3xl) 0;
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

    .capabilities-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .capability-card {
      padding: var(--space-lg);
    }

    .platform-cta {
      padding: var(--space-xl);
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
      max-width: 250px;
    }
  }

  @media (max-width: 480px) {
    .resops-explanation {
      padding: var(--space-lg);
    }

    .resops-title {
      font-size: 22px;
    }

    .capability-card {
      padding: var(--space-md);
    }

    .card-icon-container {
      width: 56px;
      height: 56px;
    }

    .card-title {
      font-size: 18px;
    }

    .cta-title {
      font-size: 22px;
    }
  }
</style>
