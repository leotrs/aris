<template>
  <section class="section-four">
    <div class="content-wrapper">
      <h2 class="section-heading">Who Aris Empowers</h2>

      <div class="user-role-grid">
        <div class="user-role-card">
          <div class="card-icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 18l-7 3l7 -15l7 15l-7 -3" />
              <path d="M12 18v3" />
              <path d="M17 18l5 -3l-5 -3l-5 3l5 3" />
              <path d="M7 18l-5 -3l5 -3l5 3l-5 3" />
            </svg>
          </div>
          <h3 class="card-title">For Authors & Researchers</h3>
          <p class="card-description">
            Craft compelling narratives, manage versions effortlessly, and collaborate in real-time
            to accelerate your discoveries.
          </p>
        </div>

        <div class="user-role-card">
          <div class="card-icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z" />
              <path d="M12 4h7v16h-7z" />
            </svg>
          </div>
          <h3 class="card-title">For Readers & Scholars</h3>
          <p class="card-description">
            Engage with interactive content, explore rich data, and trace the evolution of ideas
            with unparalleled clarity.
          </p>
        </div>

        <div class="user-role-card">
          <div class="card-icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
              />
              <path
                d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"
              />
              <path d="M9 14l2 2l4 -4" />
            </svg>
          </div>
          <h3 class="card-title">For Peer Reviewers & Editors</h3>
          <p class="card-description">
            Streamline feedback, track changes semantically, and ensure scientific rigor with
            intuitive, powerful tools.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  // No specific script logic needed for this component.
  // If you were fetching user roles from an API or defining them in data,
  // that logic would go here.
</script>

<style scoped>
  /* Section Container */
  .section-four {
    background-color: var(--gray-75); /* Background color as per design brief */
    padding: 80px 0; /* Vertical padding for the section */
  }

  /* Content Wrapper - Max-width & Centering */
  .content-wrapper {
    max-width: 1200px; /* Adjust max-width as needed for content, typically wider for grids */
    margin: 0 auto; /* Center the content wrapper */
    padding: 0 var(--side-padding, 24px); /* Side padding */
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
