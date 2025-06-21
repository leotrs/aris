<script setup>
  import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-image"></div>
        <div class="hero-text">
          <h1>Transforming Research Publishing for the Digital Age</h1>
          <p>
            Experience the future of research publishing with Aris. Join a community that values accessibility, clarity, and innovation.
          </p>
        </div>
      </div>
    </section>

    <!-- Dark Banner CTA -->
    <section class="banner-cta">
      <h2>Experience the Future of Publishing</h2>
      <p>Transform your research into interactive, accessible publications that engage readers worldwide.</p>
      <div class="buttons">
        <a href="/demo" class="btn primary">Try</a>
        <a href="#signup" class="btn secondary">Join</a>
      </div>
    </section>

    <!-- Visual Features -->
    <section class="features">
      <h2>Discover the future of research publishing with Aris's innovative platform.</h2>
      <p>
        Aris transforms traditional publishing into a dynamic, web-native experience. Designed for seamless collaboration, immersive content, and broad accessibility.
      </p>
      <div class="feature-grid">
        <div class="feature-box">
          <div class="image-placeholder" />
          <h3>Responsive by Design</h3>
          <p>Research that looks great on every screen, from desktop to mobile.</p>
          <a href="#">Demo →</a>
        </div>
        <div class="feature-box">
          <div class="image-placeholder" />
          <h3>Interactive & Immersive</h3>
          <p>Engage your audience with live visuals and dynamic content.</p>
          <a href="#">Explore →</a>
        </div>
        <div class="feature-box">
          <div class="image-placeholder" />
          <h3>Accessible to All</h3>
          <p>Inclusive and readable, making your work available to everyone.</p>
          <a href="#">Join →</a>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process">
      <p class="label">Process</p>
      <h2>Transform Your Research into Impactful Publications</h2>
      <p>We streamline your publishing journey: from draft to publication, Aris empowers you every step of the way.</p>
      <div class="steps">
        <div class="step">
          <h3>Step 1: Author Your Work</h3>
          <p>Begin by writing your research using Aris or importing from other tools.</p>
        </div>
        <div class="step">
          <h3>Step 2: Iterate for Perfection</h3>
          <p>Collaborate with peers, add interactivity, and polish your findings.</p>
        </div>
        <div class="step">
          <h3>Step 3: Publish with Ease</h3>
          <p>Share your work with the world — accessible, beautiful, and web-native.</p>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="cta">
      <h2>Start Your Publishing Journey Today</h2>
      <p>Experience the future of scientific publishing with Aris.</p>
      <div class="buttons">
        <a href="/demo" class="btn primary">Try</a>
        <a href="#signup" class="btn secondary">Join</a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div>
          <p><strong>Logo</strong></p>
          <p>Subscribe to get the latest Aris features and updates.</p>
          <form class="newsletter">
            <input type="email" placeholder="Your email" />
            <button>Subscribe</button>
          </form>
        </div>
        <div>
          <p><strong>Resources</strong></p>
          <ul>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <p><strong>Connect</strong></p>
          <ul>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Mastodon</a></li>
            <li><a href="#">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Aris. All rights reserved.</p>
        <ul>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Cookies</a></li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  /* Shared */
  section {
    padding: 4rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1, h2, h3 {
    font-weight: bold;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
  }

  .btn.primary {
    background: #3b82f6;
    color: white;
  }

  .btn.primary:hover {
    background: #2563eb;
  }

  .btn.secondary {
    background: #f3f4f6;
    color: #111827;
  }

  .btn.link {
    background: transparent;
    color: #3b82f6;
  }

  /* Hero */
  .hero-content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2rem;
  }

  .hero-image {
    flex: 1;
    min-height: 200px;
    background: #e2e8f0;
    border-radius: 8px;
  }

  .hero-text {
    flex: 1;
  }

  /* Banner CTA */
  .banner-cta {
    text-align: center;
    background: #1f2937;
    color: white;
    padding: 4rem 1rem;
  }

  .banner-cta .buttons {
    justify-content: center;
  }

  /* Features Grid */
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
    background: #f9fafb;
    padding: 2rem;
    border-radius: 8px;
    text-align: left;
  }

  .image-placeholder {
    width: 100%;
    height: 150px;
    background: #d1d5db;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .feature-box h3 {
    font-size: 1.125rem;
    margin: 0.5rem 0;
  }

  /* Process Section */
  .process {
    text-align: center;
  }

  .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .steps {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 2rem;
    justify-content: center;
  }

  .step {
    flex: 1 1 250px;
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: left;
  }

  /* CTA */
  .cta {
    text-align: center;
    background: #f3f4f6;
    padding: 4rem 1rem;
  }

  /* Footer */
  .footer {
    background: #1f2937;
    color: #e5e7eb;
    padding: 3rem 1rem;
    font-size: 0.9rem;
  }

  .footer-content {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .footer-content div {
    flex: 1 1 200px;
  }

  .footer ul {
    list-style: none;
    padding: 0;
  }

  .footer a {
    color: #e5e7eb;
    text-decoration: none;
  }

  .footer a:hover {
    text-decoration: underline;
  }

  .newsletter {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
  }

  .newsletter input {
    flex: 1;
    padding: 0.5rem;
    border-radius: 4px;
    border: none;
  }

  .newsletter button {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    border: none;
    color: white;
    border-radius: 4px;
    font-weight: bold;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    border-top: 1px solid #374151;
    padding-top: 1rem;
  }

  .footer-bottom ul {
    display: flex;
    gap: 1rem;
  }
</style>
