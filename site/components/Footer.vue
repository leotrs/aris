<script setup></script>

<template>
  <footer class="main-footer">
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
          <ul class="footer-links">
            <li><a href="#" class="footer-link">BlueSky</a></li>
            <li><a href="#" class="footer-link">LinkedIn</a></li>
            <li><a href="#" class="footer-link">Twitter</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <img src="@/assets/logo-32px-gray.svg" alt="Aris Logo" class="footer-logo" />

        <p class="footer-bottom-text">© 2025 Aris. All rights reserved.</p>
        <div class="footer-legal-links">
          <a href="/terms" class="footer-legal-link">Terms & Conditions</a>
          <a href="/cookies" class="footer-legal-link">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
  /* Main Footer Container */
  .main-footer {
    background-color: var(--primary-900); /* Deep blue background as per design */
    color: var(--gray-200); /* Default text color for the footer */
    padding: 80px 0; /* Generous vertical padding */
    font-family: "Source Sans 3", sans-serif;
  }

  /* Content Wrapper - Max-width & Centering */
  .footer-content-wrapper {
    max-width: 1200px; /* Standard content width */
    margin: 0 auto; /* Center the wrapper */
    padding: 0 var(--side-padding, 24px); /* Side padding */
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
    color: var(--gray-200); /* Link color */
    text-decoration: none;
    font-size: 18px;
    transition: color 0.2s ease-in-out;
  }

  .footer-link:hover {
    color: var(--primary-500); /* Primary blue on hover */
  }

  /* Social Icons */
  .social-icons {
    display: flex;
    gap: 20px; /* Space between social icons */
  }

  .social-icon-link {
    color: var(--gray-200); /* Icon color */
    transition: color 0.2s ease-in-out;
    display: inline-flex; /* Ensures proper alignment if there's padding/margin */
  }

  .social-icon-link:hover {
    color: var(--primary-500); /* Primary blue on hover */
  }

  .social-icon-link svg {
    width: 28px; /* Size of social icons */
    height: 28px;
  }

  /* Footer Bottom Section */
  .footer-bottom {
    border-top: 1px solid var(--gray-700); /* Thin line separates main footer from bottom */
    padding-top: 40px;
    text-align: center;
  }

  .footer-logo {
    max-width: 100px; /* Smaller logo for the footer */
    height: auto;
    margin: 0 auto 20px auto; /* Center logo with space below */
    filter: grayscale(100%) brightness(200%); /* Example for monochromatic/light logo */
    opacity: 0.8; /* Slightly less prominent */
  }

  .footer-bottom-text {
    font-size: 16px;
    color: var(--gray-400); /* Slightly muted color for copyright text */
    margin-bottom: 10px;
  }

  .footer-legal-links {
    display: flex;
    justify-content: center;
    gap: 20px; /* Space between legal links */
    flex-wrap: wrap; /* Allow wrapping on small screens */
  }

  .footer-legal-link {
    font-size: 16px;
    color: var(--gray-400); /* Muted color for legal links */
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }

  .footer-legal-link:hover {
    color: var(--primary-500); /* Primary blue on hover */
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .main-footer {
      padding: 60px 0;
    }

    .footer-columns {
      grid-template-columns: 1fr; /* Stack columns vertically on smaller screens */
      gap: 40px; /* Adjust gap for stacked layout */
      text-align: center; /* Center align content in columns */
    }

    .column-heading {
      margin-bottom: 15px; /* Adjust spacing */
    }

    .footer-links li {
      margin-bottom: 10px;
    }

    .social-icons {
      justify-content: center; /* Center social icons when stacked */
    }

    .footer-bottom {
      padding-top: 30px;
    }

    .footer-logo {
      max-width: 80px;
    }
  }

  @media (max-width: 480px) {
    .main-footer {
      padding: 40px 0;
    }
    .footer-bottom {
      padding-top: 20px;
    }
    .footer-legal-links {
      flex-direction: column; /* Stack legal links too */
      gap: 5px; /* Smaller gap when stacked */
    }
  }
</style>
