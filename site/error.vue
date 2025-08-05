<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-message">The page you're looking for doesn't exist or has been moved.</p>
        <NuxtLink to="/" class="back-button"> ← Back to Home </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from "vue";
  import { useDarkMode } from "~/composables/useDarkMode";

  const { isDarkMode, isHydrated } = useDarkMode();

  // Apply dark mode to body when component mounts
  onMounted(() => {
    if (isHydrated.value) {
      document.body.classList.toggle("dark-theme", isDarkMode.value);
    }
  });
</script>

<style scoped>
  .error-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-page);
    padding: var(--space-lg);
  }

  .error-container {
    text-align: center;
    max-width: 500px;
  }

  .error-code {
    font-size: 8rem;
    font-weight: 700;
    color: var(--primary-600);
    margin: 0;
    line-height: 1;
  }

  .error-title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-heading);
    margin: var(--space-md) 0;
  }

  .error-message {
    font-size: 1.125rem;
    color: var(--text-body);
    margin: var(--space-md) 0 var(--space-xl);
    line-height: 1.6;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-lg);
    background: var(--primary-600);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .back-button:hover {
    background: var(--primary-700);
  }

  .back-button:focus-visible {
    outline: var(--border-med) solid var(--border-focus);
    outline-offset: var(--border-extrathin);
  }

  /* Dark theme adjustments */
  :global(.dark-theme) .error-code {
    color: var(--primary-400);
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    .error-code {
      font-size: 6rem;
    }

    .error-title {
      font-size: 1.5rem;
    }

    .error-message {
      font-size: 1rem;
    }
  }
</style>
