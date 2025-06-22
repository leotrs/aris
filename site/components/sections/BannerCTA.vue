<script setup>
  const demoCopy = "Explore the Demo";
</script>

<template>
  <section class="banner-cta">
    <h2>Web-native. Human-first. Built for science.</h2>
    <p>
      Create research documents that are readable, dynamic, and personalized — made for how you write, read, and collaborate.
    </p>
    <div class="buttons">
      <a href="/demo" class="btn primary">{{ demoCopy }}</a>
    </div>
  </section>
</template>

<style scoped>
  section {
    padding: 4rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  p {
    margin: 0 auto;
    max-width: 65ch;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 2rem;
    justify-content: center;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
  }

  .btn.primary {
    background: var(--primary-500);
    color: white;
  }

  .btn.primary:hover {
    background: var(--primary-600);
  }

  .banner-cta {
    text-align: center;
    background: var(--primary-950);
    color: white;
    padding: 4rem 1rem;
  }
</style>