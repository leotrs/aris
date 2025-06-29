<template>
  <section class="ethics-section" aria-labelledby="ethics-heading">
    <div class="ethics-content-wrapper">
      <div class="section-header">
        <h2 id="ethics-heading" class="section-title">Ethics in Research Publishing</h2>
        <p class="section-subtitle">
          Academic publishing should uphold the highest standards of transparency, integrity, and
          fairness. We reject the extractive practices that have plagued scholarly communication.
        </p>
      </div>

      <div class="ethics-grid">
        <div class="ethics-pillar">
          <div class="pillar-icon">
            <IconEye :size="40" />
          </div>
          <h3 class="pillar-title">Transparent Peer Review</h3>
          <div class="pillar-content">
            <p class="pillar-description">
              Every step of the peer review process is visible and accountable. No black box
              decisions, no hidden biases, no mysterious rejections.
            </p>
            <div class="pillar-practices">
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Open reviewer identities (with consent)</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Public review criteria and standards</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Transparent decision timelines</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Clear conflict of interest policies</span>
              </div>
            </div>
          </div>
        </div>

        <div class="ethics-pillar">
          <div class="pillar-icon">
            <IconShield :size="40" />
          </div>
          <h3 class="pillar-title">Researcher Rights Protection</h3>
          <div class="pillar-content">
            <p class="pillar-description">
              Researchers retain full rights to their work. No copyright transfers, no exclusive
              licensing, no restrictions on sharing publicly funded research.
            </p>
            <div class="pillar-practices">
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Authors retain full copyright</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>No exclusive licensing requirements</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Free sharing and distribution rights</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Protection from predatory practices</span>
              </div>
            </div>
          </div>
        </div>

        <div class="ethics-pillar">
          <div class="pillar-icon">
            <IconUsers :size="40" />
          </div>
          <h3 class="pillar-title">Inclusive Access</h3>
          <div class="pillar-content">
            <p class="pillar-description">
              Knowledge should be accessible to everyone, not just those at well-funded
              institutions. No paywalls, no geographic restrictions, no artificial barriers.
            </p>
            <div class="pillar-practices">
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Free access for all readers</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>No geographic or institutional barriers</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Accessible design for all abilities</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Multi-language support (planned)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="ethics-pillar">
          <div class="pillar-icon">
            <IconScale :size="40" />
          </div>
          <h3 class="pillar-title">Fair Economics</h3>
          <div class="pillar-content">
            <p class="pillar-description">
              Publishing costs should reflect actual value delivered, not market exploitation. No
              profit extraction from publicly funded research.
            </p>
            <div class="pillar-practices">
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Transparent cost structure</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Non-profit operation model</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>Community-funded infrastructure</span>
              </div>
              <div class="practice-item">
                <IconCheck :size="16" />
                <span>No shareholder profit extraction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ethics-statement">
        <div class="statement-container">
          <h3 class="statement-title">Against Extractive Publishing</h3>
          <div class="problems-solutions">
            <div class="problem-column">
              <h4 class="column-title">The Current System</h4>
              <div class="problem-list">
                <div class="problem-item">
                  <IconX :size="16" />
                  <span>38% profit margins on public research</span>
                </div>
                <div class="problem-item">
                  <IconX :size="16" />
                  <span>Researchers give away copyright for free</span>
                </div>
                <div class="problem-item">
                  <IconX :size="16" />
                  <span>Institutions pay twice (funding + access)</span>
                </div>
                <div class="problem-item">
                  <IconX :size="16" />
                  <span>Opaque peer review processes</span>
                </div>
                <div class="problem-item">
                  <IconX :size="16" />
                  <span>Artificial scarcity and paywalls</span>
                </div>
              </div>
            </div>
            <div class="solution-column">
              <h4 class="column-title">The Aris Alternative</h4>
              <div class="solution-list">
                <div class="solution-item">
                  <IconCheck :size="16" />
                  <span>Zero profit extraction from research</span>
                </div>
                <div class="solution-item">
                  <IconCheck :size="16" />
                  <span>Researchers retain all rights</span>
                </div>
                <div class="solution-item">
                  <IconCheck :size="16" />
                  <span>Sustainable community funding model</span>
                </div>
                <div class="solution-item">
                  <IconCheck :size="16" />
                  <span>Transparent review workflows</span>
                </div>
                <div class="solution-item">
                  <IconCheck :size="16" />
                  <span>Universal access by design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconEye, IconShield, IconUsers, IconScale, IconCheck, IconX } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Ethics Section */
  .ethics-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--gray-50) 100%);
    padding: var(--space-4xl) 0;
  }

  .ethics-content-wrapper {
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

  /* Ethics Grid */
  .ethics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .ethics-pillar {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    text-align: center;
    transition: all 0.3s ease;
  }

  .ethics-pillar:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .pillar-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--primary-600);
  }

  .pillar-title {
    font-family: "Montserrat", sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .pillar-content {
    text-align: left;
  }

  .pillar-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
    text-align: center;
  }

  .pillar-practices {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .practice-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .practice-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Ethics Statement */
  .ethics-statement {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    box-shadow: var(--shadow-soft);
  }

  .statement-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .statement-title {
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .problems-solutions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
  }

  .problem-column,
  .solution-column {
    padding: var(--space-lg);
    border-radius: 12px;
  }

  .problem-column {
    background: linear-gradient(135deg, var(--error-25), var(--error-50));
    border: 1px solid var(--error-200);
  }

  .solution-column {
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
    border: 1px solid var(--success-200);
  }

  .column-title {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    text-align: center;
  }

  .problem-list,
  .solution-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .problem-item,
  .solution-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .problem-item svg {
    color: var(--error-600);
    flex-shrink: 0;
  }

  .solution-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .ethics-section {
      padding: var(--space-3xl) 0;
    }

    .ethics-grid {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .ethics-pillar {
      padding: var(--space-lg);
    }

    .pillar-icon {
      width: 64px;
      height: 64px;
    }

    .problems-solutions {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .ethics-statement {
      padding: var(--space-xl);
    }

    .statement-title {
      font-size: 28px;
    }
  }

  @media (max-width: 480px) {
    .ethics-pillar {
      padding: var(--space-md);
    }

    .pillar-icon {
      width: 56px;
      height: 56px;
    }

    .pillar-title {
      font-size: 20px;
    }

    .ethics-statement {
      padding: var(--space-lg);
    }

    .statement-title {
      font-size: 24px;
    }

    .problem-column,
    .solution-column {
      padding: var(--space-md);
    }
  }
</style>
