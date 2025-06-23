<script setup>
  import { ref } from "vue";

  const openItems = ref(new Set());

  const toggleItem = (index) => {
    if (openItems.value.has(index)) {
      openItems.value.delete(index);
    } else {
      openItems.value.add(index);
    }
  };

  const faqs = [
    {
      question: "How does Aris relate to LaTeX and PDF?",
      answer:
        "Aris isn't a replacement for LaTeX or PDF — they serve different purposes. LaTeX and PDF focus on typesetting for print media. Aris is built specifically for web-native research documents with features like threaded comments, responsive design, and real-time collaboration that aren't possible in static formats.",
    },
    {
      question: "What is RSM and how is it different from Markdown or LaTeX?",
      answer:
        "RSM (Redable Science Markup) is a semantic markup language focused on meaning rather than presentation. Unlike LaTeX which combines content with typesetting commands, RSM separates content structure from visual styling. This enables responsive design, accessibility features, and content reuse across different formats. Typesetting in Aris is handled via web-native standards (i.e. CSS and JS).",
    },
    {
      question: "Can I export my Aris documents to traditional formats?",
      answer:
        "Yes! While Aris documents are designed to be web-native, you can export to various formats when needed for journal submissions or other requirements. The semantic structure of RSM makes it easier to generate clean exports.",
    },
    {
      question: "How does collaboration work in Aris?",
      answer:
        "Collaboration happens in real-time with threaded comments tied to specific sections of your document. Multiple authors can edit simultaneously with automatic conflict resolution and version tracking. Reviewers can leave contextual feedback without disrupting the writing flow.",
    },
    {
      question: "Is Aris suitable for all types of research?",
      answer:
        "Aris is designed for research that benefits from web-native features — interactive figures, threaded discussions, responsive reading, and semantic search. It's particularly valuable for collaborative research and when you want to engage readers beyond static text.",
    },
    {
      question: "How do I get started with Aris?",
      answer:
        "You can begin with our guided demo to see Aris in action, then start with a simple document to learn RSM markup. We provide templates and examples for common research formats to help you transition smoothly.",
    },
  ];
</script>

<template>
  <section class="section-container section-light-gray">
    <div class="faq-header text-center">
      <p class="section-label">FAQ</p>
      <h2 class="section-heading">Common questions about web-native research</h2>
      <p class="section-text">
        We understand that moving to a new platform involves questions. Here are answers to what
        researchers ask most often.
      </p>
    </div>

    <div class="faq-list">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="faq-item"
        :class="{ 'faq-item--open': openItems.has(index) }"
      >
        <button
          class="faq-question"
          :aria-expanded="openItems.has(index)"
          :aria-controls="`faq-answer-${index}`"
          @click="toggleItem(index)"
        >
          <span>{{ faq.question }}</span>
          <svg
            class="faq-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>
        <div
          :id="`faq-answer-${index}`"
          class="faq-answer"
          :class="{ 'faq-answer--open': openItems.has(index) }"
        >
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .faq-header {
    margin-bottom: 3rem;
  }

  .faq-list {
    max-width: 800px;
    margin: 0 auto;
  }

  .faq-item {
    border-bottom: 1px solid var(--gray-200);
  }

  .faq-item:last-child {
    border-bottom: none;
  }

  .faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 0;
    background: none;
    border: none;
    text-align: left;
    font-size: 1.125rem;
    font-weight: var(--weight-semi);
    color: var(--gray-900);
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .faq-question:hover {
    color: var(--primary-600);
  }

  .faq-question:focus-visible {
    outline: 2px solid var(--primary-300);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .faq-icon {
    flex-shrink: 0;
    margin-left: 1rem;
    transition: transform 0.3s ease;
    color: var(--gray-500);
  }

  .faq-item--open .faq-icon {
    transform: rotate(180deg);
  }

  .faq-answer {
    overflow: hidden;
    max-height: 0;
    transition:
      max-height 0.3s ease,
      padding 0.3s ease;
  }

  .faq-answer--open {
    max-height: 200px;
    padding-bottom: 1.5rem;
  }

  .faq-answer p {
    margin: 0;
    line-height: 1.6;
    color: var(--gray-700);
    max-width: none;
  }

  @media (max-width: 768px) {
    .faq-header {
      margin-bottom: 2rem;
    }

    .faq-question {
      padding: 1rem 0;
      font-size: 1rem;
    }

    .faq-answer--open {
      padding-bottom: 1rem;
    }
  }
</style>
