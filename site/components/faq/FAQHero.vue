<template>
  <section class="faq-hero-section" aria-labelledby="faq-hero-heading">
    <div class="hero-content-wrapper">
      <div class="hero-content">
        <h1 id="faq-hero-heading" class="hero-headline">Frequently Asked Questions</h1>
        <p class="hero-subheadline">
          Get answers to common questions about Aris, data ownership, platform comparisons, and
          technical details. Built transparently by researchers, for researchers.
        </p>
        <div class="search-box">
          <div class="search-input-wrapper">
            <IconSearch :size="20" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for answers..."
              class="search-input"
              @input="handleSearch"
            />
          </div>
          <div v-if="searchResults.length > 0" class="search-results">
            <div
              v-for="result in searchResults"
              :key="result.id"
              class="search-result"
              @click="navigateToFAQ(result.section)"
            >
              <h4 class="result-question">{{ result.question }}</h4>
              <p class="result-preview">{{ result.preview }}</p>
            </div>
          </div>
        </div>
        <div class="quick-links">
          <h3 class="quick-links-title">Popular Questions:</h3>
          <div class="quick-link-buttons">
            <button class="quick-link-btn" @click="navigateToFAQ('data-ownership')">
              <IconShield :size="16" />
              Data Ownership
            </button>
            <button class="quick-link-btn" @click="navigateToFAQ('platform-comparison')">
              <IconScale :size="16" />
              vs Overleaf
            </button>
            <button class="quick-link-btn" @click="navigateToFAQ('technical')">
              <IconCode :size="16" />
              Technical Details
            </button>
            <button class="quick-link-btn" @click="navigateToFAQ('institutional')">
              <IconBuilding :size="16" />
              For Institutions
            </button>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="faq-stats">
          <div class="stat-card">
            <div class="stat-number">50+</div>
            <div class="stat-label">Common Questions</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">100%</div>
            <div class="stat-label">Transparent Answers</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">24h</div>
            <div class="stat-label">Response Time</div>
          </div>
        </div>
        <div class="help-illustration">
          <div class="illustration-center">
            <IconQuestionMark :size="48" />
          </div>
          <div class="illustration-bubbles">
            <div class="bubble bubble-1">
              <IconCheck :size="16" />
            </div>
            <div class="bubble bubble-2">
              <IconLightbulb :size="16" />
            </div>
            <div class="bubble bubble-3">
              <IconHeart :size="16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref } from "vue";
  import {
    IconSearch,
    IconShield,
    IconScale,
    IconCode,
    IconBuilding,
    IconQuestionMark,
    IconCheck,
    IconLightbulb,
    IconHeart,
  } from "@tabler/icons-vue";

  const searchQuery = ref("");
  const searchResults = ref([]);

  // Sample FAQ data for search
  const faqData = [
    {
      id: 1,
      question: "Can I export my data if you shut down?",
      preview: "Yes, complete data export is guaranteed. All manuscripts in standard formats...",
      section: "data-ownership",
    },
    {
      id: 2,
      question: "Who owns the IP of my manuscripts?",
      preview: "You own all intellectual property. Aris has no claims to your research...",
      section: "data-ownership",
    },
    {
      id: 3,
      question: "How is this different from Overleaf?",
      preview: "Aris integrates the entire research workflow, not just writing...",
      section: "platform-comparison",
    },
    {
      id: 4,
      question: "What about journal formatting requirements?",
      preview: "RSM compiles to any journal format. LaTeX templates fully supported...",
      section: "technical",
    },
    {
      id: 5,
      question: "Can I use this for grant applications?",
      preview: "Yes, many researchers use Aris for collaborative grant writing...",
      section: "technical",
    },
    {
      id: 6,
      question: "How does institutional pricing work?",
      preview: "Transparent, fair pricing based on active users. Free for individuals...",
      section: "institutional",
    },
  ];

  const handleSearch = () => {
    if (searchQuery.value.length < 2) {
      searchResults.value = [];
      return;
    }

    searchResults.value = faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        faq.preview.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  };

  const navigateToFAQ = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    searchQuery.value = "";
    searchResults.value = [];
  };
</script>

<style scoped>
  /* FAQ Hero Section */
  .faq-hero-section {
    background: linear-gradient(135deg, var(--primary-25) 0%, var(--gray-25) 100%);
    padding: var(--space-4xl) 0;
    min-height: 60vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .hero-content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: var(--space-4xl);
  }

  /* Hero Content */
  .hero-content {
    flex: 1;
    max-width: 700px;
  }

  .hero-headline {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(32px, 8vw, 48px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.1;
  }

  .hero-subheadline {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 20px);
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  /* Search Box */
  .search-box {
    position: relative;
    margin-bottom: var(--space-xl);
  }

  .search-input-wrapper {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--surface-page);
    border: 2px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-md);
    transition: all 0.2s ease;
  }

  .search-input-wrapper:focus-within {
    border-color: var(--primary-400);
    box-shadow: 0 0 0 3px rgba(14, 154, 233, 0.1);
  }

  .search-input-wrapper svg {
    color: var(--gray-500);
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    color: var(--gray-900);
    background: transparent;
  }

  .search-input::placeholder {
    color: var(--gray-500);
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    box-shadow: var(--shadow-medium);
    z-index: 10;
    max-height: 300px;
    overflow-y: auto;
    margin-top: var(--space-xs);
  }

  .search-result {
    padding: var(--space-md);
    border-bottom: 1px solid var(--border-primary);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .search-result:last-child {
    border-bottom: none;
  }

  .search-result:hover {
    background: var(--gray-50);
  }

  .result-question {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .result-preview {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-600);
    margin: 0;
  }

  /* Quick Links */
  .quick-links {
    margin-bottom: var(--space-xl);
  }

  .quick-links-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .quick-link-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .quick-link-btn {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-700);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .quick-link-btn:hover {
    background: var(--primary-50);
    border-color: var(--primary-300);
    color: var(--primary-700);
    transform: translateY(-1px);
  }

  .quick-link-btn svg {
    color: var(--primary-500);
  }

  /* Hero Visual */
  .hero-visual {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2xl);
    min-height: 400px;
  }

  .faq-stats {
    display: flex;
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .stat-card {
    text-align: center;
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    box-shadow: var(--shadow-soft);
    min-width: 100px;
  }

  .stat-number {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: var(--space-xs);
  }

  .stat-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Help Illustration */
  .help-illustration {
    position: relative;
    width: 200px;
    height: 200px;
  }

  .illustration-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border: 3px solid var(--primary-300);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    z-index: 2;
  }

  .illustration-bubbles {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .bubble {
    position: absolute;
    width: 40px;
    height: 40px;
    background: var(--surface-page);
    border: 2px solid var(--success-200);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--success-600);
    animation: float 4s ease-in-out infinite;
  }

  .bubble-1 {
    top: 20px;
    left: 20px;
    animation-delay: 0s;
  }

  .bubble-2 {
    top: 20px;
    right: 20px;
    animation-delay: 1.3s;
  }

  .bubble-3 {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 2.6s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-8px) scale(1.05);
    }
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .faq-hero-section {
      padding: var(--space-3xl) 0;
      min-height: 50vh;
    }

    .hero-content-wrapper {
      flex-direction: column;
      gap: var(--space-2xl);
    }

    .hero-content {
      text-align: center;
      max-width: 100%;
    }

    .hero-visual {
      min-height: 300px;
    }

    .faq-stats {
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);
    }

    .quick-link-buttons {
      justify-content: center;
    }

    .help-illustration {
      width: 150px;
      height: 150px;
    }

    .illustration-center {
      width: 60px;
      height: 60px;
    }

    .bubble {
      width: 32px;
      height: 32px;
    }
  }

  @media (max-width: 480px) {
    .search-input-wrapper {
      padding: var(--space-sm);
    }

    .quick-link-buttons {
      flex-direction: column;
      align-items: center;
    }

    .quick-link-btn {
      width: 100%;
      max-width: 200px;
      justify-content: center;
    }

    .faq-stats {
      width: 100%;
    }

    .stat-card {
      min-width: 80px;
      padding: var(--space-md);
    }

    .stat-number {
      font-size: 20px;
    }
  }
</style>
