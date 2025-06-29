<template>
  <section
    id="institutional"
    class="institutional-faq-section"
    aria-labelledby="institutional-heading"
  >
    <div class="faq-content-wrapper">
      <div class="section-header">
        <div class="section-icon">
          <IconBuilding :size="32" />
        </div>
        <h2 id="institutional-heading" class="section-title">Institutional Setup</h2>
        <p class="section-subtitle">
          Enterprise-ready features for universities, research institutions, and academic
          organizations.
        </p>
      </div>

      <div class="faq-grid">
        <div class="faq-item featured">
          <div class="faq-question" @click="toggleFAQ('institutional-deployment')">
            <h3 class="question-text">Can this be deployed at our institution?</h3>
            <div
              class="question-toggle"
              :class="{ active: activeFAQs.includes('institutional-deployment') }"
            >
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('institutional-deployment')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Yes, multiple deployment options available.</strong> Choose the setup that
                  meets your institution's requirements:
                </p>
                <div class="deployment-options">
                  <div class="option-card">
                    <IconCloud :size="24" />
                    <h4 class="option-title">Hosted Solution</h4>
                    <p class="option-description">
                      We manage everything while maintaining your institutional branding and data
                      sovereignty
                    </p>
                  </div>
                  <div class="option-card">
                    <IconServer :size="24" />
                    <h4 class="option-title">Private Cloud</h4>
                    <p class="option-description">
                      Dedicated infrastructure in your preferred cloud provider with full control
                    </p>
                  </div>
                  <div class="option-card">
                    <IconShield :size="24" />
                    <h4 class="option-title">On-Premises</h4>
                    <p class="option-description">
                      Complete self-hosting within your institution's infrastructure and security
                      policies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('sso-integration')">
            <h3 class="question-text">Does this integrate with our SSO system?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('sso-integration') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('sso-integration')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Yes, comprehensive SSO support.</strong> Integrate with your existing
                  identity management:
                </p>
                <div class="sso-protocols">
                  <div class="protocol-item">
                    <IconCheck :size="16" />
                    <span>SAML 2.0</span>
                  </div>
                  <div class="protocol-item">
                    <IconCheck :size="16" />
                    <span>OAuth 2.0 / OpenID Connect</span>
                  </div>
                  <div class="protocol-item">
                    <IconCheck :size="16" />
                    <span>LDAP / Active Directory</span>
                  </div>
                  <div class="protocol-item">
                    <IconCheck :size="16" />
                    <span>Shibboleth</span>
                  </div>
                  <div class="protocol-item">
                    <IconCheck :size="16" />
                    <span>CAS Protocol</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('pricing-institutions')">
            <h3 class="question-text">What's the pricing for institutions?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('pricing-institutions') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('pricing-institutions')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Transparent, research-friendly pricing.</strong> We believe cost shouldn't
                  be a barrier to better research infrastructure:
                </p>
                <div class="pricing-tiers">
                  <div class="tier-card">
                    <h4 class="tier-title">Small Institution</h4>
                    <div class="tier-price">$2-5K/year</div>
                    <div class="tier-users">Up to 500 users</div>
                  </div>
                  <div class="tier-card">
                    <h4 class="tier-title">Large University</h4>
                    <div class="tier-price">$10-25K/year</div>
                    <div class="tier-users">Up to 5,000 users</div>
                  </div>
                  <div class="tier-card">
                    <h4 class="tier-title">Enterprise</h4>
                    <div class="tier-price">Custom</div>
                    <div class="tier-users">Unlimited users</div>
                  </div>
                </div>
                <div class="pricing-notes">
                  <p class="note-text">
                    <strong>Founding member benefits:</strong> 50% discount for first-year adopters
                    and input on platform development priorities.
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
    IconBuilding,
    IconChevronDown,
    IconCloud,
    IconServer,
    IconShield,
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
  .institutional-faq-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--gray-50) 100%);
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

  .deployment-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .option-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    padding: var(--space-lg);
    border-radius: 8px;
    text-align: center;
  }

  .option-card svg {
    color: var(--primary-600);
    margin-bottom: var(--space-md);
  }

  .option-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .option-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  .sso-protocols {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-sm);
    margin: var(--space-lg) 0;
  }

  .protocol-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    background: var(--success-25);
    border: 1px solid var(--success-200);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .protocol-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  .pricing-tiers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .tier-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    padding: var(--space-lg);
    border-radius: 8px;
    text-align: center;
  }

  .tier-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .tier-price {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: var(--space-xs);
  }

  .tier-users {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-600);
  }

  .pricing-notes {
    margin-top: var(--space-lg);
    padding: var(--space-md);
    background: var(--success-25);
    border-radius: 8px;
  }

  .note-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  @media (max-width: 768px) {
    .institutional-faq-section {
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

    .deployment-options {
      grid-template-columns: 1fr;
    }

    .sso-protocols {
      grid-template-columns: 1fr;
    }

    .pricing-tiers {
      grid-template-columns: 1fr;
    }
  }
</style>
