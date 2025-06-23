<script setup>
  import logoFull from "@/assets/logo-32px.svg";
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div>
        <p><strong>Stay Updated</strong></p>
        <p>
          Want updates on Aris development?
          <a href="#signup" class="footer-signup-link">Sign up for early access </a>
          and we'll keep you informed on our progress.
        </p>
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
        <NuxtImg
          id="logo"
          :src="logoFull"
          alt="Aris logo"
          width="30"
          height="30"
          format="svg"
          loading="lazy"
        />
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
</template>

<style scoped>
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

  .footer-signup-link {
    color: var(--primary-300);
    text-decoration: underline;
  }

  .footer-signup-link:hover {
    color: var(--primary-200);
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
    flex: 1;
    display: flex;
    align-items: center;
  }

  .footer-bottom > div:nth-child(1) {
    justify-content: left;
  }

  .footer-bottom > div:nth-child(2) {
    justify-content: center;
  }

  .footer-bottom > div:nth-child(3) {
    justify-content: right;
  }

  .footer-bottom p {
    margin-bottom: 0;
  }

  .footer-bottom ul {
    display: flex;
    gap: 1rem;
  }
</style>
