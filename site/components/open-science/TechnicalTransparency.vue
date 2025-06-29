<template>
  <section class="technical-transparency-section" aria-labelledby="technical-heading">
    <div class="transparency-content-wrapper">
      <div class="section-header">
        <h2 id="technical-heading" class="section-title">Technical Transparency</h2>
        <p class="section-subtitle">
          No black boxes, no proprietary algorithms, no vendor lock-in. Every technical decision is
          made in the open with community input and oversight.
        </p>
      </div>

      <div class="transparency-features">
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <IconApi :size="32" />
            </div>
            <h3 class="feature-title">Open APIs</h3>
            <p class="feature-description">
              Every service exposes public APIs. Integrate with your existing tools, build custom
              workflows, or migrate to alternative platforms.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <IconDatabase :size="32" />
            </div>
            <h3 class="feature-title">Standard Formats</h3>
            <p class="feature-description">
              Your data is stored in open, standard formats. LaTeX, RSM, JSON, PDF—no proprietary
              formats that trap your content.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <IconDownload :size="32" />
            </div>
            <h3 class="feature-title">Complete Export</h3>
            <p class="feature-description">
              Export everything: manuscripts, review histories, collaboration data, and metadata.
              Your data is yours to take anywhere.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <IconServer :size="32" />
            </div>
            <h3 class="feature-title">Self-Hosting</h3>
            <p class="feature-description">
              Run your own instance with the same features. Complete institutional control over
              data, infrastructure, and policies.
            </p>
          </div>
        </div>

        <div class="technical-commitment">
          <h3 class="commitment-title">Our Technical Commitments</h3>
          <div class="commitments-list">
            <div class="commitment-item">
              <IconCheck :size="18" />
              <span>All source code publicly available under MIT license</span>
            </div>
            <div class="commitment-item">
              <IconCheck :size="18" />
              <span>Open development process with public issue tracking</span>
            </div>
            <div class="commitment-item">
              <IconCheck :size="18" />
              <span>Standard protocols and formats throughout</span>
            </div>
            <div class="commitment-item">
              <IconCheck :size="18" />
              <span>No proprietary dependencies or vendor lock-in</span>
            </div>
            <div class="commitment-item">
              <IconCheck :size="18" />
              <span>Complete data portability and export capabilities</span>
            </div>
            <div class="commitment-item">
              <IconCheck :size="18" />
              <span>Public security audits and vulnerability disclosure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconApi, IconDatabase, IconDownload, IconServer, IconCheck } from "@tabler/icons-vue";
</script>

<style scoped>
  .technical-transparency-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .transparency-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

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

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .feature-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    text-align: center;
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
  }

  .feature-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--primary-600);
  }

  .feature-title {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .feature-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
  }

  .technical-commitment {
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    border: 1px solid var(--primary-200);
    border-radius: 12px;
    padding: var(--space-2xl);
    text-align: center;
  }

  .commitment-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
  }

  .commitments-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-md);
    max-width: 800px;
    margin: 0 auto;
  }

  .commitment-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    color: var(--gray-700);
    text-align: left;
  }

  .commitment-item svg {
    color: var(--primary-600);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .technical-transparency-section {
      padding: var(--space-3xl) 0;
    }

    .feature-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .commitments-list {
      grid-template-columns: 1fr;
    }

    .technical-commitment {
      padding: var(--space-xl);
    }
  }
</style>
