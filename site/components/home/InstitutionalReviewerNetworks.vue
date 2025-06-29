<template>
  <section class="reviewer-networks-section">
    <div class="content-wrapper">
      <div class="section-header">
        <h2 class="section-heading">The Network Effect: Institutional Reviewer Pools</h2>
        <p class="section-subtitle">
          Every institutional member becomes a potential reviewer. Smart matching creates better
          reviews, faster turnaround, and fair distribution of workload.
        </p>
      </div>

      <div class="network-demo">
        <div class="network-content">
          <div class="network-feature">
            <div class="feature-icon">
              <IconNetwork :size="32" />
            </div>
            <h3 class="feature-title">Growing Reviewer Networks</h3>
            <p class="feature-description">
              Each institution that joins Aris expands the qualified reviewer pool for all members.
              More institutions means better matches for every paper.
            </p>
            <div class="feature-stats">
              <div class="stat-item">
                <div class="stat-number">500+</div>
                <div class="stat-label">Qualified reviewers per institution</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">95%</div>
                <div class="stat-label">Match accuracy for expertise</div>
              </div>
            </div>
          </div>

          <div class="network-feature">
            <div class="feature-icon">
              <IconBrain :size="32" />
            </div>
            <h3 class="feature-title">AI-Powered Expert Matching</h3>
            <p class="feature-description">
              Our algorithms analyze research profiles, publication history, and current workload to
              suggest the best reviewers for each manuscript.
            </p>
            <div class="feature-benefits">
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Expertise-based matching</span>
              </div>
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Workload balancing</span>
              </div>
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Quality scoring</span>
              </div>
            </div>
          </div>

          <div class="network-feature">
            <div class="feature-icon">
              <IconShield :size="32" />
            </div>
            <h3 class="feature-title">Transparent Conflict Management</h3>
            <p class="feature-description">
              Automated conflict of interest detection with clear disclosure. Every reviewer
              suggestion comes with complete transparency about potential conflicts.
            </p>
            <div class="feature-benefits">
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Automated CoI detection</span>
              </div>
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Clear conflict disclosure</span>
              </div>
              <div class="benefit-item">
                <IconCheck :size="16" />
                <span>Ethical review practices</span>
              </div>
            </div>
          </div>
        </div>

        <div class="network-visualization">
          <div class="network-diagram">
            <div class="central-hub">
              <div class="hub-icon">
                <IconServer :size="32" />
              </div>
              <span class="hub-label">Aris Network</span>
            </div>

            <div class="institution-node node-1">
              <div class="node-icon">
                <IconBuilding :size="24" />
              </div>
              <span class="node-label">University A</span>
              <div class="node-count">450 researchers</div>
            </div>

            <div class="institution-node node-2">
              <div class="node-icon">
                <IconBuilding :size="24" />
              </div>
              <span class="node-label">Institute B</span>
              <div class="node-count">320 researchers</div>
            </div>

            <div class="institution-node node-3">
              <div class="node-icon">
                <IconBuilding :size="24" />
              </div>
              <span class="node-label">Lab C</span>
              <div class="node-count">180 researchers</div>
            </div>

            <div class="institution-node node-4">
              <div class="node-icon">
                <IconBuilding :size="24" />
              </div>
              <span class="node-label">Center D</span>
              <div class="node-count">290 researchers</div>
            </div>

            <!-- Connection lines -->
            <div class="connection-line line-1"></div>
            <div class="connection-line line-2"></div>
            <div class="connection-line line-3"></div>
            <div class="connection-line line-4"></div>
          </div>
        </div>
      </div>

      <div class="network-cta">
        <h3 class="cta-title">Ready to Build Your Institution's Reviewer Network?</h3>
        <p class="cta-description">
          Join pioneering institutions already using Aris to improve their peer review processes.
        </p>
        <a href="/institutions" class="btn btn-primary">Learn About Institutional Membership</a>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconNetwork,
    IconBrain,
    IconShield,
    IconCheck,
    IconServer,
    IconBuilding,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Section Container */
  .reviewer-networks-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  /* Content Wrapper */
  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-heading {
    font-family: "Montserrat", sans-serif;
    font-size: var(--text-5xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.2;
  }

  .section-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: var(--text-xl);
    line-height: 1.6;
    color: var(--gray-700);
  }

  /* Network Demo */
  .network-demo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4xl);
    align-items: center;
    margin-bottom: var(--space-4xl);
  }

  .network-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
  }

  /* Network Features */
  .network-feature {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-xl);
    transition: all 0.3s ease;
  }

  .network-feature:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  .feature-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    margin-bottom: var(--space-md);
  }

  .feature-title {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
    line-height: 1.3;
  }

  .feature-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-lg);
  }

  /* Feature Stats */
  .feature-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md);
  }

  .stat-item {
    text-align: center;
    padding: var(--space-md);
    background: var(--surface-page);
    border-radius: 8px;
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
    color: var(--gray-600);
    line-height: 1.3;
  }

  /* Feature Benefits */
  .feature-benefits {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .benefit-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
  }

  .benefit-item svg {
    color: var(--success-600);
    flex-shrink: 0;
  }

  /* Network Visualization */
  .network-visualization {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .network-diagram {
    position: relative;
    width: 350px;
    height: 350px;
  }

  .central-hub {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--white);
    box-shadow: var(--shadow-medium);
    z-index: 3;
  }

  .hub-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
    margin-top: 2px;
  }

  .institution-node {
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
    box-shadow: var(--shadow-soft);
    transition: all 0.3s ease;
    z-index: 2;
  }

  .institution-node:hover {
    transform: scale(1.1);
    border-color: var(--primary-400);
  }

  .node-label {
    font-family: "Source Sans 3", sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: var(--gray-700);
    text-align: center;
  }

  .node-count {
    font-family: "Source Sans 3", sans-serif;
    font-size: 8px;
    color: var(--gray-500);
    text-align: center;
  }

  /* Node Positioning */
  .node-1 {
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .node-2 {
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .node-3 {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .node-4 {
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
  }

  /* Connection Lines */
  .connection-line {
    position: absolute;
    background: linear-gradient(var(--primary-200), var(--primary-300));
    z-index: 1;
  }

  .line-1 {
    top: 70px;
    left: 50%;
    width: 2px;
    height: 60px;
    transform: translateX(-50%);
  }

  .line-2 {
    top: 50%;
    right: 70px;
    width: 60px;
    height: 2px;
    transform: translateY(-50%);
  }

  .line-3 {
    bottom: 70px;
    left: 50%;
    width: 2px;
    height: 60px;
    transform: translateX(-50%);
  }

  .line-4 {
    top: 50%;
    left: 70px;
    width: 60px;
    height: 2px;
    transform: translateY(-50%);
  }

  /* Network CTA */
  .network-cta {
    text-align: center;
    padding: var(--space-2xl);
    background: linear-gradient(135deg, var(--primary-25), var(--primary-50));
    border-radius: 12px;
    border: 1px solid var(--primary-100);
  }

  .cta-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .cta-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
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
    display: inline-block;
  }

  .btn-primary {
    background: var(--primary-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 154, 233, 0.35);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .reviewer-networks-section {
      padding: var(--space-3xl) 0;
    }

    .network-demo {
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    .network-visualization {
      order: -1;
      min-height: 300px;
    }

    .network-diagram {
      width: 280px;
      height: 280px;
    }

    .central-hub {
      width: 80px;
      height: 80px;
    }

    .institution-node {
      width: 60px;
      height: 60px;
    }

    .feature-stats {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .network-feature {
      padding: var(--space-lg);
    }

    .network-diagram {
      width: 240px;
      height: 240px;
    }

    .central-hub {
      width: 70px;
      height: 70px;
    }

    .institution-node {
      width: 50px;
      height: 50px;
    }
  }
</style>
