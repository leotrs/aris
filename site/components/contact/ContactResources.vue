<template>
  <section class="contact-resources-section" aria-labelledby="contact-resources-heading">
    <div class="contact-resources-content-wrapper">
      <div class="section-header">
        <h2 id="contact-resources-heading" class="section-title">Self-Service Resources</h2>
        <p class="section-subtitle">
          Find answers instantly with our comprehensive documentation, guides, and resources. Most
          questions can be resolved quickly with these self-service options.
        </p>
      </div>

      <div class="resources-grid">
        <div class="resource-card featured">
          <div class="card-icon">
            <IconBook :size="32" />
          </div>
          <h3 class="card-title">Documentation Hub</h3>
          <p class="card-description">
            Complete documentation covering all aspects of Aris, from getting started to advanced
            integrations and troubleshooting.
          </p>
          <div class="resource-sections">
            <div class="section-item">
              <IconRocket :size="16" />
              <span>Quick Start Guide</span>
            </div>
            <div class="section-item">
              <IconCode :size="16" />
              <span>RSM Syntax Reference</span>
            </div>
            <div class="section-item">
              <IconPlugConnected :size="16" />
              <span>Integration Tutorials</span>
            </div>
            <div class="section-item">
              <IconTool :size="16" />
              <span>Troubleshooting</span>
            </div>
          </div>
          <div class="card-actions">
            <a href="/docs" class="btn btn-primary">
              <IconExternalLink :size="16" />
              Browse Documentation
            </a>
            <div class="resource-meta">
              <IconSearch :size="14" />
              <span>Searchable knowledge base</span>
            </div>
          </div>
        </div>

        <div class="resource-card">
          <div class="card-icon">
            <IconVideo :size="32" />
          </div>
          <h3 class="card-title">Video Tutorials</h3>
          <p class="card-description">
            Step-by-step video guides covering common workflows, features, and best practices for
            academic publishing with Aris.
          </p>
          <div class="video-stats">
            <div class="video-stat">
              <IconPlay :size="16" />
              <span>25+ tutorials</span>
            </div>
            <div class="video-stat">
              <IconClock :size="16" />
              <span>5-15 min each</span>
            </div>
            <div class="video-stat">
              <IconSubtitles :size="16" />
              <span>Closed captions</span>
            </div>
          </div>
          <div class="featured-videos">
            <div class="video-item">
              <div class="video-thumbnail">
                <IconPlay :size="20" />
              </div>
              <div class="video-info">
                <span class="video-title">Your First Manuscript</span>
                <span class="video-duration">8:30</span>
              </div>
            </div>
            <div class="video-item">
              <div class="video-thumbnail">
                <IconPlay :size="20" />
              </div>
              <div class="video-info">
                <span class="video-title">Collaboration Workflows</span>
                <span class="video-duration">12:15</span>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <a href="/tutorials" class="btn btn-secondary">
              <IconExternalLink :size="16" />
              Watch Tutorials
            </a>
          </div>
        </div>

        <div class="resource-card">
          <div class="card-icon">
            <IconQuestionMark :size="32" />
          </div>
          <h3 class="card-title">FAQ</h3>
          <p class="card-description">
            Answers to the most frequently asked questions about Aris features, workflows, data
            ownership, and technical requirements.
          </p>
          <div class="faq-categories">
            <div class="faq-category">
              <IconShield :size="16" />
              <span>Data & Privacy</span>
            </div>
            <div class="faq-category">
              <IconUsers :size="16" />
              <span>Collaboration</span>
            </div>
            <div class="faq-category">
              <IconSettings :size="16" />
              <span>Technical Setup</span>
            </div>
            <div class="faq-category">
              <IconBuilding :size="16" />
              <span>Institutional</span>
            </div>
          </div>
          <div class="card-actions">
            <a href="/faq" class="btn btn-secondary">
              <IconExternalLink :size="16" />
              View FAQ
            </a>
          </div>
        </div>

        <div class="resource-card">
          <div class="card-icon">
            <IconBrandGithub :size="32" />
          </div>
          <h3 class="card-title">GitHub Repository</h3>
          <p class="card-description">
            Access the source code, report issues, contribute to development, and stay updated with
            the latest releases and changes.
          </p>
          <div class="github-stats">
            <div class="github-stat">
              <IconGitBranch :size="16" />
              <span>Open source</span>
            </div>
            <div class="github-stat">
              <IconBug :size="16" />
              <span>Issue tracking</span>
            </div>
            <div class="github-stat">
              <IconGitCommit :size="16" />
              <span>Active development</span>
            </div>
          </div>
          <div class="card-actions">
            <a href="https://github.com/aris-platform/aris" class="btn btn-secondary">
              <IconExternalLink :size="16" />
              View on GitHub
            </a>
          </div>
        </div>

        <div class="resource-card">
          <div class="card-icon">
            <IconMessageSquare :size="32" />
          </div>
          <h3 class="card-title">Status Page</h3>
          <p class="card-description">
            Real-time platform status, scheduled maintenance notifications, and historical uptime
            data to keep you informed.
          </p>
          <div class="status-indicators">
            <div class="status-item">
              <div class="status-dot operational"></div>
              <span>Platform: Operational</span>
            </div>
            <div class="status-item">
              <div class="status-dot operational"></div>
              <span>API: Operational</span>
            </div>
            <div class="status-item">
              <div class="status-dot operational"></div>
              <span>Storage: Operational</span>
            </div>
          </div>
          <div class="card-actions">
            <a href="https://status.aris-platform.org" class="btn btn-secondary">
              <IconExternalLink :size="16" />
              Check Status
            </a>
          </div>
        </div>

        <div class="resource-card">
          <div class="card-icon">
            <IconNewspaper :size="32" />
          </div>
          <h3 class="card-title">Blog & Updates</h3>
          <p class="card-description">
            Development updates, feature announcements, academic publishing insights, and community
            stories from researchers using Aris.
          </p>
          <div class="blog-preview">
            <div class="blog-post">
              <span class="post-title">RSM 2.0: Enhanced Collaboration</span>
              <span class="post-date">2 days ago</span>
            </div>
            <div class="blog-post">
              <span class="post-title">Spotlight: Dr. Chen's Research</span>
              <span class="post-date">1 week ago</span>
            </div>
          </div>
          <div class="card-actions">
            <a href="/blog" class="btn btn-secondary">
              <IconExternalLink :size="16" />
              Read Blog
            </a>
          </div>
        </div>
      </div>

      <div class="quick-links">
        <div class="quick-links-content">
          <h3 class="quick-links-title">Quick Access</h3>
          <div class="links-grid">
            <a href="/docs/getting-started" class="quick-link">
              <IconRocket :size="20" />
              <span>Getting Started</span>
            </a>
            <a href="/docs/rsm-syntax" class="quick-link">
              <IconCode :size="20" />
              <span>RSM Syntax</span>
            </a>
            <a href="/docs/integrations" class="quick-link">
              <IconPlugConnected :size="20" />
              <span>Integrations</span>
            </a>
            <a href="/security" class="quick-link">
              <IconShield :size="20" />
              <span>Security</span>
            </a>
            <a href="/docs/api" class="quick-link">
              <IconApi :size="20" />
              <span>API Reference</span>
            </a>
            <a href="/docs/troubleshooting" class="quick-link">
              <IconTool :size="20" />
              <span>Troubleshooting</span>
            </a>
          </div>
        </div>
      </div>

      <div class="help-statistics">
        <div class="statistics-content">
          <h3 class="statistics-title">Self-Service Success</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">85%</div>
              <div class="stat-label">Issues Resolved</div>
              <div class="stat-description">Through documentation alone</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">3 min</div>
              <div class="stat-label">Average Search Time</div>
              <div class="stat-description">To find relevant answers</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">Articles & Guides</div>
              <div class="stat-description">Comprehensive coverage</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">Documentation Uptime</div>
              <div class="stat-description">Always available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconBook,
    IconVideo,
    IconQuestionMark,
    IconBrandGithub,
    IconMessageSquare,
    IconNewspaper,
    IconRocket,
    IconCode,
    IconPlugConnected,
    IconTool,
    IconExternalLink,
    IconSearch,
    IconPlay,
    IconClock,
    IconSubtitles,
    IconShield,
    IconUsers,
    IconSettings,
    IconBuilding,
    IconGitBranch,
    IconBug,
    IconGitCommit,
    IconApi,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Contact Resources Section */
  .contact-resources-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .contact-resources-content-wrapper {
    max-width: 1400px;
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

  /* Resources Grid */
  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .resource-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .resource-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .resource-card.featured {
    border-color: var(--primary-300);
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    grid-column: span 2;
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--primary-600);
    box-shadow: var(--shadow-soft);
  }

  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
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
    margin-bottom: var(--space-lg);
  }

  /* Resource Sections */
  .resource-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .section-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    padding: var(--space-sm);
    background: var(--surface-page);
    border-radius: 6px;
    text-align: left;
  }

  .section-item svg {
    color: var(--primary-600);
    flex-shrink: 0;
  }

  /* Video Stats */
  .video-stats {
    display: flex;
    justify-content: center;
    gap: var(--space-lg);
    margin-bottom: var(--space-lg);
    flex-wrap: wrap;
  }

  .video-stat {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
    padding: var(--space-xs) var(--space-sm);
    background: var(--surface-page);
    border-radius: 12px;
  }

  .video-stat svg {
    color: var(--primary-500);
  }

  /* Featured Videos */
  .featured-videos {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .video-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    background: var(--surface-page);
    border-radius: 6px;
    text-align: left;
  }

  .video-thumbnail {
    width: 32px;
    height: 32px;
    background: var(--primary-100);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .video-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  .video-title {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .video-duration {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--gray-600);
  }

  /* FAQ Categories */
  .faq-categories {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .faq-category {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    padding: var(--space-sm);
    background: var(--surface-page);
    border-radius: 6px;
  }

  .faq-category svg {
    color: var(--primary-600);
    flex-shrink: 0;
  }

  /* GitHub Stats */
  .github-stats {
    display: flex;
    justify-content: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
    flex-wrap: wrap;
  }

  .github-stat {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
    padding: var(--space-xs) var(--space-sm);
    background: var(--surface-page);
    border-radius: 12px;
  }

  .github-stat svg {
    color: var(--primary-500);
  }

  /* Status Indicators */
  .status-indicators {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    padding: var(--space-sm);
    background: var(--surface-page);
    border-radius: 6px;
    text-align: left;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .status-dot.operational {
    background: var(--success-500);
    box-shadow: 0 0 4px rgba(34, 197, 94, 0.5);
  }

  /* Blog Preview */
  .blog-preview {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .blog-post {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm);
    background: var(--surface-page);
    border-radius: 6px;
    text-align: left;
  }

  .post-title {
    font-family: "Source Sans 3", sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .post-date {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--gray-600);
  }

  /* Card Actions */
  .card-actions {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
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
    min-width: 150px;
    justify-content: center;
  }

  .btn-primary {
    background: var(--primary-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: var(--white);
    color: var(--primary-600);
    border: 1px solid var(--primary-300);
  }

  .btn-secondary:hover {
    background: var(--primary-50);
    transform: translateY(-2px);
  }

  .resource-meta {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
  }

  .resource-meta svg {
    color: var(--gray-500);
  }

  /* Quick Links */
  .quick-links {
    background: linear-gradient(135deg, var(--gray-25), var(--primary-25));
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .quick-links-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .quick-links-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xl);
  }

  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
  }

  .quick-link {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .quick-link:hover {
    background: var(--primary-50);
    border-color: var(--primary-300);
    transform: translateY(-2px);
  }

  .quick-link svg {
    color: var(--primary-600);
  }

  /* Help Statistics */
  .help-statistics {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .statistics-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .statistics-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xl);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-xl);
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: var(--space-sm);
  }

  .stat-label {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .stat-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-600);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .contact-resources-section {
      padding: var(--space-3xl) 0;
    }

    .resources-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .resource-card.featured {
      grid-column: span 1;
    }

    .resource-card {
      padding: var(--space-xl);
    }

    .resource-sections,
    .faq-categories {
      grid-template-columns: 1fr;
    }

    .video-stats,
    .github-stats {
      flex-direction: column;
      align-items: center;
    }

    .quick-links,
    .help-statistics {
      padding: var(--space-xl);
    }

    .links-grid,
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--space-md);
    }
  }

  @media (max-width: 480px) {
    .resource-card {
      padding: var(--space-lg);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .quick-links,
    .help-statistics {
      padding: var(--space-lg);
    }

    .quick-links-title,
    .statistics-title {
      font-size: 24px;
    }

    .stat-number {
      font-size: 24px;
    }

    .btn {
      width: 100%;
      min-width: auto;
    }

    .links-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
