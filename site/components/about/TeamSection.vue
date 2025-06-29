<template>
  <section class="team-section" aria-labelledby="team-heading">
    <div class="team-content-wrapper">
      <div class="section-header">
        <h2 id="team-heading" class="section-title">The Founder</h2>
        <p class="section-subtitle">
          Building the future of scientific publishing, one feature at a time.
        </p>
      </div>

      <div class="founder-spotlight">
        <div class="founder-card">
          <div class="founder-avatar">
            <div class="avatar-placeholder">
              <IconUser :size="64" />
            </div>
          </div>
          <div class="founder-content">
            <h3 class="founder-name">Solo Founder</h3>
            <p class="founder-role">Founder & Everything</p>
            <p class="founder-story">
              Frustrated by the state of scientific publishing and convinced there's a better way,
              I'm building Aris as a web-native platform that treats research as living,
              collaborative documents. Combining technical expertise with a deep understanding of
              researcher needs.
            </p>
            <div class="founder-skills">
              <div class="skill-category">
                <h4 class="skill-title">Technical</h4>
                <div class="skills-list">
                  <span class="skill-tag">FastAPI</span>
                  <span class="skill-tag">Vue.js</span>
                  <span class="skill-tag">Python</span>
                  <span class="skill-tag">TypeScript</span>
                </div>
              </div>
              <div class="skill-category">
                <h4 class="skill-title">Domain</h4>
                <div class="skills-list">
                  <span class="skill-tag">Research Operations</span>
                  <span class="skill-tag">Scientific Publishing</span>
                  <span class="skill-tag">Web Standards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="team-grid">
        <div class="join-team-card">
          <div class="join-icon">
            <IconPlus :size="48" />
          </div>
          <h3 class="join-title">Join Our Mission</h3>
          <p class="join-description">
            We're looking for passionate individuals who want to revolutionize how research is
            shared and consumed. Come help us build the future of scientific publishing.
          </p>
          <a href="/careers" class="join-cta">
            View Open Positions
            <IconArrowRight :size="20" />
          </a>
        </div>
      </div>

      <div class="team-values">
        <h3 class="values-title">What We Believe</h3>
        <div class="values-grid">
          <div class="value-item">
            <div class="value-icon">
              <IconHeart :size="28" />
            </div>
            <h4 class="value-name">Research First</h4>
            <p class="value-description">
              Every decision prioritizes the researcher's needs and workflow.
            </p>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <IconUsers :size="28" />
            </div>
            <h4 class="value-name">Open Collaboration</h4>
            <p class="value-description">Science advances through connection, not competition.</p>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <IconBolt :size="28" />
            </div>
            <h4 class="value-name">Move Fast</h4>
            <p class="value-description">Research moves quickly; our tools should too.</p>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <IconShield :size="28" />
            </div>
            <h4 class="value-name">Quality Standards</h4>
            <p class="value-description">High standards in code, design, and research integrity.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconUser,
    IconCode,
    IconPalette,
    IconPlus,
    IconArrowRight,
    IconHeart,
    IconUsers,
    IconBolt,
    IconShield,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Team Section - Overall Container */
  .team-section {
    background: var(--gray-25);
    padding: var(--space-4xl) 0;
    position: relative;
  }

  .team-content-wrapper {
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

  /* Founder Spotlight */
  .founder-spotlight {
    margin-bottom: var(--space-4xl);
  }

  .founder-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 20px;
    padding: var(--space-3xl);
    box-shadow: var(--shadow-medium);
    border-top: 6px solid var(--primary-500);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-2xl);
    align-items: center;
    max-width: 900px;
    margin: 0 auto;
    transition: all 0.3s ease;
  }

  .founder-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-large);
  }

  /* Founder Avatar */
  .founder-avatar {
    display: flex;
    justify-content: center;
  }

  .founder-card .avatar-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    transition: all 0.3s ease;
    box-shadow: var(--shadow-medium);
  }

  .founder-card:hover .avatar-placeholder {
    transform: scale(1.05);
  }

  /* Founder Content */
  .founder-content {
    text-align: left;
  }

  .founder-name {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
    line-height: 1.2;
  }

  .founder-role {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-600);
    margin-bottom: var(--space-lg);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .founder-story {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  /* Founder Skills */
  .founder-skills {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
  }

  .skill-category {
    margin-bottom: var(--space-md);
  }

  .skill-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: var(--space-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .skill-tag {
    background: var(--primary-50);
    color: var(--primary-700);
    padding: var(--space-xs) var(--space-sm);
    border-radius: 14px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid var(--primary-200);
  }

  /* Team Grid */
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  /* Join Team Card */
  .join-team-card {
    background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
    border: 1px solid var(--primary-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
    transition: all 0.3s ease;
    border-top: 4px solid var(--primary-500);
  }

  .join-team-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .join-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--primary-500);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    margin: 0 auto var(--space-lg);
    transition: all 0.3s ease;
  }

  .join-team-card:hover .join-icon {
    transform: scale(1.05);
    background: var(--primary-600);
  }

  .join-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .join-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
    text-align: left;
  }

  .join-cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--primary-500);
    color: var(--white);
    padding: var(--space-md) var(--space-lg);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .join-cta:hover {
    background: var(--primary-600);
    transform: translateY(-1px);
  }

  /* Team Values */
  .team-values {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    box-shadow: var(--shadow-soft);
  }

  .values-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xl);
    text-align: center;
    line-height: 1.3;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--space-xl);
  }

  .value-item {
    text-align: center;
  }

  .value-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: var(--primary-50);
    color: var(--primary-600);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    transition: all 0.3s ease;
  }

  .value-item:hover .value-icon {
    transform: scale(1.05);
    background: var(--primary-100);
  }

  .value-name {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
    line-height: 1.3;
  }

  .value-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-600);
    margin: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .team-section {
      padding: var(--space-3xl) 0;
    }

    .founder-card {
      grid-template-columns: 1fr;
      text-align: center;
      padding: var(--space-2xl);
      gap: var(--space-xl);
    }

    .founder-card .avatar-placeholder {
      width: 100px;
      height: 100px;
    }

    .founder-name {
      font-size: 24px;
    }

    .founder-role {
      font-size: 16px;
    }

    .founder-skills {
      grid-template-columns: 1fr;
      gap: var(--space-md);
    }

    .team-grid {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .join-team-card {
      padding: var(--space-xl);
    }

    .join-icon {
      width: 64px;
      height: 64px;
    }

    .join-title {
      font-size: 18px;
    }

    .values-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-lg);
    }

    .value-icon {
      width: 48px;
      height: 48px;
    }
  }

  @media (max-width: 480px) {
    .founder-card {
      padding: var(--space-lg);
    }

    .founder-card .avatar-placeholder {
      width: 80px;
      height: 80px;
    }

    .founder-name {
      font-size: 20px;
    }

    .founder-story {
      font-size: 15px;
    }

    .join-team-card,
    .team-values {
      padding: var(--space-lg);
    }

    .values-grid {
      grid-template-columns: 1fr;
      gap: var(--space-md);
    }

    .join-description {
      text-align: center;
    }
  }
</style>
