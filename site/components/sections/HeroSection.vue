<script setup>
  import screen1 from "@/assets/screen1.png";
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <div class="hero-text">
        <h1>Scientific publishing, reimagined for the web</h1>
        <p>
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
  section {
    padding: 4rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    font-weight: var(--weight-bold);
    margin-bottom: 1rem;
    line-height: 2.5rem;
  }

  p {
    margin: 0 auto;
    max-width: 65ch;
  }

  .hero-content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2rem;
  }

  .hero-image {
    flex: 1;
    min-height: 200px;
    background: var(--extra-light);
    border-radius: 8px;
  }

  .hero-img {
    width: 100%;
    height: 100%;
  }

  .hero-text {
    flex: 1;
  }
</style>