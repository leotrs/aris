<template>
  <section class="demo-section" aria-labelledby="demo-heading">
    <div class="demo-content-wrapper">
      <div class="section-header">
        <h2 id="demo-heading" class="section-title">Try Aris Right Now</h2>
        <p class="section-subtitle">
          Experience the power of integrated research workflows without signing up. Interactive
          demos of key features that make academic publishing better.
        </p>
      </div>

      <div class="demo-grid">
        <div class="demo-card featured">
          <div class="demo-header">
            <div class="demo-icon">
              <IconEdit :size="32" />
            </div>
            <h3 class="demo-title">Interactive Editor</h3>
            <p class="demo-description">
              See how writing in RSM compares to LaTeX with live preview and smart formatting.
            </p>
          </div>
          <div class="demo-preview">
            <div class="editor-demo">
              <div class="editor-tabs">
                <button class="tab active">RSM</button>
                <button class="tab">LaTeX</button>
                <button class="tab">Preview</button>
              </div>
              <div class="editor-content">
                <div class="line-numbers">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
                <div class="editor-text">
                  <div class="code-line"># Introduction</div>
                  <div class="code-line">This paper presents novel findings in...</div>
                  <div class="code-line"></div>
                  <div class="code-line">## Related Work</div>
                  <div class="code-line">@cite{smith2023} demonstrated that...</div>
                </div>
              </div>
            </div>
          </div>
          <div class="demo-cta">
            <a href="/demo/editor" class="btn btn-primary">
              <IconPlayerPlay :size="16" />
              Try Interactive Editor
            </a>
          </div>
        </div>

        <div class="demo-card">
          <div class="demo-header">
            <div class="demo-icon">
              <IconUsers :size="32" />
            </div>
            <h3 class="demo-title">Real-time Collaboration</h3>
            <p class="demo-description">
              Watch how multiple researchers can work together seamlessly on the same manuscript.
            </p>
          </div>
          <div class="demo-preview">
            <div class="collab-demo">
              <div class="active-users">
                <div class="user-avatar">JS</div>
                <div class="user-avatar">MB</div>
                <div class="user-avatar you">You</div>
              </div>
              <div class="live-changes">
                <div class="change-item new">
                  <span class="user-indicator js">JS</span>
                  Added citation on line 23
                </div>
                <div class="change-item">
                  <span class="user-indicator mb">MB</span>
                  Suggested edit in abstract
                </div>
                <div class="change-item">
                  <span class="user-indicator you">You</span>
                  Typing in introduction...
                </div>
              </div>
            </div>
          </div>
          <div class="demo-cta">
            <a href="/demo/collaboration" class="btn btn-secondary">
              <IconPlayerPlay :size="16" />
              See Collaboration
            </a>
          </div>
        </div>

        <div class="demo-card">
          <div class="demo-header">
            <div class="demo-icon">
              <IconSearch :size="32" />
            </div>
            <h3 class="demo-title">Smart Reviewer Matching</h3>
            <p class="demo-description">
              Experience how AI finds the perfect reviewers based on expertise and availability.
            </p>
          </div>
          <div class="demo-preview">
            <div class="reviewer-demo">
              <div class="search-bar">
                <input type="text" placeholder="Machine Learning, Neural Networks" readonly />
                <button class="search-btn">Find Reviewers</button>
              </div>
              <div class="reviewer-results">
                <div class="reviewer-match">
                  <div class="match-score">95%</div>
                  <div class="reviewer-info">
                    <strong>Dr. Sarah Chen</strong>
                    <span>MIT • 47 reviews • Available</span>
                  </div>
                </div>
                <div class="reviewer-match">
                  <div class="match-score">92%</div>
                  <div class="reviewer-info">
                    <strong>Prof. David Kim</strong>
                    <span>Stanford • 31 reviews • Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="demo-cta">
            <a href="/demo/reviewer-matching" class="btn btn-secondary">
              <IconPlayerPlay :size="16" />
              Try Reviewer Matching
            </a>
          </div>
        </div>

        <div class="demo-card">
          <div class="demo-header">
            <div class="demo-icon">
              <IconWorld :size="32" />
            </div>
            <h3 class="demo-title">Web-Native Publishing</h3>
            <p class="demo-description">
              See how your research looks as a beautiful, interactive web publication.
            </p>
          </div>
          <div class="demo-preview">
            <div class="publication-demo">
              <div class="pub-header">
                <h4>Novel Approaches in Machine Learning</h4>
                <p class="authors">Smith, J. • Chen, S. • Kim, D.</p>
              </div>
              <div class="pub-content">
                <p>Interactive figures adapt to reader preferences...</p>
                <div class="interactive-element">
                  <div class="chart-placeholder">[Interactive Chart]</div>
                  <div class="chart-controls">
                    <button class="control-btn active">2023</button>
                    <button class="control-btn">2022</button>
                    <button class="control-btn">2021</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="demo-cta">
            <a href="/demo/publication" class="btn btn-secondary">
              <IconPlayerPlay :size="16" />
              View Sample Publication
            </a>
          </div>
        </div>
      </div>

      <div class="demo-footer">
        <div class="footer-content">
          <h3 class="footer-title">Ready to Experience the Full Platform?</h3>
          <p class="footer-description">
            These demos show just a glimpse of what's possible. Sign up to access the complete
            ResOps platform and transform your research workflow.
          </p>
          <div class="footer-actions">
            <a href="/signup" class="btn btn-primary btn-large">
              <IconRocket :size="18" />
              Start Your Free Account
            </a>
            <a href="/demo/full-platform" class="btn btn-secondary btn-large">
              <IconDevices :size="18" />
              Full Platform Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconEdit,
    IconUsers,
    IconSearch,
    IconWorld,
    IconPlayerPlay,
    IconRocket,
    IconDevices,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Demo Section */
  .demo-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .demo-content-wrapper {
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

  /* Demo Grid */
  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-4xl);
  }

  .demo-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .demo-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .demo-card.featured {
    border: 2px solid var(--primary-300);
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    grid-column: span 2;
  }

  /* Demo Header */
  .demo-header {
    text-align: center;
    margin-bottom: var(--space-lg);
  }

  .demo-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--primary-600);
  }

  .demo-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
    line-height: 1.3;
  }

  .demo-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-700);
  }

  /* Demo Preview */
  .demo-preview {
    flex: 1;
    margin-bottom: var(--space-lg);
  }

  /* Editor Demo */
  .editor-demo {
    background: var(--surface-page);
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    overflow: hidden;
  }

  .editor-tabs {
    display: flex;
    background: var(--gray-100);
    border-bottom: 1px solid var(--gray-300);
  }

  .tab {
    padding: var(--space-sm) var(--space-md);
    background: none;
    border: none;
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-600);
    cursor: pointer;
  }

  .tab.active {
    background: var(--surface-page);
    color: var(--primary-600);
    border-bottom: 2px solid var(--primary-500);
  }

  .editor-content {
    display: flex;
    font-family: "Courier New", monospace;
    font-size: 12px;
    min-height: 120px;
  }

  .line-numbers {
    background: var(--gray-50);
    padding: var(--space-sm) var(--space-xs);
    border-right: 1px solid var(--gray-300);
    color: var(--gray-500);
    text-align: right;
    user-select: none;
  }

  .line-numbers span {
    display: block;
    line-height: 1.5;
  }

  .editor-text {
    flex: 1;
    padding: var(--space-sm);
  }

  .code-line {
    line-height: 1.5;
    color: var(--gray-800);
  }

  /* Collaboration Demo */
  .collab-demo {
    background: var(--surface-page);
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    padding: var(--space-md);
  }

  .active-users {
    display: flex;
    gap: var(--space-xs);
    margin-bottom: var(--space-md);
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Montserrat", sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: var(--white);
  }

  .user-avatar:nth-child(1) {
    background: var(--success-500);
  }
  .user-avatar:nth-child(2) {
    background: var(--warning-500);
  }
  .user-avatar.you {
    background: var(--primary-500);
  }

  .live-changes {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .change-item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--gray-700);
    padding: var(--space-xs);
    border-radius: 4px;
  }

  .change-item.new {
    background: var(--success-50);
    border: 1px solid var(--success-200);
  }

  .user-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 600;
    color: var(--white);
    flex-shrink: 0;
  }

  .user-indicator.js {
    background: var(--success-500);
  }
  .user-indicator.mb {
    background: var(--warning-500);
  }
  .user-indicator.you {
    background: var(--primary-500);
  }

  /* Reviewer Demo */
  .reviewer-demo {
    background: var(--surface-page);
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    padding: var(--space-md);
  }

  .search-bar {
    display: flex;
    gap: var(--space-xs);
    margin-bottom: var(--space-md);
  }

  .search-bar input {
    flex: 1;
    padding: var(--space-xs);
    border: 1px solid var(--gray-300);
    border-radius: 4px;
    font-size: 11px;
  }

  .search-btn {
    padding: var(--space-xs) var(--space-sm);
    background: var(--primary-500);
    color: var(--white);
    border: none;
    border-radius: 4px;
    font-size: 10px;
    cursor: pointer;
  }

  .reviewer-results {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .reviewer-match {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-xs);
    background: var(--gray-50);
    border-radius: 4px;
  }

  .match-score {
    background: var(--success-500);
    color: var(--white);
    padding: 2px var(--space-xs);
    border-radius: 4px;
    font-family: "Montserrat", sans-serif;
    font-size: 10px;
    font-weight: 600;
  }

  .reviewer-info {
    display: flex;
    flex-direction: column;
  }

  .reviewer-info strong {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--gray-900);
  }

  .reviewer-info span {
    font-family: "Source Sans 3", sans-serif;
    font-size: 9px;
    color: var(--gray-600);
  }

  /* Publication Demo */
  .publication-demo {
    background: var(--surface-page);
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    padding: var(--space-md);
  }

  .pub-header h4 {
    font-family: "Montserrat", sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .authors {
    font-family: "Source Sans 3", sans-serif;
    font-size: 10px;
    color: var(--gray-600);
    margin-bottom: var(--space-sm);
  }

  .pub-content p {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--gray-700);
    margin-bottom: var(--space-sm);
  }

  .interactive-element {
    background: var(--primary-25);
    border: 1px solid var(--primary-200);
    border-radius: 4px;
    padding: var(--space-sm);
  }

  .chart-placeholder {
    background: var(--primary-50);
    border: 2px dashed var(--primary-300);
    padding: var(--space-sm);
    text-align: center;
    font-size: 10px;
    color: var(--primary-600);
    margin-bottom: var(--space-xs);
  }

  .chart-controls {
    display: flex;
    gap: var(--space-xs);
    justify-content: center;
  }

  .control-btn {
    padding: 2px var(--space-xs);
    background: var(--gray-100);
    border: 1px solid var(--gray-300);
    border-radius: 3px;
    font-size: 9px;
    cursor: pointer;
  }

  .control-btn.active {
    background: var(--primary-500);
    color: var(--white);
    border-color: var(--primary-500);
  }

  /* Demo CTA */
  .demo-cta {
    text-align: center;
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
    min-width: 160px;
    justify-content: center;
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

  /* Demo Footer */
  .demo-footer {
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
    border: 1px solid var(--success-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
  }

  .footer-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .footer-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .footer-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
  }

  .footer-actions {
    display: flex;
    gap: var(--space-lg);
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-large {
    padding: var(--space-md) var(--space-xl);
    font-size: 16px;
    min-width: 200px;
  }

  /* Responsive Adjustments */
  @media (max-width: 1024px) {
    .demo-card.featured {
      grid-column: span 1;
    }
  }

  @media (max-width: 768px) {
    .demo-section {
      padding: var(--space-3xl) 0;
    }

    .demo-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .demo-card {
      padding: var(--space-lg);
    }

    .demo-footer {
      padding: var(--space-xl);
    }

    .footer-actions {
      flex-direction: column;
      align-items: center;
    }

    .btn-large {
      width: 100%;
      max-width: 250px;
    }
  }

  @media (max-width: 480px) {
    .demo-card {
      padding: var(--space-md);
    }

    .demo-icon {
      width: 56px;
      height: 56px;
    }

    .demo-title {
      font-size: 18px;
    }

    .demo-footer {
      padding: var(--space-lg);
    }

    .footer-title {
      font-size: 20px;
    }
  }
</style>
