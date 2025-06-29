<template>
  <section class="open-science-hero-section" aria-labelledby="open-science-hero-heading">
    <div class="hero-content-wrapper">
      <div class="hero-content">
        <h1 id="open-science-hero-heading" class="hero-headline">
          Built on Principles of Open Science
        </h1>
        <p class="hero-subheadline">
          100% open source infrastructure for transparent, ethical research publishing. No
          shareholders, no paywalls, no compromise—just tools that serve the academic community.
        </p>
        <div class="principles-preview">
          <div class="principle-badge">
            <IconCode :size="20" />
            <span>100% Open Source</span>
          </div>
          <div class="principle-badge">
            <IconScale :size="20" />
            <span>Transparent Governance</span>
          </div>
          <div class="principle-badge">
            <IconHeart :size="20" />
            <span>Community Driven</span>
          </div>
          <div class="principle-badge">
            <IconShield :size="20" />
            <span>Ethics First</span>
          </div>
        </div>
        <div class="hero-ctas">
          <a href="https://github.com/aris-platform" class="btn btn-primary">
            <IconBrandGithub :size="18" />
            <span>View Source Code</span>
          </a>
          <a href="#commitment" class="btn btn-secondary">Learn Our Values</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="open-source-diagram">
          <div class="central-hub">
            <IconCode :size="40" />
            <span class="hub-label">Aris Platform</span>
          </div>
          <div class="contribution-nodes">
            <div class="node researchers">
              <IconUsers :size="24" />
              <span>Researchers</span>
            </div>
            <div class="node developers">
              <IconTerminal :size="24" />
              <span>Developers</span>
            </div>
            <div class="node institutions">
              <IconBuilding :size="24" />
              <span>Institutions</span>
            </div>
            <div class="node community">
              <IconWorld :size="24" />
              <span>Community</span>
            </div>
          </div>
          <div class="connection-lines">
            <div class="line line-1"></div>
            <div class="line line-2"></div>
            <div class="line line-3"></div>
            <div class="line line-4"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconCode,
    IconScale,
    IconHeart,
    IconShield,
    IconBrandGithub,
    IconUsers,
    IconTerminal,
    IconBuilding,
    IconWorld,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Open Science Hero Section */
  .open-science-hero-section {
    background: linear-gradient(135deg, var(--success-25) 0%, var(--primary-25) 100%);
    padding: var(--space-4xl) 0;
    min-height: 70vh;
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
    max-width: 600px;
  }

  .hero-headline {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(32px, 8vw, 56px);
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

  /* Principles Preview */
  .principles-preview {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin-bottom: var(--space-xl);
  }

  .principle-badge {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    background: var(--surface-page);
    border: 1px solid var(--success-200);
    border-radius: 20px;
    padding: var(--space-sm) var(--space-md);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--success-700);
    box-shadow: var(--shadow-soft);
  }

  .principle-badge svg {
    color: var(--success-600);
  }

  /* Hero CTAs */
  .hero-ctas {
    display: flex;
    gap: var(--space-lg);
    flex-wrap: wrap;
  }

  .btn {
    padding: var(--space-md) var(--space-xl);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    min-width: 160px;
    justify-content: center;
  }

  .btn-primary {
    background: var(--success-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--success-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.35);
  }

  .btn-secondary {
    background: var(--white);
    color: var(--success-600);
    border: 2px solid var(--success-300);
  }

  .btn-secondary:hover {
    background: var(--success-50);
    border-color: var(--success-400);
    transform: translateY(-2px);
  }

  /* Hero Visual */
  .hero-visual {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .open-source-diagram {
    position: relative;
    width: 350px;
    height: 350px;
  }

  .central-hub {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    border: 3px solid var(--success-300);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    color: var(--success-700);
    z-index: 3;
  }

  .hub-label {
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }

  .contribution-nodes {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .node {
    position: absolute;
    width: 80px;
    height: 80px;
    background: var(--surface-page);
    border: 2px solid var(--primary-200);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: var(--primary-600);
    font-family: "Source Sans 3", sans-serif;
    font-size: 10px;
    font-weight: 600;
    text-align: center;
    z-index: 2;
    animation: float 6s ease-in-out infinite;
  }

  .node.researchers {
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 0s;
  }

  .node.developers {
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    animation-delay: 1.5s;
  }

  .node.institutions {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 3s;
  }

  .node.community {
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    animation-delay: 4.5s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(-2px, -4px) scale(1.05);
    }
  }

  .connection-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .line {
    position: absolute;
    background: linear-gradient(var(--success-200), var(--success-300));
    opacity: 0.6;
  }

  .line-1 {
    top: 80px;
    left: 50%;
    width: 2px;
    height: 80px;
    transform: translateX(-50%);
  }

  .line-2 {
    top: 50%;
    right: 80px;
    width: 80px;
    height: 2px;
    transform: translateY(-50%);
  }

  .line-3 {
    bottom: 80px;
    left: 50%;
    width: 2px;
    height: 80px;
    transform: translateX(-50%);
  }

  .line-4 {
    top: 50%;
    left: 80px;
    width: 80px;
    height: 2px;
    transform: translateY(-50%);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .open-science-hero-section {
      padding: var(--space-3xl) 0;
      min-height: 60vh;
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

    .open-source-diagram {
      width: 280px;
      height: 280px;
    }

    .central-hub {
      width: 100px;
      height: 100px;
    }

    .node {
      width: 60px;
      height: 60px;
      font-size: 9px;
    }

    .hero-ctas {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .hero-content {
      text-align: center;
    }

    .principles-preview {
      justify-content: center;
    }

    .principle-badge {
      font-size: 12px;
      padding: var(--space-xs) var(--space-sm);
    }

    .hero-ctas {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 250px;
    }

    .open-source-diagram {
      width: 240px;
      height: 240px;
    }

    .central-hub {
      width: 80px;
      height: 80px;
    }

    .node {
      width: 50px;
      height: 50px;
      font-size: 8px;
    }
  }
</style>
