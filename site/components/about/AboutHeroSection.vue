<template>
  <section class="about-hero-section" aria-labelledby="about-hero-heading">
    <div class="about-hero-content-wrapper">
      <div class="about-hero-content">
        <h1 id="about-hero-heading" class="about-hero-headline">
          About Aris
        </h1>
        <p class="about-hero-subheadline">
          Aris is a web-native scientific publishing platform that transforms how researchers write, collaborate, and share their work. Built with a FastAPI backend and Vue.js frontend, we support RSM (Readable Science Markup) manuscripts for modern, interactive research publishing.
        </p>
        <div class="company-stats">
          <div class="stat-item">
            <div class="stat-number">2025</div>
            <div class="stat-label">Founded</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">Beta</div>
            <div class="stat-label">Current Stage</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">Web-First</div>
            <div class="stat-label">Platform</div>
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
              <p class="feature-description">Multiple authors, threaded comments, version control</p>
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
  import { IconFileText, IconUsers, IconGlobe } from "@tabler/icons-vue";
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

  /* Company Stats Section */
  .company-stats {
    display: flex;
    gap: var(--space-xl);
    margin-top: var(--space-2xl);
    flex-wrap: wrap;
  }

  .stat-item {
    text-align: center;
    flex: 1;
    min-width: 100px;
  }

  .stat-number {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: var(--space-xs);
  }

  .stat-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
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

    .company-stats {
      justify-content: center;
      gap: var(--space-lg);
    }

    .stat-number {
      font-size: 20px;
    }

    .stat-label {
      font-size: 12px;
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
