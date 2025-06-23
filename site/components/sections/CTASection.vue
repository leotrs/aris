<script setup>
  const betaCopy = "Get Early Access";
</script>

<template>
  <section class="section-container text-center">
    <h2 class="section-heading">Experience what research should <em>feel</em> like</h2>
    <p class="section-text">
      Every Aris document is an interactive, readable, and beautifully rendered scientific
      manuscript — a modern interface between researcher and audience.
    </p>
    <div class="btn-container">
      <a href="#signup" class="btn btn-primary">{{ betaCopy }}</a>
    </div>
    <a href="#signup" class="btn btn-link">Or explore the demo</a>
  </section>
</template>

<style scoped>
  /* Component-specific styles only */
  .section-container .btn-link {
    margin-top: 1rem;
    display: block;
  }
</style>
