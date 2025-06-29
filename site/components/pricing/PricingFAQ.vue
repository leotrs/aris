<template>
  <section class="pricing-faq-section" aria-labelledby="pricing-faq-heading">
    <div class="faq-content-wrapper">
      <div class="section-header">
        <div class="section-icon">
          <IconQuestionMark :size="32" />
        </div>
        <h2 id="pricing-faq-heading" class="section-title">Pricing Questions</h2>
        <p class="section-subtitle">
          Common questions about our pricing, billing, and policies.
        </p>
      </div>

      <div class="faq-grid">
        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('free-forever')">
            <h3 class="question-text">Is the individual plan really free forever?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('free-forever') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('free-forever')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Yes, absolutely.</strong> Individual researchers can use Aris free forever with no
                  hidden fees or time limits. This includes core features like LaTeX import, PDF export,
                  basic collaboration (up to 3 people), and journal export templates.
                </p>
                <p class="answer-text">
                  Our business model is based on institutional subscriptions, not individual users.
                  We believe in keeping research accessible.
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('academic-discounts')">
            <h3 class="question-text">Do you offer academic discounts?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('academic-discounts') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('academic-discounts')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Our pricing is already designed for academic budgets.</strong> We offer:
                </p>
                <div class="discount-options">
                  <div class="discount-item">
                    <IconCheck :size="16" />
                    <span>50% discount for educational institutions</span>
                  </div>
                  <div class="discount-item">
                    <IconCheck :size="16" />
                    <span>Additional discounts for multi-year commitments</span>
                  </div>
                  <div class="discount-item">
                    <IconCheck :size="16" />
                    <span>Special pricing for developing countries</span>
                  </div>
                  <div class="discount-item">
                    <IconCheck :size="16" />
                    <span>Grants available for small research groups</span>
                  </div>
                </div>
                <p class="answer-text">
                  Contact us to discuss your specific situation and budget constraints.
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('data-export')">
            <h3 class="question-text">What happens to my data if I cancel?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('data-export') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('data-export')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>You get complete data export in multiple formats:</strong>
                </p>
                <div class="export-formats">
                  <div class="format-item">
                    <IconFileText :size="16" />
                    <span>LaTeX source files</span>
                  </div>
                  <div class="format-item">
                    <IconFileText :size="16" />
                    <span>Word documents (.docx)</span>
                  </div>
                  <div class="format-item">
                    <IconFileText :size="16" />
                    <span>PDF exports</span>
                  </div>
                  <div class="format-item">
                    <IconFileText :size="16" />
                    <span>JSON metadata</span>
                  </div>
                  <div class="format-item">
                    <IconFileText :size="16" />
                    <span>All references and citations</span>
                  </div>
                </div>
                <p class="answer-text">
                  Your data remains accessible for 90 days after cancellation, and you can export
                  everything at any time during your subscription.
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('billing-changes')">
            <h3 class="question-text">Can I change plans or cancel anytime?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('billing-changes') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('billing-changes')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Yes, complete flexibility:</strong>
                </p>
                <div class="billing-features">
                  <div class="billing-item">
                    <IconCheck :size="16" />
                    <span>Upgrade or downgrade anytime</span>
                  </div>
                  <div class="billing-item">
                    <IconCheck :size="16" />
                    <span>No cancellation fees</span>
                  </div>
                  <div class="billing-item">
                    <IconCheck :size="16" />
                    <span>Prorated billing adjustments</span>
                  </div>
                  <div class="billing-item">
                    <IconCheck :size="16" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
                <p class="answer-text">
                  Academic budgets change, and we understand that. No long-term lock-ins required.
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('beta-pricing')">
            <h3 class="question-text">Will pricing change after beta?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('beta-pricing') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('beta-pricing')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Early adopters get locked-in pricing for 2 years.</strong> If you sign up during
                  beta, your pricing won't change until 2026, even if we raise prices for new customers.
                </p>
                <p class="answer-text">
                  Individual plans will always remain free. Institutional pricing may adjust as we add
                  more features, but early adopters are protected.
                </p>
                <div class="pricing-guarantee">
                  <IconShield :size="20" />
                  <span>Your early trust in Aris gets rewarded with long-term pricing protection.</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('payment-methods')">
            <h3 class="question-text">What payment methods do you accept?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('payment-methods') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('payment-methods')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  We accept all major payment methods:
                </p>
                <div class="payment-methods">
                  <div class="payment-item">
                    <IconCreditCard :size="16" />
                    <span>Credit and debit cards</span>
                  </div>
                  <div class="payment-item">
                    <IconBuildingBank :size="16" />
                    <span>Bank transfers (ACH/SEPA)</span>
                  </div>
                  <div class="payment-item">
                    <IconFileInvoice :size="16" />
                    <span>Purchase orders and invoicing</span>
                  </div>
                  <div class="payment-item">
                    <IconCheck :size="16" />
                    <span>Annual billing discounts available</span>
                  </div>
                </div>
                <p class="answer-text">
                  For institutional customers, we work with your procurement processes and can accommodate
                  specific billing requirements.
                </p>
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
    IconCheck,
    IconFileText,
    IconShield,
    IconCreditCard,
    IconBuildingBank,
    IconFileInvoice,
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
  /* Pricing FAQ Section */
  .pricing-faq-section {
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
    background: var(--success-500);
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

  /* Feature Lists */
  .discount-options,
  .export-formats,
  .billing-features,
  .payment-methods {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin: var(--space-lg) 0;
  }

  .discount-item,
  .format-item,
  .billing-item,
  .payment-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .discount-item svg,
  .format-item svg,
  .billing-item svg,
  .payment-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Pricing Guarantee */
  .pricing-guarantee {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--success-25);
    border: 1px solid var(--success-200);
    border-radius: 8px;
    padding: var(--space-md);
    margin-top: var(--space-lg);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--success-700);
  }

  .pricing-guarantee svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .pricing-faq-section {
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
  }
</style>