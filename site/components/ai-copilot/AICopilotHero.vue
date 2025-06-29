<template>
  <section class="ai-copilot-hero-section" aria-labelledby="ai-hero-heading">
    <div class="hero-content-wrapper">
      <div class="hero-content">
        <div class="hero-badge">
          <IconSparkles :size="16" />
          <span>AI-Powered Research Assistant</span>
        </div>
        <h1 id="ai-hero-heading" class="hero-headline">
          Your AI Copilot for Academic Writing
        </h1>
        <p class="hero-subheadline">
          Intelligent writing assistance that understands research. Get contextual suggestions, 
          citation help, and writing improvements while maintaining complete control over your work.
        </p>
        <div class="hero-features">
          <div class="feature-highlight">
            <IconBrain :size="20" />
            <span>Context-aware suggestions</span>
          </div>
          <div class="feature-highlight">
            <IconBook :size="20" />
            <span>Citation assistance</span>
          </div>
          <div class="feature-highlight">
            <IconShield :size="20" />
            <span>Privacy-first design</span>
          </div>
        </div>
        <div class="hero-ctas">
          <a href="/demo" class="btn btn-primary">Try AI Features</a>
          <a href="#ai-capabilities" class="btn btn-secondary">Learn More</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="ai-demo-mockup">
          <div class="mockup-header">
            <div class="mockup-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="mockup-title">Research Document</div>
          </div>
          <div class="mockup-content">
            <div class="text-line">
              <span class="text">The results demonstrate a significant</span>
              <div class="ai-suggestion">
                <IconSparkles :size="12" />
                <span class="suggestion-text">correlation between...</span>
              </div>
            </div>
            <div class="text-line">
              <span class="text">Previous studies have shown</span>
              <div class="citation-help">
                <IconBook :size="12" />
                <span class="citation-text">(Smith et al., 2023)</span>
              </div>
            </div>
            <div class="text-line">
              <span class="text">Our methodology follows</span>
            </div>
            <div class="ai-writing-assist">
              <div class="assist-header">
                <IconBrain :size="14" />
                <span>Writing Assistant</span>
              </div>
              <div class="assist-suggestions">
                <div class="suggestion">Improve clarity</div>
                <div class="suggestion">Add citation</div>
                <div class="suggestion">Check grammar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconSparkles, IconBrain, IconBook, IconShield } from "@tabler/icons-vue";
</script>

<style scoped>
  /* AI Copilot Hero Section */
  .ai-copilot-hero-section {
    background: linear-gradient(135deg, var(--primary-25) 0%, var(--success-25) 50%, var(--warning-25) 100%);
    padding: var(--space-4xl) 0;
    position: relative;
    overflow: hidden;
  }

  .hero-content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4xl);
    align-items: center;
  }

  /* Hero Content */
  .hero-content {
    position: relative;
    z-index: 2;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border: 1px solid var(--primary-300);
    border-radius: 20px;
    padding: var(--space-sm) var(--space-lg);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--primary-700);
    margin-bottom: var(--space-lg);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .hero-badge svg {
    color: var(--warning-600);
  }

  .hero-headline {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(32px, 8vw, 48px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.1;
  }

  .hero-subheadline {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-2xl);
  }

  .hero-features {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
    margin-bottom: var(--space-2xl);
  }

  .feature-highlight {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 20px;
    padding: var(--space-sm) var(--space-md);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-800);
    box-shadow: var(--shadow-soft);
  }

  .feature-highlight svg {
    color: var(--primary-600);
  }

  .hero-ctas {
    display: flex;
    align-items: center;
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
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    color: var(--white);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
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

  /* Hero Visual */
  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ai-demo-mockup {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    box-shadow: var(--shadow-soft);
    width: 100%;
    max-width: 400px;
    overflow: hidden;
  }

  .mockup-header {
    background: var(--gray-100);
    padding: var(--space-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mockup-dots {
    display: flex;
    gap: var(--space-xs);
  }

  .mockup-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gray-400);
  }

  .mockup-title {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-700);
  }

  .mockup-content {
    padding: var(--space-lg);
  }

  .text-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-md);
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    color: var(--gray-700);
  }

  .ai-suggestion {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    background: linear-gradient(135deg, var(--warning-100), var(--warning-200));
    border: 1px solid var(--warning-300);
    border-radius: 4px;
    padding: var(--space-xs) var(--space-sm);
    font-size: 10px;
    color: var(--warning-700);
  }

  .citation-help {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border: 1px solid var(--primary-300);
    border-radius: 4px;
    padding: var(--space-xs) var(--space-sm);
    font-size: 10px;
    color: var(--primary-700);
  }

  .ai-writing-assist {
    background: var(--gray-50);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    padding: var(--space-md);
    margin-top: var(--space-lg);
  }

  .assist-header {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    margin-bottom: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--gray-800);
  }

  .assist-suggestions {
    display: flex;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  .suggestion {
    background: var(--primary-100);
    border: 1px solid var(--primary-200);
    border-radius: 12px;
    padding: var(--space-xs) var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 9px;
    font-weight: 500;
    color: var(--primary-700);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .ai-copilot-hero-section {
      padding: var(--space-3xl) 0;
    }

    .hero-content-wrapper {
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
      text-align: center;
    }

    .hero-features {
      justify-content: center;
    }

    .hero-ctas {
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 250px;
      text-align: center;
    }

    .ai-demo-mockup {
      max-width: 320px;
    }
  }
</style>