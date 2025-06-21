<!-- components/NavBar.vue -->
<template>
  <nav class="nav">
    <a href="/" class="logo">Aris</a>
    <a href="/demo" class="link">Try the Demo</a>
  </nav>
</template>

<style scoped>
  .nav {
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }
  .logo {
    font-weight: bold;
    font-size: 1.25rem;
    text-decoration: none;
  }
  .link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }
</style>
