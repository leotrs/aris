<template>
  <section class="compliance-section" aria-labelledby="compliance-heading">
    <div class="compliance-content-wrapper">
      <div class="section-header">
        <h2 id="compliance-heading" class="section-title">Compliance & Regulatory Standards</h2>
        <p class="section-subtitle">
          Built to meet the strictest academic and regulatory requirements worldwide. Our compliance
          framework ensures your institution can confidently adopt Aris.
        </p>
      </div>

      <div class="compliance-grid">
        <div class="compliance-card soc2">
          <div class="card-header">
            <div class="compliance-badge soc2-badge">
              <IconCertificate :size="24" />
              <span>SOC 2 Type II</span>
            </div>
            <h3 class="card-title">Service Organization Control 2</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Independently audited and certified for security, availability, processing integrity,
              confidentiality, and privacy controls.
            </p>
            <div class="compliance-details">
              <div class="detail-section">
                <h4 class="detail-title">Trust Service Criteria</h4>
                <div class="criteria-list">
                  <div class="criteria-item">
                    <IconShield :size="16" />
                    <span>Security</span>
                  </div>
                  <div class="criteria-item">
                    <IconActivity :size="16" />
                    <span>Availability</span>
                  </div>
                  <div class="criteria-item">
                    <IconLock :size="16" />
                    <span>Confidentiality</span>
                  </div>
                  <div class="criteria-item">
                    <IconUserCheck :size="16" />
                    <span>Privacy</span>
                  </div>
                  <div class="criteria-item">
                    <IconCheckCircle :size="16" />
                    <span>Processing Integrity</span>
                  </div>
                </div>
              </div>
              <div class="audit-info">
                <div class="audit-detail"><strong>Auditor:</strong> Independent CPA firm</div>
                <div class="audit-detail">
                  <strong>Frequency:</strong> Annual Type II examination
                </div>
                <div class="audit-detail">
                  <strong>Report:</strong> Available to customers under NDA
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="compliance-card gdpr">
          <div class="card-header">
            <div class="compliance-badge gdpr-badge">
              <IconGlobe :size="24" />
              <span>GDPR</span>
            </div>
            <h3 class="card-title">General Data Protection Regulation</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Full compliance with EU data protection requirements, including data residency options
              and comprehensive user rights implementation.
            </p>
            <div class="gdpr-rights">
              <h4 class="rights-title">Your GDPR Rights</h4>
              <div class="rights-grid">
                <div class="right-item">
                  <IconEye :size="16" />
                  <div class="right-content">
                    <strong>Right to Access</strong>
                    <span>View all your personal data</span>
                  </div>
                </div>
                <div class="right-item">
                  <IconEdit :size="16" />
                  <div class="right-content">
                    <strong>Right to Rectification</strong>
                    <span>Correct inaccurate data</span>
                  </div>
                </div>
                <div class="right-item">
                  <IconTrash :size="16" />
                  <div class="right-content">
                    <strong>Right to Erasure</strong>
                    <span>Delete your data completely</span>
                  </div>
                </div>
                <div class="right-item">
                  <IconDownload :size="16" />
                  <div class="right-content">
                    <strong>Data Portability</strong>
                    <span>Export in machine-readable format</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="data-residency">
              <h4 class="residency-title">Data Residency Options</h4>
              <div class="residency-options">
                <div class="residency-option">
                  <IconMapPin :size="16" />
                  <span>EU (Frankfurt, Dublin)</span>
                </div>
                <div class="residency-option">
                  <IconMapPin :size="16" />
                  <span>US (Virginia, Oregon)</span>
                </div>
                <div class="residency-option">
                  <IconMapPin :size="16" />
                  <span>UK (London)</span>
                </div>
                <div class="residency-option">
                  <IconMapPin :size="16" />
                  <span>Canada (Central)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="compliance-card ferpa">
          <div class="card-header">
            <div class="compliance-badge ferpa-badge">
              <IconSchool :size="24" />
              <span>FERPA</span>
            </div>
            <h3 class="card-title">Family Educational Rights and Privacy Act</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Designed specifically for educational institutions with built-in protections for
              student educational records and research data.
            </p>
            <div class="ferpa-protections">
              <div class="protection-item">
                <IconUserShield :size="20" />
                <div class="protection-content">
                  <h4 class="protection-title">Student Data Protection</h4>
                  <p class="protection-text">
                    Strict controls over educational record access with automatic audit trails
                  </p>
                </div>
              </div>
              <div class="protection-item">
                <IconKey :size="20" />
                <div class="protection-content">
                  <h4 class="protection-title">Directory Information Controls</h4>
                  <p class="protection-text">
                    Granular controls over what information can be shared and with whom
                  </p>
                </div>
              </div>
              <div class="protection-item">
                <IconClipboardList :size="20" />
                <div class="protection-content">
                  <h4 class="protection-title">Consent Management</h4>
                  <p class="protection-text">
                    Built-in consent tracking for research participation and data sharing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="compliance-card iso">
          <div class="card-header">
            <div class="compliance-badge iso-badge">
              <IconAward :size="24" />
              <span>ISO 27001</span>
            </div>
            <h3 class="card-title">Information Security Management</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              International standard for information security management systems, ensuring
              systematic approach to managing sensitive information.
            </p>
            <div class="iso-framework">
              <div class="framework-item">
                <div class="framework-icon">
                  <IconTarget :size="20" />
                </div>
                <div class="framework-content">
                  <h4 class="framework-title">Risk Management</h4>
                  <p class="framework-text">
                    Systematic identification and mitigation of security risks
                  </p>
                </div>
              </div>
              <div class="framework-item">
                <div class="framework-icon">
                  <IconRefresh :size="20" />
                </div>
                <div class="framework-content">
                  <h4 class="framework-title">Continuous Improvement</h4>
                  <p class="framework-text">Regular review and enhancement of security practices</p>
                </div>
              </div>
              <div class="framework-item">
                <div class="framework-icon">
                  <IconUsers :size="20" />
                </div>
                <div class="framework-content">
                  <h4 class="framework-title">Personnel Security</h4>
                  <p class="framework-text">
                    Background checks and security training for all staff
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="regional-compliance">
        <div class="regional-content">
          <h3 class="regional-title">Regional & Institutional Compliance</h3>
          <p class="regional-description">
            We understand that different regions and institutions have unique compliance
            requirements. Our platform is designed to adapt to your specific needs.
          </p>
          <div class="regional-grid">
            <div class="regional-item">
              <div class="regional-flag">🇺🇸</div>
              <div class="regional-info">
                <h4 class="regional-name">United States</h4>
                <div class="regional-standards">
                  <span>FERPA</span>
                  <span>HIPAA (health research)</span>
                  <span>NIST Cybersecurity Framework</span>
                </div>
              </div>
            </div>
            <div class="regional-item">
              <div class="regional-flag">🇪🇺</div>
              <div class="regional-info">
                <h4 class="regional-name">European Union</h4>
                <div class="regional-standards">
                  <span>GDPR</span>
                  <span>NIS2 Directive</span>
                  <span>Digital Services Act</span>
                </div>
              </div>
            </div>
            <div class="regional-item">
              <div class="regional-flag">🇬🇧</div>
              <div class="regional-info">
                <h4 class="regional-name">United Kingdom</h4>
                <div class="regional-standards">
                  <span>UK GDPR</span>
                  <span>Data Protection Act 2018</span>
                  <span>Cyber Essentials</span>
                </div>
              </div>
            </div>
            <div class="regional-item">
              <div class="regional-flag">🇨🇦</div>
              <div class="regional-info">
                <h4 class="regional-name">Canada</h4>
                <div class="regional-standards">
                  <span>PIPEDA</span>
                  <span>Provincial privacy laws</span>
                  <span>CCCS guidelines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="compliance-support">
        <div class="support-content">
          <h3 class="support-title">Compliance Support & Documentation</h3>
          <p class="support-description">
            Our dedicated compliance team helps institutions navigate regulatory requirements and
            provides comprehensive documentation for IT and legal teams.
          </p>
          <div class="support-services">
            <div class="service-item">
              <IconFileText :size="24" />
              <div class="service-content">
                <h4 class="service-title">Compliance Documentation</h4>
                <p class="service-text">
                  Complete security questionnaires, audit reports, and compliance mappings
                </p>
              </div>
            </div>
            <div class="service-item">
              <IconUsers :size="24" />
              <div class="service-content">
                <h4 class="service-title">Dedicated Support</h4>
                <p class="service-text">
                  Direct access to compliance experts for institutional requirements
                </p>
              </div>
            </div>
            <div class="service-item">
              <IconGavel :size="24" />
              <div class="service-content">
                <h4 class="service-title">Legal Framework Mapping</h4>
                <p class="service-text">
                  Clear mapping of platform features to specific regulatory requirements
                </p>
              </div>
            </div>
          </div>
          <div class="support-cta">
            <a href="/contact?type=compliance" class="btn btn-primary">
              <IconMail :size="16" />
              Contact Compliance Team
            </a>
            <a href="/compliance/documentation" class="btn btn-secondary">
              <IconDownload :size="16" />
              Download Compliance Pack
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconCertificate,
    IconShield,
    IconActivity,
    IconLock,
    IconUserCheck,
    IconCheckCircle,
    IconGlobe,
    IconEye,
    IconEdit,
    IconTrash,
    IconDownload,
    IconMapPin,
    IconSchool,
    IconUserShield,
    IconKey,
    IconClipboardList,
    IconAward,
    IconTarget,
    IconRefresh,
    IconUsers,
    IconFileText,
    IconGavel,
    IconMail,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Compliance Section */
  .compliance-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .compliance-content-wrapper {
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

  /* Compliance Grid */
  .compliance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .compliance-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 500px;
  }

  .compliance-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .card-header {
    margin-bottom: var(--space-lg);
  }

  .compliance-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border-radius: 20px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: var(--space-md);
  }

  .soc2-badge {
    background: var(--primary-100);
    color: var(--primary-700);
    border: 1px solid var(--primary-200);
  }

  .gdpr-badge {
    background: var(--success-100);
    color: var(--success-700);
    border: 1px solid var(--success-200);
  }

  .ferpa-badge {
    background: var(--warning-100);
    color: var(--warning-700);
    border: 1px solid var(--warning-200);
  }

  .iso-badge {
    background: var(--gray-100);
    color: var(--gray-700);
    border: 1px solid var(--gray-300);
  }

  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    line-height: 1.3;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  /* SOC2 Details */
  .compliance-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    margin-top: auto;
  }

  .detail-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .criteria-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .criteria-item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background: var(--primary-50);
    border: 1px solid var(--primary-200);
    border-radius: 12px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--primary-700);
  }

  .criteria-item svg {
    color: var(--primary-600);
  }

  .audit-info {
    background: var(--gray-50);
    padding: var(--space-md);
    border-radius: 8px;
  }

  .audit-detail {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    color: var(--gray-700);
    margin-bottom: var(--space-xs);
  }

  .audit-detail:last-child {
    margin-bottom: 0;
  }

  /* GDPR Rights */
  .gdpr-rights {
    margin-bottom: var(--space-lg);
  }

  .rights-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .rights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-sm);
  }

  .right-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    background: var(--success-50);
    border-radius: 6px;
  }

  .right-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  .right-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .right-content strong {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-900);
  }

  .right-content span {
    font-family: "Source Sans 3", sans-serif;
    font-size: 10px;
    color: var(--gray-600);
  }

  .data-residency {
    margin-top: auto;
  }

  .residency-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .residency-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .residency-option {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-700);
  }

  .residency-option svg {
    color: var(--success-500);
  }

  /* FERPA Protections */
  .ferpa-protections {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-top: auto;
  }

  .protection-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--warning-50);
    border-radius: 8px;
  }

  .protection-item svg {
    color: var(--warning-600);
    flex-shrink: 0;
  }

  .protection-content {
    flex: 1;
  }

  .protection-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .protection-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  /* ISO Framework */
  .iso-framework {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-top: auto;
  }

  .framework-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--gray-50);
    border-radius: 8px;
  }

  .framework-icon {
    width: 32px;
    height: 32px;
    background: var(--gray-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-600);
    flex-shrink: 0;
  }

  .framework-content {
    flex: 1;
  }

  .framework-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .framework-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  /* Regional Compliance */
  .regional-compliance {
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .regional-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .regional-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .regional-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .regional-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
  }

  .regional-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    text-align: left;
  }

  .regional-flag {
    font-size: 32px;
    flex-shrink: 0;
  }

  .regional-info {
    flex: 1;
  }

  .regional-name {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .regional-standards {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .regional-standards span {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-700);
    padding: var(--space-xs) var(--space-sm);
    background: var(--gray-50);
    border-radius: 4px;
  }

  /* Compliance Support */
  .compliance-support {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .support-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .support-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .support-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .support-services {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .service-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    text-align: left;
  }

  .service-item svg {
    color: var(--primary-500);
    flex-shrink: 0;
  }

  .service-content {
    flex: 1;
  }

  .service-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .service-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  .support-cta {
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
    .compliance-section {
      padding: var(--space-3xl) 0;
    }

    .compliance-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .compliance-card {
      padding: var(--space-xl);
      min-height: auto;
    }

    .rights-grid {
      grid-template-columns: 1fr;
    }

    .regional-compliance {
      padding: var(--space-xl);
    }

    .regional-grid {
      grid-template-columns: 1fr;
    }

    .regional-item {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }

    .compliance-support {
      padding: var(--space-xl);
    }

    .support-services {
      grid-template-columns: 1fr;
    }

    .service-item {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }

    .support-cta {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 250px;
    }
  }

  @media (max-width: 480px) {
    .compliance-card {
      padding: var(--space-lg);
    }

    .criteria-list {
      grid-template-columns: 1fr;
    }

    .residency-options {
      flex-direction: column;
      align-items: center;
    }

    .regional-flag {
      font-size: 24px;
    }

    .regional-compliance {
      padding: var(--space-lg);
    }

    .compliance-support {
      padding: var(--space-lg);
    }

    .support-title {
      font-size: 24px;
    }

    .regional-title {
      font-size: 24px;
    }
  }
</style>
