<template>
  <section class="technical-specs-section" aria-labelledby="specs-heading">
    <div class="specs-content-wrapper">
      <div class="section-header">
        <h2 id="specs-heading" class="section-title">Built for Real Research Workflows</h2>
        <p class="section-subtitle">
          Open-source infrastructure with the features researchers actually need. Designed for
          seamless integration with your existing tools and workflows.
        </p>
      </div>

      <div class="specs-grid">
        <div class="spec-card">
          <div class="card-icon">
            <IconFileText :size="32" />
          </div>
          <h3 class="card-title">Universal Format Support</h3>
          <div class="spec-details">
            <div class="spec-item">
              <IconCheck :size="16" />
              <span>RSM: Modern markup designed for the web</span>
            </div>
            <div class="spec-item">
              <IconCheck :size="16" />
              <span>LaTeX: Import existing manuscripts seamlessly</span>
            </div>
            <div class="spec-item">
              <IconCheck :size="16" />
              <span>Multi-format export: PDF, HTML, DOCX, and more</span>
            </div>
            <div class="spec-item">
              <IconCheck :size="16" />
              <span>Interactive elements: Embed data and visualizations</span>
            </div>
          </div>
        </div>

        <div class="spec-card">
          <div class="card-icon">
            <IconCurrencyDollar :size="32" />
          </div>
          <h3 class="card-title">Community-First Pricing</h3>
          <div class="spec-details">
            <div class="spec-item">
              <IconCheck :size="16" />
              <span>Always free for individual researchers</span>
            </div>
            <div class="spec-item">
              <IconCheck :size="16" />
              <span>Research group plans with collaborative features</span>
            </div>
            <div class="spec-item">
              <IconCheck :size="16" />
              <span>Institutional partnerships for network effects</span>
            </div>
            <div class="spec-item">
              <IconInfoCircle :size="16" />
              <span>Free beta access with early feature preview</span>
            </div>
          </div>
        </div>

        <div class="spec-card">
          <div class="card-icon">
            <IconLink :size="32" />
          </div>
          <h3 class="card-title">Works With Your Tools</h3>
          <div class="spec-details">
            <div class="spec-item">
              <IconCheck :size="16" />
              <span>Seamless citation management (Zotero, Mendeley)</span>
            </div>
            <div class="spec-item">
              <IconCheck :size="16" />
              <span>Git-based collaboration and version control</span>
            </div>
            <div class="spec-item">
              <IconCheck :size="16" />
              <span>ORCID integration and institutional SSO</span>
            </div>
            <div class="spec-item">
              <IconClock :size="16" />
              <span>Direct journal submission workflows (coming soon)</span>
            </div>
          </div>
        </div>

        <div class="spec-card beta-card">
          <div class="card-icon">
            <IconRocket :size="32" />
          </div>
          <h3 class="card-title">Shape the Future Together</h3>
          <p class="beta-description">
            Join the community of researchers building the next generation of academic publishing
            infrastructure. Your feedback directly shapes features and priorities.
          </p>
          <div class="beta-benefits">
            <div class="spec-item">
              <IconStar :size="16" />
              <span>Full platform access at no cost</span>
            </div>
            <div class="spec-item">
              <IconUsers :size="16" />
              <span>Collaborative development with our team</span>
            </div>
            <div class="spec-item">
              <IconBolt :size="16" />
              <span>Preview features before general release</span>
            </div>
          </div>
          <div class="beta-cta">
            <a href="/signup" class="btn btn-primary">Request Beta Access</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconFileText,
    IconCurrencyDollar,
    IconLink,
    IconRocket,
    IconCheck,
    IconInfoCircle,
    IconClock,
    IconStar,
    IconUsers,
    IconBolt,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Technical Specs Section - Overall Container */
  .technical-specs-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
    position: relative;
  }

  .specs-content-wrapper {
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

  /* Specs Grid */
  .specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xl);
    margin-top: var(--space-3xl);
  }

  /* Spec Cards */
  .spec-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .spec-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .beta-card {
    border: 2px solid var(--primary-200);
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
  }

  .beta-card:hover {
    border-color: var(--primary-300);
  }

  /* Card Icon */
  .card-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-lg);
    color: var(--primary-600);
    transition: all 0.3s ease;
  }

  .spec-card:hover .card-icon {
    transform: scale(1.1);
  }

  /* Card Content */
  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.3;
  }

  .spec-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .spec-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-700);
  }

  .spec-item svg {
    flex-shrink: 0;
    color: var(--success-600);
  }

  .spec-item:has(svg[data-tabler="info-circle"]) svg {
    color: var(--primary-600);
  }

  .spec-item:has(svg[data-tabler="clock"]) svg {
    color: var(--warning-600);
  }

  /* Beta Card Specific Styles */
  .beta-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 15px;
    line-height: 1.5;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  .beta-benefits {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-xl);
  }

  .beta-cta {
    text-align: center;
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
    .technical-specs-section {
      padding: var(--space-3xl) 0;
    }

    .specs-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .spec-card {
      padding: var(--space-lg);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .card-title {
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    .spec-card {
      padding: var(--space-md);
    }

    .card-icon {
      width: 48px;
      height: 48px;
    }

    .card-title {
      font-size: 16px;
    }

    .spec-item {
      font-size: 13px;
    }
  }
</style>
