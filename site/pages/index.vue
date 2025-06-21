<!-- pages/index.vue -->
<template>
  <main class="container">
    <h1>Aris</h1>
    <p>Web-native scientific publishing. No PDFs. Just interactive, human-first research.</p>
    <a href="/demo" class="cta-button">Try the demo</a>
    <section class="product-section">
  <h2>No more PDFs.</h2>
  <p>Aris turns research into interactive, web-native documents — accessible, responsive, and human-first.</p>
    </section>
  </main>
  <footer class="footer">
  <p>Be the first to try Aris. Get early access.</p>
  <button>Join the waitlist</button>
  </footer>
</template>




<style scoped>
  .container {
    max-width: 800px;
    margin: 6rem auto;
    text-align: center;
    padding: 0 1rem;
  }
  .cta-button {
    display: inline-block;
    margin-top: 2rem;
    padding: 0.75rem 1.5rem;
    font-weight: bold;
    color: white;
    background: #3b82f6;
    border-radius: 0.5rem;
    text-decoration: none;
  }
  .cta-button:hover {
    background: #2563eb;
  }

  .product-section {
    padding: 4rem 1rem;
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
  }
  .footer {
    margin-top: 6rem;
    padding: 3rem 1rem;
    background: #f1f5f9;
    text-align: center;
  }
  button {
    background: #3b82f6;
    color: white;
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: 0.5rem;
    margin-top: 1rem;
    font-weight: bold;
  }
</style>
