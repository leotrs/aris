<template>
  <section class="security-contact-section" aria-labelledby="security-contact-heading">
    <div class="security-contact-content-wrapper">
      <div class="section-header">
        <h2 id="security-contact-heading" class="section-title">Security Support & Contact</h2>
        <p class="section-subtitle">
          Our dedicated security team is here to help with questions, assessments, and incident
          response. Multiple channels ensure you can reach us when you need support most.
        </p>
      </div>

      <div class="contact-grid">
        <div class="contact-card primary">
          <div class="card-header">
            <div class="card-icon">
              <IconShieldCheck :size="32" />
            </div>
            <h3 class="card-title">Security Team</h3>
            <p class="card-subtitle">General security inquiries and support</p>
          </div>
          <div class="card-content">
            <div class="contact-methods">
              <div class="contact-method">
                <IconMail :size="20" />
                <div class="method-info">
                  <span class="method-label">Email</span>
                  <span class="method-value">security@aris-platform.org</span>
                </div>
              </div>
              <div class="contact-method">
                <IconClock :size="20" />
                <div class="method-info">
                  <span class="method-label">Response Time</span>
                  <span class="method-value">Within 24 hours</span>
                </div>
              </div>
              <div class="contact-method">
                <IconKey :size="20" />
                <div class="method-info">
                  <span class="method-label">PGP Key</span>
                  <span class="method-value">Available for encrypted communication</span>
                </div>
              </div>
            </div>
            <div class="security-topics">
              <h4 class="topics-title">What we can help with:</h4>
              <div class="topics-list">
                <div class="topic">Security architecture questions</div>
                <div class="topic">Compliance requirements</div>
                <div class="topic">Integration security review</div>
                <div class="topic">Best practices guidance</div>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-card urgent">
          <div class="card-header">
            <div class="card-icon">
              <IconAlertTriangle :size="32" />
            </div>
            <h3 class="card-title">Emergency Response</h3>
            <p class="card-subtitle">Critical security incidents requiring immediate attention</p>
          </div>
          <div class="card-content">
            <div class="contact-methods">
              <div class="contact-method emergency">
                <IconPhoneCall :size="20" />
                <div class="method-info">
                  <span class="method-label">24/7 Hotline</span>
                  <span class="method-value">+1 (555) 123-SECURITY</span>
                </div>
              </div>
              <div class="contact-method">
                <IconMail :size="20" />
                <div class="method-info">
                  <span class="method-label">Emergency Email</span>
                  <span class="method-value">incident@aris-platform.org</span>
                </div>
              </div>
              <div class="contact-method">
                <IconClock :size="20" />
                <div class="method-info">
                  <span class="method-label">Response Time</span>
                  <span class="method-value">Within 15 minutes</span>
                </div>
              </div>
            </div>
            <div class="emergency-note">
              <IconInfo :size="16" />
              <span>Use this channel only for active security incidents or suspected breaches</span>
            </div>
          </div>
        </div>

        <div class="contact-card compliance">
          <div class="card-header">
            <div class="card-icon">
              <IconCertificate :size="32" />
            </div>
            <h3 class="card-title">Compliance Office</h3>
            <p class="card-subtitle">Regulatory compliance and audit support</p>
          </div>
          <div class="card-content">
            <div class="contact-methods">
              <div class="contact-method">
                <IconMail :size="20" />
                <div class="method-info">
                  <span class="method-label">Email</span>
                  <span class="method-value">compliance@aris-platform.org</span>
                </div>
              </div>
              <div class="contact-method">
                <IconCalendar :size="20" />
                <div class="method-info">
                  <span class="method-label">Consultation</span>
                  <span class="method-value">Schedule compliance review</span>
                </div>
              </div>
              <div class="contact-method">
                <IconFileText :size="20" />
                <div class="method-info">
                  <span class="method-label">Documentation</span>
                  <span class="method-value">SOC reports, certifications</span>
                </div>
              </div>
            </div>
            <div class="compliance-services">
              <h4 class="services-title">Compliance services:</h4>
              <div class="services-list">
                <div class="service">FERPA assessment support</div>
                <div class="service">GDPR compliance guidance</div>
                <div class="service">SOC 2 report access</div>
                <div class="service">Custom compliance mapping</div>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-card vulnerability">
          <div class="card-header">
            <div class="card-icon">
              <IconBug :size="32" />
            </div>
            <h3 class="card-title">Vulnerability Disclosure</h3>
            <p class="card-subtitle">Responsible security vulnerability reporting</p>
          </div>
          <div class="card-content">
            <div class="contact-methods">
              <div class="contact-method">
                <IconMail :size="20" />
                <div class="method-info">
                  <span class="method-label">Email</span>
                  <span class="method-value">security-reports@aris-platform.org</span>
                </div>
              </div>
              <div class="contact-method">
                <IconBrandGithub :size="20" />
                <div class="method-info">
                  <span class="method-label">GitHub</span>
                  <span class="method-value">Private security advisories</span>
                </div>
              </div>
              <div class="contact-method">
                <IconAward :size="20" />
                <div class="method-info">
                  <span class="method-label">Bug Bounty</span>
                  <span class="method-value">Recognition program available</span>
                </div>
              </div>
            </div>
            <div class="disclosure-process">
              <h4 class="process-title">Disclosure process:</h4>
              <div class="process-steps">
                <div class="step">1. Report vulnerability securely</div>
                <div class="step">2. Receive acknowledgment within 48h</div>
                <div class="step">3. Collaborate on fix timeline</div>
                <div class="step">4. Coordinated public disclosure</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-resources">
        <div class="resources-content">
          <h3 class="resources-title">Security Resources & Documentation</h3>
          <p class="resources-description">
            Access comprehensive security documentation, best practices, and self-service resources
            to help you implement secure research workflows.
          </p>
          <div class="resources-grid">
            <div class="resource-item">
              <div class="resource-icon">
                <IconBook :size="24" />
              </div>
              <div class="resource-info">
                <h4 class="resource-title">Security Documentation</h4>
                <p class="resource-description">
                  Comprehensive guides, best practices, and security implementation details
                </p>
                <a href="/security/docs" class="resource-link">
                  <span>View Documentation</span>
                  <IconArrowRight :size="16" />
                </a>
              </div>
            </div>
            <div class="resource-item">
              <div class="resource-icon">
                <IconDownload :size="24" />
              </div>
              <div class="resource-info">
                <h4 class="resource-title">Compliance Reports</h4>
                <p class="resource-description">
                  SOC 2 reports, certifications, and compliance documentation for your IT team
                </p>
                <a href="/security/reports" class="resource-link">
                  <span>Download Reports</span>
                  <IconArrowRight :size="16" />
                </a>
              </div>
            </div>
            <div class="resource-item">
              <div class="resource-icon">
                <IconUsers :size="24" />
              </div>
              <div class="resource-info">
                <h4 class="resource-title">Security Community</h4>
                <p class="resource-description">
                  Join discussions with other academic institutions about research security
                </p>
                <a href="/community/security" class="resource-link">
                  <span>Join Community</span>
                  <IconArrowRight :size="16" />
                </a>
              </div>
            </div>
            <div class="resource-item">
              <div class="resource-icon">
                <IconActivity :size="24" />
              </div>
              <div class="resource-info">
                <h4 class="resource-title">Security Status</h4>
                <p class="resource-description">
                  Real-time platform status, security updates, and incident notifications
                </p>
                <a href="/status" class="resource-link">
                  <span>Check Status</span>
                  <IconArrowRight :size="16" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-footer">
        <div class="footer-content">
          <div class="footer-info">
            <h4 class="footer-title">Aris Security Team</h4>
            <p class="footer-description">
              Protecting academic research with transparency, expertise, and 24/7 dedication. When
              you choose Aris, you're choosing a partner committed to the highest standards of
              research data security.
            </p>
          </div>
          <div class="footer-certifications">
            <div class="cert-badge">
              <IconCertificate :size="16" />
              <span>SOC 2 Type II</span>
            </div>
            <div class="cert-badge">
              <IconGlobe :size="16" />
              <span>GDPR Compliant</span>
            </div>
            <div class="cert-badge">
              <IconSchool :size="16" />
              <span>FERPA Ready</span>
            </div>
            <div class="cert-badge">
              <IconAward :size="16" />
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconShieldCheck,
    IconMail,
    IconClock,
    IconKey,
    IconAlertTriangle,
    IconPhoneCall,
    IconInfo,
    IconCertificate,
    IconCalendar,
    IconFileText,
    IconBug,
    IconBrandGithub,
    IconAward,
    IconBook,
    IconDownload,
    IconUsers,
    IconActivity,
    IconArrowRight,
    IconGlobe,
    IconSchool,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Security Contact Section */
  .security-contact-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .security-contact-content-wrapper {
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

  /* Contact Grid */
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .contact-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 450px;
  }

  .contact-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .contact-card.primary {
    border-color: var(--primary-300);
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
  }

  .contact-card.urgent {
    border-color: var(--error-300);
    background: linear-gradient(135deg, var(--error-25), var(--error-50));
  }

  .contact-card.compliance {
    border-color: var(--success-300);
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
  }

  .contact-card.vulnerability {
    border-color: var(--warning-300);
    background: linear-gradient(135deg, var(--warning-25), var(--warning-50));
  }

  .card-header {
    text-align: center;
    margin-bottom: var(--space-lg);
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: var(--surface-page);
    border: 2px solid var(--primary-200);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--primary-600);
    box-shadow: var(--shadow-soft);
  }

  .contact-card.urgent .card-icon {
    border-color: var(--error-200);
    color: var(--error-600);
  }

  .contact-card.compliance .card-icon {
    border-color: var(--success-200);
    color: var(--success-600);
  }

  .contact-card.vulnerability .card-icon {
    border-color: var(--warning-200);
    color: var(--warning-600);
  }

  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
    line-height: 1.3;
  }

  .card-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-600);
    line-height: 1.4;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* Contact Methods */
  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .contact-method {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--surface-page);
    border-radius: 8px;
  }

  .contact-method.emergency {
    border: 2px solid var(--error-300);
    background: linear-gradient(135deg, var(--error-50), var(--error-100));
  }

  .contact-method svg {
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .contact-card.urgent .contact-method svg {
    color: var(--error-600);
  }

  .contact-card.compliance .contact-method svg {
    color: var(--success-600);
  }

  .contact-card.vulnerability .contact-method svg {
    color: var(--warning-600);
  }

  .method-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .method-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .method-value {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
  }

  /* Emergency Note */
  .emergency-note {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    background: var(--error-100);
    border: 1px solid var(--error-200);
    border-radius: 6px;
    margin-top: auto;
  }

  .emergency-note svg {
    color: var(--error-600);
    flex-shrink: 0;
  }

  .emergency-note span {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--error-700);
    font-style: italic;
  }

  /* Security Topics & Services */
  .security-topics,
  .compliance-services,
  .disclosure-process {
    margin-top: auto;
  }

  .topics-title,
  .services-title,
  .process-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .topics-list,
  .services-list,
  .process-steps {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .topic,
  .service,
  .step {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-700);
    padding: var(--space-xs) var(--space-sm);
    background: var(--surface-page);
    border-radius: 4px;
    position: relative;
  }

  .topic::before,
  .service::before,
  .step::before {
    content: "•";
    position: absolute;
    left: var(--space-xs);
    color: var(--primary-500);
  }

  .topic,
  .service,
  .step {
    padding-left: var(--space-lg);
  }

  .contact-card.compliance .service::before {
    color: var(--success-500);
  }

  .contact-card.vulnerability .step::before {
    color: var(--warning-500);
  }

  /* Contact Resources */
  .contact-resources {
    background: linear-gradient(135deg, var(--gray-25), var(--primary-25));
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .resources-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .resources-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .resources-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
  }

  .resource-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    text-align: center;
  }

  .resource-icon {
    width: 48px;
    height: 48px;
    background: var(--primary-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .resource-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .resource-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .resource-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  .resource-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-600);
    text-decoration: none;
    margin-top: auto;
    transition: all 0.2s ease;
  }

  .resource-link:hover {
    color: var(--primary-700);
    transform: translateX(2px);
  }

  /* Contact Footer */
  .contact-footer {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .footer-content {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2xl);
  }

  .footer-info {
    flex: 1;
  }

  .footer-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .footer-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin: 0;
  }

  .footer-certifications {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .cert-badge {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    background: var(--primary-50);
    color: var(--primary-700);
    border: 1px solid var(--primary-200);
    border-radius: 12px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .security-contact-section {
      padding: var(--space-3xl) 0;
    }

    .contact-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .contact-card {
      padding: var(--space-xl);
      min-height: auto;
    }

    .contact-resources {
      padding: var(--space-xl);
    }

    .resources-grid {
      grid-template-columns: 1fr;
    }

    .contact-footer {
      padding: var(--space-xl);
    }

    .footer-content {
      flex-direction: column;
      text-align: center;
      gap: var(--space-lg);
    }

    .footer-certifications {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .contact-card {
      padding: var(--space-lg);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .contact-resources {
      padding: var(--space-lg);
    }

    .resources-title {
      font-size: 24px;
    }

    .contact-footer {
      padding: var(--space-lg);
    }

    .footer-certifications {
      flex-direction: column;
      align-items: center;
    }

    .cert-badge {
      width: 100%;
      max-width: 200px;
      justify-content: center;
    }
  }
</style>
