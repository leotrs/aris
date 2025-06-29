<template>
  <section class="about-hero-section" aria-labelledby="about-hero-heading">
    <div class="about-hero-content-wrapper">
      <div class="about-hero-content">
        <h1 id="about-hero-heading" class="about-hero-headline">
          Building the Future of Academic Publishing Together
        </h1>
        <p class="about-hero-subheadline">
          Aris is the open-source ResOps platform that makes research workflows faster, more
          transparent, and more enjoyable for everyone involved. Built by the academic community,
          for the academic community.
        </p>
        <div class="what-you-get">
          <div class="rsm-explanation">
            <h3 class="rsm-title">Write in RSM or Import LaTeX</h3>
            <p class="rsm-description">
              RSM (Readable Research Markup) is our modern alternative to LaTeX—designed for the
              web, easier to learn, but just as powerful. Already have LaTeX manuscripts? Import
              them seamlessly.
            </p>
          </div>
          <div class="tagline-section">
            <p class="core-tagline">
              Collaborative writing. Smart peer review workflows. Web-native publishing.
            </p>
          </div>
          <h3 class="features-title">The only platform that integrates:</h3>
          <div class="feature-comparison">
            <div class="feature-item">
              <div class="feature-icon">
                <IconEdit :size="20" />
              </div>
              <span class="feature-text">Collaborative manuscript writing</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <IconEye :size="20" />
              </div>
              <span class="feature-text">Built-in peer review workflows</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <IconGlobe :size="20" />
              </div>
              <span class="feature-text">Web-native publication (no more PDFs)</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <IconUsers :size="20" />
              </div>
              <span class="feature-text">End-to-end research operations</span>
            </div>
          </div>
        </div>
      </div>
      <div class="about-hero-visual" aria-hidden="true">
        <div class="visual-content">
          <div class="product-showcase">
            <div class="product-feature">
              <div class="feature-icon">
                <IconFileText :size="32" />
              </div>
              <h4 class="feature-title">RSM Manuscripts</h4>
              <p class="feature-description">Semantic markup for web-native research documents</p>
            </div>
            <div class="product-feature">
              <div class="feature-icon">
                <IconUsers :size="32" />
              </div>
              <h4 class="feature-title">Real-time Collaboration</h4>
              <p class="feature-description">
                Multiple authors, threaded comments, version control
              </p>
            </div>
            <div class="product-feature">
              <div class="feature-icon">
                <IconGlobe :size="32" />
              </div>
              <h4 class="feature-title">Interactive Publishing</h4>
              <p class="feature-description">Responsive, accessible, web-first research sharing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconFileText, IconUsers, IconGlobe, IconEdit, IconEye } from "@tabler/icons-vue";
</script>

<style scoped>
  /* About Hero Section - Overall Container */
  .about-hero-section {
    background: linear-gradient(135deg, var(--gray-0) 0%, var(--gray-50) 100%);
    padding: var(--space-4xl) 0;
    min-height: 70vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  /* Content Wrapper */
  .about-hero-content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: var(--space-4xl);
  }

  /* Hero Content - Left Side */
  .about-hero-content {
    flex: 1;
    max-width: 600px;
    z-index: 2;
    position: relative;
  }

  /* Hero Visual - Right Side */
  .about-hero-visual {
    flex: 1;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .visual-content {
    width: 100%;
    max-width: 400px;
    position: relative;
  }

  .product-showcase {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    max-width: 320px;
    margin: 0 auto;
  }

  .product-feature {
    background: var(--surface-page);
    border-radius: 12px;
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--border-primary);
    transition: all 0.3s ease;
    border-left: 4px solid var(--primary-200);
  }

  .product-feature:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
    border-left-color: var(--primary-500);
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-sm);
    background: var(--primary-50);
    color: var(--primary-600);
    transition: all 0.3s ease;
  }

  .product-feature:hover .feature-icon {
    transform: scale(1.05);
    background: var(--primary-100);
  }

  .feature-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
    line-height: 1.3;
  }

  .feature-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    line-height: 1.4;
    color: var(--gray-600);
    margin: 0;
  }

  /* Headline Styling */
  .about-hero-headline {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(32px, 8vw, 48px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.1;
  }

  /* Sub-headline Styling */
  .about-hero-subheadline {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-2xl);
  }

  /* What You Get Section */
  .what-you-get {
    margin-top: var(--space-2xl);
  }

  /* RSM Explanation */
  .rsm-explanation {
    background: var(--primary-25);
    border: 1px solid var(--primary-100);
    border-radius: 12px;
    padding: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .rsm-title {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-700);
    margin-bottom: var(--space-sm);
    line-height: 1.3;
  }

  .rsm-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 15px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  /* Tagline Section */
  .tagline-section {
    text-align: center;
    margin: var(--space-lg) 0;
    padding: var(--space-lg) 0;
    border-top: 1px solid var(--border-primary);
    border-bottom: 1px solid var(--border-primary);
  }

  .core-tagline {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-700);
    margin: 0;
    line-height: 1.4;
  }

  .features-title {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: var(--space-lg);
  }

  .feature-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md);
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    background: var(--primary-25);
    border: 1px solid var(--primary-100);
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .feature-item:hover {
    background: var(--primary-50);
    border-color: var(--primary-200);
  }

  .feature-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: var(--primary-100);
    color: var(--primary-600);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .feature-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-700);
    line-height: 1.3;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .about-hero-section {
      padding: var(--space-3xl) 0;
      min-height: auto;
    }

    .about-hero-content-wrapper {
      flex-direction: column;
      gap: var(--space-2xl);
      padding: 0 var(--space-md);
      text-align: center;
    }

    .about-hero-content {
      max-width: none;
      order: 1;
    }

    .about-hero-visual {
      order: 2;
      min-height: 300px;
    }

    .product-showcase {
      max-width: 280px;
      gap: var(--space-md);
    }

    .product-feature {
      padding: var(--space-md);
    }

    .feature-icon {
      width: 40px;
      height: 40px;
    }

    .feature-title {
      font-size: 14px;
    }

    .feature-description {
      font-size: 12px;
    }

    .feature-comparison {
      grid-template-columns: 1fr;
      gap: var(--space-sm);
    }

    .feature-item {
      padding: var(--space-xs);
    }

    .feature-icon {
      width: 28px;
      height: 28px;
    }

    .feature-text {
      font-size: 13px;
    }
  }

  @media (max-width: 480px) {
    .about-hero-visual {
      min-height: 250px;
    }

    .research-layers {
      transform: scale(0.7);
    }
  }
</style>
