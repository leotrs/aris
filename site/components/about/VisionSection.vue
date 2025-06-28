<template>
  <section class="vision-section" aria-labelledby="vision-heading">
    <div class="vision-content-wrapper">
      <div class="vision-content">
        <h2 id="vision-heading" class="vision-title">Research Operations (ResOps)</h2>
        <p class="vision-description">
          ResOps encompasses everything that happens between completing your research and your audience consuming it. Just as DevOps revolutionized software development, ResOps streamlines the entire research publication pipeline—from writing to reading.
        </p>
        <div class="vision-highlights">
          <div class="highlight-row">
            <div class="highlight-item">
              <div class="highlight-number">
                <IconInfinity :size="24" />
              </div>
              <span class="highlight-label">Limitless collaboration</span>
            </div>
            <div class="highlight-item">
              <div class="highlight-number">
                <IconTarget :size="24" />
              </div>
              <span class="highlight-label">Focused research</span>
            </div>
          </div>
          <div class="highlight-row">
            <div class="highlight-item">
              <div class="highlight-number">
                <IconWorld :size="24" />
              </div>
              <span class="highlight-label">Global impact</span>
            </div>
            <div class="highlight-item">
              <div class="highlight-number">
                <IconBulb :size="24" />
              </div>
              <span class="highlight-label">Human creativity</span>
            </div>
          </div>
        </div>
        <div class="vision-ctas">
          <a href="/demo" class="btn btn-primary"> Experience the Vision </a>
          <a href="/signup" class="btn btn-secondary"> Join the Beta </a>
        </div>
      </div>
      <div class="vision-visual">
        <div class="research-journey">
          <div class="journey-path">
            <div class="journey-step step-1" data-step="write">
              <div class="step-icon">
                <IconEdit :size="24" />
              </div>
              <div class="step-content">
                <h4 class="step-title">Write</h4>
                <p class="step-description">Transform research into manuscripts</p>
              </div>
            </div>
            <div class="journey-connector connector-1"></div>
            
            <div class="journey-step step-2" data-step="collaborate">
              <div class="step-icon">
                <IconUsers :size="24" />
              </div>
              <div class="step-content">
                <h4 class="step-title">Collaborate</h4>
                <p class="step-description">Co-author and refine together</p>
              </div>
            </div>
            <div class="journey-connector connector-2"></div>
            
            <div class="journey-step step-3" data-step="review">
              <div class="step-icon">
                <IconEye :size="24" />
              </div>
              <div class="step-content">
                <h4 class="step-title">Review</h4>
                <p class="step-description">Peer review and editorial process</p>
              </div>
            </div>
            <div class="journey-connector connector-3"></div>
            
            <div class="journey-step step-4" data-step="publish">
              <div class="step-icon">
                <IconBroadcast :size="24" />
              </div>
              <div class="step-content">
                <h4 class="step-title">Publish</h4>
                <p class="step-description">Share with the research community</p>
              </div>
            </div>
            <div class="journey-connector connector-4"></div>
            
            <div class="journey-step step-5" data-step="consume">
              <div class="step-icon">
                <IconBook :size="24" />
              </div>
              <div class="step-content">
                <h4 class="step-title">Read</h4>
                <p class="step-description">Audience consumes and builds upon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconInfinity,
    IconTarget,
    IconWorld,
    IconBulb,
    IconEdit,
    IconUsers,
    IconEye,
    IconBroadcast,
    IconBook,
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

  /* Vision Highlights */
  .vision-highlights {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-2xl);
  }

  .highlight-row {
    display: flex;
    gap: var(--space-xl);
  }

  .highlight-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex: 1;
  }

  .highlight-number {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--primary-600);
  }

  .highlight-label {
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    color: var(--gray-700);
    font-size: 16px;
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

  .research-journey {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }

  .journey-path {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
  }

  .journey-step {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    padding: var(--space-lg);
    background: var(--surface-page);
    border-radius: 16px;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--border-primary);
    position: relative;
    transition: all 0.3s ease;
    z-index: 2;
  }

  .journey-step:hover {
    transform: translateX(8px);
    box-shadow: var(--shadow-medium);
  }

  .step-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .journey-step[data-step="write"] .step-icon {
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    color: var(--primary-600);
  }

  .journey-step[data-step="collaborate"] .step-icon {
    background: linear-gradient(135deg, var(--secondary-100), var(--secondary-200));
    color: var(--secondary-600);
  }

  .journey-step[data-step="review"] .step-icon {
    background: linear-gradient(135deg, var(--warning-100), var(--warning-200));
    color: var(--warning-600);
  }

  .journey-step[data-step="publish"] .step-icon {
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    color: var(--success-600);
  }

  .journey-step[data-step="consume"] .step-icon {
    background: linear-gradient(135deg, var(--gray-100), var(--gray-200));
    color: var(--gray-600);
  }

  .journey-step:hover .step-icon {
    transform: scale(1.1);
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
    line-height: 1.3;
  }

  .step-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-600);
    margin: 0;
  }

  .journey-connector {
    width: 2px;
    height: 24px;
    background: linear-gradient(180deg, var(--gray-300), var(--gray-400));
    margin: 0 auto;
    margin-left: calc(var(--space-lg) + 24px);
    border-radius: 1px;
    z-index: 1;
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

    .research-journey {
      max-width: 300px;
    }

    .journey-step {
      padding: var(--space-md);
      gap: var(--space-md);
    }

    .step-icon {
      width: 40px;
      height: 40px;
    }

    .step-title {
      font-size: 14px;
    }

    .step-description {
      font-size: 13px;
    }

    .highlight-row {
      justify-content: center;
    }

    .vision-ctas {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .research-journey {
      max-width: 280px;
    }

    .journey-step {
      padding: var(--space-sm);
      gap: var(--space-sm);
    }

    .step-icon {
      width: 36px;
      height: 36px;
    }

    .highlight-row {
      flex-direction: column;
      gap: var(--space-sm);
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
