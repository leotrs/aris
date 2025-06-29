<template>
  <section id="commitment" class="commitment-section" aria-labelledby="commitment-heading">
    <div class="commitment-content-wrapper">
      <div class="section-header">
        <h2 id="commitment-heading" class="section-title">Our Commitment to Open Science</h2>
        <p class="section-subtitle">
          Public research should benefit the public. Every line of code, every decision, and every
          feature is developed transparently by and for the academic community.
        </p>
      </div>

      <div class="commitments-grid">
        <div class="commitment-card primary">
          <div class="card-icon">
            <IconCode :size="32" />
          </div>
          <h3 class="card-title">100% Open Source</h3>
          <p class="card-description">
            Every component of Aris is open source and freely available. No proprietary black boxes,
            no vendor lock-in, no hidden algorithms. The entire platform is built in the open.
          </p>
          <div class="commitment-details">
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>MIT License for maximum freedom</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Public development on GitHub</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Community contributions welcome</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>No proprietary dependencies</span>
            </div>
          </div>
          <div class="card-action">
            <a href="https://github.com/aris-platform" class="github-link">
              <IconBrandGithub :size="16" />
              <span>Explore the Code</span>
            </a>
          </div>
        </div>

        <div class="commitment-card">
          <div class="card-icon">
            <IconEye :size="32" />
          </div>
          <h3 class="card-title">Transparent Development</h3>
          <p class="card-description">
            All decisions are made in public with community input. Roadmaps, feature discussions,
            and technical decisions happen in the open for everyone to participate.
          </p>
          <div class="commitment-details">
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Public roadmap and planning</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Open RFC process for major changes</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Community voting on features</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Regular development updates</span>
            </div>
          </div>
        </div>

        <div class="commitment-card">
          <div class="card-icon">
            <IconLock :size="32" />
          </div>
          <h3 class="card-title">No Vendor Lock-in</h3>
          <p class="card-description">
            Your data is yours, always. Export everything in standard formats, self-host if you
            want, or migrate to any compatible platform. No artificial barriers to leaving.
          </p>
          <div class="commitment-details">
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Standard file formats (LaTeX, RSM, PDF)</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Complete data export capabilities</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Self-hosting options available</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Open API for integrations</span>
            </div>
          </div>
        </div>

        <div class="commitment-card">
          <div class="card-icon">
            <IconWorld :size="32" />
          </div>
          <h3 class="card-title">Community Ownership</h3>
          <p class="card-description">
            Built by researchers, for researchers. The academic community controls the direction,
            features, and future of the platform through democratic governance structures.
          </p>
          <div class="commitment-details">
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Academic advisory board</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Community-driven feature requests</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>Democratic decision-making</span>
            </div>
            <div class="detail-item">
              <IconCheck :size="16" />
              <span>No corporate shareholders</span>
            </div>
          </div>
        </div>
      </div>

      <div class="values-statement">
        <div class="statement-content">
          <h3 class="statement-title">Why This Matters</h3>
          <blockquote class="statement-quote">
            "Academic publishing has been controlled by profit-driven entities for too long.
            Research funded by the public deserves infrastructure owned by the public. Open science
            isn't just about access—it's about control, transparency, and ensuring that the tools we
            use to share knowledge reflect the values of the scientific community."
          </blockquote>
          <div class="statement-attribution">
            <div class="attribution-text">
              <strong>Our Founding Principle</strong>
              <span>The academic community deserves better</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconCode,
    IconEye,
    IconLock,
    IconWorld,
    IconCheck,
    IconBrandGithub,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Commitment Section */
  .commitment-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .commitment-content-wrapper {
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

  /* Commitments Grid */
  .commitments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .commitment-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    transition: all 0.3s ease;
    text-align: center;
  }

  .commitment-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .commitment-card.primary {
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
    border-color: var(--success-200);
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--success-600);
  }

  .commitment-card.primary .card-icon {
    background: linear-gradient(135deg, var(--success-200), var(--success-300));
    color: var(--success-700);
  }

  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  .commitment-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
    text-align: left;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .detail-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  .card-action {
    text-align: center;
  }

  .github-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-lg);
    background: var(--gray-100);
    border: 1px solid var(--gray-200);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-700);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .github-link:hover {
    background: var(--gray-200);
    transform: translateY(-1px);
  }

  /* Values Statement */
  .values-statement {
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .statement-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .statement-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
  }

  .statement-quote {
    font-family: "Source Sans 3", sans-serif;
    font-size: 20px;
    font-style: italic;
    line-height: 1.6;
    color: var(--gray-800);
    margin-bottom: var(--space-lg);
    padding: 0 var(--space-lg);
    border-left: 4px solid var(--primary-400);
    text-align: left;
  }

  .statement-attribution {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-md);
  }

  .attribution-text {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    text-align: center;
  }

  .attribution-text strong {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    color: var(--gray-900);
  }

  .attribution-text span {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-600);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .commitment-section {
      padding: var(--space-3xl) 0;
    }

    .commitments-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .commitment-card {
      padding: var(--space-lg);
    }

    .values-statement {
      padding: var(--space-xl);
    }

    .statement-quote {
      font-size: 18px;
      padding: 0 var(--space-md);
    }
  }

  @media (max-width: 480px) {
    .commitment-card {
      padding: var(--space-md);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .card-title {
      font-size: 18px;
    }

    .values-statement {
      padding: var(--space-lg);
    }

    .statement-title {
      font-size: 24px;
    }

    .statement-quote {
      font-size: 16px;
    }
  }
</style>
