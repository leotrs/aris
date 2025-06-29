<template>
  <section class="quick-start-section" aria-labelledby="quick-start-heading">
    <div class="quick-start-content-wrapper">
      <div class="section-header">
        <h2 id="quick-start-heading" class="section-title">5-Minute Quick Start</h2>
        <p class="section-subtitle">
          See yourself using Aris in just 5 minutes. Follow along with our interactive guide to
          create your first manuscript.
        </p>
      </div>

      <div class="guide-container">
        <div class="guide-steps">
          <div
            v-for="(step, index) in quickStartSteps"
            :key="index"
            class="guide-step"
            :class="{ active: activeStep === index }"
            @click="setActiveStep(index)"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
              <div class="step-time">{{ step.time }}</div>
            </div>
            <div class="step-icon">
              <component :is="step.icon" :size="24" />
            </div>
          </div>
        </div>

        <div class="guide-preview">
          <div class="preview-header">
            <h3 class="preview-title">{{ quickStartSteps[activeStep].title }}</h3>
            <div class="preview-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${((activeStep + 1) / quickStartSteps.length) * 100}%` }"
                ></div>
              </div>
              <span class="progress-text"
                >{{ activeStep + 1 }} of {{ quickStartSteps.length }}</span
              >
            </div>
          </div>

          <div class="preview-content">
            <div class="preview-image">
              <div class="mock-interface">
                <div v-if="activeStep === 0" class="signup-mock">
                  <div class="form-field">
                    <label>Academic Email</label>
                    <input type="email" placeholder="your.name@university.edu" readonly />
                  </div>
                  <div class="form-field">
                    <label>Institution</label>
                    <input type="text" placeholder="Your University" readonly />
                  </div>
                  <button class="mock-btn">Create Account</button>
                </div>

                <div v-else-if="activeStep === 1" class="manuscript-mock">
                  <div class="mock-toolbar">
                    <button>+ New Manuscript</button>
                    <button>Import LaTeX</button>
                  </div>
                  <div class="mock-templates">
                    <div class="template-card active">Research Paper</div>
                    <div class="template-card">Review Article</div>
                    <div class="template-card">Thesis Chapter</div>
                  </div>
                </div>

                <div v-else-if="activeStep === 2" class="editor-mock">
                  <div class="mock-editor-toolbar">
                    <button>RSM</button>
                    <button>LaTeX</button>
                    <button>Preview</button>
                  </div>
                  <div class="mock-editor-content">
                    <div class="mock-line"># Introduction</div>
                    <div class="mock-line">This paper presents...</div>
                    <div class="mock-line">@cite{smith2023}</div>
                    <div class="mock-cursor"></div>
                  </div>
                </div>

                <div v-else-if="activeStep === 3" class="collab-mock">
                  <div class="mock-collaborators">
                    <div class="collaborator">
                      <div class="avatar">JS</div>
                      <span>Jane Smith (Editing)</span>
                    </div>
                    <div class="collaborator">
                      <div class="avatar">MB</div>
                      <span>Mike Brown (Reviewing)</span>
                    </div>
                  </div>
                  <div class="mock-changes">
                    <div class="change-item">✓ Abstract updated</div>
                    <div class="change-item">+ Figure 2 added</div>
                    <div class="change-item">⚠ Comment on line 45</div>
                  </div>
                </div>

                <div v-else-if="activeStep === 4" class="publish-mock">
                  <div class="mock-preview">
                    <div class="preview-header-mock">
                      <h4>Your Paper Title</h4>
                      <p>Authors: You, Jane Smith, Mike Brown</p>
                    </div>
                    <div class="preview-content-mock">
                      <p>Beautiful web-native formatting...</p>
                      <div class="interactive-figure">[Interactive Figure]</div>
                    </div>
                  </div>
                  <div class="publish-options">
                    <button class="mock-btn primary">Publish to Web</button>
                    <button class="mock-btn">Export PDF</button>
                    <button class="mock-btn">Submit to Journal</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="preview-details">
              <h4 class="details-title">What happens here:</h4>
              <ul class="details-list">
                <li v-for="detail in quickStartSteps[activeStep].details" :key="detail">
                  {{ detail }}
                </li>
              </ul>
            </div>
          </div>

          <div class="preview-actions">
            <button v-if="activeStep > 0" class="btn btn-secondary" @click="previousStep">
              <IconArrowLeft :size="16" />
              Previous
            </button>
            <button
              v-if="activeStep < quickStartSteps.length - 1"
              class="btn btn-primary"
              @click="nextStep"
            >
              Next
              <IconArrowRight :size="16" />
            </button>
            <a v-else href="/signup" class="btn btn-success">
              <IconRocket :size="16" />
              Start Your Journey
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref } from "vue";
  import {
    IconUserPlus,
    IconFileText,
    IconEdit,
    IconUsers,
    IconWorld,
    IconArrowLeft,
    IconArrowRight,
    IconRocket,
  } from "@tabler/icons-vue";

  const activeStep = ref(0);

  const quickStartSteps = [
    {
      title: "Sign Up",
      description: "Create your account with your academic email",
      time: "30 seconds",
      icon: IconUserPlus,
      details: [
        "Use your institutional email for verification",
        "Automatic affiliation detection",
        "No credit card required",
        "Instant access to all features",
      ],
    },
    {
      title: "Create Manuscript",
      description: "Choose a template or import existing work",
      time: "1 minute",
      icon: IconFileText,
      details: [
        "Multiple template options available",
        "Import from LaTeX files",
        "Auto-formatted reference sections",
        "Collaborative workspace setup",
      ],
    },
    {
      title: "Start Writing",
      description: "Write in RSM or LaTeX with real-time preview",
      time: "Ongoing",
      icon: IconEdit,
      details: [
        "Switch between RSM and LaTeX seamlessly",
        "Live preview of formatting",
        "Smart auto-completion",
        "Version control built-in",
      ],
    },
    {
      title: "Collaborate",
      description: "Invite co-authors and reviewers",
      time: "2 minutes",
      icon: IconUsers,
      details: [
        "Real-time collaborative editing",
        "Threaded comments and suggestions",
        "Transparent review workflows",
        "Role-based permissions",
      ],
    },
    {
      title: "Publish",
      description: "Beautiful web-native publication",
      time: "1 minute",
      icon: IconWorld,
      details: [
        "Interactive figures and data",
        "Responsive design for all devices",
        "SEO-optimized content",
        "Multiple export formats",
      ],
    },
  ];

  const setActiveStep = (index) => {
    activeStep.value = index;
  };

  const nextStep = () => {
    if (activeStep.value < quickStartSteps.length - 1) {
      activeStep.value++;
    }
  };

  const previousStep = () => {
    if (activeStep.value > 0) {
      activeStep.value--;
    }
  };
</script>

<style scoped>
  /* Quick Start Section */
  .quick-start-section {
    background: linear-gradient(135deg, var(--gray-25) 0%, var(--gray-50) 100%);
    padding: var(--space-4xl) 0;
  }

  .quick-start-content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 700px;
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

  /* Guide Container */
  .guide-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: var(--space-3xl);
  }

  /* Guide Steps */
  .guide-steps {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .guide-step {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 2px solid var(--border-primary);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .guide-step:hover {
    border-color: var(--primary-300);
    transform: translateX(4px);
  }

  .guide-step.active {
    border-color: var(--primary-400);
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    transform: translateX(8px);
    box-shadow: var(--shadow-medium);
  }

  .step-number {
    width: 32px;
    height: 32px;
    background: var(--gray-300);
    color: var(--gray-700);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }

  .guide-step.active .step-number {
    background: var(--primary-500);
    color: var(--white);
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .step-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    line-height: 1.4;
    color: var(--gray-700);
    margin-bottom: var(--space-xs);
  }

  .step-time {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--primary-600);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .step-icon {
    color: var(--gray-500);
    flex-shrink: 0;
  }

  .guide-step.active .step-icon {
    color: var(--primary-600);
  }

  /* Guide Preview */
  .guide-preview {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    box-shadow: var(--shadow-soft);
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-lg);
    border-bottom: 1px solid var(--border-primary);
  }

  .preview-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .preview-progress {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .progress-bar {
    width: 120px;
    height: 6px;
    background: var(--gray-200);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary-500);
    transition: width 0.3s ease;
  }

  .progress-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
    font-weight: 600;
  }

  /* Preview Content */
  .preview-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-xl);
    margin-bottom: var(--space-xl);
  }

  .preview-image {
    background: var(--gray-50);
    border: 2px dashed var(--gray-300);
    border-radius: 12px;
    padding: var(--space-xl);
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Mock Interface Styles */
  .mock-interface {
    width: 100%;
    max-width: 400px;
  }

  .signup-mock {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .form-field label {
    display: block;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-700);
    margin-bottom: var(--space-xs);
  }

  .form-field input {
    width: 100%;
    padding: var(--space-sm);
    border: 1px solid var(--gray-300);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
  }

  .mock-btn {
    padding: var(--space-sm) var(--space-md);
    background: var(--primary-500);
    color: var(--white);
    border: none;
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    cursor: pointer;
  }

  .mock-btn.primary {
    background: var(--success-500);
  }

  .manuscript-mock {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .mock-toolbar {
    display: flex;
    gap: var(--space-sm);
  }

  .mock-toolbar button {
    padding: var(--space-xs) var(--space-sm);
    background: var(--gray-100);
    border: 1px solid var(--gray-300);
    border-radius: 4px;
    font-size: 12px;
  }

  .mock-templates {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .template-card {
    padding: var(--space-sm);
    background: var(--surface-page);
    border: 1px solid var(--gray-300);
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
  }

  .template-card.active {
    border-color: var(--primary-400);
    background: var(--primary-50);
  }

  .editor-mock {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .mock-editor-toolbar {
    display: flex;
    gap: var(--space-xs);
  }

  .mock-editor-toolbar button {
    padding: var(--space-xs) var(--space-sm);
    background: var(--gray-100);
    border: none;
    border-radius: 4px;
    font-size: 12px;
  }

  .mock-editor-content {
    background: var(--surface-page);
    border: 1px solid var(--gray-300);
    border-radius: 6px;
    padding: var(--space-md);
    font-family: "Courier New", monospace;
    font-size: 12px;
    min-height: 150px;
  }

  .mock-line {
    margin-bottom: var(--space-xs);
    color: var(--gray-700);
  }

  .mock-cursor {
    width: 1px;
    height: 16px;
    background: var(--primary-500);
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  .collab-mock {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .mock-collaborators {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .collaborator {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .avatar {
    width: 24px;
    height: 24px;
    background: var(--primary-500);
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
  }

  .mock-changes {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .change-item {
    font-size: 12px;
    color: var(--gray-700);
  }

  .publish-mock {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .mock-preview {
    background: var(--surface-page);
    border: 1px solid var(--gray-300);
    border-radius: 6px;
    padding: var(--space-md);
  }

  .preview-header-mock h4 {
    font-size: 14px;
    margin-bottom: var(--space-xs);
  }

  .preview-header-mock p {
    font-size: 12px;
    color: var(--gray-600);
  }

  .interactive-figure {
    background: var(--primary-50);
    border: 2px dashed var(--primary-300);
    padding: var(--space-md);
    text-align: center;
    font-size: 12px;
    color: var(--primary-600);
  }

  .publish-options {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  /* Preview Details */
  .details-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .details-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .details-list li {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
    margin-bottom: var(--space-sm);
    padding-left: var(--space-lg);
    position: relative;
  }

  .details-list li::before {
    content: "•";
    color: var(--primary-500);
    position: absolute;
    left: 0;
    font-weight: bold;
  }

  /* Preview Actions */
  .preview-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-lg);
    border-top: 1px solid var(--border-primary);
  }

  .btn {
    padding: var(--space-sm) var(--space-lg);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .btn-primary {
    background: var(--primary-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--primary-600);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: var(--gray-100);
    color: var(--gray-700);
    border: 1px solid var(--gray-300);
  }

  .btn-secondary:hover {
    background: var(--gray-200);
    transform: translateY(-1px);
  }

  .btn-success {
    background: var(--success-500);
    color: var(--white);
  }

  .btn-success:hover {
    background: var(--success-600);
    transform: translateY(-1px);
  }

  /* Responsive Adjustments */
  @media (max-width: 1024px) {
    .guide-container {
      grid-template-columns: 250px 1fr;
      gap: var(--space-2xl);
    }

    .preview-content {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }
  }

  @media (max-width: 768px) {
    .quick-start-section {
      padding: var(--space-3xl) 0;
    }

    .guide-container {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .guide-steps {
      flex-direction: row;
      overflow-x: auto;
      padding-bottom: var(--space-sm);
    }

    .guide-step {
      min-width: 200px;
      flex-direction: column;
      text-align: center;
      padding: var(--space-md);
    }

    .guide-step:hover,
    .guide-step.active {
      transform: translateY(-4px);
    }

    .preview-actions {
      flex-direction: column;
      gap: var(--space-md);
    }
  }

  @media (max-width: 480px) {
    .guide-preview {
      padding: var(--space-lg);
    }

    .preview-header {
      flex-direction: column;
      gap: var(--space-md);
      align-items: flex-start;
    }

    .progress-bar {
      width: 100px;
    }

    .mock-interface {
      max-width: 100%;
    }
  }
</style>
