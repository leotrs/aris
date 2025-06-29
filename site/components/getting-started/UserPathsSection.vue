<template>
  <section id="user-paths" class="user-paths-section" aria-labelledby="user-paths-heading">
    <div class="user-paths-content-wrapper">
      <div class="section-header">
        <h2 id="user-paths-heading" class="section-title">Choose Your Path</h2>
      </div>

      <div class="paths-grid">
        <div class="path-card researcher">
          <div class="path-header">
            <div class="path-icon">
              <IconUser :size="32" />
            </div>
            <h3 class="path-title">Individual Researcher</h3>
            <p class="path-subtitle">Start writing and collaborating immediately</p>
          </div>

          <div class="path-steps">
            <div class="step">1. Sign up with academic email</div>
            <div class="step">2. Create your first manuscript</div>
            <div class="step">3. Start writing and sharing</div>
          </div>

          <div class="path-cta">
            <a href="/signup?type=researcher" class="btn btn-primary">
              <IconRocket :size="16" />
              Start Writing Now
            </a>
            <div class="path-note">Free forever</div>
          </div>
        </div>

        <div class="path-card institution">
          <div class="path-header">
            <div class="path-icon">
              <IconBuilding :size="32" />
            </div>
            <h3 class="path-title">Institution Setup</h3>
            <p class="path-subtitle">For universities and research organizations</p>
          </div>

          <div class="path-steps">
            <div class="step">1. Schedule a demo call</div>
            <div class="step">2. Custom setup for your needs</div>
            <div class="step">3. Onboard your researchers</div>
          </div>

          <div class="path-cta">
            <a href="/contact?type=institution" class="btn btn-secondary">
              <IconCalendar :size="16" />
              Schedule Demo
            </a>
            <div class="path-note">Custom pricing</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconUser, IconBuilding, IconRocket, IconCalendar } from "@tabler/icons-vue";
</script>

<style scoped>
  .user-paths-section {
    background: var(--surface-page);
    padding: var(--space-4xl) 0;
  }

  .user-paths-content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  .section-header {
    text-align: center;
    margin-bottom: var(--space-3xl);
  }

  .section-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(28px, 6vw, 36px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
  }

  .paths-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
  }

  .path-card {
    background: var(--gray-25);
    border: 2px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    text-align: center;
    transition: all 0.3s ease;
  }

  .path-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .path-card.researcher {
    border-color: var(--primary-300);
  }

  .path-card.institution {
    border-color: var(--success-300);
  }

  .path-header {
    margin-bottom: var(--space-xl);
  }

  .path-icon {
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

  .path-card.institution .path-icon {
    background: linear-gradient(135deg, var(--success-100), var(--success-200));
    color: var(--success-600);
  }

  .path-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .path-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    color: var(--gray-700);
    line-height: 1.5;
  }

  .path-steps {
    margin-bottom: var(--space-xl);
  }

  .step {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    margin-bottom: var(--space-sm);
    padding: var(--space-sm);
    background: var(--surface-page);
    border-radius: 6px;
  }

  .path-cta {
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
    min-width: 160px;
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
    color: var(--success-600);
    border: 2px solid var(--success-300);
  }

  .btn-secondary:hover {
    background: var(--success-50);
    transform: translateY(-2px);
  }

  .path-note {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
    font-style: italic;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .user-paths-section {
      padding: var(--space-3xl) 0;
    }

    .paths-grid {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    .path-card {
      padding: var(--space-xl);
    }

    .path-icon {
      width: 56px;
      height: 56px;
    }

    .path-title {
      font-size: 20px;
    }
  }
</style>
