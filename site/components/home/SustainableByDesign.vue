<template>
  <section class="sustainable-design-section">
    <div class="content-wrapper">
      <div class="section-header">
        <h2 class="section-heading">100% Open Source & Community Owned</h2>
        <p class="section-subtitle">
          Built by researchers, for researchers. No shareholders, no profit extraction, no
          compromise. Open-source ResOps infrastructure with values aligned to the academic
          community.
        </p>
      </div>

      <div class="sustainability-grid">
        <div class="sustainability-feature">
          <div class="feature-icon">
            <IconCode :size="32" />
          </div>
          <h3 class="feature-title">100% Open Source</h3>
          <p class="feature-description">
            Every component is open source under MIT license. No proprietary black boxes, no vendor
            lock-in, no hidden algorithms. The research community owns and controls the platform.
          </p>
          <div class="feature-actions">
            <a href="https://github.com/aris-platform" class="feature-link">
              <IconBrandGithub :size="16" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        <div class="sustainability-feature">
          <div class="feature-icon">
            <IconScale :size="32" />
          </div>
          <h3 class="feature-title">Ethics Over Profits</h3>
          <p class="feature-description">
            No venture capital, no shareholders, no profit extraction from public research. Our only
            goal is building infrastructure that serves the academic community's values and needs.
          </p>
          <div class="feature-benefits">
            <div class="benefit-item">
              <IconCheck :size="14" />
              <span>Community governance</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="14" />
              <span>Transparent decision making</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="14" />
              <span>Academic priorities first</span>
            </div>
          </div>
        </div>

        <div class="sustainability-feature">
          <div class="feature-icon">
            <IconBuilding :size="32" />
          </div>
          <h3 class="feature-title">Institutional Sustainability</h3>
          <p class="feature-description">
            Institutions fund the infrastructure their researchers use daily. Fair pricing based on
            value delivered, with free access for individual researchers always guaranteed.
          </p>
          <div class="pricing-highlights">
            <div class="pricing-item">
              <div class="price-label">Individual Researchers</div>
              <div class="price-value">Free Forever</div>
            </div>
            <div class="pricing-item">
              <div class="price-label">Institutional Members</div>
              <div class="price-value">Sustainable Funding</div>
            </div>
          </div>
        </div>

        <div class="sustainability-feature">
          <div class="feature-icon">
            <IconUsers :size="32" />
          </div>
          <h3 class="feature-title">Community Contributions</h3>
          <p class="feature-description">
            Researchers, developers, and institutions contribute features, bug fixes, and
            improvements. Every contribution makes the platform better for the entire community.
          </p>
          <div class="contribution-types">
            <div class="contribution-item">
              <IconCode :size="16" />
              <span>Code contributions</span>
            </div>
            <div class="contribution-item">
              <IconBug :size="16" />
              <span>Bug reports & fixes</span>
            </div>
            <div class="contribution-item">
              <IconBulb :size="16" />
              <span>Feature suggestions</span>
            </div>
            <div class="contribution-item">
              <IconBook :size="16" />
              <span>Documentation</span>
            </div>
          </div>
        </div>
      </div>

      <div class="transparency-section">
        <h3 class="transparency-title">Complete Transparency</h3>
        <div class="transparency-grid">
          <div class="transparency-item">
            <div class="transparency-icon">
              <IconChartBar :size="24" />
            </div>
            <div class="transparency-content">
              <h4 class="transparency-heading">Financial Reports</h4>
              <p class="transparency-text">Annual financial statements published openly</p>
            </div>
          </div>
          <div class="transparency-item">
            <div class="transparency-icon">
              <IconMap :size="24" />
            </div>
            <div class="transparency-content">
              <h4 class="transparency-heading">Development Roadmap</h4>
              <p class="transparency-text">Public roadmap with community input</p>
            </div>
          </div>
          <div class="transparency-item">
            <div class="transparency-icon">
              <IconUserCheck :size="24" />
            </div>
            <div class="transparency-content">
              <h4 class="transparency-heading">Governance Structure</h4>
              <p class="transparency-text">Academic board with elected representatives</p>
            </div>
          </div>
        </div>
      </div>

      <div class="open-science-cta">
        <div class="cta-content">
          <h3 class="cta-title">Learn More About Our Values</h3>
          <p class="cta-description">
            Discover why open source, transparent governance, and community ownership matter for the
            future of academic publishing.
          </p>
          <a href="/open-science" class="btn btn-primary">
            <IconHeart :size="16" />
            <span>Our Open Science Commitment</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconCode,
    IconScale,
    IconBuilding,
    IconUsers,
    IconCheck,
    IconBrandGithub,
    IconBug,
    IconBulb,
    IconBook,
    IconChartBar,
    IconMap,
    IconUserCheck,
    IconHeart,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Section Container */
  .sustainable-design-section {
    background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-25) 100%);
    padding: var(--space-4xl) 0;
  }

  /* Content Wrapper */
  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-heading {
    font-family: "Montserrat", sans-serif;
    font-size: var(--text-5xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.2;
  }

  .section-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: var(--text-xl);
    line-height: 1.6;
    color: var(--gray-700);
  }

  /* Sustainability Grid */
  .sustainability-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .sustainability-feature {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
  }

  .sustainability-feature:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .feature-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--success-600);
    margin-bottom: var(--space-lg);
  }

  .feature-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .feature-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  /* Feature Actions */
  .feature-actions {
    margin-top: var(--space-lg);
  }

  .feature-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    background: var(--gray-100);
    border: 1px solid var(--gray-200);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-700);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .feature-link:hover {
    background: var(--gray-200);
    transform: translateY(-1px);
  }

  /* Feature Benefits */
  .feature-benefits {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .benefit-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .benefit-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Pricing Highlights */
  .pricing-highlights {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md);
  }

  .pricing-item {
    text-align: center;
    padding: var(--space-md);
    background: var(--success-25);
    border: 1px solid var(--success-100);
    border-radius: 8px;
  }

  .price-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
    margin-bottom: var(--space-xs);
  }

  .price-value {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--success-700);
  }

  /* Contribution Types */
  .contribution-types {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
  }

  .contribution-item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    color: var(--gray-600);
  }

  .contribution-item svg {
    color: var(--primary-500);
    flex-shrink: 0;
  }

  /* Transparency Section */
  .transparency-section {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-2xl);
    box-shadow: var(--shadow-soft);
  }

  .transparency-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .transparency-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-lg);
  }

  .transparency-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--gray-25);
    border-radius: 8px;
  }

  .transparency-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .transparency-content {
    flex: 1;
  }

  .transparency-heading {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .transparency-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-600);
    margin: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .sustainable-design-section {
      padding: var(--space-3xl) 0;
    }

    .sustainability-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .pricing-highlights {
      grid-template-columns: 1fr;
    }

    .contribution-types {
      grid-template-columns: 1fr;
    }

    .transparency-grid {
      grid-template-columns: 1fr;
    }

    .transparency-item {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }
  }

  @media (max-width: 480px) {
    .sustainability-feature {
      padding: var(--space-lg);
    }

    .transparency-section {
      padding: var(--space-xl);
    }

    .open-science-cta {
      padding: var(--space-xl);
    }

    .cta-title {
      font-size: 24px;
    }
  }

  /* Open Science CTA */
  .open-science-cta {
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
    border: 1px solid var(--success-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-top: var(--space-3xl);
    text-align: center;
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
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    min-width: 200px;
    justify-content: center;
  }

  .btn-primary {
    background: var(--success-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--success-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.35);
  }
</style>
