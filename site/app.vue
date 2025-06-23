<script setup>
  import NavBar from "@/components/NavBar.vue";
  import Footer from '@/components/Footer.vue';
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
