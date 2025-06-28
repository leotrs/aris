<template>
  <section class="our-story-section" aria-labelledby="our-story-heading">
    <div class="our-story-content-wrapper">
      <div class="section-header">
        <h2 id="our-story-heading" class="section-title">Our Story</h2>
        <p class="section-subtitle">
          Born from the frustration of researchers who knew there had to be a better way to share scientific knowledge in the digital age.
        </p>
      </div>

      <div class="story-grid">
        <div class="story-content">
          <div class="story-block">
            <div class="story-icon">
              <IconBulb :size="32" />
            </div>
            <h3 class="story-title">The Problem We Saw</h3>
            <p class="story-description">
              Research publishing was stuck in the past—static PDFs, broken collaboration workflows, and barriers between researchers and their audiences. The web had transformed every other industry, but scientific publishing remained unchanged.
            </p>
          </div>

          <div class="story-block">
            <div class="story-icon">
              <IconRocket :size="32" />
            </div>
            <h3 class="story-title">Our Solution</h3>
            <p class="story-description">
              We built Aris as a web-native platform that treats research as living, collaborative documents. Using modern web technologies and semantic markup, we're creating the publishing infrastructure that research deserves.
            </p>
          </div>

          <div class="story-block">
            <div class="story-icon">
              <IconTarget :size="32" />
            </div>
            <h3 class="story-title">Our Mission</h3>
            <p class="story-description">
              To accelerate scientific progress by removing friction from the research lifecycle. Every minute saved in publishing is a minute gained for discovery, collaboration, and breakthrough insights.
            </p>
          </div>
        </div>

        <div class="story-visual">
          <div class="timeline-visual">
            <div class="timeline-item">
              <div class="timeline-year">2024</div>
              <div class="timeline-event">
                <h4 class="event-title">The Idea</h4>
                <p class="event-description">Recognized the need for web-native research publishing</p>
              </div>
            </div>
            <div class="timeline-connector"></div>
            
            <div class="timeline-item">
              <div class="timeline-year">2025</div>
              <div class="timeline-event">
                <h4 class="event-title">Platform Launch</h4>
                <p class="event-description">Built FastAPI backend with Vue.js frontend, launched beta</p>
              </div>
            </div>
            <div class="timeline-connector"></div>
            
            <div class="timeline-item future">
              <div class="timeline-year">2026</div>
              <div class="timeline-event">
                <h4 class="event-title">Research Revolution</h4>
                <p class="event-description">Empowering researchers worldwide with modern tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconBulb, IconRocket, IconTarget } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Our Story Section - Overall Container */
  .our-story-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
    position: relative;
  }

  .our-story-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(28px, 6vw, 42px);
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

  /* Story Grid Layout */
  .story-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4xl);
    align-items: center;
  }

  /* Story Content */
  .story-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }

  .story-block {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-xl);
    transition: all 0.3s ease;
    border-top: 4px solid var(--primary-200);
  }

  .story-block:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
    border-top-color: var(--primary-500);
  }

  .story-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-md);
    background: var(--primary-50);
    color: var(--primary-600);
    transition: all 0.3s ease;
  }

  .story-block:hover .story-icon {
    transform: scale(1.05);
    background: var(--primary-100);
  }

  .story-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .story-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin: 0;
  }

  /* Story Visual - Timeline */
  .story-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .timeline-visual {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 300px;
    width: 100%;
  }

  .timeline-item {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    position: relative;
    z-index: 2;
  }

  .timeline-item.future {
    opacity: 0.7;
  }

  .timeline-year {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 16px;
    flex-shrink: 0;
    box-shadow: var(--shadow-medium);
  }

  .timeline-item.future .timeline-year {
    background: linear-gradient(135deg, var(--gray-400), var(--gray-500));
  }

  .timeline-event {
    flex: 1;
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
  }

  .timeline-event:hover {
    transform: translateX(4px);
    box-shadow: var(--shadow-medium);
  }

  .event-title {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
    line-height: 1.3;
  }

  .event-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-600);
    margin: 0;
  }

  .timeline-connector {
    width: 3px;
    height: 32px;
    background: linear-gradient(180deg, var(--primary-300), var(--primary-400));
    margin: 0 auto;
    margin-left: calc(40px - 1.5px);
    border-radius: 2px;
    z-index: 1;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .our-story-section {
      padding: var(--space-3xl) 0;
    }

    .story-grid {
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    .story-visual {
      order: -1;
      min-height: 300px;
    }

    .timeline-visual {
      max-width: 280px;
    }

    .timeline-year {
      width: 60px;
      height: 60px;
      font-size: 14px;
    }

    .timeline-event {
      padding: var(--space-md);
    }

    .event-title {
      font-size: 16px;
    }

    .event-description {
      font-size: 13px;
    }

    .timeline-connector {
      height: 24px;
      margin-left: calc(30px - 1.5px);
    }

    .story-block {
      padding: var(--space-lg);
    }

    .story-icon {
      width: 48px;
      height: 48px;
    }

    .story-title {
      font-size: 18px;
    }

    .story-description {
      font-size: 15px;
    }
  }

  @media (max-width: 480px) {
    .timeline-visual {
      max-width: 260px;
    }

    .timeline-item {
      gap: var(--space-md);
    }

    .timeline-year {
      width: 50px;
      height: 50px;
      font-size: 12px;
    }

    .timeline-connector {
      margin-left: calc(25px - 1.5px);
    }
  }
</style>