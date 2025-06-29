<template>
  <section id="ai-capabilities" class="ai-capabilities-section" aria-labelledby="capabilities-heading">
    <div class="capabilities-content-wrapper">
      <div class="section-header">
        <h2 id="capabilities-heading" class="section-title">AI That Understands Research</h2>
        <p class="section-subtitle">
          Purpose-built AI features designed specifically for academic writing and research workflows.
        </p>
      </div>

      <div class="capabilities-grid">
        <!-- Smart Writing Assistance -->
        <div class="capability-card featured">
          <div class="card-icon">
            <IconPencil :size="32" />
          </div>
          <h3 class="card-title">Smart Writing Assistance</h3>
          <p class="card-description">
            Context-aware suggestions that understand academic writing conventions, research terminology, 
            and disciplinary standards.
          </p>
          <div class="card-features">
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Academic tone and style guidance</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Clarity and readability improvements</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Discipline-specific terminology</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Structure and flow optimization</span>
            </div>
          </div>
        </div>

        <!-- Citation Intelligence -->
        <div class="capability-card">
          <div class="card-icon">
            <IconBook :size="32" />
          </div>
          <h3 class="card-title">Citation Intelligence</h3>
          <p class="card-description">
            Intelligent citation assistance that finds relevant papers, formats references, 
            and ensures proper attribution throughout your document.
          </p>
          <div class="card-features">
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Auto-suggest relevant papers</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Format citations automatically</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Check for missing references</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>ORCID and DOI integration</span>
            </div>
          </div>
        </div>

        <!-- Research Context -->
        <div class="capability-card">
          <div class="card-icon">
            <IconSearch :size="32" />
          </div>
          <h3 class="card-title">Research Context</h3>
          <p class="card-description">
            AI that understands your research domain and provides contextual insights, 
            helping identify gaps and connections in your work.
          </p>
          <div class="card-features">
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Domain-aware suggestions</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Research gap identification</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Methodology recommendations</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Related work discovery</span>
            </div>
          </div>
        </div>

        <!-- Document Structure -->
        <div class="capability-card">
          <div class="card-icon">
            <IconLayout :size="32" />
          </div>
          <h3 class="card-title">Document Structure</h3>
          <p class="card-description">
            AI-powered organization that helps structure your paper logically, 
            ensuring clear flow and proper academic formatting.
          </p>
          <div class="card-features">
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Logical section organization</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Transition improvements</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Argument flow analysis</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Academic format compliance</span>
            </div>
          </div>
        </div>

        <!-- Collaboration Intelligence -->
        <div class="capability-card">
          <div class="card-icon">
            <IconUsers :size="32" />
          </div>
          <h3 class="card-title">Collaboration Intelligence</h3>
          <p class="card-description">
            Smart features that enhance team writing, track contributions, 
            and facilitate seamless collaboration between co-authors.
          </p>
          <div class="card-features">
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Contribution tracking</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Conflict resolution suggestions</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Version merge assistance</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Review workflow optimization</span>
            </div>
          </div>
        </div>

        <!-- Quality Assurance -->
        <div class="capability-card">
          <div class="card-icon">
            <IconShield :size="32" />
          </div>
          <h3 class="card-title">Quality Assurance</h3>
          <p class="card-description">
            Comprehensive quality checks that ensure your research meets academic standards 
            and publication requirements.
          </p>
          <div class="card-features">
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Methodology validation</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Statistical accuracy checks</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Reproducibility assessment</span>
            </div>
            <div class="feature-item">
              <IconCheck :size="14" />
              <span>Ethical compliance review</span>
            </div>
          </div>
        </div>
      </div>

      <div class="capabilities-cta">
        <h3 class="cta-title">Experience AI-Enhanced Research Writing</h3>
        <p class="cta-description">
          See how AI can accelerate your research workflow while maintaining the highest standards of academic integrity.
        </p>
        <div class="cta-buttons">
          <a href="/demo" class="btn btn-primary">Try AI Features</a>
          <a href="#ai-privacy" class="btn btn-secondary">Privacy & Ethics</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconPencil,
    IconBook,
    IconSearch,
    IconLayout,
    IconUsers,
    IconShield,
    IconCheck,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* AI Capabilities Section */
  .ai-capabilities-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .capabilities-content-wrapper {
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

  /* Capabilities Grid */
  .capabilities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .capability-card {
    background: var(--surface-page);
    border: 2px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .capability-card:hover {
    box-shadow: var(--shadow-soft);
    transform: translateY(-4px);
  }

  .capability-card.featured {
    border-color: var(--primary-300);
    background: linear-gradient(135deg, var(--primary-25), var(--surface-page));
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-lg);
    color: var(--primary-600);
  }

  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
    flex: 1;
  }

  .card-features {
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

  /* Capabilities CTA */
  .capabilities-cta {
    background: linear-gradient(135deg, var(--gray-25), var(--primary-25));
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
  }

  .cta-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .cta-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-buttons {
    display: flex;
    gap: var(--space-lg);
    justify-content: center;
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

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .ai-capabilities-section {
      padding: var(--space-3xl) 0;
    }

    .capabilities-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .capability-card {
      padding: var(--space-xl);
    }

    .capabilities-cta {
      padding: var(--space-xl);
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 250px;
    }
  }
</style>