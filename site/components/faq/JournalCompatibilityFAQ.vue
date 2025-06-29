<template>
  <section
    id="journal-compatibility"
    class="journal-compatibility-faq-section"
    aria-labelledby="journal-compatibility-heading"
  >
    <div class="faq-content-wrapper">
      <div class="section-header">
        <div class="section-icon">
          <IconFileText :size="32" />
        </div>
        <h2 id="journal-compatibility-heading" class="section-title">Journal Compatibility</h2>
        <p class="section-subtitle">
          Aris works seamlessly with traditional journal submission processes. Your research journey
          doesn't end with preprint publication—it begins there.
        </p>
      </div>

      <div class="faq-grid">
        <div class="faq-item featured">
          <div class="faq-question" @click="toggleFAQ('journal-submission')">
            <h3 class="question-text">How does this work with journal submissions?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('journal-submission') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('journal-submission')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Aris enhances, not replaces, journal submission.</strong> Our platform
                  prepares your manuscript for any journal's requirements:
                </p>
                <div class="submission-workflow">
                  <div class="workflow-step">
                    <div class="step-icon">
                      <IconEdit :size="20" />
                    </div>
                    <div class="step-content">
                      <h4 class="step-title">Write & Review on Aris</h4>
                      <p class="step-text">Complete your research with transparent peer review</p>
                    </div>
                  </div>
                  <div class="workflow-step">
                    <div class="step-icon">
                      <IconDownload :size="20" />
                    </div>
                    <div class="step-content">
                      <h4 class="step-title">Export for Journals</h4>
                      <p class="step-text">Generate submission packages in any required format</p>
                    </div>
                  </div>
                  <div class="workflow-step">
                    <div class="step-icon">
                      <IconSend :size="20" />
                    </div>
                    <div class="step-content">
                      <h4 class="step-title">Submit with Confidence</h4>
                      <p class="step-text">
                        Include complete review history and collaboration data
                      </p>
                    </div>
                  </div>
                </div>
                <div class="format-support">
                  <h4 class="format-title">Supported Export Formats:</h4>
                  <div class="format-list">
                    <span class="format-badge">LaTeX</span>
                    <span class="format-badge">Word (.docx)</span>
                    <span class="format-badge">PDF</span>
                    <span class="format-badge">XML (JATS)</span>
                    <span class="format-badge">Custom Templates</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('prestigious-journals')">
            <h3 class="question-text">Can I still submit to Nature, Science, Cell, etc.?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('prestigious-journals') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('prestigious-journals')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Absolutely.</strong> Top-tier journals actively encourage preprint sharing
                  and transparent peer review.
                </p>
                <div class="journal-benefits">
                  <div class="benefit-card">
                    <IconCheck :size="24" />
                    <div class="benefit-content">
                      <h4 class="benefit-title">Enhanced Submissions</h4>
                      <p class="benefit-text">
                        Journals appreciate manuscripts with transparent review history and
                        community engagement data.
                      </p>
                    </div>
                  </div>
                  <div class="benefit-card">
                    <IconShield :size="24" />
                    <div class="benefit-content">
                      <h4 class="benefit-title">Established Priority</h4>
                      <p class="benefit-text">
                        Your preprint establishes priority and precedence for your discoveries.
                      </p>
                    </div>
                  </div>
                  <div class="benefit-card">
                    <IconUsers :size="24" />
                    <div class="benefit-content">
                      <h4 class="benefit-title">Community Recognition</h4>
                      <p class="benefit-text">
                        Build recognition and citations while your paper moves through traditional
                        review.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="journal-policies">
                  <p class="policy-note">
                    <strong>Major journals with preprint-friendly policies:</strong>
                    Nature, Science, Cell, PNAS, eLife, PLOS, and most others now accept preprint
                    manuscripts.
                  </p>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('review-history')">
            <h3 class="question-text">What happens to peer review after journal acceptance?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('review-history') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('review-history')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  Your Aris review history becomes a valuable supplement to traditional journal peer
                  review:
                </p>
                <div class="review-continuation">
                  <div class="continuation-item">
                    <IconArchive :size="20" />
                    <div class="continuation-content">
                      <h4 class="continuation-title">Permanent Archive</h4>
                      <p class="continuation-text">
                        All review discussions, suggestions, and improvements remain archived and
                        accessible.
                      </p>
                    </div>
                  </div>
                  <div class="continuation-item">
                    <IconLink :size="20" />
                    <div class="continuation-content">
                      <h4 class="continuation-title">Linked to Publication</h4>
                      <p class="continuation-text">
                        Your final journal publication links back to the complete development
                        history.
                      </p>
                    </div>
                  </div>
                  <div class="continuation-item">
                    <IconAward :size="20" />
                    <div class="continuation-content">
                      <h4 class="continuation-title">Reviewer Recognition</h4>
                      <p class="continuation-text">
                        Pre-publication reviewers get credited for their contributions to the
                        research.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="post-acceptance-note">
                  <p class="note-text">
                    <strong>The result:</strong> A richer, more complete record of how research
                    develops—benefiting science, authors, and reviewers.
                  </p>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('submission-package')">
            <h3 class="question-text">Is my review history included when I submit to journals?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('submission-package') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('submission-package')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>You decide what to include.</strong> Aris gives you complete control over
                  your submission package:
                </p>
                <div class="inclusion-options">
                  <div class="option-section">
                    <h4 class="option-title">
                      <IconEye :size="16" />
                      What You Can Include
                    </h4>
                    <ul class="option-list">
                      <li>Peer review reports and responses</li>
                      <li>Version history and change logs</li>
                      <li>Collaborative contributor information</li>
                      <li>Community engagement metrics</li>
                      <li>Data and code review comments</li>
                    </ul>
                  </div>
                  <div class="option-section">
                    <h4 class="option-title">
                      <IconEyeOff :size="16" />
                      Privacy Controls
                    </h4>
                    <ul class="option-list">
                      <li>Choose which reviews to include</li>
                      <li>Anonymize reviewer identities if preferred</li>
                      <li>Include only final version for traditional submission</li>
                      <li>Custom submission packages per journal</li>
                    </ul>
                  </div>
                </div>
                <div class="flexibility-note">
                  <p class="flexibility-text">
                    Many authors find that including transparent review history actually
                    <em>strengthens</em> their journal submissions by demonstrating thorough vetting
                    and community engagement.
                  </p>
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
    IconFileText,
    IconChevronDown,
    IconCheck,
    IconEdit,
    IconDownload,
    IconSend,
    IconShield,
    IconUsers,
    IconArchive,
    IconLink,
    IconAward,
    IconEye,
    IconEyeOff,
    IconRocket,
    IconPlayerPlay,
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
  /* Journal Compatibility FAQ Section */
  .journal-compatibility-faq-section {
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
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--primary-600);
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
    border: 2px solid var(--primary-300);
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
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
    max-height: 1500px;
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

  /* Submission Workflow */
  .submission-workflow {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin: var(--space-lg) 0;
  }

  .workflow-step {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--gray-50);
    border-radius: 8px;
  }

  .step-icon {
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

  .step-content {
    flex: 1;
  }

  .step-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .step-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  /* Format Support */
  .format-support {
    margin: var(--space-lg) 0;
  }

  .format-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .format-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .format-badge {
    background: var(--success-100);
    border: 1px solid var(--success-300);
    color: var(--success-700);
    padding: var(--space-xs) var(--space-sm);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
  }

  /* Journal Benefits */
  .journal-benefits {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin: var(--space-lg) 0;
  }

  .benefit-card {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--success-25);
    border: 1px solid var(--success-200);
    border-radius: 8px;
  }

  .benefit-card svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  .benefit-content {
    flex: 1;
  }

  .benefit-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .benefit-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  .journal-policies {
    margin-top: var(--space-lg);
    padding: var(--space-md);
    background: var(--primary-25);
    border-radius: 8px;
  }

  .policy-note {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  /* Review Continuation */
  .review-continuation {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin: var(--space-lg) 0;
  }

  .continuation-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--gray-50);
    border-radius: 8px;
  }

  .continuation-item svg {
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .continuation-content {
    flex: 1;
  }

  .continuation-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .continuation-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  .post-acceptance-note {
    margin-top: var(--space-lg);
    padding: var(--space-md);
    background: var(--success-25);
    border-left: 4px solid var(--success-400);
    border-radius: 0 8px 8px 0;
  }

  .note-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  /* Inclusion Options */
  .inclusion-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .option-section {
    background: var(--gray-50);
    padding: var(--space-md);
    border-radius: 8px;
  }

  .option-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .option-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .option-list li {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    line-height: 1.4;
    color: var(--gray-700);
    margin-bottom: var(--space-xs);
    padding-left: var(--space-sm);
    position: relative;
  }

  .option-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--primary-500);
    font-weight: bold;
  }

  .flexibility-note {
    margin-top: var(--space-lg);
    padding: var(--space-md);
    background: var(--primary-25);
    border-radius: 8px;
  }

  .flexibility-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  /* Compatibility Footer */
  .compatibility-footer {
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
  }

  .footer-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .footer-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .footer-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .footer-actions {
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
    min-width: 160px;
    justify-content: center;
  }

  .btn-primary {
    background: var(--primary-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 154, 233, 0.35);
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
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .journal-compatibility-faq-section {
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

    .inclusion-options {
      grid-template-columns: 1fr;
    }

    .compatibility-footer {
      padding: var(--space-xl);
    }

    .footer-actions {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 200px;
    }
  }

  @media (max-width: 480px) {
    .journal-benefits {
      gap: var(--space-sm);
    }

    .benefit-card {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }

    .submission-workflow {
      gap: var(--space-sm);
    }

    .workflow-step {
      flex-direction: column;
      text-align: center;
      gap: var(--space-sm);
    }
  }
</style>
