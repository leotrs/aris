<script setup>
  import { onMounted } from "vue";
  import { useDarkMode } from "~/composables/useDarkMode";

  // Initialize dark mode for the entire app
  const { initializeDarkMode } = useDarkMode();

  // Apply theme on client-side mount
  onMounted(() => {
    initializeDarkMode();
  });
</script>

<template>
  <main id="main-content" role="main">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>

<style>
  body {
    font-family: "Source Sans 3", sans-serif;
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3 {
    font-family: "Montserrat", sans-serif;
  }

  a {
    text-decoration: none;
  }

  p {
    font-family: "Source Sans 3", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.5;
  }

  main {
    min-height: 100vh;
  }

  /* Global transitions for smooth theme switching */
  * {
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }
</style>
