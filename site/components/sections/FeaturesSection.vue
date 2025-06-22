<script setup>
  import feature3 from "@/assets/feature3.png";
</script>

<template>
  <section class="features">
    <p class="label text-label">Features</p>
    <h2>Built for every part of the research journey</h2>
    <p>
      Aris adapts to how you write, review, and read — so science flows better for everyone.
    </p>
    <div class="feature-grid">
      <div class="feature-box">
        <div class="image-placeholder" />
        <h3>For Authors</h3>
        <p>Write together. Communicate clearly. Publish fast.</p>
        <ul>
          <li>Real-time collaboration</li>
          <li>Interactive figures</li>
          <li>Instant reader feedback</li>
        </ul>
      </div>
      <div class="feature-box">
        <div class="image-placeholder" />
        <h3>For Reviewers</h3>
        <p>Focus on the science, not the formatting.</p>
        <ul>
          <li>Comment threads</li>
          <li>Change tracking</li>
          <li>Compare versions with diff views</li>
        </ul>
      </div>
      <div class="feature-box">
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
        <h3>For Readers</h3>
        <p>Research that fits your screen, your pace, your needs.</p>
        <ul>
          <li>Responsive on any device</li>
          <li>Personalize font, layout, colors and more</li>
          <li>Clean, intuitive navigation</li>
        </ul>
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

  h2, h3 {
    font-weight: var(--weight-semi);
    margin-bottom: 1rem;
  }

  p {
    margin: 0 auto;
    max-width: 65ch;
  }

  .features {
    text-align: center;
  }

  .feature-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 2rem;
    justify-content: center;
  }

  .feature-box {
    flex: 1 1 250px;
    background: var(--gray-75);
    padding: 2rem;
    border-radius: 8px;
    text-align: left;
  }

  .image-placeholder {
    width: 100%;
    height: 150px;
    background: var(--medium);
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .feature-box h3 {
    font-size: 1.125rem;
    margin: 0.5rem 0;
  }

  .feature-img {
    height: 150px;
  }

  .label {
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .feature-box p {
    line-height: 1.6;
  }
</style>