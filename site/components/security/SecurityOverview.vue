<template>
  <section
    id="security-overview"
    class="security-overview-section"
    aria-labelledby="security-overview-heading"
  >
    <div class="security-overview-content-wrapper">
      <div class="section-header">
        <h2 id="security-overview-heading" class="section-title">Security Architecture Overview</h2>
        <p class="section-subtitle">
          Multi-layered protection designed specifically for academic research environments. Every
          component built with security, privacy, and compliance in mind.
        </p>
      </div>

      <div class="security-pillars">
        <div class="pillar-card featured">
          <div class="pillar-header">
            <div class="pillar-icon">
              <IconShield :size="40" />
            </div>
            <h3 class="pillar-title">Data Protection</h3>
          </div>
          <div class="pillar-content">
            <p class="pillar-description">
              Your research data is protected by enterprise-grade encryption and access controls
              designed for academic confidentiality requirements.
            </p>
            <div class="protection-features">
              <div class="feature-item">
                <IconLock :size="16" />
                <span>AES-256 encryption at rest</span>
              </div>
              <div class="feature-item">
                <IconKey :size="16" />
                <span>TLS 1.3 for data in transit</span>
              </div>
              <div class="feature-item">
                <IconEye :size="16" />
                <span>Zero-knowledge architecture</span>
              </div>
              <div class="feature-item">
                <IconUserCheck :size="16" />
                <span>Multi-factor authentication</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pillar-card">
          <div class="pillar-header">
            <div class="pillar-icon">
              <IconServer :size="40" />
            </div>
            <h3 class="pillar-title">Infrastructure Security</h3>
          </div>
          <div class="pillar-content">
            <p class="pillar-description">
              Built on hardened infrastructure with continuous monitoring, automated threat
              detection, and rapid incident response capabilities.
            </p>
            <div class="infrastructure-stats">
              <div class="stat-item">
                <div class="stat-value">99.9%</div>
                <div class="stat-label">Uptime SLA</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">24/7</div>
                <div class="stat-label">SOC Monitoring</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">&lt; 1min</div>
                <div class="stat-label">Threat Detection</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pillar-card">
          <div class="pillar-header">
            <div class="pillar-icon">
              <IconCertificate :size="40" />
            </div>
            <h3 class="pillar-title">Compliance Framework</h3>
          </div>
          <div class="pillar-content">
            <p class="pillar-description">
              Comprehensive compliance with academic and regulatory standards to meet institutional
              requirements worldwide.
            </p>
            <div class="compliance-badges">
              <div class="badge soc2">SOC 2 Type II</div>
              <div class="badge gdpr">GDPR Ready</div>
              <div class="badge ferpa">FERPA Compliant</div>
              <div class="badge iso">ISO 27001</div>
            </div>
          </div>
        </div>

        <div class="pillar-card">
          <div class="pillar-header">
            <div class="pillar-icon">
              <IconEye :size="40" />
            </div>
            <h3 class="pillar-title">Access Control</h3>
          </div>
          <div class="pillar-content">
            <p class="pillar-description">
              Granular permissions and zero-trust access ensure only authorized users can access
              your research data, with full audit trails.
            </p>
            <div class="access-features">
              <div class="access-item">
                <IconUsers :size="20" />
                <div class="access-info">
                  <h4 class="access-title">Role-Based Access</h4>
                  <p class="access-text">Precise control over who can read, edit, or review</p>
                </div>
              </div>
              <div class="access-item">
                <IconKey :size="20" />
                <div class="access-info">
                  <h4 class="access-title">SSO Integration</h4>
                  <p class="access-text">
                    Seamless integration with institutional identity providers
                  </p>
                </div>
              </div>
              <div class="access-item">
                <IconClipboardList :size="20" />
                <div class="access-info">
                  <h4 class="access-title">Audit Logging</h4>
                  <p class="access-text">Complete trails of all access and modifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="security-transparency">
        <div class="transparency-content">
          <h3 class="transparency-title">Transparent Security Practices</h3>
          <p class="transparency-description">
            As an open-source platform, our security practices are transparent and auditable.
            Academic institutions can review our security implementations and contribute to
            improvements.
          </p>
          <div class="transparency-grid">
            <div class="transparency-item">
              <IconCode :size="24" />
              <div class="transparency-info">
                <h4 class="transparency-item-title">Open Source Security</h4>
                <p class="transparency-item-text">
                  Security through transparency—all code is auditable by the community
                </p>
              </div>
            </div>
            <div class="transparency-item">
              <IconBug :size="24" />
              <div class="transparency-info">
                <h4 class="transparency-item-title">Responsible Disclosure</h4>
                <p class="transparency-item-text">
                  Clear vulnerability reporting process with recognized security researchers
                </p>
              </div>
            </div>
            <div class="transparency-item">
              <IconFileText :size="24" />
              <div class="transparency-info">
                <h4 class="transparency-item-title">Security Documentation</h4>
                <p class="transparency-item-text">
                  Comprehensive security guides and best practices for institutional IT teams
                </p>
              </div>
            </div>
          </div>
          <div class="transparency-cta">
            <a href="https://github.com/aris-platform/security" class="btn btn-primary">
              <IconBrandGithub :size="16" />
              View Security Repository
            </a>
            <a href="/security/whitepaper" class="btn btn-secondary">
              <IconFileText :size="16" />
              Security Whitepaper
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconShield,
    IconLock,
    IconKey,
    IconEye,
    IconUserCheck,
    IconServer,
    IconCertificate,
    IconUsers,
    IconClipboardList,
    IconCode,
    IconBug,
    IconFileText,
    IconBrandGithub,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Security Overview Section */
  .security-overview-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .security-overview-content-wrapper {
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

  /* Security Pillars */
  .security-pillars {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .pillar-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 400px;
  }

  .pillar-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .pillar-card.featured {
    border: 2px solid var(--success-300);
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
  }

  .pillar-header {
    text-align: center;
    margin-bottom: var(--space-lg);
  }

  .pillar-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--success-600);
    box-shadow: var(--shadow-soft);
  }

  .pillar-title {
    font-family: "Montserrat", sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gray-900);
    line-height: 1.3;
  }

  .pillar-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .pillar-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
    text-align: center;
  }

  /* Protection Features */
  .protection-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-top: auto;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    padding: var(--space-sm);
    background: var(--surface-page);
    border-radius: 6px;
  }

  .feature-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Infrastructure Stats */
  .infrastructure-stats {
    display: flex;
    justify-content: space-around;
    gap: var(--space-md);
    margin-top: auto;
  }

  .stat-item {
    text-align: center;
    padding: var(--space-md);
    background: var(--surface-page);
    border-radius: 8px;
    flex: 1;
  }

  .stat-value {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--success-600);
    margin-bottom: var(--space-xs);
  }

  .stat-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Compliance Badges */
  .compliance-badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    justify-content: center;
    margin-top: auto;
  }

  .badge {
    padding: var(--space-sm) var(--space-md);
    border-radius: 20px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    min-width: 80px;
  }

  .badge.soc2 {
    background: var(--primary-50);
    color: var(--primary-700);
    border: 1px solid var(--primary-200);
  }

  .badge.gdpr {
    background: var(--success-50);
    color: var(--success-700);
    border: 1px solid var(--success-200);
  }

  .badge.ferpa {
    background: var(--warning-50);
    color: var(--warning-700);
    border: 1px solid var(--warning-200);
  }

  .badge.iso {
    background: var(--gray-100);
    color: var(--gray-700);
    border: 1px solid var(--gray-300);
  }

  /* Access Features */
  .access-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-top: auto;
  }

  .access-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--surface-page);
    border-radius: 8px;
  }

  .access-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  .access-info {
    flex: 1;
  }

  .access-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .access-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  /* Security Transparency */
  .security-transparency {
    background: linear-gradient(135deg, var(--gray-25), var(--primary-25));
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .transparency-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .transparency-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .transparency-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .transparency-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .transparency-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    text-align: left;
  }

  .transparency-item svg {
    color: var(--primary-500);
    flex-shrink: 0;
  }

  .transparency-info {
    flex: 1;
  }

  .transparency-item-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .transparency-item-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  .transparency-cta {
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
  }

  .btn-secondary {
    background: var(--white);
    color: var(--primary-600);
    border: 1px solid var(--primary-300);
  }

  .btn-secondary:hover {
    background: var(--primary-50);
    transform: translateY(-2px);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .security-overview-section {
      padding: var(--space-3xl) 0;
    }

    .security-pillars {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .pillar-card {
      padding: var(--space-xl);
      min-height: auto;
    }

    .pillar-icon {
      width: 64px;
      height: 64px;
    }

    .infrastructure-stats {
      flex-direction: column;
      gap: var(--space-sm);
    }

    .compliance-badges {
      grid-template-columns: 1fr 1fr;
      gap: var(--space-xs);
    }

    .transparency-grid {
      grid-template-columns: 1fr;
    }

    .transparency-item {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }

    .security-transparency {
      padding: var(--space-xl);
    }

    .transparency-cta {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 250px;
    }
  }

  @media (max-width: 480px) {
    .pillar-card {
      padding: var(--space-lg);
    }

    .pillar-icon {
      width: 56px;
      height: 56px;
    }

    .pillar-title {
      font-size: 20px;
    }

    .compliance-badges {
      flex-direction: column;
      align-items: center;
    }

    .badge {
      width: 100%;
      max-width: 150px;
    }

    .security-transparency {
      padding: var(--space-lg);
    }

    .transparency-title {
      font-size: 24px;
    }
  }
</style>
