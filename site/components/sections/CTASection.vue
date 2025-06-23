<script setup>
  const betaCopy = "Get Early Access";
</script>

<template>
  <section class="section-container text-center">
    <h2 class="section-heading">Experience what research should <em>feel</em> like</h2>
    <p class="section-text">
      Aris is not better LaTeX, and Aris is not better PDF. Aris is something new — the first
      platform built specifically for web-native research, connecting authors, reviewers, and
      readers in one seamless environment.
    </p>
    <div class="btn-container">
      <a href="#signup" class="btn btn-primary">{{ betaCopy }}</a>
    </div>
    <a href="/demo" class="btn btn-link">Or explore the demo</a>
  </section>
</template>

<style scoped>
  /* Component-specific styles only */
  .section-container .btn-link {
    margin-top: 1rem;
    display: block;
  }
</style>
