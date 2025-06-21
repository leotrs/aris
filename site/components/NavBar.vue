<script setup>
  import logoFull from "@/assets/logo-32px.svg";
</script>

<template>
  <nav class="nav">
    <a href="/" class="logo-wrapper">
      <img id="logo" :src="logoFull" alt="Aris logo" />
      <span id="type">Aris</span>
    </a>
    <a href="/demo" class="link">Try the Demo</a>
  </nav>
</template>

<style scoped>
  .nav {
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: white;
    box-shadow: var(--shadow-soft);
  }

  #logo {
    height: 30px;
    width: 30px;
    margin-bottom: -8px;
  }

  #type {
    font-weight: var(--weight-bold);
    margin-left: 8px;
    font-size: 24px;
    color: var(--information-700);
  }

  .link {
    color: var(--information-600);
    font-weight: var(--weight-regular);
  }
</style>
