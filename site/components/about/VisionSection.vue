<template>
  <section class="vision-section" aria-labelledby="vision-heading">
    <div class="vision-content-wrapper">
      <div class="vision-content">
        <h2 id="vision-heading" class="vision-title">Why ResOps? The Academic Publishing Crisis</h2>
        <p class="vision-description">
          Academic publishing is broken. Researchers juggle 5+ tools, peer review is a black box,
          and papers are trapped in PDFs. Aris fixes this with integrated ResOps—treating research
          publication as one connected workflow.
        </p>
        <div class="comparison-table">
          <table class="workflow-table">
            <thead>
              <tr>
                <th class="before-header">
                  <IconX :size="20" />
                  <span>Academic Publishing Today</span>
                </th>
                <th class="after-header">
                  <IconCheck :size="20" />
                  <span>With Aris ResOps</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="before-cell">Write in LaTeX, export to Word, submit PDF</td>
                <td class="after-cell">Write in RSM or LaTeX, publish web-native</td>
              </tr>
              <tr>
                <td class="before-cell">Track changes via email attachments</td>
                <td class="after-cell">Git-like version control with semantic diffs</td>
              </tr>
              <tr>
                <td class="before-cell">Peer review happens in editorial black box</td>
                <td class="after-cell">Transparent, integrated review workflows</td>
              </tr>
              <tr>
                <td class="before-cell">Feedback buried in PDF annotations</td>
                <td class="after-cell">Contextual, threaded discussions on every element</td>
              </tr>
              <tr>
                <td class="before-cell">Submit to journal, wait 6+ months for decision</td>
                <td class="after-cell">Streamlined submission with built-in review tools</td>
              </tr>
              <tr>
                <td class="before-cell">Readers struggle with static PDFs</td>
                <td class="after-cell">Interactive papers with embedded data/visualizations</td>
              </tr>
              <tr>
                <td class="before-cell">Citation management in separate tools</td>
                <td class="after-cell">Intelligent reference handling built-in</td>
              </tr>
              <tr>
                <td class="before-cell">Figures locked in static formats</td>
                <td class="after-cell">Dynamic, explorable visualizations</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="vision-ctas">
          <a href="/demo" class="btn btn-primary"> Experience the Vision </a>
          <a href="/signup" class="btn btn-secondary"> Join the Beta </a>
        </div>
      </div>
      <div class="vision-visual">
        <div class="resops-workflow">
          <h3 class="workflow-title">Complete ResOps Workflow</h3>
          <div class="workflow-steps">
            <div class="workflow-step" data-step="write">
              <div class="step-icon">
                <IconEdit :size="24" />
              </div>
              <div class="step-content">
                <h4 class="step-title">Write</h4>
                <p class="step-description">RSM or LaTeX authoring with real-time collaboration</p>
              </div>
            </div>
            <div class="workflow-arrow">→</div>

            <div class="workflow-step" data-step="review">
              <div class="step-icon">
                <IconEye :size="24" />
              </div>
              <div class="step-content">
                <h4 class="step-title">Review</h4>
                <p class="step-description">Integrated peer review (our unique feature)</p>
              </div>
            </div>
            <div class="workflow-arrow">→</div>

            <div class="workflow-step" data-step="publish">
              <div class="step-icon">
                <IconGlobe :size="24" />
              </div>
              <div class="step-content">
                <h4 class="step-title">Publish</h4>
                <p class="step-description">Web-native papers, not PDFs</p>
              </div>
            </div>
          </div>

          <div class="workflow-benefits">
            <div class="benefit-item">
              <IconClock :size="20" />
              <span>Faster publication cycles</span>
            </div>
            <div class="benefit-item">
              <IconShield :size="20" />
              <span>Transparent peer review process</span>
            </div>
            <div class="benefit-item">
              <IconBolt :size="20" />
              <span>No more tool-switching overhead</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconX,
    IconCheck,
    IconEdit,
    IconEye,
    IconGlobe,
    IconClock,
    IconShield,
    IconBolt,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Vision Section - Overall Container */
  .vision-section {
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    padding: var(--space-4xl) 0;
    position: relative;
    overflow: hidden;
  }

  .vision-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4xl);
    align-items: center;
  }

  /* Vision Content */
  .vision-content {
    z-index: 2;
    position: relative;
  }

  .vision-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(32px, 6vw, 48px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.1;
  }

  .vision-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-2xl);
  }

  /* Comparison Table */
  .comparison-table {
    margin-bottom: var(--space-2xl);
  }

  .workflow-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface-page);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--border-primary);
    table-layout: fixed;
    display: table;
  }

  .workflow-table thead {
    display: table-header-group;
  }

  .workflow-table tbody {
    display: table-row-group;
  }

  .workflow-table tr {
    display: table-row;
  }

  .workflow-table th {
    background: var(--gray-50);
    padding: var(--space-lg);
    text-align: left;
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 2px solid var(--border-primary);
    width: 50%;
    display: table-cell;
    vertical-align: middle;
  }

  .before-header {
    color: var(--error-700);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    width: 50%;
  }

  .after-header {
    color: var(--success-700);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    width: 50%;
  }

  .workflow-table td {
    padding: var(--space-lg);
    font-family: "Source Sans 3", sans-serif;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.4;
    border-bottom: 1px solid var(--border-primary);
    display: table-cell;
    vertical-align: middle;
    width: 50%;
  }

  .workflow-table tr:last-child td {
    border-bottom: none;
  }

  .workflow-table tr:hover {
    background: var(--gray-25);
  }

  .before-cell {
    color: var(--error-600);
    border-right: 1px solid var(--border-primary);
  }

  .after-cell {
    color: var(--success-600);
  }

  /* Vision CTAs */
  .vision-ctas {
    display: flex;
    gap: var(--space-lg);
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

  /* Vision Visual */
  .vision-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-height: 400px;
  }

  .resops-workflow {
    width: 100%;
    max-width: 450px;
    padding: var(--space-lg);
    background: var(--surface-page);
    border-radius: 16px;
    box-shadow: var(--shadow-medium);
    border: 1px solid var(--border-primary);
  }

  .workflow-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .workflow-steps {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-xl);
    gap: var(--space-md);
  }

  .workflow-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
    min-width: 100px;
  }

  .workflow-step .step-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-sm);
    transition: all 0.3s ease;
  }

  .workflow-step[data-step="write"] .step-icon {
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    color: var(--primary-600);
  }

  .workflow-step[data-step="review"] .step-icon {
    background: linear-gradient(135deg, var(--warning-100), var(--warning-200));
    color: var(--warning-600);
  }

  .workflow-step[data-step="publish"] .step-icon {
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    color: var(--success-600);
  }

  .workflow-step:hover .step-icon {
    transform: scale(1.1);
  }

  .workflow-step .step-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
    line-height: 1.3;
  }

  .workflow-step .step-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.3;
    color: var(--gray-600);
    margin: 0;
  }

  .workflow-arrow {
    font-size: 20px;
    color: var(--gray-400);
    font-weight: bold;
    flex-shrink: 0;
  }

  .workflow-benefits {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding-top: var(--space-lg);
    border-top: 1px solid var(--border-primary);
  }

  .benefit-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    font-weight: 500;
  }

  .benefit-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .vision-section {
      padding: var(--space-3xl) 0;
    }

    .vision-content-wrapper {
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
      text-align: center;
    }

    .vision-visual {
      order: -1;
      min-height: 300px;
    }

    .resops-workflow {
      max-width: 350px;
    }

    .workflow-steps {
      flex-direction: column;
      gap: var(--space-lg);
    }

    .workflow-arrow {
      transform: rotate(90deg);
      margin: var(--space-sm) 0;
    }

    .workflow-step .step-icon {
      width: 40px;
      height: 40px;
    }

    .workflow-step .step-title {
      font-size: 13px;
    }

    .workflow-step .step-description {
      font-size: 11px;
    }

    .workflow-table th,
    .workflow-table td {
      padding: var(--space-md);
      font-size: 14px;
    }

    .vision-ctas {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .resops-workflow {
      max-width: 300px;
      padding: var(--space-md);
    }

    .workflow-step .step-icon {
      width: 36px;
      height: 36px;
    }

    .workflow-table th,
    .workflow-table td {
      padding: var(--space-sm);
      font-size: 13px;
    }

    .vision-ctas {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 200px;
    }
  }
</style>
