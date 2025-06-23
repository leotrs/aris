<script setup>
  import NavBar from "@/components/NavBar.vue";
</script>

<template>
  <NavBar />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
  body {
    font-family: "Source Sans Pro", sans-serif;
    background: var(--surface-primary);
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
    font-size: 18px;
    line-height: 1.25;
  }
</style>
