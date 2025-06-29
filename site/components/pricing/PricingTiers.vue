<template>
  <section class="pricing-tiers-section" aria-labelledby="pricing-tiers-heading">
    <div class="tiers-content-wrapper">
      <div class="section-header">
        <h2 id="pricing-tiers-heading" class="section-title">Choose Your Plan</h2>
        <p class="section-subtitle">
          Start free and upgrade when your team grows. All plans include complete data export and LaTeX support.
        </p>
      </div>

      <div class="pricing-grid">
        <!-- Free Tier -->
        <div class="pricing-card free-tier">
          <div class="tier-header">
            <div class="tier-icon">
              <IconUser :size="24" />
            </div>
            <h3 class="tier-name">Individual</h3>
            <div class="tier-price">
              <span class="price-amount">Free</span>
              <span class="price-period">Always</span>
            </div>
            <p class="tier-description">Perfect for individual researchers and students</p>
          </div>
          
          <div class="tier-features">
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Unlimited personal documents</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>LaTeX import & PDF export</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Basic collaboration (up to 3 people)</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Journal export templates</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>ORCID integration</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Public preprint hosting</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Complete data export</span>
            </div>
          </div>

          <div class="tier-cta">
            <a href="/signup" class="btn btn-secondary">Get Started Free</a>
          </div>
        </div>

        <!-- Institutional Tier -->
        <div class="pricing-card institutional-tier featured">
          <div class="featured-badge">Most Popular</div>
          <div class="tier-header">
            <div class="tier-icon">
              <IconBuilding :size="24" />
            </div>
            <h3 class="tier-name">Institutional</h3>
            <div class="tier-price">
              <span class="price-amount">$25</span>
              <span class="price-period">per user/month</span>
            </div>
            <p class="tier-description">For research teams and academic institutions</p>
          </div>
          
          <div class="tier-features">
            <div class="feature-group">
              <h4 class="feature-group-title">Everything in Individual, plus:</h4>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Unlimited team collaboration</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Advanced peer review workflows</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Institutional branding</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>SSO integration</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Repository auto-deposit</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Admin dashboard & analytics</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Priority support</span>
            </div>
          </div>

          <div class="tier-cta">
            <a href="/contact" class="btn btn-primary">Contact Sales</a>
            <p class="cta-note">30-day free trial</p>
          </div>
        </div>

        <!-- Enterprise Tier -->
        <div class="pricing-card enterprise-tier">
          <div class="tier-header">
            <div class="tier-icon">
              <IconShield :size="24" />
            </div>
            <h3 class="tier-name">Enterprise</h3>
            <div class="tier-price">
              <span class="price-amount">Custom</span>
              <span class="price-period">Contact us</span>
            </div>
            <p class="tier-description">For large institutions with specific requirements</p>
          </div>
          
          <div class="tier-features">
            <div class="feature-group">
              <h4 class="feature-group-title">Everything in Institutional, plus:</h4>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Private cloud deployment</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Custom integrations</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Advanced security & compliance</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Dedicated account manager</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>Custom training & onboarding</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="16" />
              <span>99.9% SLA guarantee</span>
            </div>
          </div>

          <div class="tier-cta">
            <a href="/contact" class="btn btn-secondary">Contact Sales</a>
            <p class="cta-note">Custom pricing</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconCheck, IconUser, IconBuilding, IconShield } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Pricing Tiers Section */
  .pricing-tiers-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .tiers-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
  }

  .section-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(28px, 6vw, 36px);
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
    max-width: 600px;
    margin: 0 auto;
  }

  /* Pricing Grid */
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-xl);
    max-width: 1000px;
    margin: 0 auto;
  }

  /* Pricing Cards */
  .pricing-card {
    background: var(--surface-page);
    border: 2px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    position: relative;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .pricing-card:hover {
    box-shadow: var(--shadow-soft);
    transform: translateY(-4px);
  }

  .pricing-card.featured {
    border-color: var(--primary-300);
    background: linear-gradient(135deg, var(--primary-25), var(--surface-page));
  }

  .featured-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary-500);
    color: var(--white);
    padding: var(--space-xs) var(--space-lg);
    border-radius: 20px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Tier Header */
  .tier-header {
    text-align: center;
    margin-bottom: var(--space-2xl);
  }

  .tier-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--primary-600);
  }

  .tier-name {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .tier-price {
    margin-bottom: var(--space-md);
  }

  .price-amount {
    font-family: "Montserrat", sans-serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--primary-600);
  }

  .price-period {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-600);
    margin-left: var(--space-xs);
  }

  .tier-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-600);
    margin: 0;
  }

  /* Tier Features */
  .tier-features {
    flex: 1;
    margin-bottom: var(--space-2xl);
  }

  .feature-group {
    margin-bottom: var(--space-lg);
  }

  .feature-group-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: var(--space-md);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .feature-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Tier CTA */
  .tier-cta {
    text-align: center;
    margin-top: auto;
  }

  .btn {
    display: inline-block;
    padding: var(--space-md) var(--space-xl);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 16px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
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

  .cta-note {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
    margin-top: var(--space-sm);
    margin-bottom: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .pricing-tiers-section {
      padding: var(--space-3xl) 0;
    }

    .pricing-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .pricing-card {
      padding: var(--space-xl);
    }

    .tier-name {
      font-size: 20px;
    }

    .price-amount {
      font-size: 28px;
    }
  }
</style>