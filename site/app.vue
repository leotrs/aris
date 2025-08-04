<script setup>
  // Coming soon site - no navigation or footer needed
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
</style>
