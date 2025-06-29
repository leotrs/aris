<template>
  <section class="incident-response-section" aria-labelledby="incident-response-heading">
    <div class="incident-response-content-wrapper">
      <div class="section-header">
        <h2 id="incident-response-heading" class="section-title">
          Incident Response & Security Management
        </h2>
        <p class="section-subtitle">
          Comprehensive incident response protocols with expert security teams, automated
          containment, and transparent communication to minimize impact and restore services
          quickly.
        </p>
      </div>

      <div class="response-overview">
        <div class="overview-content">
          <h3 class="overview-title">Our Incident Response Promise</h3>
          <p class="overview-description">
            When security incidents occur, our expert response team follows established protocols to
            contain threats, preserve evidence, and restore services with minimal disruption to your
            research activities.
          </p>
        </div>
      </div>

      <div class="response-phases">
        <h3 class="phases-title">Incident Response Phases</h3>
        <div class="phases-grid">
          <div class="phase-card detection">
            <div class="phase-number">1</div>
            <div class="phase-content">
              <h4 class="phase-title">Detection & Analysis</h4>
              <p class="phase-description">
                Automated monitoring systems and SOC analysts identify potential security incidents
                through real-time threat intelligence and behavioral analysis.
              </p>
              <div class="phase-features">
                <div class="feature">
                  <IconRadar :size="16" />
                  <span>AI-powered anomaly detection</span>
                </div>
                <div class="feature">
                  <IconEye :size="16" />
                  <span>24/7 security analyst monitoring</span>
                </div>
                <div class="feature">
                  <IconBell :size="16" />
                  <span>Automated alert prioritization</span>
                </div>
              </div>
            </div>
          </div>

          <div class="phase-card containment">
            <div class="phase-number">2</div>
            <div class="phase-content">
              <h4 class="phase-title">Containment & Isolation</h4>
              <p class="phase-description">
                Immediate containment actions to prevent incident spread while preserving evidence
                and maintaining service availability for unaffected systems.
              </p>
              <div class="phase-features">
                <div class="feature">
                  <IconLock :size="16" />
                  <span>Automatic system isolation</span>
                </div>
                <div class="feature">
                  <IconDatabase :size="16" />
                  <span>Evidence preservation</span>
                </div>
                <div class="feature">
                  <IconNetwork :size="16" />
                  <span>Network segmentation</span>
                </div>
              </div>
            </div>
          </div>

          <div class="phase-card eradication">
            <div class="phase-number">3</div>
            <div class="phase-content">
              <h4 class="phase-title">Eradication & Recovery</h4>
              <p class="phase-description">
                Complete removal of threats and restoration of affected systems using verified clean
                backups and hardened configurations.
              </p>
              <div class="phase-features">
                <div class="feature">
                  <IconTrash :size="16" />
                  <span>Threat elimination</span>
                </div>
                <div class="feature">
                  <IconRefresh :size="16" />
                  <span>System restoration</span>
                </div>
                <div class="feature">
                  <IconShieldCheck :size="16" />
                  <span>Security validation</span>
                </div>
              </div>
            </div>
          </div>

          <div class="phase-card lessons">
            <div class="phase-number">4</div>
            <div class="phase-content">
              <h4 class="phase-title">Lessons Learned</h4>
              <p class="phase-description">
                Post-incident analysis to improve security posture, update procedures, and share
                insights with the academic security community.
              </p>
              <div class="phase-features">
                <div class="feature">
                  <IconFileText :size="16" />
                  <span>Detailed incident report</span>
                </div>
                <div class="feature">
                  <IconTrendingUp :size="16" />
                  <span>Security improvements</span>
                </div>
                <div class="feature">
                  <IconUsers :size="16" />
                  <span>Community knowledge sharing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="communication-protocol">
        <div class="protocol-content">
          <h3 class="protocol-title">Transparent Communication</h3>
          <p class="protocol-description">
            We believe in transparent, timely communication during security incidents. You'll be
            informed at every step with clear, actionable information.
          </p>
          <div class="communication-timeline">
            <div class="timeline-item">
              <div class="timeline-marker immediate"></div>
              <div class="timeline-content">
                <h4 class="timeline-title">Immediate Notification</h4>
                <p class="timeline-text">
                  Immediate incident alert with basic details and immediate actions taken
                </p>
                <div class="timeline-channels">
                  <span>Email</span>
                  <span>SMS</span>
                  <span>Platform Alert</span>
                </div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker hourly"></div>
              <div class="timeline-content">
                <h4 class="timeline-title">Regular Updates</h4>
                <p class="timeline-text">
                  Every hour: Progress updates, containment status, and estimated resolution time
                </p>
                <div class="timeline-channels">
                  <span>Status Page</span>
                  <span>Email Updates</span>
                </div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker resolution"></div>
              <div class="timeline-content">
                <h4 class="timeline-title">Resolution & Report</h4>
                <p class="timeline-text">
                  Within 72 hours: Detailed incident report with root cause analysis and prevention
                  measures
                </p>
                <div class="timeline-channels">
                  <span>Formal Report</span>
                  <span>Security Brief</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="team-expertise">
        <div class="expertise-content">
          <h3 class="expertise-title">Expert Response Team</h3>
          <p class="expertise-description">
            Our incident response team combines academic research security expertise with
            enterprise-grade incident management capabilities.
          </p>
          <div class="team-grid">
            <div class="team-member">
              <div class="member-icon">
                <IconUserShield :size="32" />
              </div>
              <div class="member-info">
                <h4 class="member-role">Security Operations Lead</h4>
                <p class="member-credentials">CISSP, GCIH, GIAC certifications</p>
                <p class="member-experience">15+ years enterprise security</p>
              </div>
            </div>
            <div class="team-member">
              <div class="member-icon">
                <IconCode :size="32" />
              </div>
              <div class="member-info">
                <h4 class="member-role">Digital Forensics Specialist</h4>
                <p class="member-credentials">GCFA, GNFA, EnCE certifications</p>
                <p class="member-experience">Academic incident expertise</p>
              </div>
            </div>
            <div class="team-member">
              <div class="member-icon">
                <IconGavel :size="32" />
              </div>
              <div class="member-info">
                <h4 class="member-role">Compliance Officer</h4>
                <p class="member-credentials">CISA, Privacy Law expertise</p>
                <p class="member-experience">FERPA/GDPR compliance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="incident-contact">
        <div class="contact-content">
          <h3 class="contact-title">Report a Security Incident</h3>
          <p class="contact-description">
            If you suspect a security incident or vulnerability, contact our security team
            immediately using any of these secure channels.
          </p>
          <div class="contact-methods">
            <div class="contact-method priority">
              <div class="method-icon">
                <IconPhone :size="24" />
              </div>
              <div class="method-info">
                <h4 class="method-title">Emergency Hotline</h4>
                <p class="method-detail">+1 (510) 555-0199</p>
                <span class="method-note">Available 24/7 for critical incidents</span>
              </div>
            </div>
            <div class="contact-method">
              <div class="method-icon">
                <IconMail :size="24" />
              </div>
              <div class="method-info">
                <h4 class="method-title">Secure Email</h4>
                <p class="method-detail">security@aris-platform.org</p>
                <span class="method-note">PGP encrypted communication available</span>
              </div>
            </div>
            <div class="contact-method">
              <div class="method-icon">
                <IconBugOff :size="24" />
              </div>
              <div class="method-info">
                <h4 class="method-title">Security Portal</h4>
                <p class="method-detail">security.aris-platform.org</p>
                <span class="method-note">Secure incident reporting interface</span>
              </div>
            </div>
          </div>
          <div class="contact-cta">
            <a href="/security/report" class="btn btn-primary">
              <IconAlertTriangle :size="16" />
              Report Incident
            </a>
            <a href="/security/contacts" class="btn btn-secondary">
              <IconBook :size="16" />
              Security Contacts
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconClock,
    IconShield,
    IconUsers,
    IconRadar,
    IconEye,
    IconBell,
    IconLock,
    IconDatabase,
    IconNetwork,
    IconTrash,
    IconRefresh,
    IconShieldCheck,
    IconFileText,
    IconTrendingUp,
    IconUserShield,
    IconCode,
    IconGavel,
    IconPhone,
    IconMail,
    IconBugOff,
    IconAlertTriangle,
    IconBook,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Incident Response Section */
  .incident-response-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--error-25) 100%);
    padding: var(--space-4xl) 0;
  }

  .incident-response-content-wrapper {
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

  /* Response Overview */
  .response-overview {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .overview-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .overview-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .overview-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Response Phases */
  .response-phases {
    margin-bottom: var(--space-4xl);
  }

  .phases-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .phases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xl);
  }

  .phase-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    position: relative;
    transition: all 0.3s ease;
  }

  .phase-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .phase-number {
    position: absolute;
    top: -12px;
    left: var(--space-lg);
    width: 32px;
    height: 32px;
    background: var(--error-500);
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 700;
    box-shadow: var(--shadow-soft);
  }

  .phase-content {
    padding-top: var(--space-md);
  }

  .phase-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .phase-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  .phase-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .feature {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    padding: var(--space-sm);
    background: var(--gray-50);
    border-radius: 6px;
  }

  .feature svg {
    color: var(--error-600);
    flex-shrink: 0;
  }

  /* Communication Protocol */
  .communication-protocol {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .protocol-content {
    max-width: 1000px;
    margin: 0 auto;
  }

  .protocol-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-md);
  }

  .protocol-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    text-align: center;
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .communication-timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .timeline-item {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    padding: var(--space-lg);
    background: var(--gray-50);
    border-radius: 12px;
  }

  .timeline-marker {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }

  .timeline-marker.immediate {
    background: var(--error-500);
  }

  .timeline-marker.hourly {
    background: var(--warning-500);
  }

  .timeline-marker.resolution {
    background: var(--success-500);
  }

  .timeline-content {
    flex: 1;
  }

  .timeline-title {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .timeline-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-md);
  }

  .timeline-channels {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .timeline-channels span {
    padding: var(--space-xs) var(--space-sm);
    background: var(--primary-50);
    color: var(--primary-700);
    border: 1px solid var(--primary-200);
    border-radius: 12px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
  }

  /* Team Expertise */
  .team-expertise {
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .expertise-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .expertise-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .expertise-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
  }

  .team-member {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    text-align: left;
  }

  .member-icon {
    width: 64px;
    height: 64px;
    background: var(--primary-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .member-info {
    flex: 1;
  }

  .member-role {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .member-credentials,
  .member-experience {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    margin-bottom: var(--space-xs);
  }

  .member-experience {
    margin-bottom: 0;
  }

  /* Incident Contact */
  .incident-contact {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .contact-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .contact-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .contact-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .contact-methods {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .contact-method {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--gray-50);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    text-align: left;
  }

  .contact-method.priority {
    border-color: var(--error-300);
    background: linear-gradient(135deg, var(--error-25), var(--error-50));
  }

  .method-icon {
    width: 48px;
    height: 48px;
    background: var(--error-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--error-600);
    flex-shrink: 0;
  }

  .method-info {
    flex: 1;
  }

  .method-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .method-detail {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--error-700);
    margin-bottom: var(--space-xs);
  }

  .method-note {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
  }

  .contact-cta {
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
    background: var(--error-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--error-600);
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: var(--white);
    color: var(--error-600);
    border: 1px solid var(--error-300);
  }

  .btn-secondary:hover {
    background: var(--error-50);
    transform: translateY(-2px);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .incident-response-section {
      padding: var(--space-3xl) 0;
    }

    .response-overview,
    .communication-protocol,
    .team-expertise,
    .incident-contact {
      padding: var(--space-xl);
    }

    .phases-grid {
      grid-template-columns: 1fr;
    }

    .timeline-item {
      flex-direction: column;
      text-align: center;
      gap: var(--space-md);
    }

    .team-grid {
      grid-template-columns: 1fr;
    }

    .team-member {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }

    .contact-methods {
      grid-template-columns: 1fr;
    }

    .contact-cta {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 250px;
    }
  }

  @media (max-width: 480px) {
    .response-overview,
    .communication-protocol,
    .team-expertise,
    .incident-contact {
      padding: var(--space-lg);
    }

    .overview-title,
    .protocol-title,
    .expertise-title,
    .contact-title {
      font-size: 24px;
    }

    .phases-title {
      font-size: 24px;
    }

    .phase-card {
      padding: var(--space-lg);
    }

    .member-icon,
    .method-icon {
      width: 48px;
      height: 48px;
    }
  }
</style>
