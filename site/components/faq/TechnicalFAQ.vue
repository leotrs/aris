<template>
  <section id="technical" class="technical-faq-section" aria-labelledby="technical-heading">
    <div class="faq-content-wrapper">
      <div class="section-header">
        <div class="section-icon">
          <IconCode :size="32" />
        </div>
        <h2 id="technical-heading" class="section-title">Technical Details</h2>
        <p class="section-subtitle">
          Built on modern web technologies with integrations for ORCID, DOI, and existing research
          infrastructure.
        </p>
      </div>

      <div class="faq-grid">
        <div class="faq-item featured">
          <div class="faq-question" @click="toggleFAQ('orcid-integration')">
            <h3 class="question-text">Does this work with ORCID?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('orcid-integration') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('orcid-integration')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Yes, ORCID integration is built into the platform.</strong> Connect your
                  ORCID profile during signup and maintain your academic identity:
                </p>
                <div class="integration-features">
                  <div class="feature-item">
                    <IconCheck :size="16" />
                    <span>Automatic author attribution using ORCID profiles</span>
                  </div>
                  <div class="feature-item">
                    <IconCheck :size="16" />
                    <span>Publications automatically added to your ORCID record</span>
                  </div>
                  <div class="feature-item">
                    <IconCheck :size="16" />
                    <span>Institutional affiliation sync</span>
                  </div>
                  <div class="feature-item">
                    <IconCheck :size="16" />
                    <span>Co-author verification and collaboration tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('doi-minting')">
            <h3 class="question-text">Can I get DOIs for my preprints?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('doi-minting') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('doi-minting')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Yes, we provide DOIs through CrossRef partnership.</strong> Every
                  publication gets a permanent, citable identifier:
                </p>
                <div class="doi-benefits">
                  <div class="benefit-card">
                    <IconLink :size="20" />
                    <span>Permanent citation links</span>
                  </div>
                  <div class="benefit-card">
                    <IconArchive :size="20" />
                    <span>Long-term preservation</span>
                  </div>
                  <div class="benefit-card">
                    <IconSearch :size="20" />
                    <span>Discoverable in academic databases</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('api-access')">
            <h3 class="question-text">Is there an API for integrations?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('api-access') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('api-access')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Yes, full REST API with comprehensive documentation.</strong> Build
                  integrations with your existing tools:
                </p>
                <div class="api-features">
                  <div class="api-category">
                    <h4 class="category-title">Manuscript Management</h4>
                    <ul class="api-list">
                      <li>Create, update, and retrieve manuscripts</li>
                      <li>Version control and change tracking</li>
                      <li>Collaboration and permissions management</li>
                    </ul>
                  </div>
                  <div class="api-category">
                    <h4 class="category-title">Review Workflows</h4>
                    <ul class="api-list">
                      <li>Submit manuscripts for review</li>
                      <li>Retrieve review status and comments</li>
                      <li>Reviewer assignment and notifications</li>
                    </ul>
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
    IconCode,
    IconChevronDown,
    IconCheck,
    IconLink,
    IconArchive,
    IconSearch,
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
  .technical-faq-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .faq-content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

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
    max-height: 800px;
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

  .integration-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .feature-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  .doi-benefits {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-md);
    margin: var(--space-lg) 0;
  }

  .benefit-card {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--success-25);
    border: 1px solid var(--success-200);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .benefit-card svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  .api-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
    margin: var(--space-lg) 0;
  }

  .api-category {
    background: var(--gray-50);
    padding: var(--space-lg);
    border-radius: 8px;
  }

  .category-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .api-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .api-list li {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin-bottom: var(--space-sm);
    padding-left: var(--space-sm);
    position: relative;
  }

  .api-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--primary-500);
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .technical-faq-section {
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

    .api-features {
      grid-template-columns: 1fr;
    }

    .doi-benefits {
      grid-template-columns: 1fr;
    }
  }
</style>
