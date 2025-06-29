<template>
  <section
    class="infrastructure-security-section"
    aria-labelledby="infrastructure-security-heading"
  >
    <div class="infrastructure-security-content-wrapper">
      <div class="section-header">
        <h2 id="infrastructure-security-heading" class="section-title">Infrastructure Security</h2>
        <p class="section-subtitle">
          Military-grade infrastructure protection with hardened systems, continuous monitoring, and
          automated threat detection to safeguard your research platform.
        </p>
      </div>

      <div class="infrastructure-grid">
        <div class="infrastructure-card network">
          <div class="card-header">
            <div class="card-icon">
              <IconNetwork :size="32" />
            </div>
            <h3 class="card-title">Network Security</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Multi-layered network protection with advanced firewalls, intrusion detection, and
              DDoS mitigation to ensure continuous availability.
            </p>
            <div class="network-features">
              <div class="network-layer">
                <div class="layer-icon">
                  <IconShield :size="20" />
                </div>
                <div class="layer-content">
                  <h4 class="layer-title">Web Application Firewall</h4>
                  <p class="layer-text">OWASP Top 10 protection with real-time threat blocking</p>
                </div>
              </div>
              <div class="network-layer">
                <div class="layer-icon">
                  <IconRadar :size="20" />
                </div>
                <div class="layer-content">
                  <h4 class="layer-title">Intrusion Detection</h4>
                  <p class="layer-text">AI-powered anomaly detection with instant alerting</p>
                </div>
              </div>
              <div class="network-layer">
                <div class="layer-icon">
                  <IconCloudRain :size="20" />
                </div>
                <div class="layer-content">
                  <h4 class="layer-title">DDoS Protection</h4>
                  <p class="layer-text">Global scrubbing centers with 10+ Tbps capacity</p>
                </div>
              </div>
            </div>
            <div class="network-stats">
              <div class="stat">
                <strong>99.99%</strong>
                <span>Network uptime</span>
              </div>
              <div class="stat">
                <strong>&lt; 5ms</strong>
                <span>Response time</span>
              </div>
            </div>
          </div>
        </div>

        <div class="infrastructure-card monitoring">
          <div class="card-header">
            <div class="card-icon">
              <IconActivity :size="32" />
            </div>
            <h3 class="card-title">24/7 Monitoring</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Continuous surveillance by our Security Operations Center with automated response
              systems and expert security analysts.
            </p>
            <div class="monitoring-capabilities">
              <div class="capability">
                <IconEye :size="16" />
                <span>Real-time log analysis</span>
              </div>
              <div class="capability">
                <IconBell :size="16" />
                <span>Automated threat alerting</span>
              </div>
              <div class="capability">
                <IconUsers :size="16" />
                <span>Expert incident response team</span>
              </div>
              <div class="capability">
                <IconTrendingUp :size="16" />
                <span>Performance monitoring</span>
              </div>
              <div class="capability">
                <IconDatabase :size="16" />
                <span>Data integrity verification</span>
              </div>
              <div class="capability">
                <IconClock :size="16" />
                <span>Historical trend analysis</span>
              </div>
            </div>
            <div class="soc-metrics">
              <div class="metric">
                <div class="metric-value">15sec</div>
                <div class="metric-label">Mean time to detection</div>
              </div>
              <div class="metric">
                <div class="metric-value">2min</div>
                <div class="metric-label">Mean time to response</div>
              </div>
            </div>
          </div>
        </div>

        <div class="infrastructure-card servers">
          <div class="card-header">
            <div class="card-icon">
              <IconServer :size="32" />
            </div>
            <h3 class="card-title">Hardened Infrastructure</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Enterprise-grade server hardening with minimal attack surface, regular patching, and
              security configuration management.
            </p>
            <div class="hardening-measures">
              <div class="measure-category">
                <h4 class="category-title">Operating System Security</h4>
                <div class="measures">
                  <div class="measure">
                    <IconLock :size="14" />
                    <span>Minimal OS installations</span>
                  </div>
                  <div class="measure">
                    <IconRefresh :size="14" />
                    <span>Automated security patching</span>
                  </div>
                  <div class="measure">
                    <IconKey :size="14" />
                    <span>SSH key-only access</span>
                  </div>
                </div>
              </div>
              <div class="measure-category">
                <h4 class="category-title">Application Security</h4>
                <div class="measures">
                  <div class="measure">
                    <IconContainer :size="14" />
                    <span>Containerized applications</span>
                  </div>
                  <div class="measure">
                    <IconScan :size="14" />
                    <span>Vulnerability scanning</span>
                  </div>
                  <div class="measure">
                    <IconShieldCheck :size="14" />
                    <span>Code signing verification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="infrastructure-card backup">
          <div class="card-header">
            <div class="card-icon">
              <IconCloudDownload :size="32" />
            </div>
            <h3 class="card-title">Disaster Recovery</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Comprehensive disaster recovery with automated failover, geographic redundancy, and
              rapid recovery capabilities.
            </p>
            <div class="recovery-tiers">
              <div class="tier hot">
                <div class="tier-status"></div>
                <div class="tier-info">
                  <h4 class="tier-title">Hot Standby</h4>
                  <p class="tier-description">Real-time data replication to secondary region</p>
                  <div class="tier-metric">RTO: &lt; 5 minutes</div>
                </div>
              </div>
              <div class="tier warm">
                <div class="tier-status"></div>
                <div class="tier-info">
                  <h4 class="tier-title">Warm Backup</h4>
                  <p class="tier-description">Regular snapshots with rapid provisioning</p>
                  <div class="tier-metric">RTO: &lt; 30 minutes</div>
                </div>
              </div>
              <div class="tier cold">
                <div class="tier-status"></div>
                <div class="tier-info">
                  <h4 class="tier-title">Cold Storage</h4>
                  <p class="tier-description">Long-term archival for compliance requirements</p>
                  <div class="tier-metric">Retention: 7 years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="infrastructure-certifications">
        <div class="certifications-content">
          <h3 class="certifications-title">Infrastructure Certifications & Standards</h3>
          <p class="certifications-description">
            Our infrastructure meets the highest industry standards for security, reliability, and
            performance.
          </p>
          <div class="certifications-grid">
            <div class="certification-item">
              <div class="cert-icon">
                <IconCertificate :size="24" />
              </div>
              <div class="cert-info">
                <h4 class="cert-name">SOC 2 Type II</h4>
                <p class="cert-description">Annual third-party audits of security controls</p>
              </div>
            </div>
            <div class="certification-item">
              <div class="cert-icon">
                <IconAward :size="24" />
              </div>
              <div class="cert-info">
                <h4 class="cert-name">ISO 27001</h4>
                <p class="cert-description">Information security management certification</p>
              </div>
            </div>
            <div class="certification-item">
              <div class="cert-icon">
                <IconShield :size="24" />
              </div>
              <div class="cert-info">
                <h4 class="cert-name">PCI DSS Level 1</h4>
                <p class="cert-description">Payment card industry security standards</p>
              </div>
            </div>
            <div class="certification-item">
              <div class="cert-icon">
                <IconCloud :size="24" />
              </div>
              <div class="cert-info">
                <h4 class="cert-name">Cloud Security Alliance</h4>
                <p class="cert-description">Cloud controls matrix compliance</p>
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
    IconNetwork,
    IconShield,
    IconRadar,
    IconCloudRain,
    IconActivity,
    IconEye,
    IconBell,
    IconUsers,
    IconTrendingUp,
    IconDatabase,
    IconClock,
    IconServer,
    IconLock,
    IconRefresh,
    IconKey,
    IconContainer,
    IconScan,
    IconShieldCheck,
    IconCloudDownload,
    IconCertificate,
    IconAward,
    IconCloud,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Infrastructure Security Section */
  .infrastructure-security-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .infrastructure-security-content-wrapper {
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

  /* Infrastructure Grid */
  .infrastructure-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .infrastructure-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 500px;
  }

  .infrastructure-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .card-header {
    text-align: center;
    margin-bottom: var(--space-lg);
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
    text-align: center;
  }

  /* Network Features */
  .network-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .network-layer {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--surface-page);
    border-radius: 8px;
  }

  .layer-icon {
    width: 32px;
    height: 32px;
    background: var(--primary-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .layer-content {
    flex: 1;
  }

  .layer-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .layer-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  .network-stats {
    display: flex;
    justify-content: space-around;
    gap: var(--space-md);
    margin-top: auto;
  }

  .stat {
    text-align: center;
    padding: var(--space-sm);
    background: var(--primary-50);
    border-radius: 6px;
    flex: 1;
  }

  .stat strong {
    display: block;
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: var(--space-xs);
  }

  .stat span {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--gray-600);
  }

  /* Monitoring Capabilities */
  .monitoring-capabilities {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .capability {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-700);
    padding: var(--space-sm);
    background: var(--surface-page);
    border-radius: 6px;
  }

  .capability svg {
    color: var(--primary-500);
    flex-shrink: 0;
  }

  .soc-metrics {
    display: flex;
    justify-content: space-around;
    gap: var(--space-md);
    margin-top: auto;
  }

  .metric {
    text-align: center;
    padding: var(--space-md);
    background: var(--surface-page);
    border-radius: 8px;
    flex: 1;
  }

  .metric-value {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: var(--space-xs);
  }

  .metric-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Hardening Measures */
  .hardening-measures {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    margin-top: auto;
  }

  .measure-category {
    background: var(--surface-page);
    border-radius: 8px;
    padding: var(--space-md);
  }

  .category-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .measures {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .measure {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-700);
  }

  .measure svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Recovery Tiers */
  .recovery-tiers {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-top: auto;
  }

  .tier {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--surface-page);
    border-radius: 8px;
  }

  .tier-status {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .tier.hot .tier-status {
    background: var(--success-500);
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
  }

  .tier.warm .tier-status {
    background: var(--warning-500);
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
  }

  .tier.cold .tier-status {
    background: var(--primary-500);
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
  }

  .tier-info {
    flex: 1;
  }

  .tier-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .tier-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0 0 var(--space-xs) 0;
  }

  .tier-metric {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--gray-600);
  }

  /* Infrastructure Certifications */
  .infrastructure-certifications {
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .certifications-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .certifications-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .certifications-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .certifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
  }

  .certification-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    text-align: left;
  }

  .cert-icon {
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

  .cert-info {
    flex: 1;
  }

  .cert-name {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .cert-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .infrastructure-security-section {
      padding: var(--space-3xl) 0;
    }

    .infrastructure-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .infrastructure-card {
      padding: var(--space-xl);
      min-height: auto;
    }

    .monitoring-capabilities {
      grid-template-columns: 1fr;
    }

    .infrastructure-certifications {
      padding: var(--space-xl);
    }

    .certifications-grid {
      grid-template-columns: 1fr;
    }

    .certification-item {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }
  }

  @media (max-width: 480px) {
    .infrastructure-card {
      padding: var(--space-lg);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .infrastructure-certifications {
      padding: var(--space-lg);
    }

    .certifications-title {
      font-size: 24px;
    }
  }
</style>
