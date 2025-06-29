<template>
  <section class="platform-overview-section" aria-labelledby="platform-overview-heading">
    <div class="platform-content-wrapper">
      <div class="section-header">
        <h2 id="platform-overview-heading" class="section-title">What is Aris?</h2>
        <p class="section-tagline">
          A modern preprint server where your research lives and evolves from first draft to publication.
        </p>
        <p class="section-subtitle">
          Write collaboratively, share as preprints, and export to any journal format with one click.
          Your paper's complete journey in one place.
        </p>
      </div>

      <div class="workflow-explanation">
        <div class="workflow-content">
          <h3 class="workflow-title">Why Living Research Documents?</h3>
          <p class="workflow-description">
            Your research should evolve naturally from idea to publication.
            <strong>Living documents grow with your work</strong>—collaborative writing becomes
            transparent review becomes published preprint becomes journal submission. All in one place,
            all connected, all building on each other.
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
              <h4 class="workflow-label">Living Research Workflow</h4>
              <div class="integrated-platform">
                <div class="unified-box">Aris: Draft → Preprint → Any Journal</div>
              </div>
              <p class="workflow-benefit">
                Seamless evolution, zero friction export, continuous collaboration
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="journal-compatibility-section">
        <h3 class="compatibility-title">Export to Any Journal with One Click</h3>
        <p class="compatibility-description">
          Continue your normal publication process with zero friction. Aris handles formatting for thousands of journals automatically.
        </p>
        <div class="journal-examples">
          <div class="journal-flow">
            <div class="aris-document">
              <IconFileText :size="24" />
              <span>Your Aris Document</span>
            </div>
            <div class="export-arrow">→</div>
            <div class="journal-formats">
              <div class="journal-option">Nature</div>
              <div class="journal-option">Science</div>
              <div class="journal-option">PLOS ONE</div>
              <div class="journal-option">Cell</div>
              <div class="journal-option">arXiv</div>
              <div class="journal-option">+ 1000s more</div>
            </div>
          </div>
        </div>
        <div class="compatibility-features">
          <div class="compatibility-feature">
            <IconCheck :size="16" />
            <span>Automatic reference formatting</span>
          </div>
          <div class="compatibility-feature">
            <IconCheck :size="16" />
            <span>Journal-specific templates</span>
          </div>
          <div class="compatibility-feature">
            <IconCheck :size="16" />
            <span>Complete submission packages</span>
          </div>
        </div>
      </div>

      <div class="platform-cta">
        <div class="cta-content">
          <h3 class="cta-title">Experience Integrated Research Workflows</h3>
          <p class="cta-description">
            Join researchers who've discovered what happens when writing, reviewing, and publishing
            work together instead of against each other.
          </p>
          <div class="cta-buttons">
            <a href="/demo" class="btn btn-primary">See the Platform in Action</a>
            <a href="/getting-started" class="btn btn-secondary">Get Started</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconCheck, IconFileText } from "@tabler/icons-vue";
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

  /* Workflow Explanation */
  .workflow-explanation {
    background: linear-gradient(135deg, var(--primary-50), var(--primary-75));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
    text-align: center;
  }

  .workflow-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .workflow-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .workflow-description {
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


  /* Journal Compatibility Section */
  .journal-compatibility-section {
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
    border: 1px solid var(--success-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
    text-align: center;
  }

  .compatibility-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .compatibility-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .journal-examples {
    margin-bottom: var(--space-xl);
  }

  .journal-flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-lg);
    flex-wrap: wrap;
    margin-bottom: var(--space-lg);
  }

  .aris-document {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 2px solid var(--primary-300);
    border-radius: 12px;
    color: var(--primary-600);
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 14px;
  }

  .export-arrow {
    font-size: 24px;
    color: var(--success-600);
    font-weight: bold;
  }

  .journal-formats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: var(--space-sm);
    max-width: 400px;
  }

  .journal-option {
    padding: var(--space-sm);
    background: var(--surface-page);
    border: 1px solid var(--success-300);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--success-700);
    transition: all 0.2s ease;
  }

  .journal-option:hover {
    background: var(--success-100);
    transform: translateY(-1px);
  }

  .compatibility-features {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-lg);
  }

  .compatibility-feature {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-700);
  }

  .compatibility-feature svg {
    color: var(--success-600);
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

    .workflow-explanation {
      padding: var(--space-xl);
    }

    .workflow-title {
      font-size: 24px;
    }

    .workflow-comparison {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }


    .journal-compatibility-section {
      padding: var(--space-xl);
    }

    .compatibility-title {
      font-size: 24px;
    }

    .journal-flow {
      flex-direction: column;
      gap: var(--space-md);
    }

    .journal-formats {
      grid-template-columns: repeat(2, 1fr);
    }

    .compatibility-features {
      flex-direction: column;
      align-items: center;
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
    .workflow-explanation {
      padding: var(--space-lg);
    }

    .workflow-title {
      font-size: 22px;
    }


    .cta-title {
      font-size: 22px;
    }
  }
</style>
