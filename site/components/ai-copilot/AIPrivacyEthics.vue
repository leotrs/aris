<template>
  <section id="ai-privacy" class="ai-privacy-section" aria-labelledby="privacy-heading">
    <div class="privacy-content-wrapper">
      <div class="section-header">
        <div class="section-icon">
          <IconShieldCheck :size="48" />
        </div>
        <h2 id="privacy-heading" class="section-title">Privacy-First AI</h2>
        <p class="section-subtitle">
          AI assistance that respects your intellectual property, maintains confidentiality, upholds
          the highest standards of academic ethics.
        </p>
      </div>

      <div class="privacy-grid">
        <!-- Data Privacy -->
        <div class="privacy-card">
          <div class="card-header">
            <IconLock :size="24" />
            <h3 class="card-title">Your Data Stays Private</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Your research content never leaves your control. AI processing happens locally or
              through encrypted, ephemeral sessions that don't store your work.
            </p>
            <div class="privacy-features">
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Local AI processing when possible</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>No persistent data storage by AI</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>End-to-end encryption for cloud AI</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Zero retention policy</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Academic Integrity -->
        <div class="privacy-card">
          <div class="card-header">
            <IconGavel :size="24" />
            <h3 class="card-title">Academic Integrity</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              AI assistance is clearly marked and traceable. You maintain full authorship and
              control, with transparent documentation of AI contributions.
            </p>
            <div class="privacy-features">
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Clear AI contribution tracking</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Author control over all suggestions</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Transparency reports available</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Plagiarism detection integrated</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ethical AI -->
        <div class="privacy-card">
          <div class="card-header">
            <IconScale :size="24" />
            <h3 class="card-title">Ethical AI Use</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Our AI models are trained ethically, without using copyrighted academic content,
              designed to enhance rather than replace human expertise.
            </p>
            <div class="privacy-features">
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Ethically sourced training data</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>No copyrighted content in training</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Bias detection and mitigation</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Human-in-the-loop design</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Compliance -->
        <div class="privacy-card">
          <div class="card-header">
            <IconCertificate :size="24" />
            <h3 class="card-title">Compliance & Standards</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Full compliance with institutional policies, research ethics guidelines, international
              data protection regulations.
            </p>
            <div class="privacy-features">
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>GDPR and CCPA compliant</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>FERPA compliance for education</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>SOC 2 Type II certified</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="14" />
                <span>Regular security audits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ethics-commitment">
        <div class="commitment-content">
          <div class="commitment-icon">
            <IconHeart :size="32" />
          </div>
          <h3 class="commitment-title">Our AI Ethics Commitment</h3>
          <p class="commitment-description">
            We believe AI should empower researchers, not replace them. Our AI features are designed
            to enhance human creativity and insight while maintaining the highest standards of
            academic integrity and ethical responsibility.
          </p>
          <div class="commitment-principles">
            <div class="principle">
              <strong>Transparency:</strong> Clear documentation of AI capabilities and limitations
            </div>
            <div class="principle">
              <strong>Control:</strong> Authors maintain final authority over all content
            </div>
            <div class="principle">
              <strong>Privacy:</strong> Your research data remains confidential and secure
            </div>
            <div class="principle">
              <strong>Integrity:</strong> AI assistance is traceable and ethically sound
            </div>
          </div>
          <div class="commitment-cta">
            <a href="/security" class="btn btn-secondary">Learn More About Security</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconShieldCheck,
    IconLock,
    IconGavel,
    IconScale,
    IconCertificate,
    IconHeart,
    IconCheck,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* AI Privacy Section */
  .ai-privacy-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--success-25) 100%);
    padding: var(--space-4xl) 0;
  }

  .privacy-content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
  }

  .section-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--success-600);
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

  /* Privacy Grid */
  .privacy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .privacy-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    transition: all 0.3s ease;
  }

  .privacy-card:hover {
    box-shadow: var(--shadow-soft);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .card-header svg {
    color: var(--success-600);
  }

  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-900);
    margin: 0;
  }

  .card-content {
    padding-left: calc(24px + var(--space-md));
  }

  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  .privacy-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    color: var(--gray-700);
  }

  .feature-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Ethics Commitment */
  .ethics-commitment {
    background: linear-gradient(135deg, var(--primary-25), var(--success-25));
    border: 2px solid var(--success-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
  }

  .commitment-content {
    max-width: 700px;
    margin: 0 auto;
  }

  .commitment-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--primary-600);
  }

  .commitment-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .commitment-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .commitment-principles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
    text-align: left;
  }

  .principle {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    padding: var(--space-md);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
  }

  .principle strong {
    color: var(--gray-900);
  }

  .commitment-cta {
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
  }

  .btn-secondary {
    background: var(--white);
    color: var(--success-600);
    border: 2px solid var(--success-300);
  }

  .btn-secondary:hover {
    background: var(--success-50);
    border-color: var(--success-400);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .ai-privacy-section {
      padding: var(--space-3xl) 0;
    }

    .privacy-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .privacy-card {
      padding: var(--space-lg);
    }

    .card-content {
      padding-left: 0;
    }

    .card-header {
      margin-bottom: var(--space-md);
    }

    .ethics-commitment {
      padding: var(--space-xl);
    }

    .commitment-principles {
      grid-template-columns: 1fr;
      gap: var(--space-md);
      text-align: center;
    }
  }
</style>
