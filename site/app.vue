<script setup>
  import NavBar from "@/components/NavBar.vue";
  import Footer from "@/components/Footer.vue";
</script>

<template>
  <NavBar />
  <main>
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

  /* Ensure main content accounts for fixed navbar */
  main {
    padding-top: 64px;
  }
</style>
