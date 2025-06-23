<script setup>
  import feature3 from "@/assets/feature3.png";
</script>

<template>
  <section class="section-container text-center">
    <p class="section-label">Features</p>
    <h2 class="section-heading">Built for every part of the research journey</h2>
    <p class="section-text">
      Aris adapts to how you write, review, and read — so science flows better for everyone.
    </p>
    <div class="flex-grid">
      <div class="flex-grid-item">
        <div class="image-placeholder" />
        <h3 class="feature-title">For Authors</h3>
        <p>Write together. Communicate clearly. Publish fast.</p>
        <ul class="feature-list">
          <li>Real-time collaboration</li>
          <li>Interactive figures</li>
          <li>Instant reader feedback</li>
        </ul>
      </div>
      <div class="flex-grid-item">
        <div class="image-placeholder" />
        <h3 class="feature-title">For Reviewers</h3>
        <p>Focus on the science, not the formatting.</p>
        <ul class="feature-list">
          <li>Comment threads</li>
          <li>Change tracking</li>
          <li>Compare versions with diff views</li>
        </ul>
      </div>
      <div class="flex-grid-item">
        <div class="image-placeholder">
          <NuxtImg 
            class="feature-img" 
            :src="feature3" 
            alt="Scientific document displayed responsively on multiple devices" 
            width="300" 
            height="150" 
            format="webp" 
            loading="lazy" 
          />
        </div>
        <h3 class="feature-title">For Readers</h3>
        <p>Research that fits your screen, your pace, your needs.</p>
        <ul class="feature-list">
          <li>Responsive on any device</li>
          <li>Personalize font, layout, colors and more</li>
          <li>Clean, intuitive navigation</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .flex-grid-item {
    text-align: left;
  }

  .feature-title {
    font-size: 1.125rem;
    margin: 0.5rem 0;
    font-weight: var(--weight-semi);
  }

  .feature-list {
    margin: 0;
    padding-left: 1.5rem;
    line-height: 1.6;
  }

  .feature-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .flex-grid-item p {
    line-height: 1.6;
    max-width: none;
    margin: 0;
  }
</style>