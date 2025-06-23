<script setup>
  import screen1 from "@/assets/screen1.png";
</script>

<template>
  <section class="section-container">
    <div class="hero-layout">
      <div class="hero-text">
        <h1 class="section-heading">Scientific publishing, reimagined for the web</h1>
        <p class="section-text">
          Aris is a new way to author and publish research — clear, interactive, and designed for modern science.
        </p>
      </div>
      <div class="hero-image">
        <NuxtImg 
          class="hero-img" 
          :src="screen1" 
          alt="Aris platform interface showing scientific document" 
          width="600" 
          height="400" 
          format="webp" 
          loading="eager" 
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
  h1 {
    font-weight: var(--weight-bold);
    line-height: 2.5rem;
  }
</style>