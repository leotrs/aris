<template>
  <section class="ai-faq-section" aria-labelledby="ai-faq-heading">
    <div class="faq-content-wrapper">
      <div class="section-header">
        <div class="section-icon">
          <IconQuestionMark :size="32" />
        </div>
        <h2 id="ai-faq-heading" class="section-title">AI Copilot Questions</h2>
        <p class="section-subtitle">
          Common questions about our AI features, privacy practices, and academic integrity.
        </p>
      </div>

      <div class="faq-grid">
        <div class="faq-item featured">
          <div class="faq-question" @click="toggleFAQ('how-ai-works')">
            <h3 class="question-text">How does the AI Copilot work?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('how-ai-works') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('how-ai-works')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>The AI Copilot provides contextual assistance</strong> while you write, offering suggestions 
                  for improvement, citation help, and research insights based on your document's content and academic domain.
                </p>
                <p class="answer-text">
                  It analyzes your writing in real-time to provide relevant suggestions, but you maintain complete 
                  control over which suggestions to accept or reject. All AI contributions are clearly marked and traceable.
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('data-privacy')">
            <h3 class="question-text">Is my research data safe with AI processing?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('data-privacy') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('data-privacy')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Yes, your data privacy is our top priority.</strong> We use a combination of local processing 
                  and encrypted, ephemeral cloud processing that doesn't store your content.
                </p>
                <div class="privacy-guarantees">
                  <div class="guarantee-item">
                    <IconShield :size="16" />
                    <span>No persistent storage of your research content</span>
                  </div>
                  <div class="guarantee-item">
                    <IconShield :size="16" />
                    <span>End-to-end encryption for all AI processing</span>
                  </div>
                  <div class="guarantee-item">
                    <IconShield :size="16" />
                    <span>Local AI processing when technically feasible</span>
                  </div>
                  <div class="guarantee-item">
                    <IconShield :size="16" />
                    <span>Zero retention policy for AI training</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('academic-integrity')">
            <h3 class="question-text">How does this maintain academic integrity?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('academic-integrity') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('academic-integrity')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Academic integrity is built into every AI feature.</strong> All AI suggestions are clearly 
                  marked, traceable, and require explicit author approval.
                </p>
                <div class="integrity-features">
                  <div class="feature-card">
                    <IconEdit :size="20" />
                    <h4 class="feature-title">Full Author Control</h4>
                    <p class="feature-description">You decide which AI suggestions to accept or reject</p>
                  </div>
                  <div class="feature-card">
                    <IconEye :size="20" />
                    <h4 class="feature-title">Transparent Tracking</h4>
                    <p class="feature-description">All AI contributions are clearly documented</p>
                  </div>
                  <div class="feature-card">
                    <IconSearch :size="20" />
                    <h4 class="feature-title">Plagiarism Detection</h4>
                    <p class="feature-description">Built-in checks to ensure originality</p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('ai-limitations')">
            <h3 class="question-text">What are the AI's limitations?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('ai-limitations') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('ai-limitations')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>We're transparent about AI limitations.</strong> The AI is a powerful assistant, 
                  but it cannot replace human expertise, critical thinking, or domain knowledge.
                </p>
                <div class="limitations-list">
                  <div class="limitation-item">
                    <IconAlertCircle :size="16" />
                    <span>Cannot verify factual accuracy of claims</span>
                  </div>
                  <div class="limitation-item">
                    <IconAlertCircle :size="16" />
                    <span>May not understand highly specialized terminology</span>
                  </div>
                  <div class="limitation-item">
                    <IconAlertCircle :size="16" />
                    <span>Cannot replace peer review or expert validation</span>
                  </div>
                  <div class="limitation-item">
                    <IconAlertCircle :size="16" />
                    <span>Requires human oversight for research methodology</span>
                  </div>
                </div>
                <p class="answer-text">
                  Always review AI suggestions critically and validate important claims independently.
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('citation-help')">
            <h3 class="question-text">How does AI citation assistance work?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('citation-help') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('citation-help')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>AI citation assistance helps you find and format references</strong> based on your 
                  document content and research area.
                </p>
                <div class="citation-features">
                  <div class="citation-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <h4 class="step-title">Context Analysis</h4>
                      <p class="step-description">AI analyzes your text to understand citation needs</p>
                    </div>
                  </div>
                  <div class="citation-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <h4 class="step-title">Paper Suggestions</h4>
                      <p class="step-description">Suggests relevant papers from academic databases</p>
                    </div>
                  </div>
                  <div class="citation-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <h4 class="step-title">Format Integration</h4>
                      <p class="step-description">Automatically formats citations in your chosen style</p>
                    </div>
                  </div>
                </div>
                <p class="answer-text">
                  You always review and approve suggested citations before they're added to your document.
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('ai-training')">
            <h3 class="question-text">Is my work used to train AI models?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('ai-training') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('ai-training')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>No, absolutely not.</strong> We have a strict zero-retention policy. Your research 
                  content is never used to train AI models or stored for any purpose beyond providing immediate assistance.
                </p>
                <div class="training-policy">
                  <div class="policy-item">
                    <IconX :size="16" />
                    <span>Your content is never stored permanently</span>
                  </div>
                  <div class="policy-item">
                    <IconX :size="16" />
                    <span>No training data derived from user content</span>
                  </div>
                  <div class="policy-item">
                    <IconX :size="16" />
                    <span>No sharing with third-party AI providers</span>
                  </div>
                  <div class="policy-guarantees">
                    <IconCheck :size="16" />
                    <span>Immediate deletion after processing</span>
                  </div>
                  <div class="policy-guarantees">
                    <IconCheck :size="16" />
                    <span>Transparent data handling practices</span>
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
    IconQuestionMark,
    IconChevronDown,
    IconShield,
    IconEdit,
    IconEye,
    IconSearch,
    IconAlertCircle,
    IconX,
    IconCheck,
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
  /* AI FAQ Section */
  .ai-faq-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .faq-content-wrapper {
    max-width: 800px;
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
    background: linear-gradient(135deg, var(--warning-100), var(--warning-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--warning-600);
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

  /* FAQ Grid and Items */
  .faq-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
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
    border: 2px solid var(--warning-300);
    background: linear-gradient(135deg, var(--warning-25), var(--warning-50));
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
    background: var(--warning-500);
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

  /* Privacy Guarantees */
  .privacy-guarantees {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin: var(--space-lg) 0;
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

  /* Integrity Features */
  .integrity-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .feature-card {
    background: var(--gray-50);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    padding: var(--space-md);
    text-align: center;
  }

  .feature-card svg {
    color: var(--primary-600);
    margin-bottom: var(--space-sm);
  }

  .feature-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .feature-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  /* Limitations */
  .limitations-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin: var(--space-lg) 0;
  }

  .limitation-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .limitation-item svg {
    color: var(--warning-600);
    flex-shrink: 0;
  }

  /* Citation Features */
  .citation-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .citation-step {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .step-number {
    width: 24px;
    height: 24px;
    background: var(--primary-500);
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    font-weight: 600;
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

  .step-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  /* Training Policy */
  .training-policy {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin: var(--space-lg) 0;
  }

  .policy-item,
  .policy-guarantees {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .policy-item svg {
    color: var(--error-600);
    flex-shrink: 0;
  }

  .policy-guarantees svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .ai-faq-section {
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

    .integrity-features {
      grid-template-columns: 1fr;
    }

    .citation-step {
      flex-direction: column;
      text-align: center;
    }
  }
</style>