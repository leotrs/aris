<script setup>
  import screen1 from "@/assets/screen1.png";
</script>

<template>
  <section class="section-container">
    <div class="hero-layout">
      <div class="hero-text">
        <h1 class="section-heading">Bring your research fully to the web</h1>
        <p class="section-text">
          From first draft to final publication, Aris connects every step of the research journey.
          Write with semantic markup, collaborate with threaded comments, publish with one-click
          sharing — all in one web-native platform.
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
