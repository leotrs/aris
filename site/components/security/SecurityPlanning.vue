<template>
  <section class="security-planning-section" aria-labelledby="security-planning-heading">
    <div class="planning-content-wrapper">
      <div class="section-header">
        <h2 id="security-planning-heading" class="section-title">Our Security Commitment</h2>
        <p class="section-subtitle">
          We're building Aris with security as a fundamental requirement, not an afterthought.
          Here's what we're doing and what we will do.
        </p>
      </div>

      <div class="security-timeline">
        <div class="timeline-section current">
          <div class="timeline-header">
            <div class="timeline-icon current">
              <IconTools :size="24" />
            </div>
            <h3 class="timeline-title">Currently Building</h3>
            <div class="status-badge current">In Development</div>
          </div>
          <div class="timeline-content">
            <div class="security-areas">
              <div class="area-card">
                <h4 class="area-title">
                  <IconCode :size="20" />
                  Open Source Foundation
                </h4>
                <p class="area-description">
                  All code will be publicly available for security review. No hidden algorithms or
                  proprietary black boxes.
                </p>
                <div class="area-status">
                  <IconCircle :size="12" />
                  <span>Architecture design phase</span>
                </div>
              </div>

              <div class="area-card">
                <h4 class="area-title">
                  <IconShield :size="20" />
                  Data Protection by Design
                </h4>
                <p class="area-description">
                  Encryption at rest and in transit, minimal data collection, and user-controlled
                  privacy settings.
                </p>
                <div class="area-status">
                  <IconCircle :size="12" />
                  <span>Technical specifications in progress</span>
                </div>
              </div>

              <div class="area-card">
                <h4 class="area-title">
                  <IconUsers :size="20" />
                  Community Accountability
                </h4>
                <p class="area-description">
                  Open development process with security reviews by the academic community before
                  launch.
                </p>
                <div class="area-status">
                  <IconCircle :size="12" />
                  <span>Community feedback framework planned</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="timeline-section future">
          <div class="timeline-header">
            <div class="timeline-icon future">
              <IconTarget :size="24" />
            </div>
            <h3 class="timeline-title">Before Launch</h3>
            <div class="status-badge future">Planned</div>
          </div>
          <div class="timeline-content">
            <div class="launch-requirements">
              <div class="requirement">
                <IconCheck :size="16" />
                <span>Independent security audit</span>
              </div>
              <div class="requirement">
                <IconCheck :size="16" />
                <span>Penetration testing</span>
              </div>
              <div class="requirement">
                <IconCheck :size="16" />
                <span>Data protection impact assessment</span>
              </div>
              <div class="requirement">
                <IconCheck :size="16" />
                <span>Academic institution security review</span>
              </div>
              <div class="requirement">
                <IconCheck :size="16" />
                <span>Clear data governance policies</span>
              </div>
            </div>
          </div>
        </div>

        <div class="timeline-section future">
          <div class="timeline-header">
            <div class="timeline-icon future">
              <IconCertificate :size="24" />
            </div>
            <h3 class="timeline-title">Post-Launch Goals</h3>
            <div class="status-badge future">Future</div>
          </div>
          <div class="timeline-content">
            <div class="compliance-goals">
              <div class="goal">
                <h4 class="goal-title">SOC 2 Type II</h4>
                <p class="goal-description">
                  Independent audit of security controls once we have production systems.
                </p>
              </div>
              <div class="goal">
                <h4 class="goal-title">GDPR Compliance</h4>
                <p class="goal-description">
                  Full compliance with EU privacy regulations for international users.
                </p>
              </div>
              <div class="goal">
                <h4 class="goal-title">ISO 27001</h4>
                <p class="goal-description">
                  Information security management certification as we scale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="transparency-commitment">
        <div class="commitment-header">
          <h3 class="commitment-title">Our Transparency Promise</h3>
          <p class="commitment-subtitle">
            We commit to honest, ongoing communication about our security posture.
          </p>
        </div>
        <div class="transparency-actions">
          <div class="action-item">
            <IconEye :size="20" />
            <div class="action-content">
              <h4 class="action-title">Public Security Updates</h4>
              <p class="action-description">Regular updates on our security development progress</p>
            </div>
          </div>
          <div class="action-item">
            <IconAlertTriangle :size="20" />
            <div class="action-content">
              <h4 class="action-title">Incident Transparency</h4>
              <p class="action-description">Honest reporting of any security issues or breaches</p>
            </div>
          </div>
          <div class="action-item">
            <IconMessageCircle :size="20" />
            <div class="action-content">
              <h4 class="action-title">Community Input</h4>
              <p class="action-description">Open channels for security feedback and suggestions</p>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-section">
        <h3 class="contact-title">Security Questions?</h3>
        <p class="contact-description">
          Have specific security requirements or concerns? We want to hear from you.
        </p>
        <a href="mailto:security@aris-platform.org" class="contact-btn">
          <IconMail :size="16" />
          security@aris-platform.org
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconTools,
    IconTarget,
    IconCertificate,
    IconCode,
    IconShield,
    IconUsers,
    IconCheck,
    IconCircle,
    IconEye,
    IconAlertTriangle,
    IconMessageCircle,
    IconMail,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  .security-planning-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .planning-content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

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
  }

  .section-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: var(--gray-700);
    max-width: 600px;
    margin: 0 auto;
  }

  /* Timeline */
  .security-timeline {
    margin-bottom: var(--space-4xl);
  }

  .timeline-section {
    margin-bottom: var(--space-3xl);
    padding: var(--space-2xl);
    border-radius: 16px;
    border: 2px solid var(--border-primary);
  }

  .timeline-section.current {
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    border-color: var(--primary-300);
  }

  .timeline-section.future {
    background: var(--gray-25);
    border-color: var(--gray-300);
  }

  .timeline-header {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .timeline-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .timeline-icon.current {
    background: var(--primary-500);
    color: var(--white);
  }

  .timeline-icon.future {
    background: var(--gray-200);
    color: var(--gray-600);
  }

  .timeline-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    flex: 1;
  }

  .status-badge {
    padding: var(--space-xs) var(--space-md);
    border-radius: 20px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
  }

  .status-badge.current {
    background: var(--success-100);
    color: var(--success-700);
    border: 1px solid var(--success-300);
  }

  .status-badge.future {
    background: var(--gray-100);
    color: var(--gray-700);
    border: 1px solid var(--gray-300);
  }

  /* Security Areas */
  .security-areas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-lg);
  }

  .area-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-lg);
  }

  .area-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .area-title svg {
    color: var(--primary-500);
  }

  .area-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin-bottom: var(--space-md);
  }

  .area-status {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
    font-style: italic;
  }

  .area-status svg {
    color: var(--warning-500);
  }

  /* Launch Requirements */
  .launch-requirements {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .requirement {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    color: var(--gray-700);
  }

  .requirement svg {
    color: var(--success-600);
  }

  /* Compliance Goals */
  .compliance-goals {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .goal {
    padding: var(--space-md);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
  }

  .goal-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .goal-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    line-height: 1.5;
  }

  /* Transparency Commitment */
  .transparency-commitment {
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
    border: 1px solid var(--success-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .commitment-header {
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .commitment-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .commitment-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    color: var(--gray-700);
  }

  .transparency-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
  }

  .action-item {
    display: flex;
    gap: var(--space-md);
    align-items: flex-start;
  }

  .action-item svg {
    color: var(--success-600);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .action-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .action-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    line-height: 1.5;
  }

  /* Contact Section */
  .contact-section {
    text-align: center;
    padding: var(--space-2xl);
    background: var(--gray-25);
    border-radius: 12px;
  }

  .contact-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .contact-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  .contact-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-xl);
    background: var(--primary-500);
    color: var(--white);
    text-decoration: none;
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .contact-btn:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .security-planning-section {
      padding: var(--space-3xl) 0;
    }

    .timeline-section {
      padding: var(--space-xl);
    }

    .timeline-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-md);
    }

    .security-areas {
      grid-template-columns: 1fr;
    }

    .transparency-actions {
      grid-template-columns: 1fr;
    }

    .transparency-commitment {
      padding: var(--space-xl);
    }
  }
</style>
