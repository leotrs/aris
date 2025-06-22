<script setup>
  const betaCopy = "Get Early Access";
</script>

<template>
  <section class="cta">
    <h2>Experience what research should <em>feel</em> like</h2>
    <p>
      Every Aris document is an interactive, readable, and beautifully rendered scientific
      manuscript — a modern interface between researcher and audience.
    </p>
    <div class="buttons">
      <a href="#signup" class="btn primary">{{ betaCopy }}</a>
    </div>
    <a href="#signup" class="">Or explore the demo</a>
  </section>
</template>

<style scoped>
  section {
    padding: 4rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  h2 {
    font-weight: var(--weight-semi);
    margin-bottom: 1rem;
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

  .cta {
    text-align: center;
    padding: 4rem 1rem;
  }
</style>