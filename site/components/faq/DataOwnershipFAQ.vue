<template>
  <section
    id="data-ownership"
    class="data-ownership-faq-section"
    aria-labelledby="data-ownership-heading"
  >
    <div class="faq-content-wrapper">
      <div class="section-header">
        <div class="section-icon">
          <IconShield :size="32" />
        </div>
        <h2 id="data-ownership-heading" class="section-title">Data Ownership & Security</h2>
        <p class="section-subtitle">
          Your research, your data, your intellectual property. Complete transparency about what we
          do and don't do with your work.
        </p>
      </div>

      <div class="faq-grid">
        <div class="faq-item featured">
          <div class="faq-question" @click="toggleFAQ('data-export')">
            <h3 class="question-text">Can I export my data if you shut down?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('data-export') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('data-export')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Absolutely.</strong> This is a fundamental right we guarantee. Your data
                  export capabilities include:
                </p>
                <div class="guarantee-box">
                  <h4 class="guarantee-title">Data Export Guarantee</h4>
                  <div class="guarantee-items">
                    <div class="guarantee-item">
                      <IconCheck :size="16" />
                      <span>Complete manuscript export in RSM, LaTeX, and PDF formats</span>
                    </div>
                    <div class="guarantee-item">
                      <IconCheck :size="16" />
                      <span>All citations, references, and metadata preserved</span>
                    </div>
                    <div class="guarantee-item">
                      <IconCheck :size="16" />
                      <span>Review history and collaboration data included</span>
                    </div>
                    <div class="guarantee-item">
                      <IconCheck :size="16" />
                      <span>Available 24/7 with one-click export</span>
                    </div>
                    <div class="guarantee-item">
                      <IconCheck :size="16" />
                      <span>90-day advance notice if service changes</span>
                    </div>
                  </div>
                </div>
                <p class="answer-text">
                  Additionally, our open-source nature means you can always self-host the platform
                  with your exported data. We have no intention of shutting down, but your academic
                  freedom isn't dependent on our existence.
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('ip-ownership')">
            <h3 class="question-text">Who owns the IP of my manuscripts?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('ip-ownership') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('ip-ownership')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>You do.</strong> Period. Aris has zero claims to your intellectual
                  property. Here's what this means legally:
                </p>
                <div class="legal-clarity">
                  <div class="legal-item">
                    <div class="legal-icon">
                      <IconUser :size="20" />
                    </div>
                    <div class="legal-content">
                      <h4 class="legal-title">Your Rights</h4>
                      <p class="legal-text">
                        Full ownership of all research, manuscripts, data, and derivative works.
                        Aris is merely a tool—like Microsoft Word or LaTeX.
                      </p>
                    </div>
                  </div>
                  <div class="legal-item">
                    <div class="legal-icon">
                      <IconX :size="20" />
                    </div>
                    <div class="legal-content">
                      <h4 class="legal-title">What We DON'T Do</h4>
                      <p class="legal-text">
                        No licensing of your content. No rights to publish, distribute, or
                        commercialize. No AI training on your manuscripts without explicit consent.
                      </p>
                    </div>
                  </div>
                  <div class="legal-item">
                    <div class="legal-icon">
                      <IconShield :size="20" />
                    </div>
                    <div class="legal-content">
                      <h4 class="legal-title">Legal Protection</h4>
                      <p class="legal-text">
                        Our terms of service explicitly state our non-claim to your IP. This is
                        legally binding and audited by academic institutions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('data-location')">
            <h3 class="question-text">Where is my data stored and who has access?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('data-location') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('data-location')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">Complete transparency about data handling and storage:</p>
                <div class="data-info-grid">
                  <div class="data-info-card">
                    <IconServer :size="24" />
                    <h4 class="data-info-title">Storage Location</h4>
                    <p class="data-info-text">
                      Primary: AWS US-East (encrypted at rest). EU/UK options available for GDPR
                      compliance.
                    </p>
                  </div>
                  <div class="data-info-card">
                    <IconLock :size="24" />
                    <h4 class="data-info-title">Encryption</h4>
                    <p class="data-info-text">
                      AES-256 at rest, TLS 1.3 in transit. Keys managed separately from data.
                    </p>
                  </div>
                  <div class="data-info-card">
                    <IconEye :size="24" />
                    <h4 class="data-info-title">Access Control</h4>
                    <p class="data-info-text">
                      Zero-trust architecture. Only you and authorized collaborators can access your
                      manuscripts.
                    </p>
                  </div>
                  <div class="data-info-card">
                    <IconTrash :size="24" />
                    <h4 class="data-info-title">Data Deletion</h4>
                    <p class="data-info-text">
                      Immediate deletion on request. 30-day retention for accidental deletions, then
                      permanent removal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('privacy-policy')">
            <h3 class="question-text">What does your privacy policy actually say?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('privacy-policy') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('privacy-policy')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">Plain English summary of our privacy commitments:</p>
                <div class="privacy-summary">
                  <div class="privacy-section">
                    <h4 class="privacy-title">
                      <IconCheck :size="16" />
                      What We Collect
                    </h4>
                    <ul class="privacy-list">
                      <li>Account information (name, email, institution)</li>
                      <li>Manuscript content you create or upload</li>
                      <li>Usage analytics for platform improvement</li>
                      <li>Technical logs for security and debugging</li>
                    </ul>
                  </div>
                  <div class="privacy-section">
                    <h4 class="privacy-title">
                      <IconX :size="16" />
                      What We DON'T Do
                    </h4>
                    <ul class="privacy-list">
                      <li>Sell your data to third parties</li>
                      <li>Use your manuscripts for AI training without consent</li>
                      <li>Share content with advertisers or marketers</li>
                      <li>Track you across other websites</li>
                    </ul>
                  </div>
                </div>
                <div class="privacy-cta">
                  <a href="/privacy" class="privacy-link">
                    <IconFileText :size="16" />
                    Read Full Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('compliance')">
            <h3 class="question-text">What about GDPR and institutional compliance?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('compliance') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('compliance')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  Built from the ground up for institutional compliance requirements:
                </p>
                <div class="compliance-badges">
                  <div class="compliance-badge">
                    <IconShield :size="20" />
                    <span>GDPR Compliant</span>
                  </div>
                  <div class="compliance-badge">
                    <IconCheck :size="20" />
                    <span>SOC 2 Type II</span>
                  </div>
                  <div class="compliance-badge">
                    <IconLock :size="20" />
                    <span>ISO 27001</span>
                  </div>
                  <div class="compliance-badge">
                    <IconGlobe :size="20" />
                    <span>FERPA Ready</span>
                  </div>
                </div>
                <div class="compliance-details">
                  <h4 class="compliance-title">Key Compliance Features:</h4>
                  <div class="compliance-grid">
                    <div class="compliance-item">
                      <strong>Data Residency:</strong> Choose EU, US, or other regions based on
                      institutional requirements
                    </div>
                    <div class="compliance-item">
                      <strong>Access Controls:</strong> SSO integration with institutional identity
                      providers
                    </div>
                    <div class="compliance-item">
                      <strong>Audit Trails:</strong> Complete logs of all data access and
                      modifications
                    </div>
                    <div class="compliance-item">
                      <strong>Right to Deletion:</strong> Immediate, verifiable data removal on
                      request
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref } from "vue";
  import {
    IconShield,
    IconChevronDown,
    IconCheck,
    IconUser,
    IconX,
    IconServer,
    IconLock,
    IconEye,
    IconTrash,
    IconFileText,
    IconGlobe,
  } from "@tabler/icons-vue";

  const activeFAQs = ref([]);

  const toggleFAQ = (faqId) => {
    const index = activeFAQs.value.indexOf(faqId);
    if (index > -1) {
      activeFAQs.value.splice(index, 1);
    } else {
      activeFAQs.value.push(faqId);
    }
  };
</script>

<style scoped>
  /* Data Ownership FAQ Section */
  .data-ownership-faq-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .faq-content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
  }

  .section-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--success-600);
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

  /* FAQ Grid */
  .faq-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    margin-bottom: var(--space-4xl);
  }

  .faq-item {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .faq-item:hover {
    box-shadow: var(--shadow-soft);
  }

  .faq-item.featured {
    border: 2px solid var(--success-300);
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
  }

  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xl);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .faq-question:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .question-text {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-900);
    margin: 0;
    flex: 1;
    padding-right: var(--space-md);
  }

  .question-toggle {
    width: 32px;
    height: 32px;
    background: var(--gray-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    color: var(--gray-600);
  }

  .question-toggle.active {
    background: var(--primary-500);
    color: var(--white);
    transform: rotate(180deg);
  }

  /* FAQ Answer Transitions */
  .faq-answer-enter-active,
  .faq-answer-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .faq-answer-enter-from,
  .faq-answer-leave-to {
    max-height: 0;
    opacity: 0;
  }

  .faq-answer-enter-to,
  .faq-answer-leave-from {
    max-height: 1000px;
    opacity: 1;
  }

  .faq-answer {
    border-top: 1px solid var(--border-primary);
  }

  .answer-content {
    padding: var(--space-xl);
  }

  .answer-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  .answer-text:last-child {
    margin-bottom: 0;
  }

  /* Guarantee Box */
  .guarantee-box {
    background: var(--success-50);
    border: 1px solid var(--success-200);
    border-radius: 8px;
    padding: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .guarantee-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--success-800);
    margin-bottom: var(--space-md);
  }

  .guarantee-items {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .guarantee-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .guarantee-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Legal Clarity */
  .legal-clarity {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .legal-item {
    display: flex;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--gray-50);
    border-radius: 8px;
  }

  .legal-icon {
    width: 40px;
    height: 40px;
    background: var(--primary-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .legal-content {
    flex: 1;
  }

  .legal-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .legal-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  /* Data Info Grid */
  .data-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
    margin: var(--space-lg) 0;
  }

  .data-info-card {
    text-align: center;
    padding: var(--space-md);
    background: var(--gray-50);
    border-radius: 8px;
  }

  .data-info-card svg {
    color: var(--primary-500);
    margin-bottom: var(--space-sm);
  }

  .data-info-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .data-info-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  /* Privacy Summary */
  .privacy-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .privacy-section {
    background: var(--gray-50);
    padding: var(--space-md);
    border-radius: 8px;
  }

  .privacy-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .privacy-title svg {
    color: var(--success-600);
  }

  .privacy-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .privacy-list li {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    line-height: 1.4;
    color: var(--gray-700);
    margin-bottom: var(--space-xs);
    padding-left: var(--space-sm);
    position: relative;
  }

  .privacy-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--gray-500);
  }

  .privacy-cta {
    text-align: center;
    margin-top: var(--space-lg);
  }

  .privacy-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-lg);
    background: var(--primary-500);
    color: var(--white);
    text-decoration: none;
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .privacy-link:hover {
    background: var(--primary-600);
    transform: translateY(-1px);
  }

  /* Compliance */
  .compliance-badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin: var(--space-lg) 0;
    justify-content: center;
  }

  .compliance-badge {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    background: var(--success-50);
    border: 1px solid var(--success-200);
    border-radius: 20px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--success-700);
  }

  .compliance-badge svg {
    color: var(--success-600);
  }

  .compliance-details {
    margin: var(--space-lg) 0;
  }

  .compliance-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .compliance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-md);
  }

  .compliance-item {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    padding: var(--space-sm);
    background: var(--gray-50);
    border-radius: 6px;
  }

  .compliance-item strong {
    color: var(--gray-900);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .data-ownership-faq-section {
      padding: var(--space-3xl) 0;
    }

    .faq-question {
      padding: var(--space-lg);
    }

    .answer-content {
      padding: var(--space-lg);
    }

    .question-text {
      font-size: 16px;
    }

    .privacy-summary {
      grid-template-columns: 1fr;
    }

    .data-info-grid {
      grid-template-columns: 1fr 1fr;
    }

    .compliance-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .data-info-grid {
      grid-template-columns: 1fr;
    }

    .compliance-badges {
      flex-direction: column;
      align-items: center;
    }

    .legal-clarity {
      gap: var(--space-md);
    }

    .legal-item {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }
  }
</style>
