<template>
  <section
    id="community-channels"
    class="community-channels-section"
    aria-labelledby="community-channels-heading"
  >
    <div class="community-channels-content-wrapper">
      <div class="section-header">
        <h2 id="community-channels-heading" class="section-title">Join Our Research Community</h2>
        <p class="section-subtitle">
          Connect with researchers worldwide who are transforming academic publishing. Share
          knowledge, collaborate, and help shape the future of open science.
        </p>
      </div>

      <div class="channels-grid">
        <div class="channel-card primary">
          <div class="card-header">
            <div class="card-icon">
              <IconMessage :size="32" />
            </div>
            <h3 class="card-title">Community Forum</h3>
            <p class="card-subtitle">Main hub for discussions and community support</p>
          </div>
          <div class="card-content">
            <p class="card-description">
              Our primary community space where researchers share experiences, ask questions, and
              collaborate on best practices for academic publishing.
            </p>
            <div class="channel-stats">
              <div class="stat">
                <IconUsers :size="16" />
                <span>500+ Members</span>
              </div>
              <div class="stat">
                <IconMessageCircle :size="16" />
                <span>50+ Discussions</span>
              </div>
              <div class="stat">
                <IconClock :size="16" />
                <span>Active Daily</span>
              </div>
            </div>
            <div class="channel-topics">
              <h4 class="topics-title">Popular Topics:</h4>
              <div class="topic-tags">
                <span class="topic-tag">RSM Syntax</span>
                <span class="topic-tag">Collaboration Tips</span>
                <span class="topic-tag">Integration Help</span>
                <span class="topic-tag">Best Practices</span>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <a href="https://forum.aris-platform.org" class="btn btn-primary">
              <IconExternalLink :size="16" />
              Join Forum
            </a>
            <p class="action-note">Free account required</p>
          </div>
        </div>

        <div class="channel-card">
          <div class="card-header">
            <div class="card-icon">
              <IconBrandGithub :size="32" />
            </div>
            <h3 class="card-title">GitHub Discussions</h3>
            <p class="card-subtitle">Technical discussions and feature requests</p>
          </div>
          <div class="card-content">
            <p class="card-description">
              Technical discussions, bug reports, feature requests, and development updates. Perfect
              for developers and technically-minded users.
            </p>
            <div class="github-categories">
              <div class="category">
                <IconBugOff :size="16" />
                <div class="category-info">
                  <span class="category-name">Bug Reports</span>
                  <span class="category-count">12 open</span>
                </div>
              </div>
              <div class="category">
                <IconBulb :size="16" />
                <div class="category-info">
                  <span class="category-name">Feature Requests</span>
                  <span class="category-count">8 open</span>
                </div>
              </div>
              <div class="category">
                <IconCode :size="16" />
                <div class="category-info">
                  <span class="category-name">Development</span>
                  <span class="category-count">5 open</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <a href="https://github.com/aris-platform/aris/discussions" class="btn btn-secondary">
              <IconExternalLink :size="16" />
              View Discussions
            </a>
            <p class="action-note">GitHub account required</p>
          </div>
        </div>

        <div class="channel-card">
          <div class="card-header">
            <div class="card-icon">
              <IconBrandDiscord :size="32" />
            </div>
            <h3 class="card-title">Discord Server</h3>
            <p class="card-subtitle">Real-time chat and quick help</p>
          </div>
          <div class="card-content">
            <p class="card-description">
              Join our Discord for real-time conversations, quick questions, and casual discussions
              about research and academic publishing.
            </p>
            <div class="discord-channels">
              <div class="discord-channel">
                <IconHash :size="14" />
                <span>general</span>
              </div>
              <div class="discord-channel">
                <IconHash :size="14" />
                <span>help</span>
              </div>
              <div class="discord-channel">
                <IconHash :size="14" />
                <span>rsm-syntax</span>
              </div>
              <div class="discord-channel">
                <IconHash :size="14" />
                <span>collaborations</span>
              </div>
            </div>
            <div class="discord-activity">
              <div class="activity-indicator online"></div>
              <span>125 members online</span>
            </div>
          </div>
          <div class="card-actions">
            <a href="https://discord.gg/aris-platform" class="btn btn-secondary">
              <IconExternalLink :size="16" />
              Join Discord
            </a>
            <p class="action-note">Instant access</p>
          </div>
        </div>

        <div class="channel-card">
          <div class="card-header">
            <div class="card-icon">
              <IconMail :size="32" />
            </div>
            <h3 class="card-title">Newsletter</h3>
            <p class="card-subtitle">Monthly updates and announcements</p>
          </div>
          <div class="card-content">
            <p class="card-description">
              Stay updated with development progress, new features, community highlights, and
              academic publishing news. No spam, unsubscribe anytime.
            </p>
            <div class="newsletter-preview">
              <h4 class="preview-title">Recent Topics:</h4>
              <ul class="preview-list">
                <li>New RSM collaboration features</li>
                <li>Community spotlight: Dr. Sarah Chen</li>
                <li>Integration with ORCID launched</li>
                <li>Upcoming webinar: "ResOps in Practice"</li>
              </ul>
            </div>
          </div>
          <div class="card-actions">
            <div class="newsletter-signup">
              <input
                v-model="newsletterEmail"
                type="email"
                placeholder="your.email@university.edu"
                class="newsletter-input"
              />
              <button
                class="btn btn-secondary"
                :disabled="!newsletterEmail"
                @click="subscribeNewsletter"
              >
                <IconSend :size="16" />
                Subscribe
              </button>
            </div>
            <p class="action-note">Monthly delivery</p>
          </div>
        </div>
      </div>

      <div class="community-guidelines">
        <div class="guidelines-content">
          <h3 class="guidelines-title">Community Guidelines</h3>
          <p class="guidelines-description">
            Our community is built on respect, collaboration, and shared learning. Here are our core
            principles:
          </p>
          <div class="guidelines-grid">
            <div class="guideline-item">
              <div class="guideline-icon">
                <IconHeart :size="24" />
              </div>
              <div class="guideline-content">
                <h4 class="guideline-title">Be Respectful</h4>
                <p class="guideline-text">
                  Treat all community members with respect and kindness, regardless of background or
                  experience level.
                </p>
              </div>
            </div>
            <div class="guideline-item">
              <div class="guideline-icon">
                <IconUsers :size="24" />
              </div>
              <div class="guideline-content">
                <h4 class="guideline-title">Help Others</h4>
                <p class="guideline-text">
                  Share your knowledge and experience to help other researchers succeed in their
                  publishing journey.
                </p>
              </div>
            </div>
            <div class="guideline-item">
              <div class="guideline-icon">
                <IconLock :size="24" />
              </div>
              <div class="guideline-content">
                <h4 class="guideline-title">Respect Privacy</h4>
                <p class="guideline-text">
                  Don't share others' unpublished research or personal information without explicit
                  permission.
                </p>
              </div>
            </div>
            <div class="guideline-item">
              <div class="guideline-icon">
                <IconMessageCircle :size="24" />
              </div>
              <div class="guideline-content">
                <h4 class="guideline-title">Stay On Topic</h4>
                <p class="guideline-text">
                  Keep discussions relevant to academic publishing, research workflows, and Aris
                  platform usage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="community-impact">
        <div class="impact-content">
          <h3 class="impact-title">Community Impact</h3>
          <div class="impact-stats">
            <div class="impact-stat">
              <div class="impact-number">2,500+</div>
              <div class="impact-label">Research Questions Answered</div>
            </div>
            <div class="impact-stat">
              <div class="impact-number">150+</div>
              <div class="impact-label">Collaborations Started</div>
            </div>
            <div class="impact-stat">
              <div class="impact-number">50+</div>
              <div class="impact-label">Feature Suggestions Implemented</div>
            </div>
            <div class="impact-stat">
              <div class="impact-number">95%</div>
              <div class="impact-label">User Satisfaction</div>
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
    IconMessage,
    IconUsers,
    IconMessageCircle,
    IconClock,
    IconExternalLink,
    IconBrandGithub,
    IconBugOff,
    IconBulb,
    IconCode,
    IconBrandDiscord,
    IconHash,
    IconMail,
    IconSend,
    IconHeart,
    IconLock,
  } from "@tabler/icons-vue";

  const newsletterEmail = ref("");

  const subscribeNewsletter = () => {
    if (newsletterEmail.value) {
      // In a real implementation, you would send this to your newsletter service
      console.log("Newsletter subscription:", newsletterEmail.value);
      alert("Thank you for subscribing! You'll receive our next newsletter within a few days.");
      newsletterEmail.value = "";
    }
  };
</script>

<style scoped>
  /* Community Channels Section */
  .community-channels-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .community-channels-content-wrapper {
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

  /* Channels Grid */
  .channels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .channel-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .channel-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .channel-card.primary {
    border-color: var(--primary-300);
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
  }

  .card-header {
    text-align: center;
    margin-bottom: var(--space-lg);
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: var(--surface-page);
    border: 2px solid var(--primary-200);
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
    margin-bottom: var(--space-sm);
    line-height: 1.3;
  }

  .card-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-600);
    line-height: 1.4;
  }

  .card-content {
    flex: 1;
    margin-bottom: var(--space-lg);
  }

  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  /* Channel Stats */
  .channel-stats {
    display: flex;
    justify-content: space-between;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .stat {
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

  .stat svg {
    color: var(--primary-500);
  }

  /* Channel Topics */
  .channel-topics {
    margin-bottom: var(--space-lg);
  }

  .topics-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .topic-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .topic-tag {
    padding: var(--space-xs) var(--space-sm);
    background: var(--primary-50);
    color: var(--primary-700);
    border: 1px solid var(--primary-200);
    border-radius: 12px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
  }

  /* GitHub Categories */
  .github-categories {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .category {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    background: var(--surface-page);
    border-radius: 6px;
  }

  .category svg {
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .category-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  .category-name {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .category-count {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--gray-600);
  }

  /* Discord Channels */
  .discord-channels {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .discord-channel {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background: var(--surface-page);
    border-radius: 4px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--gray-700);
  }

  .discord-channel svg {
    color: var(--gray-500);
  }

  .discord-activity {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
  }

  .activity-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success-500);
    box-shadow: 0 0 4px rgba(34, 197, 94, 0.5);
  }

  /* Newsletter */
  .newsletter-preview {
    margin-bottom: var(--space-lg);
  }

  .preview-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .preview-list {
    margin: 0;
    padding-left: var(--space-lg);
  }

  .preview-list li {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-700);
    margin-bottom: var(--space-xs);
  }

  /* Card Actions */
  .card-actions {
    margin-top: auto;
    text-align: center;
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

  .action-note {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--gray-600);
    margin-top: var(--space-sm);
    margin-bottom: 0;
  }

  /* Newsletter Signup */
  .newsletter-signup {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
  }

  .newsletter-input {
    flex: 1;
    padding: var(--space-sm) var(--space-md);
    border: 2px solid var(--border-primary);
    border-radius: 6px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-900);
    background: var(--surface-page);
  }

  .newsletter-input:focus {
    outline: none;
    border-color: var(--primary-500);
  }

  .newsletter-signup .btn {
    min-width: auto;
    padding: var(--space-sm) var(--space-md);
  }

  /* Community Guidelines */
  .community-guidelines {
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
    border: 1px solid var(--success-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .guidelines-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .guidelines-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .guidelines-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .guidelines-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
  }

  .guideline-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    text-align: center;
  }

  .guideline-icon {
    width: 48px;
    height: 48px;
    background: var(--success-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--success-600);
    flex-shrink: 0;
  }

  .guideline-content {
    flex: 1;
  }

  .guideline-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .guideline-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--gray-700);
    margin: 0;
  }

  /* Community Impact */
  .community-impact {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .impact-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .impact-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xl);
  }

  .impact-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-xl);
  }

  .impact-stat {
    text-align: center;
  }

  .impact-number {
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: var(--space-sm);
  }

  .impact-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .community-channels-section {
      padding: var(--space-3xl) 0;
    }

    .channels-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .channel-card {
      padding: var(--space-xl);
    }

    .channel-stats {
      flex-direction: column;
      gap: var(--space-sm);
    }

    .newsletter-signup {
      flex-direction: column;
    }

    .community-guidelines,
    .community-impact {
      padding: var(--space-xl);
    }

    .guidelines-grid {
      grid-template-columns: 1fr;
    }

    .impact-stats {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--space-lg);
    }
  }

  @media (max-width: 480px) {
    .channel-card {
      padding: var(--space-lg);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .community-guidelines,
    .community-impact {
      padding: var(--space-lg);
    }

    .guidelines-title,
    .impact-title {
      font-size: 24px;
    }

    .impact-number {
      font-size: 24px;
    }

    .btn {
      width: 100%;
      min-width: auto;
    }
  }
</style>
