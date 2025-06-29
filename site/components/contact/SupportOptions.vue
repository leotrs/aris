<template>
  <section class="support-options-section" aria-labelledby="support-options-heading">
    <div class="support-options-content-wrapper">
      <div class="section-header">
        <h2 id="support-options-heading" class="section-title">Multiple Ways to Get Help</h2>
        <p class="section-subtitle">
          Choose the support channel that works best for you. From self-service documentation to
          direct expert help, we've got you covered.
        </p>
      </div>

      <div class="support-grid">
        <div class="support-card documentation">
          <div class="card-icon">
            <IconBook :size="32" />
          </div>
          <h3 class="card-title">Documentation Hub</h3>
          <p class="card-description">
            Comprehensive guides, tutorials, and reference materials for all aspects of Aris. Start
            here for quick answers and step-by-step instructions.
          </p>
          <div class="card-features">
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Getting started guides</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>RSM syntax reference</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Integration tutorials</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Troubleshooting guides</span>
            </div>
          </div>
          <div class="card-actions">
            <a href="/docs" class="btn btn-primary">
              <IconExternalLink :size="16" />
              Browse Documentation
            </a>
            <div class="card-meta">
              <IconClock :size="14" />
              <span>Available 24/7</span>
            </div>
          </div>
        </div>

        <div class="support-card community">
          <div class="card-icon">
            <IconUsers :size="32" />
          </div>
          <h3 class="card-title">Community Support</h3>
          <p class="card-description">
            Connect with other researchers, share experiences, and get help from the community. Our
            forum is moderated by Aris team members.
          </p>
          <div class="card-features">
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Peer-to-peer help</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Best practices sharing</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Feature discussions</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Academic workflows</span>
            </div>
          </div>
          <div class="card-actions">
            <a href="https://forum.aris-platform.org" class="btn btn-primary">
              <IconExternalLink :size="16" />
              Join Community
            </a>
            <div class="card-meta">
              <IconUsers :size="14" />
              <span>500+ active researchers</span>
            </div>
          </div>
        </div>

        <div class="support-card technical">
          <div class="card-icon">
            <IconSettings :size="32" />
          </div>
          <h3 class="card-title">Technical Support</h3>
          <p class="card-description">
            Direct technical assistance from our engineering team for complex issues, integration
            challenges, and platform-specific questions.
          </p>
          <div class="card-features">
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Expert engineering help</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Integration assistance</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Bug reports & fixes</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Performance optimization</span>
            </div>
          </div>
          <div class="card-actions">
            <a href="mailto:support@aris-platform.org" class="btn btn-primary">
              <IconMail :size="16" />
              Contact Support
            </a>
            <div class="card-meta">
              <IconClock :size="14" />
              <span>24h response time</span>
            </div>
          </div>
        </div>

        <div class="support-card institutional">
          <div class="card-icon">
            <IconBuilding :size="32" />
          </div>
          <h3 class="card-title">Institutional Support</h3>
          <p class="card-description">
            Dedicated support for institutions considering Aris adoption. Includes consultations,
            security reviews, and implementation planning.
          </p>
          <div class="card-features">
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Security consultations</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Implementation planning</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Compliance assistance</span>
            </div>
            <div class="feature">
              <IconCircleCheck :size="16" />
              <span>Training programs</span>
            </div>
          </div>
          <div class="card-actions">
            <a href="#office-hours" class="btn btn-primary">
              <IconCalendar :size="16" />
              Schedule Consultation
            </a>
            <div class="card-meta">
              <IconShield :size="14" />
              <span>Enterprise-grade support</span>
            </div>
          </div>
        </div>
      </div>

      <div class="support-stats">
        <div class="stats-content">
          <h3 class="stats-title">Support by the Numbers</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">98%</div>
              <div class="stat-label">Resolution Rate</div>
              <div class="stat-description">Issues resolved on first contact</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">&lt; 2h</div>
              <div class="stat-label">Avg Response Time</div>
              <div class="stat-description">For technical support inquiries</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Documentation</div>
              <div class="stat-description">Always available self-service</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">95%</div>
              <div class="stat-label">Satisfaction Score</div>
              <div class="stat-description">Based on user feedback</div>
            </div>
          </div>
        </div>
      </div>

      <div class="support-flow">
        <div class="flow-content">
          <h3 class="flow-title">How to Get Help Efficiently</h3>
          <div class="flow-steps">
            <div class="flow-step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4 class="step-title">Check Documentation</h4>
                <p class="step-description">
                  Start with our comprehensive docs for common questions and tutorials
                </p>
              </div>
            </div>
            <div class="flow-arrow">
              <IconArrowRight :size="24" />
            </div>
            <div class="flow-step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4 class="step-title">Search Community</h4>
                <p class="step-description">
                  Browse forum discussions for similar issues and solutions
                </p>
              </div>
            </div>
            <div class="flow-arrow">
              <IconArrowRight :size="24" />
            </div>
            <div class="flow-step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4 class="step-title">Contact Direct Support</h4>
                <p class="step-description">Reach out to our team for personalized assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconBook,
    IconUsers,
    IconSettings,
    IconBuilding,
    IconCircleCheck,
    IconExternalLink,
    IconMail,
    IconCalendar,
    IconClock,
    IconShield,
    IconArrowRight,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Support Options Section */
  .support-options-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--primary-25) 100%);
    padding: var(--space-4xl) 0;
  }

  .support-options-content-wrapper {
    max-width: 1400px;
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

  /* Support Grid */
  .support-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .support-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .support-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .support-card.documentation {
    border-color: var(--primary-300);
  }

  .support-card.community {
    border-color: var(--success-300);
  }

  .support-card.technical {
    border-color: var(--warning-300);
  }

  .support-card.institutional {
    border-color: var(--error-300);
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--primary-600);
    box-shadow: var(--shadow-soft);
  }

  .support-card.community .card-icon {
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    color: var(--success-600);
  }

  .support-card.technical .card-icon {
    background: linear-gradient(135deg, var(--warning-100), var(--warning-200));
    color: var(--warning-600);
  }

  .support-card.institutional .card-icon {
    background: linear-gradient(135deg, var(--error-100), var(--error-200));
    color: var(--error-600);
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

  /* Card Features */
  .card-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-xl);
    text-align: left;
  }

  .feature {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .feature svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Card Actions */
  .card-actions {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    align-items: center;
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
  }

  .btn-primary {
    background: var(--primary-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
  }

  .card-meta svg {
    color: var(--gray-500);
  }

  /* Support Stats */
  .support-stats {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .stats-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .stats-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xl);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-xl);
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: var(--space-sm);
  }

  .stat-label {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .stat-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-600);
  }

  /* Support Flow */
  .support-flow {
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .flow-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .flow-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xl);
  }

  .flow-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-lg);
    flex-wrap: wrap;
  }

  .flow-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    max-width: 200px;
    text-align: center;
  }

  .step-number {
    width: 48px;
    height: 48px;
    background: var(--primary-500);
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 700;
    box-shadow: var(--shadow-soft);
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .step-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  .flow-arrow {
    color: var(--primary-400);
    display: flex;
    align-items: center;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .support-options-section {
      padding: var(--space-3xl) 0;
    }

    .support-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .support-card {
      padding: var(--space-xl);
    }

    .support-stats,
    .support-flow {
      padding: var(--space-xl);
    }

    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--space-lg);
    }

    .flow-steps {
      flex-direction: column;
      gap: var(--space-xl);
    }

    .flow-arrow {
      transform: rotate(90deg);
    }
  }

  @media (max-width: 480px) {
    .support-card {
      padding: var(--space-lg);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .support-stats,
    .support-flow {
      padding: var(--space-lg);
    }

    .stats-title,
    .flow-title {
      font-size: 24px;
    }

    .stat-number {
      font-size: 24px;
    }

    .btn {
      width: 100%;
      min-width: auto;
    }
  }
</style>
