<script setup>
  import feature3 from "@/assets/feature3.png";
</script>

<template>
  <section class="section-container text-center">
    <p class="section-label">Features</p>
    <h2 class="section-heading">Every step from idea to impact</h2>
    <p class="section-text">
      Connect the entire research workflow — writing, reviewing, publishing, and reading — in one
      web-native environment designed for collaboration and discovery.
    </p>
    <div class="flex-grid">
      <div class="flex-grid-item">
        <div class="image-placeholder" />
        <h3 class="feature-title">Publish Faster</h3>
        <p>Semantic markup lets you focus on content, not typesetting.</p>
        <ul class="feature-list">
          <li>RSM language separates meaning from presentation</li>
          <li>Real-time collaborative editing</li>
          <li>Version tracking through drafts and publications</li>
        </ul>
      </div>
      <div class="flex-grid-item">
        <div class="image-placeholder" />
        <h3 class="feature-title">Review Smarter</h3>
        <p>Threaded discussions tied directly to content sections.</p>
        <ul class="feature-list">
          <li>Comments attached to specific passages</li>
          <li>Visual diff views between versions</li>
          <li>Track changes from submission to publication</li>
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
        <h3 class="feature-title">Reach More Readers</h3>
        <p>Web-native documents that adapt to every reader.</p>
        <ul class="feature-list">
          <li>Responsive design for any screen size</li>
          <li>Personal accessibility and reading preferences</li>
          <li>Semantic search and discovery by tags</li>
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
