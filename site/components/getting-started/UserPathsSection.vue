<template>
  <section id="user-paths" class="user-paths-section" aria-labelledby="user-paths-heading">
    <div class="user-paths-content-wrapper">
      <div class="section-header">
        <h2 id="user-paths-heading" class="section-title">Choose Your Path</h2>
        <p class="section-subtitle">
          Different users have different needs. Pick the path that matches your situation for a
          tailored setup experience.
        </p>
      </div>

      <div class="paths-grid">
        <div class="path-card researcher">
          <div class="path-header">
            <div class="path-icon">
              <IconUser :size="40" />
            </div>
            <h3 class="path-title">Individual Researcher</h3>
            <p class="path-subtitle">Perfect for researchers who want to try Aris personally</p>
          </div>

          <div class="path-features">
            <h4 class="features-title">What you get:</h4>
            <div class="feature-list">
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Personal manuscripts and drafts</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Real-time collaborative writing</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Basic peer review workflows</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Web-native publishing</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Full data export always</span>
              </div>
            </div>
          </div>

          <div class="path-timeline">
            <div class="timeline-item">
              <div class="timeline-step">1</div>
              <div class="timeline-content"><strong>Sign up</strong> with your academic email</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-step">2</div>
              <div class="timeline-content"><strong>Create</strong> your first manuscript</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-step">3</div>
              <div class="timeline-content"><strong>Start writing</strong> in RSM or LaTeX</div>
            </div>
          </div>

          <div class="path-cta">
            <a href="/signup?type=researcher" class="btn btn-primary">
              <IconRocket :size="16" />
              <span>Start as Researcher</span>
            </a>
            <div class="path-note">Free forever for individual use</div>
          </div>
        </div>

        <div class="path-card institution">
          <div class="path-header">
            <div class="path-icon">
              <IconBuilding :size="40" />
            </div>
            <h3 class="path-title">Institution Setup</h3>
            <p class="path-subtitle">For universities, labs, and research organizations</p>
          </div>

          <div class="path-features">
            <h4 class="features-title">What you get:</h4>
            <div class="feature-list">
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Multi-user organization management</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Advanced reviewer networks</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Institutional branding</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Advanced analytics and reporting</span>
              </div>
              <div class="feature-item">
                <IconCheck :size="16" />
                <span>Priority support and training</span>
              </div>
            </div>
          </div>

          <div class="path-timeline">
            <div class="timeline-item">
              <div class="timeline-step">1</div>
              <div class="timeline-content"><strong>Schedule</strong> a consultation call</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-step">2</div>
              <div class="timeline-content"><strong>Custom setup</strong> for your needs</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-step">3</div>
              <div class="timeline-content"><strong>Onboard</strong> your researchers</div>
            </div>
          </div>

          <div class="path-cta">
            <a href="/contact?type=institution" class="btn btn-secondary">
              <IconCalendar :size="16" />
              <span>Schedule Consultation</span>
            </a>
            <div class="path-note">Pilot programs available</div>
          </div>
        </div>
      </div>

      <div class="comparison-note">
        <div class="note-content">
          <IconInfo :size="24" />
          <div class="note-text">
            <strong>Not sure which path?</strong> Individual researchers can always upgrade to
            institutional features later. Start with the researcher path to try Aris risk-free.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconUser,
    IconBuilding,
    IconCheck,
    IconRocket,
    IconCalendar,
    IconInfo,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* User Paths Section */
  .user-paths-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .user-paths-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
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
  }

  /* Paths Grid */
  .paths-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
    margin-bottom: var(--space-3xl);
  }

  .path-card {
    background: var(--gray-25);
    border: 2px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .path-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .path-card.researcher {
    border-color: var(--success-300);
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
  }

  .path-card.institution {
    border-color: var(--primary-300);
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
  }

  /* Path Header */
  .path-header {
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .path-icon {
    width: 80px;
    height: 80px;
    background: var(--surface-page);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    box-shadow: var(--shadow-soft);
  }

  .path-card.researcher .path-icon {
    color: var(--success-600);
    border: 2px solid var(--success-200);
  }

  .path-card.institution .path-icon {
    color: var(--primary-600);
    border: 2px solid var(--primary-200);
  }

  .path-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
    line-height: 1.3;
  }

  .path-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: var(--gray-700);
  }

  /* Path Features */
  .path-features {
    margin-bottom: var(--space-xl);
  }

  .features-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .feature-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Path Timeline */
  .path-timeline {
    margin-bottom: var(--space-xl);
  }

  .timeline-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
  }

  .timeline-item:last-child {
    margin-bottom: 0;
  }

  .timeline-step {
    width: 24px;
    height: 24px;
    background: var(--primary-500);
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 12px;
    flex-shrink: 0;
  }

  .path-card.researcher .timeline-step {
    background: var(--success-500);
  }

  .timeline-content {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    line-height: 1.4;
  }

  .timeline-content strong {
    color: var(--gray-900);
  }

  /* Path CTA */
  .path-cta {
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
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    min-width: 180px;
    justify-content: center;
    margin-bottom: var(--space-sm);
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

  .path-note {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
    font-style: italic;
  }

  /* Comparison Note */
  .comparison-note {
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    padding: var(--space-lg);
  }

  .note-content {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    max-width: 600px;
    margin: 0 auto;
  }

  .note-content svg {
    color: var(--primary-500);
    flex-shrink: 0;
  }

  .note-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
  }

  .note-text strong {
    color: var(--gray-900);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .user-paths-section {
      padding: var(--space-3xl) 0;
    }

    .paths-grid {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .path-card {
      padding: var(--space-xl);
    }

    .comparison-note {
      padding: var(--space-md);
    }

    .note-content {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }
  }

  @media (max-width: 480px) {
    .path-card {
      padding: var(--space-lg);
    }

    .path-icon {
      width: 64px;
      height: 64px;
    }

    .path-title {
      font-size: 20px;
    }

    .btn {
      width: 100%;
      max-width: 200px;
    }
  }
</style>
