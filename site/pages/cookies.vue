<template>
  <div class="cookie-policy-page">
    <div class="cookie-policy-container">
      <h1 class="policy-title">Cookie Policy for Aris</h1>
      <p class="last-updated">Last Updated: <time datetime="2025-06-24">June 24, 2025</time></p>

      <section class="policy-section danger">
        <h2 class="section-title danger">DISCLAIMER: THIS IS A PLACEHOLDER AND HAS NOT BEEN APPROVED BY A LAWYER</h2>
      </section>

      <section class="policy-section">
        <h2 class="section-title">1. What are Cookies?</h2>
        <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work or work more efficiently, as well as to provide reporting information.</p>
        <p>Cookies set by the website owner (in this case, Aris) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and when it visits certain other websites.</p>
      </section>

      <section class="policy-section">
        <h2 class="section-title">2. How Aris Uses Cookies</h2>
        <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our Website. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.</p>
      </section>

      <section class="policy-section">
        <h2 class="section-title">3. Types of Cookies We Use and Their Purpose</h2>
        <p>The specific types of first- and third-party cookies served through our Website and the purposes they perform are described below:</p>

        <h3>Strictly Necessary Cookies</h3>
        <ul>
          <li><strong>Purpose:</strong> These cookies are essential to provide you with services available through our Website and to enable you to use some of its features, such as accessing secure areas. Without these cookies, services like login or shopping carts cannot be provided.</li>
          <li><strong>Data Collected:</strong> Typically anonymous session identifiers, security tokens.</li>
          <li><strong>Duration:</strong> Session-based or persistent.</li>
        </ul>

        <h3>Performance and Functionality Cookies</h3>
        <ul>
          <li><strong>Purpose:</strong> These cookies are used to enhance the performance and functionality of our Website but are non-essential to its use. However, without these cookies, certain functionality (like remembering your preferences) may become unavailable.</li>
          <li><strong>Data Collected:</strong> User preferences, basic site usage data.</li>
          <li><strong>Duration:</strong> Persistent.</li>
        </ul>

        <h3>Analytics and Customization Cookies</h3>
        <ul>
          <li><strong>Purpose:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.</li>
          <li><strong>Data Collected:</strong> Anonymized IP addresses, browser type, pages visited, time spent on pages.</li>
          <li><strong>Duration:</strong> Persistent.</li>
          <li><strong>Examples:</strong> Google Analytics (if used), other analytics tools.</li>
        </ul>

        <h3>Advertising Cookies (Targeting Cookies)</h3>
        <ul>
          <li><strong>Purpose:</strong> These cookies are used to make advertising messages more relevant to you and your interests. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</li>
          <li><strong>Data Collected:</strong> Browse habits, interaction with ads.</li>
          <li><strong>Duration:</strong> Persistent.</li>
          <li><strong>Examples:</strong> Google Ads, social media pixels (if used).</li>
        </ul>
      </section>

      <section class="policy-section">
        <h2 class="section-title">4. How You Can Control Cookies</h2>
        <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie consent banner, if applicable, or by setting your preferences within your web browser.</p>
        <ul>
          <li><strong>Browser Controls:</strong> Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" class="text-link">www.allaboutcookies.org</a>.</li>
          <li><strong>Opting Out of Advertising:</strong> You can learn more about how to opt out of interest-based advertising by visiting the Network Advertising Initiative's (NAI) <a href="http://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" class="text-link">Consumer Opt-Out page</a> or the Digital Advertising Alliance's (DAA) <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" class="text-link">Your Ad Choices page</a>.</li>
        </ul>
      </section>

      <section class="policy-section">
        <h2 class="section-title">5. Changes to Our Cookie Policy</h2>
        <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
      </section>

      <section class="policy-section">
        <h2 class="section-title">6. Contact Us</h2>
        <p>If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:support@aris.pub" class="text-link">support@aris.com</a> or visit our <a href="/contact" class="text-link">Contact Us page</a>.</p>
      </section>

    </div>
  </div>
</template>

<script setup>
  // For a static page like this, no specific script logic is usually needed.
  // definePageMeta({
  //   title: 'Cookie Policy - Aris',
  //   description: 'Understand how Aris uses cookies on its website.',
  // });
</script>

<style scoped>
  .cookie-policy-page {
    background-color: var(--surface-bg);
    padding: 80px var(--side-padding, 24px);
    font-family: 'Source Sans 3', sans-serif;
    color: var(--gray-800);
  }

  .cookie-policy-container {
    max-width: 900px;
    margin: 0 auto;
    background-color: var(--surface-page);
    padding: 50px;
    border-radius: 12px;
    box-shadow: var(--shadow-soft);
  }

  .policy-title {
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

  .policy-section {
    margin-bottom: 40px;
  }

  .section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 15px;
    border-bottom: 1px solid var(--gray-200);
    padding-bottom: 8px;
  }

  h3 {
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-800);
    margin-top: 30px;
    margin-bottom: 15px;
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

  /* Links within the policy document */
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
    .cookie-policy-page {
      padding: 60px var(--side-padding, 20px);
    }

    .cookie-policy-container {
      padding: 30px;
      border-radius: 8px;
    }

    .policy-title {
      font-size: 32px;
    }

    .last-updated {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 22px;
    }

    h3 {
      font-size: 18px;
    }

    p, ul li {
      font-size: 16px;
      line-height: 1.6;
    }
  }

  @media (max-width: 480px) {
    .cookie-policy-page {
      padding: 40px var(--side-padding-mobile, 16px);
    }

    .cookie-policy-container {
      padding: 25px;
    }

    .policy-title {
      font-size: 28px;
    }

    .section-title {
      font-size: 20px;
    }

    h3 {
      font-size: 16px;
    }

    p, ul li {
      font-size: 15px;
    }
  }

  .danger {
    color: var(--error-700);
  }
</style>
