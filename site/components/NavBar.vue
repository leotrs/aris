<template>
  <nav class="navbar" :class="{ 'navbar-solid': isSolidBackground }">
    <div class="navbar-content-wrapper">
      <div class="navbar-logo">
        <a href="/" aria-label="Home - Aris">
          <img src="@/assets/logo-32px.svg" alt="Aris Logo">
        </a>
      </div>

      <ul class="navbar-links">
        <li><a href="/about" class="nav-link">About</a></li>
        <li><a href="/ai-copilot" class="nav-link">AI Copilot</a></li>
        <li><a href="/pricing" class="nav-link">Pricing</a></li>
        <li class="has-dropdown" @mouseenter="openDropdown('resources')" @mouseleave="closeDropdown('resources')">
          <a href="#" class="nav-link dropdown-toggle" @click.prevent>Resources</a>
          <ul v-if="isResourcesDropdownOpen" class="dropdown-menu">
            <li><a href="/documentation" class="dropdown-link">Documentation</a></li>
            <li><a href="/blog" class="dropdown-link">Blog</a></li>
          </ul>
        </li>
      </ul>

      <div class="navbar-utility-links">
        <a href="/login" class="nav-link">Login</a>
        <a href="/signup" class="nav-link">Sign Up</a>
        <a href="/demo" class="nav-link nav-link-cta">Try the Demo</a>
      </div>

      <button class="menu-toggle" @click="toggleMobileMenu" aria-label="Toggle navigation menu">
        <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M4 6h16"></path>
          <path d="M4 12h16"></path>
          <path d="M4 18h16"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M18 6l-12 12"></path>
          <path d="M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <div v-if="isMobileMenuOpen" class="mobile-menu-overlay">
      <ul class="mobile-navbar-links">
        <li><a href="/about" class="mobile-nav-link" @click="closeMobileMenu">About</a></li>
        <li><a href="/ai-copilot" class="mobile-nav-link" @click="closeMobileMenu">AI Copilot</a></li>
        <li><a href="/pricing" class="mobile-nav-link" @click="closeMobileMenu">Pricing</a></li>
        <li class="mobile-has-dropdown">
          <a href="#" class="mobile-nav-link mobile-dropdown-toggle" @click.prevent="toggleMobileDropdown('resources')">Resources</a>
          <ul v-if="isMobileResourcesDropdownOpen" class="mobile-dropdown-menu">
            <li><a href="/documentation" class="mobile-dropdown-link" @click="closeMobileMenu">Documentation</a></li>
            <li><a href="/blog" class="mobile-dropdown-link" @click="closeMobileMenu">Blog</a></li>
          </ul>
        </li>
      </ul>
      <div class="mobile-navbar-utility-links">
        <a href="/login" class="mobile-nav-link" @click="closeMobileMenu">Login</a>
        <a href="/signup" class="mobile-nav-link" @click="closeMobileMenu">Sign Up</a>
        <a href="/demo" class="mobile-nav-link mobile-nav-link-cta" @click="closeMobileMenu">Try the Demo</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';

  const isSolidBackground = ref(false);
  const isMobileMenuOpen = ref(false);
  const isResourcesDropdownOpen = ref(false);
  const isMobileResourcesDropdownOpen = ref(false);

  // Handle transparency effect on scroll
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    // Transition to solid background after scrolling past a certain point (e.g., 50px)
    isSolidBackground.value = scrollPosition > 50;
  };

  // Toggle desktop dropdowns (on hover)
  const openDropdown = (menuName) => {
    if (menuName === 'resources') {
      isResourcesDropdownOpen.value = true;
    }
  };

  const closeDropdown = (menuName) => {
    if (menuName === 'resources') {
      isResourcesDropdownOpen.value = false;
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    // Prevent body scrolling when mobile menu is open
    if (isMobileMenuOpen.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
    isMobileResourcesDropdownOpen.value = false; // Close mobile dropdown when menu closes
    document.body.style.overflow = ''; // Restore body scrolling
  };

  // Toggle mobile dropdowns (on click)
  const toggleMobileDropdown = (menuName) => {
    if (menuName === 'resources') {
      isMobileResourcesDropdownOpen.value = !isMobileResourcesDropdownOpen.value;
    }
  };

  // Add/remove scroll listener
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style scoped>
  /* Navbar Container */
  .navbar {
    height: 64px; /* Fixed height as per brief */
    position: fixed; /* Fixed at the top */
    top: 0;
    left: 0;
    width: 100%;
    background-color: transparent; /* Starts transparent */
    transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* Smooth transition */
    z-index: 1000; /* Ensures it stays on top of other content */
    font-family: 'Source Sans 3', sans-serif;
    display: flex; /* Use flex to align content wrapper vertically */
    align-items: center; /* Center content wrapper vertically */
  }

  /* Solid background when scrolled */
  .navbar-solid {
    background-color: var(--surface-page); /* Solid white background */
    box-shadow: var(--shadow-soft); /* Subtle shadow */
  }

  .navbar-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--side-padding, 24px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%; /* Ensure it spans full width of its parent */
  }

  /* Logo */
  .navbar-logo img {
    height: 40px; /* Adjust logo size as needed */
    width: auto;
  }

  /* Primary Navigation Links (Left Side) */
  .navbar-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 30px; /* Space between links */
  }

  .nav-link {
    color: var(--gray-700);
    text-decoration: none;
    font-size: 17px; /* Slightly adjusted font size */
    font-weight: 600;
    transition: color 0.2s ease-in-out;
    line-height: 1; /* Ensure consistent vertical alignment */
    display: block; /* For dropdown toggles */
    padding: 5px 0; /* Add slight vertical padding for click area */
  }

  .nav-link:hover {
    color: var(--primary-500);
  }

  /* Dropdown Menu Styling */
  .has-dropdown {
    position: relative;
    /* For hover to work, padding/margin should not break hover area */
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 5px); /* Position below the nav-link */
    left: 0;
    background-color: var(--surface-page);
    box-shadow: var(--shadow-medium);
    border-radius: 8px;
    min-width: 180px;
    padding: 10px 0;
    list-style: none;
    margin: 0;
    z-index: 1010; /* Above navbar and other content */
    animation: fadeIn 0.2s ease-out; /* Simple fade in */
  }

  .dropdown-menu li {
    margin: 0;
  }

  .dropdown-link {
    display: block; /* Make entire list item clickable */
    padding: 10px 20px;
    color: var(--gray-800);
    text-decoration: none;
    font-size: 16px;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  }

  .dropdown-link:hover {
    background-color: var(--primary-50);
    color: var(--primary-600);
  }

  /* Utility Links / CTAs (Right Side) */
  .navbar-utility-links {
    display: flex;
    align-items: center;
    gap: 25px; /* Space between utility links */
  }

  .nav-link-cta {
    font-weight: 700; /* Slightly bolder for CTA */
    color: var(--primary-500); /* Primary blue color */
  }

  .nav-link-cta:hover {
    color: var(--primary-600);
  }


  /* Mobile Menu Toggle Button */
  .menu-toggle {
    display: none; /* Hidden on desktop */
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    color: var(--gray-800);
    z-index: 1001; /* Ensure it's above the overlay */
  }

  /* Mobile Menu Overlay */
  .mobile-menu-overlay {
    position: fixed;
    top: 64px; /* Starts below the fixed navbar */
    left: 0;
    width: 100%;
    height: calc(100vh - 64px); /* Full height minus navbar height */
    background-color: var(--surface-page); /* White background for mobile menu */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px var(--side-padding, 24px); /* Vertical padding for content */
    z-index: 999; /* Below the toggle button, above other content */
    overflow-y: auto; /* Enable scrolling for long menus */
    animation: slideInFromTop 0.3s ease-out forwards; /* Slide in effect */
  }

  .mobile-navbar-links {
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: center;
    width: 100%;
    margin-bottom: 30px;
  }

  .mobile-navbar-links li {
    margin-bottom: 20px; /* Space between main links */
  }

  .mobile-nav-link {
    font-size: 24px; /* Larger links for mobile touch */
    font-weight: 700;
    color: var(--gray-800);
    text-decoration: none;
    display: block; /* Make the whole area clickable */
    padding: 10px 0;
  }

  .mobile-nav-link:hover {
    color: var(--primary-500);
  }

  /* Mobile Dropdown */
  .mobile-has-dropdown {
    width: 100%; /* Ensure dropdown toggle spans full width */
  }

  .mobile-dropdown-toggle {
    /* No specific styles needed beyond mobile-nav-link for initial state */
  }

  .mobile-dropdown-menu {
    list-style: none;
    padding: 0;
    margin-top: 15px; /* Space above dropdown items */
    background-color: var(--gray-50); /* Slightly different background for dropdown */
    border-radius: 8px;
    padding: 10px 0;
    animation: fadeIn 0.2s ease-out; /* Simple fade in */
  }

  .mobile-dropdown-menu li {
    margin-bottom: 0; /* Remove extra margin for dropdown items */
  }

  .mobile-dropdown-link {
    font-size: 20px; /* Slightly smaller than main mobile links */
    font-weight: 600;
    color: var(--gray-700);
    text-decoration: none;
    display: block;
    padding: 10px 30px; /* Padding for mobile dropdown links */
    text-align: center;
  }

  .mobile-dropdown-link:hover {
    background-color: var(--gray-100);
    color: var(--primary-500);
  }


  .mobile-navbar-utility-links {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 80%; /* Adjust button width for mobile */
    max-width: 300px;
  }

  /* --- Animations --- */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInFromTop {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
  }


  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .navbar-links,
    .navbar-utility-links {
      display: none; /* Hide desktop nav and utility links */
    }

    .menu-toggle {
      display: block; /* Show hamburger icon */
      color: var(--gray-800); /* Ensure icon color is visible against transparency */
    }

    /* When navbar is solid, ensure menu toggle color is good */
    .navbar-solid .menu-toggle {
      color: var(--gray-800);
    }
  }

  /* Optional: Adjust for smaller phones if needed */
  @media (max-width: 480px) {
    .navbar-content-wrapper {
      padding: 0 16px;
    }

    .mobile-navbar-links li {
      margin-bottom: 15px;
    }
    .mobile-nav-link {
      font-size: 22px;
    }
    .mobile-dropdown-link {
      font-size: 18px;
      padding: 8px 20px;
    }
    .mobile-navbar-utility-links {
      gap: 15px;
    }
  }
</style>
