<template>
  <section class="human-first-section" aria-labelledby="human-first-heading">
    <div class="human-first-content-wrapper">
      <div class="section-header">
        <h2 id="human-first-heading" class="section-title">Publish and Flourish</h2>
        <p class="section-subtitle">
          Moving beyond "publish or perish" to a world where research communication helps careers
          and communities thrive. Whether you're writing, reviewing, or reading research, we've
          designed tools that respect your time and enhance your work.
        </p>
      </div>

      <div class="human-first-grid">
        <div class="philosophy-content">
          <div class="principle-block">
            <h3 class="principle-title">For Authors</h3>
            <p class="principle-description">
              Beautiful writing environment with real-time collaboration. See exactly who's working
              on what, track changes with semantic diffs, and collaborate with co-authors without
              email chaos. Your manuscripts look professional from day one.
            </p>
          </div>

          <div class="principle-block">
            <h3 class="principle-title">For Reviewers</h3>
            <p class="principle-description">
              Modern tools that respect your time. Clear commenting interfaces, version tracking
              that actually works, and recognition for quality reviews. No more fighting with clunky
              journal portals or losing track of your feedback.
            </p>
          </div>

          <div class="principle-block">
            <h3 class="principle-title">For Readers</h3>
            <p class="principle-description">
              Papers that adapt to your device and reading style. Interactive figures you can
              explore, smooth typography that's easy on your eyes, and smart navigation that helps
              you find exactly what you need.
            </p>
          </div>
        </div>

        <div class="philosophy-visual">
          <div class="user-journey-visualization">
            <h3 class="journey-title">Your Research Journey with Aris</h3>

            <div class="journey-timeline">
              <div class="journey-step" data-step="1">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4 class="step-title">Write & Collaborate</h4>
                  <p class="step-description">
                    Start writing in RSM or LaTeX with real-time co-author collaboration
                  </p>
                </div>
              </div>

              <div class="journey-connector"></div>

              <div class="journey-step" data-step="2">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4 class="step-title">Review & Iterate</h4>
                  <p class="step-description">
                    Track peer review progress with transparent, contextual feedback
                  </p>
                </div>
              </div>

              <div class="journey-connector"></div>

              <div class="journey-step" data-step="3">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4 class="step-title">Publish & Share</h4>
                  <p class="step-description">
                    Release beautiful, interactive papers that readers actually enjoy
                  </p>
                </div>
              </div>
            </div>

            <div class="journey-benefits">
              <div class="benefit-highlight">
                <IconCheck :size="16" />
                <span>One platform, complete workflow</span>
              </div>
              <div class="benefit-highlight">
                <IconCheck :size="16" />
                <span>Beautiful tools you'll want to use</span>
              </div>
              <div class="benefit-highlight">
                <IconCheck :size="16" />
                <span>Community-driven development</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconCheck } from "@tabler/icons-vue";
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

  .user-journey-visualization {
    width: 100%;
    max-width: 450px;
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-xl);
    box-shadow: var(--shadow-soft);
  }

  .journey-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .journey-timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
  }

  .journey-step {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--primary-25);
    border: 1px solid var(--primary-100);
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .journey-step:hover {
    transform: translateX(4px);
    background: var(--primary-50);
  }

  .step-number {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;
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
    font-size: 13px;
    line-height: 1.4;
    color: var(--gray-600);
    margin: 0;
  }

  .journey-connector {
    width: 2px;
    height: 16px;
    background: var(--primary-200);
    margin: 0 auto;
    margin-left: 16px;
  }

  .journey-benefits {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding-top: var(--space-lg);
    border-top: 1px solid var(--border-primary);
  }

  .benefit-highlight {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    font-weight: 500;
  }

  .benefit-highlight svg {
    color: var(--success-600);
    flex-shrink: 0;
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

    .user-journey-visualization {
      max-width: 400px;
      padding: var(--space-lg);
    }

    .journey-step {
      padding: var(--space-sm);
    }

    .step-number {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }

    .step-title {
      font-size: 14px;
    }

    .step-description {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .user-journey-visualization {
      max-width: 350px;
      padding: var(--space-md);
    }

    .step-number {
      width: 24px;
      height: 24px;
      font-size: 11px;
    }

    .journey-title {
      font-size: 18px;
    }

    .benefit-highlight {
      font-size: 12px;
    }
  }
</style>
