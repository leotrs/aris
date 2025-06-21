<script setup>
  import NavBar from '@/components/NavBar.vue'
  import logoFull from "@/assets/logo-32px.svg";

  const demoCopy = "Explore the Demo";
  const betaCopy = "Get Early Access";
</script>

<template>
  <div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-image"></div>
        <div class="hero-text">
          <h1>Scientific publishing, reimagined for the web</h1>
          <p>
            Aris is a new way to author and publish research — clear, interactive, and designed for modern science.
          </p>
        </div>
      </div>
    </section>

    <!-- Dark Banner CTA -->
    <section class="banner-cta">
      <h2>Web-native. Human-first. Built for science.</h2>
      <p>
        Create research documents that are readable, dynamic, and personalized — made for how you write, read, and collaborate.
      </p>
      <div class="buttons">
        <a href="/demo" class="btn primary">{{ demoCopy }}</a>
      </div>
    </section>

    <!-- Visual Features -->
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
          <div class="image-placeholder" />
          <h3>For Readers</h3>
          <p>Research that fits your screen, your pace, your needs.</p>
          <ul>
            <li>Responsive on any device</li>
            <li>Accessibility features like font and layout controls</li>
            <li>Clean, intuitive navigation</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process">
      <p class="label text-label">Process</p>
      <h2>From idea to publication — all in one space</h2>
      <p>
        Aris supports your research from first draft to final release, with built-in tools for writing, reviewing, and sharing.
      </p>
      <div class="steps">
        <div class="step">
          <h3>Step 1: Write</h3>
          <p>Start with a clean editor built for research. No templates or formatting battles.</p>
        </div>
        <div class="step">
          <h3>Step 2: Collaborate</h3>
          <p>Invite co-authors, reviewers, and colleagues to read and comment in real time.</p>
        </div>
        <div class="step">
          <h3>Step 3: Share</h3>
          <p>Publish a polished document that’s accessible and professional — instantly and online.</p>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
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

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div>
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
            <li><a href="#">Bluesky</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>
          <p>© 2025 Aris. All rights reserved.</p>
        </div>
        <div>
          <img id="logo" :src="logoFull" alt="Aris logo" />
        </div>
        <div>
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
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

  .btn.secondary {
    background: var(--gray-50);
    color: var(--primary-800);
  }

  .btn.secondary:hover {
    background: var(--gray-200);
  }

  .btn.link {
    background: transparent;
    color: var(--primary-500);
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
    background: var(--extra-light);
    border-radius: 8px;
  }

  .hero-text {
    flex: 1;
  }

  /* Banner CTA */
  .banner-cta {
    text-align: center;
    background: var(--primary-950);
    color: white;
    padding: 4rem 1rem;
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

  /* Process Section */
  .process {
    text-align: center;
  }

  .label {
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .feature-box p,
  .step p {
    line-height: 1.6;
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
    background: var(--gray-75);
    padding: 1.5rem;
    border-radius: 8px;
    text-align: left;
  }

  /* CTA */
  .cta {
    text-align: center;
    background-color: var(--gray-100);
    padding: 4rem 1rem;
    border-top: var(--border-extrathin) solid var(--gray-200);
  }

  /* Footer */
  .footer {
    background: var(--primary-950);
    color: var(--almost-white);
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
    color: var(--light);
    text-decoration: none;
  }

  .footer a:hover {
    text-decoration: underline;
  }

  .footer #logo {
    width: 30px;
    height: 30px;
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
    background: var(--primary-500);
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
    border-top: var(--border-extrathin) solid var(--gray-700);
    padding-top: 1rem;
  }

  .footer-bottom > div {
    flex:1;
    display: flex;
    align-items: center;

    &:nth-child(1) {
      justify-content: left;
    }

    &:nth-child(2) {
      justify-content: center;
    }

    &:nth-child(3) {
      justify-content: right;
    }
  }

  .footer-bottom p {
    margin-bottom: 0;
  }

  .footer-bottom ul {
    display: flex;
    gap: 1rem;
  }
</style>
