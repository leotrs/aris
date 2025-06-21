<script setup>
  import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <NavBar />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
  body {
    font-family: 'Source Sans Pro', sans-serif;
  }
  h1, h2, h3 {
    font-family: 'Montserrat', sans-serif;
  }
</style>
