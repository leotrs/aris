<template>
  <div class="page-layout">
    <AppNavbar />

    <section class="page-content">
      <div class="container">
        <slot />
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<style>
  .page-layout {
    min-height: 100vh;
    background: var(--surface-page);
    overflow-x: hidden;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  .page-content {
    padding: 7rem 0;
    background: var(--surface-page);
    position: relative;
  }

  /* Section Headers */
  .section-header {
    font-family: "Georgia", serif;
    font-size: var(--h2-size);
    font-weight: var(--weight-semi);
    color: var(--text-body);
    text-align: left;
    margin: 0 0 2rem 0;
    line-height: var(--header-line-height);
  }

  .section-subheader {
    font-family: "Source Sans 3", sans-serif;
    font-size: 1.25rem;
    font-weight: var(--weight-semi);
    color: var(--text-body);
    text-align: left;
    margin: 2rem 0 1rem 0;
    line-height: var(--header-line-height);
  }

  /* Content Styles */
  .intro-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: left;
  }

  .intro-content p {
    font-family: "Source Sans 3", sans-serif;
    font-size: 1.1rem;
    color: var(--text-body);
    line-height: var(--body-line-height);
    margin: 0 0 1.5rem 0;
  }

  .intro-content ul {
    font-family: "Source Sans 3", sans-serif;
    font-size: 1.1rem;
    color: var(--text-body);
    line-height: var(--body-line-height);
    margin: 0 0 1.5rem 0;
    padding-left: 2rem;
  }

  .intro-content li {
    margin: 0 0 0.5rem 0;
  }

  .intro-content h4 {
    font-family: "Montserrat", sans-serif;
    font-size: 1.1rem;
    font-weight: var(--weight-semi);
    color: var(--text-body);
    margin: 1.5rem 0 0.75rem 0;
    line-height: var(--header-line-height);
  }

  /* Benefit Card */
  .benefit-card {
    background: var(--surface-page);
    padding: 2rem;
    border-radius: 16px;
    border: var(--border-extrathin) solid var(--border-primary);
    box-shadow: var(--shadow-soft);
    margin: 2rem 0;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
  }

  .benefit-card:hover {
    transform: translateY(-2px);
    border-color: var(--primary-400);
    box-shadow:
      var(--shadow-soft),
      0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .benefit-card p {
    font-family: "Source Sans 3", sans-serif;
    color: var(--dark);
    line-height: var(--body-line-height);
    margin: 0 0 1rem 0;
  }

  .benefit-card p:last-child {
    margin-bottom: 0;
  }

  /* Page subtitle styling */
  .page-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 1rem;
    font-weight: var(--weight-medium);
    color: var(--medium);
    margin: -0.5rem 0 0.5rem 0;
  }

  /* Legal info styling */
  .legal-info {
    font-size: 0.9rem;
    color: var(--dark);
    margin: 0;
  }

  /* Subsection headers (h4) */
  .subsection-header {
    font-family: "Source Sans 3", sans-serif;
    font-size: 1.05rem;
    font-weight: var(--weight-semi);
    color: var(--text-body);
    margin: 1.5rem 0 0.75rem 0;
    line-height: var(--header-line-height);
  }

  /* Paragraphs before headers need more space */
  p + .section-subheader {
    margin-top: 2.5rem;
  }

  /* Links */
  a {
    color: var(--primary-600);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: var(--primary-600);
    text-decoration: underline;
  }

  /* Contact footer links */
  .contact-footer {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-primary);
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .contact-footer a {
    font-weight: var(--weight-medium);
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    .page-content {
      padding: 4rem 0 2rem 0;
    }

    .section-header {
      font-size: 2rem;
      margin: 2rem 0 0.75rem 0;
    }

    .intro-content p {
      font-size: 1rem;
    }
  }
</style>
