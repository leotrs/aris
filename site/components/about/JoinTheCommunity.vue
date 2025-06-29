<template>
  <section class="join-community-section" aria-labelledby="community-heading">
    <div class="community-content-wrapper">
      <div class="section-header">
        <h2 id="community-heading" class="section-title">Join the Community Building the Future</h2>
        <p class="section-subtitle">
          Researchers, developers, and institutions working together to create better tools for
          academic communication. Every voice matters in shaping the future of research publishing.
        </p>
      </div>

      <div class="community-grid">
        <div class="community-path">
          <div class="path-icon">
            <IconUsers :size="40" />
          </div>
          <h3 class="path-title">For Researchers</h3>
          <p class="path-description">
            Get early access to next-generation publishing tools. Share your workflow insights and
            help design features that actually solve real research challenges.
          </p>
          <div class="path-benefits">
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Beta platform access</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Direct input on features</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Connect with like-minded researchers</span>
            </div>
          </div>
          <div class="path-action">
            <a href="/beta-signup" class="btn btn-primary">Join Beta Program</a>
          </div>
        </div>

        <div class="community-path">
          <div class="path-icon">
            <IconCode :size="40" />
          </div>
          <h3 class="path-title">For Developers</h3>
          <p class="path-description">
            Contribute to open-source infrastructure that impacts global research. Work on
            challenging problems with real academic and technical depth.
          </p>
          <div class="path-benefits">
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Open source contributions</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Collaborate with research community</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Build tools that matter</span>
            </div>
          </div>
          <div class="path-action">
            <a href="https://github.com/aris-platform" class="btn btn-secondary">
              <IconBrandGithub :size="16" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        <div class="community-path">
          <div class="path-icon">
            <IconBuilding :size="40" />
          </div>
          <h3 class="path-title">For Institutions</h3>
          <p class="path-description">
            Partner with us to create sustainable infrastructure for your researchers. Join the
            growing network of institutions shaping academic publishing.
          </p>
          <div class="path-benefits">
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Institutional reviewer networks</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Sustainable funding model</span>
            </div>
            <div class="benefit-item">
              <IconCheck :size="16" />
              <span>Governance participation</span>
            </div>
          </div>
          <div class="path-action">
            <a href="/institutions" class="btn btn-secondary">Learn About Partnerships</a>
          </div>
        </div>
      </div>

      <div class="community-stats">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">Beta Researchers</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50+</div>
            <div class="stat-label">Contributing Institutions</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Open Source</div>
          </div>
        </div>
      </div>

      <div class="community-cta">
        <h3 class="cta-title">Ready to Get Started?</h3>
        <p class="cta-description">
          Choose your path to join the community building the future of academic publishing.
        </p>
        <div class="cta-buttons">
          <a href="/beta-signup" class="btn btn-primary btn-large">Start Your Beta Journey</a>
          <a href="/community" class="btn btn-secondary btn-large">Explore Community</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconUsers, IconCode, IconBuilding, IconCheck, IconBrandGithub } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Join Community Section - Overall Container */
  .join-community-section {
    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
    padding: var(--space-4xl) 0;
    color: var(--white);
    position: relative;
    overflow: hidden;
  }

  .join-community-section::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.3;
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
  }

  .community-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    position: relative;
    z-index: 1;
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
    color: var(--white);
    margin-bottom: var(--space-lg);
    line-height: 1.2;
  }

  .section-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
  }

  /* Community Grid */
  .community-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  /* Community Paths */
  .community-path {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
    transition: all 0.3s ease;
  }

  .community-path:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .path-icon {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-lg);
    color: var(--white);
    transition: all 0.3s ease;
  }

  .community-path:hover .path-icon {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.3);
  }

  .path-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .path-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: var(--space-lg);
  }

  /* Path Benefits */
  .path-benefits {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-xl);
    align-items: center;
  }

  .benefit-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }

  .benefit-item svg {
    color: rgba(255, 255, 255, 0.8);
    flex-shrink: 0;
  }

  /* Path Actions */
  .path-action {
    margin-top: var(--space-lg);
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
    justify-content: center;
    gap: var(--space-sm);
    min-width: 160px;
    text-align: center;
  }

  .btn-primary {
    background: var(--white);
    color: var(--primary-600);
  }

  .btn-primary:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .btn-secondary {
    background: transparent;
    color: var(--white);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  .btn-large {
    padding: var(--space-lg) var(--space-2xl);
    font-size: 18px;
    min-width: 200px;
  }

  /* Community Stats */
  .community-stats {
    margin-bottom: var(--space-4xl);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-xl);
    max-width: 600px;
    margin: 0 auto;
  }

  .stat-item {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: var(--space-lg);
    backdrop-filter: blur(10px);
  }

  .stat-number {
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--white);
    margin-bottom: var(--space-xs);
    line-height: 1;
  }

  .stat-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }

  /* Community CTA */
  .community-cta {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .cta-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: var(--space-md);
  }

  .cta-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: var(--space-xl);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-buttons {
    display: flex;
    gap: var(--space-lg);
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .join-community-section {
      padding: var(--space-3xl) 0;
    }

    .community-grid {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .community-path {
      padding: var(--space-xl);
    }

    .path-icon {
      width: 64px;
      height: 64px;
    }

    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-md);
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .btn-large {
      width: 100%;
      max-width: 250px;
    }
  }

  @media (max-width: 480px) {
    .community-path {
      padding: var(--space-lg);
    }

    .path-icon {
      width: 56px;
      height: 56px;
    }

    .path-title {
      font-size: 20px;
    }

    .community-cta {
      padding: var(--space-xl);
    }

    .cta-title {
      font-size: 24px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: var(--space-sm);
    }

    .stat-number {
      font-size: 28px;
    }
  }
</style>
