<script setup>
  import {
    IconBrandBluesky,
    IconBrandLinkedin,
    IconBrandX,
    IconChevronUp,
  } from "@tabler/icons-vue";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
</script>

<template>
  <footer class="main-footer" role="contentinfo">
    <div class="footer-content-wrapper">
      <div class="footer-columns">
        <div class="footer-column">
          <h4 class="column-heading">Resources</h4>
          <ul class="footer-links">
            <li><a href="/blog" class="footer-link">Blog</a></li>
            <li><a href="https://docs.aris.pub/" class="footer-link">Documentation</a></li>
            <li><a href="/contact" class="footer-link">Contact</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="column-heading">Product</h4>
          <ul class="footer-links">
            <li><a href="https://app.aris.pub/demo" class="footer-link">Demo</a></li>
            <li><a href="/pricing" class="footer-link">Pricing</a></li>
            <li><a href="https://github.com/leotrs/aris" class="footer-link">GitHub</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="column-heading">Connect</h4>
          <div class="social-icons">
            <a href="#" class="social-icon-link" aria-label="Follow us on BlueSky">
              <IconBrandBluesky />
            </a>
            <a href="#" class="social-icon-link" aria-label="Follow us on LinkedIn">
              <IconBrandLinkedin />
            </a>
            <a href="#" class="social-icon-link" aria-label="Follow us on X (Twitter)">
              <IconBrandX />
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-branding">
          <img src="@/assets/logo-32px-gray.svg" alt="Aris Logo" class="footer-logo" />
          <p class="footer-tagline">
            Transforming scientific research through human-first technology
          </p>

          <div class="footer-legal">
            <p class="footer-bottom-text">© 2025 Aris. All rights reserved.</p>
            <div class="footer-legal-links">
              <a href="/terms" class="footer-legal-link">Terms & Conditions</a>
              <a href="/cookies" class="footer-legal-link">Cookie Policy</a>
            </div>
          </div>

          <button class="back-to-top" aria-label="Back to top" @click="scrollToTop">
            <IconChevronUp />
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
  /* Main Footer Container */
  .main-footer {
    background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%);
    color: var(--gray-200);
    padding: 80px 0 40px 0;
    font-family: "Source Sans 3", sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Decorative background pattern */
  .main-footer::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }

  /* Content Wrapper - Max-width & Centering */
  .footer-content-wrapper {
    max-width: 1200px; /* Standard content width */
    margin: 0 auto; /* Center the wrapper */
    padding: 0 32px; /* Better side padding for desktop */
  }

  /* Footer Columns Layout */
  .footer-columns {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Three equal columns on desktop */
    gap: 60px; /* Space between columns */
    margin-bottom: 60px; /* Space above the bottom section */
  }

  .footer-column {
    /* No specific styles needed here, children will be styled */
  }

  .column-heading {
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--gray-100); /* Slightly lighter heading color */
    margin-bottom: 25px; /* Space below heading */
  }

  .footer-links {
    list-style: none; /* Remove bullet points */
    padding: 0;
    margin: 0;
  }

  .footer-links li {
    margin-bottom: 15px; /* Space between links */
  }

  .footer-link {
    color: var(--gray-200);
    text-decoration: none;
    font-size: 18px;
    transition: all 0.3s ease;
    display: inline-block;
  }

  .footer-link:hover {
    color: var(--primary-300);
    transform: translateX(4px);
  }

  /* Social Icons */
  .social-icons {
    display: flex;
    gap: 16px;
    margin-top: 8px;
  }

  .social-icon-link {
    color: var(--gray-300);
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
  }

  .social-icon-link:hover {
    color: var(--primary-200);
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .social-icon-link svg {
    width: 22px;
    height: 22px;
  }

  /* Footer Bottom Section */
  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    position: relative;
  }

  .footer-branding {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .footer-logo {
    height: 32px;
    width: auto;
    filter: grayscale(100%) brightness(200%);
    opacity: 0.8;
  }

  .footer-tagline {
    font-size: 14px;
    color: var(--gray-400);
    font-style: italic;
    max-width: 300px;
  }

  .footer-legal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .footer-bottom-text {
    font-size: 14px;
    color: var(--gray-400);
    margin: 0;
  }

  .footer-legal-links {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .footer-legal-link {
    font-size: 14px;
    color: var(--gray-400);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-legal-link:hover {
    color: var(--primary-300);
  }

  /* Back to Top Button */
  .back-to-top {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-300);
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .back-to-top:hover {
    background: rgba(255, 255, 255, 0.15);
    color: var(--primary-200);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .back-to-top svg {
    width: 20px;
    height: 20px;
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .main-footer {
      padding: 60px 0 30px 0;
    }

    .footer-content-wrapper {
      padding: 0 16px; /* Tighter padding on mobile */
    }

    .footer-columns {
      grid-template-columns: 1fr;
      gap: 40px;
      text-align: center;
    }

    .column-heading {
      margin-bottom: 15px;
    }

    .footer-links li {
      margin-bottom: 10px;
    }

    .social-icons {
      justify-content: center;
    }

    .footer-bottom {
      padding-top: 30px;
      flex-direction: column;
      text-align: center;
      gap: 20px;
    }

    .footer-branding {
      align-items: center;
      text-align: center;
    }

    .footer-tagline {
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .main-footer {
      padding: 40px 0 20px 0;
    }

    .footer-bottom {
      padding-top: 20px;
    }

    .footer-legal-links {
      flex-direction: column;
      gap: 8px;
    }

    .back-to-top {
      width: 44px;
      height: 44px;
    }
  }
</style>
