<script setup>
  import NavBar from "@/components/NavBar.vue";
  import Footer from "@/components/Footer.vue";
</script>

<template>
  <!-- Skip to main content link for accessibility -->
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <NavBar />
  <main id="main-content" role="main">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
  <Footer />
</template>

<style>
  body {
    font-family: "Source Sans 3", sans-serif;
    background: var(--surface-page);
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
    font-weight: var(--weight-regular);
    font-size: 16px;
    line-height: 1.5;
  }

  /* Skip link for accessibility */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-600);
    color: var(--white);
    padding: 8px;
    border-radius: 4px;
    text-decoration: none;
    z-index: 9999;
    font-weight: 600;
    transition: top 0.3s;
  }

  .skip-link:focus {
    top: 6px;
  }

  /* Ensure main content accounts for fixed navbar */
  main {
    padding-top: 64px;
  }
</style>
