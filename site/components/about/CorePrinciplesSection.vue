<template>
  <section class="core-principles-section" aria-labelledby="principles-heading">
    <div class="principles-content-wrapper">
      <div class="section-header">
        <h2 id="principles-heading" class="section-title">Core Principles in Action</h2>
        <p class="section-subtitle">
          These foundational concepts guide everything we build, ensuring research remains human
          while leveraging the best of modern technology.
        </p>
      </div>

      <div class="principles-grid">
        <div class="principle-card" data-principle="stories">
          <div class="card-icon">
            <IconBook2 :size="40" />
          </div>
          <h3 class="card-title">Stories of Science</h3>
          <p class="card-description">
            Research is fundamentally about discovery narratives. Our platform preserves and
            celebrates the human story behind every scientific breakthrough—the curiosity, setbacks,
            insights, and "aha!" moments that drive progress.
          </p>
          <div class="card-details">
            <div class="detail-item">
              <div class="detail-icon">
                <IconFileText :size="20" />
              </div>
              <span class="detail-text">Preserve research narratives</span>
            </div>
            <div class="detail-item">
              <div class="detail-icon">
                <IconTarget :size="20" />
              </div>
              <span class="detail-text">Connect purpose to process</span>
            </div>
            <div class="detail-item">
              <div class="detail-icon">
                <IconStar :size="20" />
              </div>
              <span class="detail-text">Celebrate human insight</span>
            </div>
          </div>
        </div>

        <div class="principle-card" data-principle="resops">
          <div class="card-icon">
            <IconSettings :size="40" />
          </div>
          <h3 class="card-title">Research Operations</h3>
          <p class="card-description">
            Just as DevOps revolutionized software development, ResOps streamlines research
            workflows. We eliminate operational friction—version control chaos, collaboration
            overhead, publishing bottlenecks—so you can focus on discovery.
          </p>
          <div class="card-details">
            <div class="detail-item">
              <div class="detail-icon">
                <IconBolt :size="20" />
              </div>
              <span class="detail-text">Streamlined workflows</span>
            </div>
            <div class="detail-item">
              <div class="detail-icon">
                <IconRefresh :size="20" />
              </div>
              <span class="detail-text">Seamless version control</span>
            </div>
            <div class="detail-item">
              <div class="detail-icon">
                <IconTrendingUp :size="20" />
              </div>
              <span class="detail-text">Optimized productivity</span>
            </div>
          </div>
        </div>

        <div class="principle-card" data-principle="collaboration">
          <div class="card-icon">
            <IconUsers :size="40" />
          </div>
          <h3 class="card-title">Intelligent Collaboration</h3>
          <p class="card-description">
            Our AI Copilot doesn't generate content—it facilitates human connections. From semantic
            change tracking to smart reviewer recommendations, technology serves as the bridge
            between brilliant minds working toward shared understanding.
          </p>
          <div class="card-details">
            <div class="detail-item">
              <div class="detail-icon">
                <IconRobot :size="20" />
              </div>
              <span class="detail-text">Human-AI partnership</span>
            </div>
            <div class="detail-item">
              <div class="detail-icon">
                <IconMessageCircle :size="20" />
              </div>
              <span class="detail-text">Meaningful feedback</span>
            </div>
            <div class="detail-item">
              <div class="detail-icon">
                <IconLink :size="20" />
              </div>
              <span class="detail-text">Connected communities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconBook2,
    IconFileText,
    IconTarget,
    IconStar,
    IconSettings,
    IconBolt,
    IconRefresh,
    IconTrendingUp,
    IconUsers,
    IconRobot,
    IconMessageCircle,
    IconLink,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Core Principles Section - Overall Container */
  .core-principles-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
    position: relative;
  }

  .principles-content-wrapper {
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

  /* Principles Grid */
  .principles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-2xl);
    margin-top: var(--space-3xl);
  }

  /* Principle Cards */
  .principle-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-2xl);
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .principle-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .principle-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .principle-card:hover::before {
    opacity: 1;
  }

  .principle-card[data-principle="stories"]::before {
    background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
  }

  .principle-card[data-principle="resops"]::before {
    background: linear-gradient(90deg, var(--secondary-500), var(--secondary-600));
  }

  .principle-card[data-principle="collaboration"]::before {
    background: linear-gradient(90deg, var(--success-500), var(--success-600));
  }

  /* Card Icon */
  .card-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-lg);
    color: var(--primary-600);
    transition: all 0.3s ease;
  }

  .principle-card[data-principle="resops"] .card-icon {
    background: linear-gradient(135deg, var(--secondary-100), var(--secondary-200));
    color: var(--secondary-600);
  }

  .principle-card[data-principle="collaboration"] .card-icon {
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    color: var(--success-600);
  }

  .principle-card:hover .card-icon {
    transform: scale(1.1);
  }

  /* Card Content */
  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  /* Card Details */
  .card-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-xs) 0;
  }

  .detail-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--gray-600);
  }

  .detail-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-600);
    line-height: 1.4;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .core-principles-section {
      padding: var(--space-3xl) 0;
    }

    .principles-grid {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .principle-card {
      padding: var(--space-xl);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .card-title {
      font-size: 20px;
    }
  }

  @media (max-width: 480px) {
    .principle-card {
      padding: var(--space-lg);
    }

    .card-icon {
      width: 48px;
      height: 48px;
    }

    .card-title {
      font-size: 18px;
    }

    .card-description {
      font-size: 15px;
    }
  }
</style>
