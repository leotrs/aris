<template>
  <section class="section-four">
    <div class="content-wrapper">
      <h2 class="section-heading">Who Aris Empowers</h2>

      <div class="user-role-grid">
        <div class="user-role-card">
          <div class="card-icon-container">
            <IconUserEdit />
          </div>
          <h3 class="card-title">Authors & Researchers</h3>
          <p class="card-description">
            Integrated platform to craft, collaborate on, and publish research with control and
            clarity. Focus on ideas, streamline workflow, reach an engaged audience.
          </p>
        </div>

        <div class="user-role-card">
          <div class="card-icon-container">
            <IconBook />
          </div>
          <h3 class="card-title">Readers & Learners</h3>
          <p class="card-description">
            Transforms engagement with scientific knowledge, making it personal and interactive.
            Dive into dynamic manuscripts, add private notes, connect with authors for richer
            learning.
          </p>
        </div>

        <div class="user-role-card">
          <div class="card-icon-container">
            <IconClipboardCheck />
          </div>
          <h3 class="card-title">Reviewers & Editors</h3>
          <p class="card-description">
            Streamlines peer review for efficiency and quality. Leverage intelligent reviewer
            recommendations, manage submissions, facilitate structured, empathetic feedback.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { IconUserEdit, IconBook, IconClipboardCheck } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Section Container */
  .section-four {
    background: linear-gradient(
      -45deg,
      var(--gray-75) 0%,
      var(--gray-100) 100%
    ); /* Opposite direction from Section 2 */
    padding: 80px 0; /* Vertical padding for the section */
  }

  /* Content Wrapper - Max-width & Centering */
  .content-wrapper {
    max-width: 1200px; /* Adjust max-width as needed for content, typically wider for grids */
    margin: 0 auto; /* Center the content wrapper */
    padding: 0 16px; /* Reduced side padding */
  }

  /* Section Heading */
  .section-heading {
    font-family: "Montserrat", sans-serif;
    font-size: 48px; /* Prominent heading size */
    font-weight: 700;
    color: var(--gray-900);
    text-align: center; /* Center align the section heading */
    margin-bottom: 60px; /* Space below the heading before the grid */
    line-height: 1.2;
  }

  /* User Role Grid */
  .user-role-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Responsive 3-column grid */
    gap: 32px; /* Space between cards */
  }

  /* Individual User Role Card Styling */
  .user-role-card {
    background-color: var(--surface-page); /* White background for cards */
    border: 1px solid var(--border-primary); /* Thin border */
    border-radius: 8px; /* Rounded corners */
    box-shadow: var(--shadow-soft); /* Soft shadow */
    padding: 40px; /* Generous padding inside cards */
    display: flex;
    flex-direction: column;
    align-items: center; /* Center content horizontally within the card */
    text-align: center; /* Center text within the card */
    transition:
      transform 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out; /* Smooth transition for hover effects */
  }

  /* Hover Effect for Cards */
  .user-role-card:hover {
    transform: translateY(-5px); /* Subtle upward lift */
    box-shadow: var(
      --shadow-medium,
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05)
    ); /* Slightly stronger shadow on hover */
    background: linear-gradient(135deg, var(--surface-page) 0%, var(--gray-50) 100%);
  }

  /* Card Icon Container */
  .card-icon-container {
    margin-bottom: 24px; /* Space below the icon */
    width: 64px; /* Larger size for prominent icons */
    height: 64px;
    /* Optional: Add a subtle background shape for the icon, e.g. */
    background-color: var(--primary-50); /* A very light primary background */
    border-radius: 50%; /* Make it circular */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Styling for the SVG icon within the container */
  .card-icon-container svg {
    width: 40px; /* Actual SVG size inside the 64px container */
    height: 40px;
    stroke: var(--primary-500); /* Color the icon with your primary color */
  }

  /* Card Title (User Role) */
  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 12px; /* Space below title */
    line-height: 1.3;
  }

  /* Card Description */
  .card-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: var(--body-line-height);
    color: var(--gray-700);
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 992px) {
    .user-role-grid {
      grid-template-columns: repeat(
        auto-fit,
        minmax(280px, 1fr)
      ); /* Adjust columns for smaller desktops/tablets */
    }
  }

  @media (max-width: 768px) {
    .section-four {
      padding: 60px 0;
    }

    .section-heading {
      font-size: 38px;
      margin-bottom: 40px;
    }

    .user-role-grid {
      grid-template-columns: 1fr; /* Stack cards in a single column on mobile */
    }

    .user-role-card {
      padding: 30px;
    }

    .card-icon-container {
      width: 56px; /* Slightly smaller icon container */
      height: 56px;
    }

    .card-icon-container svg {
      width: 36px;
      height: 36px;
    }
  }

  @media (max-width: 480px) {
    .section-heading {
      font-size: 32px;
    }

    .user-role-card {
      padding: 24px;
    }
  }
</style>
