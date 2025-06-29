<template>
  <section class="data-protection-section" aria-labelledby="data-protection-heading">
    <div class="data-protection-content-wrapper">
      <div class="section-header">
        <h2 id="data-protection-heading" class="section-title">Data Protection & Encryption</h2>
        <p class="section-subtitle">
          Military-grade encryption and zero-knowledge architecture ensure your research remains
          confidential, secure, and accessible only to authorized users.
        </p>
      </div>

      <div class="protection-grid">
        <div class="protection-card encryption">
          <div class="card-header">
            <div class="card-icon">
              <IconLock :size="32" />
            </div>
            <h3 class="card-title">End-to-End Encryption</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Your manuscripts are encrypted with AES-256 before they ever leave your device. Even
              we cannot read your research without your explicit permission.
            </p>
            <div class="encryption-flow">
              <div class="flow-step">
                <div class="step-icon">
                  <IconDevices :size="20" />
                </div>
                <div class="step-content">
                  <h4 class="step-title">Your Device</h4>
                  <p class="step-text">Data encrypted locally</p>
                </div>
              </div>
              <div class="flow-arrow">
                <IconArrowRight :size="16" />
              </div>
              <div class="flow-step">
                <div class="step-icon">
                  <IconCloud :size="20" />
                </div>
                <div class="step-content">
                  <h4 class="step-title">In Transit</h4>
                  <p class="step-text">TLS 1.3 protection</p>
                </div>
              </div>
              <div class="flow-arrow">
                <IconArrowRight :size="16" />
              </div>
              <div class="flow-step">
                <div class="step-icon">
                  <IconServer :size="20" />
                </div>
                <div class="step-content">
                  <h4 class="step-title">At Rest</h4>
                  <p class="step-text">AES-256 storage</p>
                </div>
              </div>
            </div>
            <div class="encryption-details">
              <div class="detail-item">
                <IconKey :size="16" />
                <span>256-bit AES encryption</span>
              </div>
              <div class="detail-item">
                <IconShield :size="16" />
                <span>Perfect Forward Secrecy</span>
              </div>
              <div class="detail-item">
                <IconFingerprint :size="16" />
                <span>Hardware security modules</span>
              </div>
            </div>
          </div>
        </div>

        <div class="protection-card access">
          <div class="card-header">
            <div class="card-icon">
              <IconUserCheck :size="32" />
            </div>
            <h3 class="card-title">Access Control</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Granular permissions ensure only authorized collaborators can access your research,
              with complete audit trails of all actions.
            </p>
            <div class="access-levels">
              <div class="access-level">
                <div class="level-badge owner">Owner</div>
                <div class="level-permissions">
                  <div class="permission">Full manuscript control</div>
                  <div class="permission">Manage collaborators</div>
                  <div class="permission">Export & deletion rights</div>
                </div>
              </div>
              <div class="access-level">
                <div class="level-badge editor">Editor</div>
                <div class="level-permissions">
                  <div class="permission">Read & write access</div>
                  <div class="permission">Comment & suggest</div>
                  <div class="permission">View change history</div>
                </div>
              </div>
              <div class="access-level">
                <div class="level-badge reviewer">Reviewer</div>
                <div class="level-permissions">
                  <div class="permission">Read-only access</div>
                  <div class="permission">Add review comments</div>
                  <div class="permission">Anonymous option</div>
                </div>
              </div>
            </div>
            <div class="access-features">
              <div class="feature">
                <IconClock :size="16" />
                <span>Time-limited access</span>
              </div>
              <div class="feature">
                <IconUserX :size="16" />
                <span>Instant revocation</span>
              </div>
              <div class="feature">
                <IconClipboard :size="16" />
                <span>Complete audit logs</span>
              </div>
            </div>
          </div>
        </div>

        <div class="protection-card backup">
          <div class="card-header">
            <div class="card-icon">
              <IconArchive :size="32" />
            </div>
            <h3 class="card-title">Backup & Recovery</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Multiple encrypted backups across geographically distributed data centers ensure your
              research is always recoverable.
            </p>
            <div class="backup-strategy">
              <div class="backup-tier">
                <div class="tier-header">
                  <IconDatabase :size="20" />
                  <h4 class="tier-title">Real-time Replication</h4>
                </div>
                <p class="tier-description">
                  Instantaneous backup to secondary encrypted storage with sub-second recovery time.
                </p>
              </div>
              <div class="backup-tier">
                <div class="tier-header">
                  <IconArchive :size="20" />
                  <h4 class="tier-title">Daily Snapshots</h4>
                </div>
                <p class="tier-description">
                  Automated daily backups retained for 90 days with point-in-time recovery
                  capabilities.
                </p>
              </div>
              <div class="backup-tier">
                <div class="tier-header">
                  <IconGlobe :size="20" />
                  <h4 class="tier-title">Geographic Distribution</h4>
                </div>
                <p class="tier-description">
                  Backups stored across multiple continents to protect against regional disasters.
                </p>
              </div>
            </div>
            <div class="recovery-guarantee">
              <div class="guarantee-item"><strong>RTO:</strong> &lt; 4 hours</div>
              <div class="guarantee-item"><strong>RPO:</strong> &lt; 1 minute</div>
              <div class="guarantee-item"><strong>Retention:</strong> 7 years</div>
            </div>
          </div>
        </div>

        <div class="protection-card privacy">
          <div class="card-header">
            <div class="card-icon">
              <IconEyeOff :size="32" />
            </div>
            <h3 class="card-title">Privacy by Design</h3>
          </div>
          <div class="card-content">
            <p class="card-description">
              Zero-knowledge architecture means we cannot access your research content. Your privacy
              is built into our fundamental architecture.
            </p>
            <div class="privacy-principles">
              <div class="principle">
                <div class="principle-icon">
                  <IconEyeOff :size="20" />
                </div>
                <div class="principle-content">
                  <h4 class="principle-title">Zero-Knowledge</h4>
                  <p class="principle-text">
                    We never have access to your unencrypted research data
                  </p>
                </div>
              </div>
              <div class="principle">
                <div class="principle-icon">
                  <IconTrash :size="20" />
                </div>
                <div class="principle-content">
                  <h4 class="principle-title">Data Minimization</h4>
                  <p class="principle-text">
                    We only collect what's necessary for platform functionality
                  </p>
                </div>
              </div>
              <div class="principle">
                <div class="principle-icon">
                  <IconUserCheck :size="20" />
                </div>
                <div class="principle-content">
                  <h4 class="principle-title">User Control</h4>
                  <p class="principle-text">
                    You maintain complete control over your data and privacy settings
                  </p>
                </div>
              </div>
            </div>
            <div class="privacy-guarantees">
              <div class="guarantee">
                <IconX :size="16" />
                <span>No data mining</span>
              </div>
              <div class="guarantee">
                <IconX :size="16" />
                <span>No AI training without consent</span>
              </div>
              <div class="guarantee">
                <IconX :size="16" />
                <span>No third-party data sharing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="technical-specs">
        <div class="specs-content">
          <h3 class="specs-title">Technical Security Specifications</h3>
          <div class="specs-grid">
            <div class="spec-category">
              <h4 class="category-title">Encryption Standards</h4>
              <div class="spec-items">
                <div class="spec-item">
                  <span class="spec-label">At Rest:</span>
                  <span class="spec-value">AES-256-GCM</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">In Transit:</span>
                  <span class="spec-value">TLS 1.3</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Key Management:</span>
                  <span class="spec-value">AWS KMS / HSM</span>
                </div>
              </div>
            </div>
            <div class="spec-category">
              <h4 class="category-title">Authentication</h4>
              <div class="spec-items">
                <div class="spec-item">
                  <span class="spec-label">MFA:</span>
                  <span class="spec-value">TOTP, WebAuthn, SMS</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">SSO:</span>
                  <span class="spec-value">SAML 2.0, OpenID Connect</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Session:</span>
                  <span class="spec-value">JWT with rotation</span>
                </div>
              </div>
            </div>
            <div class="spec-category">
              <h4 class="category-title">Infrastructure</h4>
              <div class="spec-items">
                <div class="spec-item">
                  <span class="spec-label">Cloud:</span>
                  <span class="spec-value">AWS, Azure, GCP</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Monitoring:</span>
                  <span class="spec-value">24/7 SOC</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Vulnerability:</span>
                  <span class="spec-value">Continuous scanning</span>
                </div>
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
    IconLock,
    IconUserCheck,
    IconEyeOff,
    IconDevices,
    IconArrowRight,
    IconCloud,
    IconServer,
    IconKey,
    IconShield,
    IconFingerprint,
    IconClock,
    IconUserX,
    IconClipboard,
    IconDatabase,
    IconArchive,
    IconGlobe,
    IconTrash,
    IconX,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Data Protection Section */
  .data-protection-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--success-25) 100%);
    padding: var(--space-4xl) 0;
  }

  .data-protection-content-wrapper {
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

  /* Protection Grid */
  .protection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .protection-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 500px;
  }

  .protection-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .protection-card.encryption {
    border-color: var(--success-300);
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
  }

  .card-header {
    text-align: center;
    margin-bottom: var(--space-lg);
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--success-600);
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

  /* Encryption Flow */
  .encryption-flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
    flex-wrap: wrap;
  }

  .flow-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm);
    background: var(--gray-50);
    border-radius: 8px;
    min-width: 80px;
  }

  .step-icon {
    width: 32px;
    height: 32px;
    background: var(--success-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--success-600);
  }

  .step-content {
    text-align: center;
  }

  .step-title {
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .step-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 10px;
    color: var(--gray-600);
    margin: 0;
  }

  .flow-arrow {
    color: var(--gray-400);
    display: flex;
    align-items: center;
  }

  .encryption-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-top: auto;
  }

  .detail-item {
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

  .detail-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Access Levels */
  .access-levels {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .access-level {
    padding: var(--space-md);
    background: var(--gray-50);
    border-radius: 8px;
  }

  .level-badge {
    display: inline-block;
    padding: var(--space-xs) var(--space-sm);
    border-radius: 12px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: var(--space-sm);
  }

  .level-badge.owner {
    background: var(--success-100);
    color: var(--success-700);
  }

  .level-badge.editor {
    background: var(--primary-100);
    color: var(--primary-700);
  }

  .level-badge.reviewer {
    background: var(--warning-100);
    color: var(--warning-700);
  }

  .level-permissions {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .permission {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-700);
    padding-left: var(--space-sm);
    position: relative;
  }

  .permission::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--gray-500);
  }

  .access-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-top: auto;
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
    color: var(--primary-500);
    flex-shrink: 0;
  }

  /* Backup Strategy */
  .backup-strategy {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .backup-tier {
    padding: var(--space-md);
    background: var(--gray-50);
    border-radius: 8px;
  }

  .tier-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
  }

  .tier-header svg {
    color: var(--primary-500);
  }

  .tier-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .tier-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  .recovery-guarantee {
    display: flex;
    justify-content: space-around;
    gap: var(--space-sm);
    margin-top: auto;
  }

  .guarantee-item {
    text-align: center;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-700);
    padding: var(--space-sm);
    background: var(--success-50);
    border-radius: 6px;
    flex: 1;
  }

  .guarantee-item strong {
    color: var(--gray-900);
  }

  /* Privacy Principles */
  .privacy-principles {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .principle {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--gray-50);
    border-radius: 8px;
  }

  .principle-icon {
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

  .principle-content {
    flex: 1;
  }

  .principle-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .principle-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  .privacy-guarantees {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-top: auto;
  }

  .guarantee {
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

  .guarantee svg {
    color: var(--error-500);
    flex-shrink: 0;
  }

  /* Technical Specs */
  .technical-specs {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .specs-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .specs-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-xl);
  }

  .spec-category {
    text-align: center;
  }

  .category-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .spec-items {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .spec-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm);
    background: var(--gray-50);
    border-radius: 6px;
  }

  .spec-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
    font-weight: 600;
  }

  .spec-value {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-900);
    font-weight: 600;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .data-protection-section {
      padding: var(--space-3xl) 0;
    }

    .protection-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .protection-card {
      padding: var(--space-xl);
      min-height: auto;
    }

    .encryption-flow {
      flex-direction: column;
      align-items: center;
    }

    .flow-arrow {
      transform: rotate(90deg);
    }

    .technical-specs {
      padding: var(--space-xl);
    }

    .specs-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }
  }

  @media (max-width: 480px) {
    .protection-card {
      padding: var(--space-lg);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .card-title {
      font-size: 18px;
    }

    .flow-step {
      min-width: 70px;
    }

    .step-icon {
      width: 28px;
      height: 28px;
    }

    .technical-specs {
      padding: var(--space-lg);
    }

    .specs-title {
      font-size: 20px;
    }
  }
</style>
