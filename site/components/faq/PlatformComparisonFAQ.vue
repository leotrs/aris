<template>
  <section
    id="platform-comparison"
    class="platform-comparison-faq-section"
    aria-labelledby="platform-comparison-heading"
  >
    <div class="faq-content-wrapper">
      <div class="section-header">
        <div class="section-icon">
          <IconGitCompare :size="32" />
        </div>
        <h2 id="platform-comparison-heading" class="section-title">Platform Comparisons</h2>
        <p class="section-subtitle">
          How Aris compares to other research tools and why integrated workflows make the
          difference.
        </p>
      </div>

      <div class="faq-grid">
        <div class="faq-item featured">
          <div class="faq-question" @click="toggleFAQ('vs-preprint-servers')">
            <h3 class="question-text">How is this different from preprint servers?</h3>
            <div
              class="question-toggle"
              :class="{ active: activeFAQs.includes('vs-preprint-servers') }"
            >
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('vs-preprint-servers')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong
                    >Aris is a modern preprint server with collaboration and peer review built
                    in.</strong
                  >
                  Traditional preprint servers just host static PDFs:
                </p>
                <div class="comparison-table">
                  <div class="comparison-header">
                    <div class="header-cell">Feature</div>
                    <div class="header-cell">Traditional Preprints</div>
                    <div class="header-cell">Aris</div>
                  </div>
                  <div class="comparison-row">
                    <div class="feature-cell">Document Type</div>
                    <div class="traditional-cell">Static PDF</div>
                    <div class="aris-cell">Living, Interactive Documents</div>
                  </div>
                  <div class="comparison-row">
                    <div class="feature-cell">Collaboration</div>
                    <div class="traditional-cell">External tools required</div>
                    <div class="aris-cell">Real-time built-in</div>
                  </div>
                  <div class="comparison-row">
                    <div class="feature-cell">Peer Review</div>
                    <div class="traditional-cell">No formal process</div>
                    <div class="aris-cell">Transparent workflows</div>
                  </div>
                  <div class="comparison-row">
                    <div class="feature-cell">Updates</div>
                    <div class="traditional-cell">Version replacement</div>
                    <div class="aris-cell">Continuous evolution</div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('vs-overleaf')">
            <h3 class="question-text">Why not just use Overleaf or Google Docs?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('vs-overleaf') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('vs-overleaf')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  Writing tools are just one piece of the research puzzle. Aris connects your entire
                  workflow:
                </p>
                <div class="workflow-comparison">
                  <div class="tool-limitations">
                    <h4 class="limitation-title">Current Tool Limitations</h4>
                    <div class="limitation-item">
                      <IconX :size="16" />
                      <span>No peer review integration</span>
                    </div>
                    <div class="limitation-item">
                      <IconX :size="16" />
                      <span>No publication pathways</span>
                    </div>
                    <div class="limitation-item">
                      <IconX :size="16" />
                      <span>Limited community engagement</span>
                    </div>
                    <div class="limitation-item">
                      <IconX :size="16" />
                      <span>Static final outputs</span>
                    </div>
                  </div>
                  <div class="aris-advantages">
                    <h4 class="advantage-title">Aris Integration</h4>
                    <div class="advantage-item">
                      <IconCheck :size="16" />
                      <span>Write, review, and publish in one place</span>
                    </div>
                    <div class="advantage-item">
                      <IconCheck :size="16" />
                      <span>Transparent peer review workflows</span>
                    </div>
                    <div class="advantage-item">
                      <IconCheck :size="16" />
                      <span>Community engagement from day one</span>
                    </div>
                    <div class="advantage-item">
                      <IconCheck :size="16" />
                      <span>Living documents that evolve</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('vs-latex')">
            <h3 class="question-text">How does this compare to LaTeX editors?</h3>
            <div class="question-toggle" :class="{ active: activeFAQs.includes('vs-latex') }">
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('vs-latex')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong
                    >Aris supports LaTeX import and maintains LaTeX-quality typesetting</strong
                  >
                  while adding modern collaboration features:
                </p>
                <div class="workflow-comparison">
                  <div class="tool-limitations">
                    <h4 class="limitation-title">Traditional LaTeX Workflow</h4>
                    <div class="limitation-item">
                      <IconX :size="16" />
                      <span>Complex setup and learning curve</span>
                    </div>
                    <div class="limitation-item">
                      <IconX :size="16" />
                      <span>No real-time collaboration</span>
                    </div>
                    <div class="limitation-item">
                      <IconX :size="16" />
                      <span>Manual journal formatting</span>
                    </div>
                    <div class="limitation-item">
                      <IconX :size="16" />
                      <span>Separate tools for review/publishing</span>
                    </div>
                  </div>
                  <div class="aris-advantages">
                    <h4 class="advantage-title">Aris + LaTeX</h4>
                    <div class="advantage-item">
                      <IconCheck :size="16" />
                      <span>Import existing LaTeX documents</span>
                    </div>
                    <div class="advantage-item">
                      <IconCheck :size="16" />
                      <span>Visual editor with LaTeX output</span>
                    </div>
                    <div class="advantage-item">
                      <IconCheck :size="16" />
                      <span>Automatic journal formatting</span>
                    </div>
                    <div class="advantage-item">
                      <IconCheck :size="16" />
                      <span>Integrated collaboration and publishing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('vs-institutional')">
            <h3 class="question-text">What about institutional repositories and systems?</h3>
            <div
              class="question-toggle"
              :class="{ active: activeFAQs.includes('vs-institutional') }"
            >
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('vs-institutional')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Aris complements institutional systems</strong> rather than replacing
                  them. We integrate with your existing workflows:
                </p>
                <div class="integration-features">
                  <div class="feature-card">
                    <IconDatabase :size="24" />
                    <h4 class="feature-title">Repository Integration</h4>
                    <p class="feature-description">
                      Automatic deposits to institutional repositories with proper metadata
                    </p>
                  </div>
                  <div class="feature-card">
                    <IconShield :size="24" />
                    <h4 class="feature-title">Institutional Auth</h4>
                    <p class="feature-description">
                      SSO integration with university authentication systems
                    </p>
                  </div>
                  <div class="feature-card">
                    <IconUsers :size="24" />
                    <h4 class="feature-title">Department Workflows</h4>
                    <p class="feature-description">
                      Custom approval processes that match institutional requirements
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="faq-item">
          <div class="faq-question" @click="toggleFAQ('journal-formatting')">
            <h3 class="question-text">What about journal formatting requirements?</h3>
            <div
              class="question-toggle"
              :class="{ active: activeFAQs.includes('journal-formatting') }"
            >
              <IconChevronDown :size="20" />
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="activeFAQs.includes('journal-formatting')" class="faq-answer">
              <div class="answer-content">
                <p class="answer-text">
                  <strong>Aris handles journal formatting automatically.</strong> We maintain
                  templates for major journals and publishers:
                </p>
                <div class="formatting-features">
                  <div class="feature-card">
                    <IconLayout :size="24" />
                    <h4 class="feature-title">Automatic Formatting</h4>
                    <p class="feature-description">
                      Export to journal-specific requirements with one click
                    </p>
                  </div>
                  <div class="feature-card">
                    <IconRefresh :size="24" />
                    <h4 class="feature-title">Always Updated</h4>
                    <p class="feature-description">
                      Templates automatically update when journals change requirements
                    </p>
                  </div>
                  <div class="feature-card">
                    <IconSettings :size="24" />
                    <h4 class="feature-title">Custom Templates</h4>
                    <p class="feature-description">
                      Request custom formats for journals not yet in our database
                    </p>
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
    IconGitCompare,
    IconChevronDown,
    IconX,
    IconCheck,
    IconLayout,
    IconRefresh,
    IconSettings,
    IconDatabase,
    IconShield,
    IconUsers,
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
  /* Platform Comparison FAQ Section */
  .platform-comparison-faq-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--gray-50) 100%);
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

  /* FAQ Grid and common styles */
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

  /* Comparison Table */
  .comparison-table {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1px;
    background: var(--border-primary);
    border-radius: 8px;
    overflow: hidden;
    margin: var(--space-lg) 0;
  }

  .comparison-header {
    display: contents;
  }

  .header-cell {
    background: var(--gray-100);
    padding: var(--space-sm);
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
  }

  .comparison-row {
    display: contents;
  }

  .feature-cell {
    background: var(--surface-page);
    padding: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-800);
  }

  .traditional-cell {
    background: var(--warning-25);
    padding: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    color: var(--gray-700);
    text-align: center;
  }

  .aris-cell {
    background: var(--success-25);
    padding: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    color: var(--gray-700);
    text-align: center;
    font-weight: 500;
  }

  /* Workflow Comparison */
  .workflow-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
    margin: var(--space-lg) 0;
  }

  .tool-limitations,
  .aris-advantages {
    background: var(--gray-50);
    padding: var(--space-lg);
    border-radius: 8px;
  }

  .limitation-title,
  .advantage-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .limitation-item,
  .advantage-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .limitation-item svg {
    color: var(--error-500);
  }

  .advantage-item svg {
    color: var(--success-600);
  }

  /* Formatting Features & Integration Features */
  .formatting-features,
  .integration-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .feature-card {
    background: var(--gray-50);
    padding: var(--space-lg);
    border-radius: 8px;
    text-align: center;
  }

  .feature-card svg {
    color: var(--primary-600);
    margin-bottom: var(--space-md);
  }

  .feature-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .feature-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .platform-comparison-faq-section {
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

    .comparison-table {
      font-size: 12px;
    }

    .workflow-comparison {
      grid-template-columns: 1fr;
    }

    .formatting-features,
    .integration-features {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .comparison-table {
      grid-template-columns: 1fr;
    }

    .header-cell:nth-child(2),
    .traditional-cell {
      display: none;
    }

    .feature-card {
      padding: var(--space-md);
    }
  }
</style>
