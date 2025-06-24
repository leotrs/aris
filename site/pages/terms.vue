<template>
  <div class="terms-page">
    <div class="terms-container">
      <h1 class="terms-title">Terms and Conditions</h1>
      <p class="last-updated">Last Updated: <time datetime="2025-06-24">June 24, 2025</time></p>

      <section class="terms-section">
        <h2 class="section-title danger">DISCLAIMER: THIS IS A PLACEHOLDER AND HAS NOT BEEN APPROVED BY A LAWYER</h2>
      </section>

      <section class="terms-section">
        <h2 class="section-title">1. Introduction</h2>
        <p>Welcome to Aris! These Terms and Conditions ("Terms") govern your access to and use of Aris's website, products, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you disagree with any part of the terms, then you may not access the Service.</p>
      </section>

      <section class="terms-section">
        <h2 class="section-title">2. User Obligations</h2>
        <p>By using the Aris Service, you agree to:</p>
        <ul>
          <li>Provide accurate and complete information during registration and use of the Service.</li>
          <li>Maintain the confidentiality of your account password and notify us immediately of any unauthorized use.</li>
          <li>Use the Service only for lawful purposes and in accordance with these Terms.</li>
          <li>Not engage in any activity that interferes with or disrupts the Service (or the servers and networks which are connected to the Service).</li>
          <li>Not reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission from Aris.</li>
        </ul>
      </section>

      <section class="terms-section">
        <h2 class="section-title">3. Intellectual Property Rights</h2>
        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Aris and its licensors. The Service is protected by copyright, trademark, and other laws of both Germany and foreign countries.</p>
        <p>Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Aris.</p>
      </section>

      <section class="terms-section">
        <h2 class="section-title">4. AI Copilot Usage and Data</h2>
        <p>The Aris AI Copilot feature leverages artificial intelligence. While we strive for accuracy and relevance, you acknowledge that:</p>
        <ul>
          <li>AI-generated content may not always be 100% accurate, complete, or up-to-date.</li>
          <li>You are solely responsible for verifying any AI-generated information before relying on it or acting upon it.</li>
          <li>Any data you input into the AI Copilot will be handled in accordance with our Privacy Policy. We take extensive measures to ensure data privacy and security.</li>
          <li>You will not input sensitive personal data or proprietary information that is not authorized for AI processing.</li>
        </ul>
      </section>

      <section class="terms-section">
        <h2 class="section-title">5. Disclaimer of Warranties</h2>
        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Aris makes no representations or warranties of any kind, express or implied, as to the operation of their Service, or the information, content, or materials included therein. You expressly agree that your use of the Service is at your sole risk.</p>
      </section>

      <section class="terms-section">
        <h2 class="section-title">6. Limitation of Liability</h2>
        <p>In no event shall Aris, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>
      </section>

      <section class="terms-section">
        <h2 class="section-title">7. Governing Law and Jurisdiction</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of Germany, without regard to its conflict of law provisions.</p>
        <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.</p>
      </section>

      <section class="terms-section">
        <h2 class="section-title">8. Changes to These Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        <p>By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.</p>
      </section>

      <section class="terms-section">
        <h2 class="section-title">9. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us:</p>
        <ul>
          <li>By email: <a href="mailto:support@aris.pub" class="text-link">support@aris.com</a></li>
          <li>By visiting this page on our website: <a href="/contact" class="text-link">aris.com/contact</a></li>
        </ul>
      </section>

    </div>
  </div>
</template>

<script setup>
  // For a static page like this, no specific script logic is usually needed.
  // You might use definePageMeta for SEO/layout if required by your Nuxt setup.
  // definePageMeta({
  //   title: 'Terms and Conditions - Aris',
  //   description: 'Review the Terms and Conditions for using Aris services.',
  // });
</script>

<style scoped>
  .terms-page {
    background-color: var(--surface-bg); /* Light background for the page */
    padding: 80px var(--side-padding, 24px); /* Generous padding top/bottom */
    font-family: 'Source Sans 3', sans-serif;
    color: var(--gray-800);
  }

  .terms-container {
    max-width: 900px; /* Readable width for long text */
    margin: 0 auto;
    background-color: var(--surface-page); /* White background for content */
    padding: 50px;
    border-radius: 12px;
    box-shadow: var(--shadow-soft); /* Subtle shadow */
  }

  .terms-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 38px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 10px;
    text-align: center;
  }

  .last-updated {
    font-size: 16px;
    color: var(--gray-500);
    margin-bottom: 40px;
    text-align: center;
  }

  .terms-section {
    margin-bottom: 40px; /* Space between sections */
  }

  .section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 15px;
    border-bottom: 1px solid var(--gray-200); /* Subtle line below title */
    padding-bottom: 8px;
  }

  p {
    font-size: 17px;
    line-height: 1.7;
    margin-bottom: 15px;
  }

  ul {
    list-style: disc;
    padding-left: 25px;
    margin-bottom: 15px;
  }

  ul li {
    font-size: 17px;
    line-height: 1.6;
    margin-bottom: 8px;
  }

  /* Links within the terms document */
  .text-link {
    color: var(--primary-500);
    text-decoration: underline;
    font-weight: 600;
    transition: color 0.2s ease-in-out;
  }

  .text-link:hover {
    color: var(--primary-600);
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .terms-page {
      padding: 60px var(--side-padding, 20px);
    }

    .terms-container {
      padding: 30px;
      border-radius: 8px;
    }

    .terms-title {
      font-size: 32px;
    }

    .last-updated {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 22px;
    }

    p, ul li {
      font-size: 16px;
      line-height: 1.6;
    }
  }

  @media (max-width: 480px) {
    .terms-page {
      padding: 40px var(--side-padding-mobile, 16px);
    }

    .terms-container {
      padding: 25px;
    }

    .terms-title {
      font-size: 28px;
    }

    .section-title {
      font-size: 20px;
    }

    p, ul li {
      font-size: 15px;
    }
  }

  .danger {
    color: var(--error-700);
  }
</style>
