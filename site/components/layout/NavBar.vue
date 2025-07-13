<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-content-wrapper">
      <div class="navbar-logo">
        <a href="/" aria-label="Home - Aris">
          <Logo type="small" alt="Aris Logo" />
        </a>
      </div>

      <ul class="navbar-links" role="navigation" aria-label="Main navigation">
        <li><a href="/getting-started" class="nav-link">Getting Started</a></li>
        <li
          class="has-dropdown"
          data-testid="platform-dropdown"
          @mouseenter="openDropdown('platform')"
          @mouseleave="closeDropdown('platform')"
        >
          <a
            ref="platformToggle"
            href="#"
            class="nav-link dropdown-toggle"
            :aria-expanded="isPlatformDropdownOpen"
            aria-haspopup="true"
            aria-label="Platform menu"
            role="button"
            @click.prevent="toggleDropdown('platform')"
            @keydown.enter.prevent="toggleDropdown('platform')"
            @keydown.space.prevent="toggleDropdown('platform')"
            @keydown.escape="closeDropdown('platform')"
            @keydown.arrow-down.prevent="openDropdownAndFocus('platform')"
          >
            Platform
          </a>
          <ul
            v-show="isPlatformDropdownOpen"
            ref="platformDropdownMenu"
            class="dropdown-menu"
            data-testid="platform-dropdown-menu"
            role="menu"
            aria-label="Platform submenu"
            @keydown.escape="closeDropdownAndFocus('platform')"
            @keydown.arrow-up.prevent="focusPreviousMenuItem"
            @keydown.arrow-down.prevent="focusNextMenuItem"
          >
            <li role="none">
              <a
                ref="firstPlatformItem"
                href="/about"
                class="dropdown-link"
                role="menuitem"
                @keydown.tab.shift.prevent="closeDropdownAndFocus('platform')"
                >About</a
              >
            </li>
            <li role="none">
              <a href="/open-science" class="dropdown-link" role="menuitem">Open Science</a>
            </li>
            <li role="none">
              <a href="/ai-copilot" class="dropdown-link" role="menuitem">AI Copilot</a>
            </li>
            <li role="none">
              <a
                href="/security"
                class="dropdown-link"
                role="menuitem"
                @keydown.tab.prevent="closeDropdown('platform')"
                >Security</a
              >
            </li>
          </ul>
        </li>
        <li><a href="/pricing" class="nav-link">Pricing</a></li>
        <li
          class="has-dropdown"
          data-testid="resources-dropdown"
          @mouseenter="openDropdown('resources')"
          @mouseleave="closeDropdown('resources')"
        >
          <a
            ref="resourcesToggle"
            href="#"
            class="nav-link dropdown-toggle"
            :aria-expanded="isResourcesDropdownOpen"
            aria-haspopup="true"
            aria-label="Resources menu"
            role="button"
            @click.prevent="toggleDropdown('resources')"
            @keydown.enter.prevent="toggleDropdown('resources')"
            @keydown.space.prevent="toggleDropdown('resources')"
            @keydown.escape="closeDropdown('resources')"
            @keydown.arrow-down.prevent="openDropdownAndFocus('resources')"
          >
            Resources
          </a>
          <ul
            v-show="isResourcesDropdownOpen"
            ref="resourcesDropdownMenu"
            class="dropdown-menu"
            role="menu"
            aria-label="Resources submenu"
            data-testid="resources-dropdown-menu"
            @keydown.escape="closeDropdownAndFocus('resources')"
            @keydown.arrow-up.prevent="focusPreviousMenuItem"
            @keydown.arrow-down.prevent="focusNextMenuItem"
          >
            <li role="none">
              <a
                ref="firstDropdownItem"
                href="/documentation"
                class="dropdown-link"
                role="menuitem"
                @keydown.tab.shift.prevent="closeDropdownAndFocus('resources')"
                >Documentation</a
              >
            </li>
            <li role="none">
              <a href="/faq" class="dropdown-link" role="menuitem">FAQ</a>
            </li>
            <li role="none">
              <a
                href="/blog"
                class="dropdown-link"
                role="menuitem"
                @keydown.tab.prevent="closeDropdown('resources')"
                >Blog</a
              >
            </li>
          </ul>
        </li>
        <li><a href="/contact" class="nav-link">Contact</a></li>
      </ul>

      <div class="navbar-utility-links">
        <a :href="frontendUrl + '/login'" class="nav-link nav-link-button">Login</a>
        <a href="/signup" class="nav-link nav-link-button nav-link-button-primary">Sign Up</a>
        <a :href="frontendUrl + '/demo'" class="nav-link nav-link-cta">Try the Demo</a>
      </div>

      <button
        class="menu-toggle"
        data-testid="menu-toggle"
        aria-label="Toggle navigation menu"
        @click="toggleMobileMenu"
        @keydown.enter.prevent="toggleMobileMenu"
        @keydown.space.prevent="toggleMobileMenu"
      >
        <IconMenu v-if="!isMobileMenuOpen" :size="28" />
        <IconX v-else :size="28" />
      </button>
    </div>

    <Transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" class="mobile-menu-overlay" data-testid="mobile-menu-overlay">
        <ul class="mobile-navbar-links">
          <li>
            <a href="/getting-started" class="mobile-nav-link" @click="closeMobileMenu"
              >Getting Started</a
            >
          </li>
          <li class="mobile-has-dropdown">
            <a
              href="#"
              class="mobile-nav-link mobile-dropdown-toggle"
              data-testid="mobile-platform-toggle"
              aria-label="Platform menu"
              @click.prevent="toggleMobileDropdown('platform')"
              >Platform</a
            >
            <ul
              v-if="isMobilePlatformDropdownOpen"
              class="mobile-dropdown-menu"
              data-testid="mobile-platform-dropdown"
            >
              <li>
                <a href="/about" class="mobile-dropdown-link" @click="closeMobileMenu">About</a>
              </li>
              <li>
                <a href="/open-science" class="mobile-dropdown-link" @click="closeMobileMenu"
                  >Open Science</a
                >
              </li>
              <li>
                <a href="/ai-copilot" class="mobile-dropdown-link" @click="closeMobileMenu"
                  >AI Copilot</a
                >
              </li>
              <li>
                <a href="/security" class="mobile-dropdown-link" @click="closeMobileMenu"
                  >Security</a
                >
              </li>
            </ul>
          </li>
          <li><a href="/pricing" class="mobile-nav-link" @click="closeMobileMenu">Pricing</a></li>
          <li class="mobile-has-dropdown">
            <a
              href="#"
              class="mobile-nav-link mobile-dropdown-toggle"
              data-testid="mobile-resources-toggle"
              aria-label="Resources menu"
              @click.prevent="toggleMobileDropdown('resources')"
              >Resources</a
            >
            <ul
              v-if="isMobileResourcesDropdownOpen"
              class="mobile-dropdown-menu"
              data-testid="mobile-resources-dropdown"
            >
              <li>
                <a href="/documentation" class="mobile-dropdown-link" @click="closeMobileMenu"
                  >Documentation</a
                >
              </li>
              <li>
                <a href="/faq" class="mobile-dropdown-link" @click="closeMobileMenu">FAQ</a>
              </li>
              <li>
                <a href="/blog" class="mobile-dropdown-link" @click="closeMobileMenu">Blog</a>
              </li>
            </ul>
          </li>
          <li><a href="/contact" class="mobile-nav-link" @click="closeMobileMenu">Contact</a></li>
        </ul>
        <div class="mobile-navbar-utility-links">
          <a
            :href="frontendUrl + '/login'"
            class="mobile-nav-link mobile-nav-link-utility"
            @click="closeMobileMenu"
            >Login</a
          >
          <a href="/signup" class="mobile-nav-link mobile-nav-link-utility" @click="closeMobileMenu"
            >Sign Up</a
          >
          <a
            :href="frontendUrl + '/demo'"
            class="mobile-nav-link mobile-nav-link-cta"
            @click="closeMobileMenu"
            >Try the Demo</a
          >
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, nextTick } from "vue";
  import { IconMenu, IconX } from "@tabler/icons-vue";
  import Logo from "./Logo.vue";

  const config = useRuntimeConfig();
  const frontendUrl = config.public.frontendUrl;

  const isMobileMenuOpen = ref(false);
  const isPlatformDropdownOpen = ref(false);
  const isResourcesDropdownOpen = ref(false);
  const isMobilePlatformDropdownOpen = ref(false);
  const isMobileResourcesDropdownOpen = ref(false);
  const isScrolled = ref(false);

  // Template refs for focus management
  const platformToggle = ref(null);
  const platformDropdownMenu = ref(null);
  const firstPlatformItem = ref(null);
  const resourcesToggle = ref(null);
  const resourcesDropdownMenu = ref(null);
  const firstDropdownItem = ref(null);

  // Handle scroll events for navbar transparency
  const handleScroll = () => {
    // Consider scrolled if we've scrolled just a little bit (50px)
    isScrolled.value = window.scrollY > 50;
  };

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  // Toggle desktop dropdowns (on hover)
  const openDropdown = (menuName) => {
    if (menuName === "platform") {
      isPlatformDropdownOpen.value = true;
    } else if (menuName === "resources") {
      isResourcesDropdownOpen.value = true;
    }
  };

  const closeDropdown = (menuName) => {
    if (menuName === "platform") {
      isPlatformDropdownOpen.value = false;
    } else if (menuName === "resources") {
      isResourcesDropdownOpen.value = false;
    }
  };

  const toggleDropdown = (menuName) => {
    if (menuName === "platform") {
      isPlatformDropdownOpen.value = !isPlatformDropdownOpen.value;
      if (isPlatformDropdownOpen.value) {
        nextTick(() => {
          if (firstPlatformItem.value) {
            firstPlatformItem.value.focus();
          }
        });
      }
    } else if (menuName === "resources") {
      isResourcesDropdownOpen.value = !isResourcesDropdownOpen.value;
      if (isResourcesDropdownOpen.value) {
        nextTick(() => {
          if (firstDropdownItem.value) {
            firstDropdownItem.value.focus();
          }
        });
      }
    }
  };

  // Open dropdown and focus first item (for arrow down key)
  const openDropdownAndFocus = (menuName) => {
    if (menuName === "platform") {
      isPlatformDropdownOpen.value = true;
      nextTick(() => {
        if (firstPlatformItem.value) {
          firstPlatformItem.value.focus();
        }
      });
    } else if (menuName === "resources") {
      isResourcesDropdownOpen.value = true;
      nextTick(() => {
        if (firstDropdownItem.value) {
          firstDropdownItem.value.focus();
        }
      });
    }
  };

  // Close dropdown and return focus to toggle
  const closeDropdownAndFocus = (menuName) => {
    if (menuName === "platform") {
      isPlatformDropdownOpen.value = false;
      nextTick(() => {
        if (platformToggle.value) {
          platformToggle.value.focus();
        }
      });
    } else if (menuName === "resources") {
      isResourcesDropdownOpen.value = false;
      nextTick(() => {
        if (resourcesToggle.value) {
          resourcesToggle.value.focus();
        }
      });
    }
  };

  // Arrow key navigation within dropdown
  const focusNextMenuItem = () => {
    const dropdownLinks = resourcesDropdownMenu.value?.querySelectorAll(".dropdown-link");
    if (!dropdownLinks) return;

    const currentIndex = Array.from(dropdownLinks).findIndex(
      (link) => link === document.activeElement
    );
    const nextIndex = (currentIndex + 1) % dropdownLinks.length;
    dropdownLinks[nextIndex].focus();
  };

  const focusPreviousMenuItem = () => {
    const dropdownLinks = resourcesDropdownMenu.value?.querySelectorAll(".dropdown-link");
    if (!dropdownLinks) return;

    const currentIndex = Array.from(dropdownLinks).findIndex(
      (link) => link === document.activeElement
    );
    const previousIndex = currentIndex <= 0 ? dropdownLinks.length - 1 : currentIndex - 1;
    dropdownLinks[previousIndex].focus();
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    // Prevent body scrolling when mobile menu is open
    if (isMobileMenuOpen.value) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
    isMobilePlatformDropdownOpen.value = false; // Close mobile dropdowns when menu closes
    isMobileResourcesDropdownOpen.value = false;
    document.body.style.overflow = ""; // Restore body scrolling
  };

  // Toggle mobile dropdowns (on click)
  const toggleMobileDropdown = (menuName) => {
    if (menuName === "platform") {
      isMobilePlatformDropdownOpen.value = !isMobilePlatformDropdownOpen.value;
    } else if (menuName === "resources") {
      isMobileResourcesDropdownOpen.value = !isMobileResourcesDropdownOpen.value;
    }
  };
</script>

<style scoped>
  /* Navbar Container */
  .navbar {
    height: 64px; /* Fixed height as per brief */
    position: fixed; /* Fixed at the top */
    top: 0;
    left: 0;
    width: 100%;
    background-color: transparent; /* Start transparent */
    box-shadow: none; /* No shadow when transparent */
    z-index: 1000; /* Ensures it stays on top of other content */
    font-family: "Source Sans 3", sans-serif;
    display: flex; /* Use flex to align content wrapper vertically */
    align-items: center; /* Center content wrapper vertically */
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease; /* Smooth transition */
  }

  /* Navbar when scrolled */
  .navbar.navbar-scrolled {
    background: linear-gradient(
      180deg,
      var(--surface-page) 0%,
      var(--gray-50) 100%
    ); /* Subtle gradient */
    box-shadow: var(--shadow-soft); /* Subtle shadow */
  }

  .navbar-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px; /* Reduced side padding */
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%; /* Ensure it spans full width of its parent */
  }

  /* Logo */
  .navbar-logo {
    display: flex;
    align-items: center; /* Ensure logo is vertically centered */
  }

  .navbar-logo img {
    height: 32px; /* Slightly smaller for better proportions */
    width: auto;
    display: block; /* Remove any baseline spacing */
  }

  /* Primary Navigation Links (Left Side) */
  .navbar-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 32px; /* Increased space between links */
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

  .nav-link:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
    border-radius: 4px;
    background-color: var(--primary-50);
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
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    min-width: 180px;
    padding: 10px 0;
    list-style: none;
    margin: 0;
    z-index: 1010; /* Above navbar and other content */
    /* Vue's v-show will handle visibility */
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
    transition:
      background-color 0.2s ease-in-out,
      color 0.2s ease-in-out;
  }

  .dropdown-link:hover {
    background-color: var(--primary-50);
    color: var(--primary-600);
  }

  .dropdown-link:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: -2px;
    background-color: var(--primary-100);
    color: var(--primary-700);
  }

  /* Utility Links / CTAs (Right Side) */
  .navbar-utility-links {
    display: flex;
    align-items: center;
    gap: 16px; /* Space between utility links */
  }

  .nav-link-button {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid var(--gray-300);
    background-color: var(--gray-0);
    color: var(--gray-700);
    transition: all 0.2s ease-in-out;
  }

  .nav-link-button:hover {
    background-color: var(--gray-50);
    border-color: var(--gray-400);
    color: var(--gray-800);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .nav-link-button:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }

  .nav-link-button-primary {
    background-color: var(--primary-500);
    border-color: var(--primary-500);
    color: var(--gray-0);
  }

  .nav-link-button-primary:hover {
    background-color: var(--primary-600);
    border-color: var(--primary-600);
    color: var(--gray-0);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(14, 154, 233, 0.25);
  }

  .nav-link-cta {
    font-weight: 700;
    color: var(--primary-500);
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
    padding: 8px;
    border-radius: 6px;
    color: var(--gray-800);
    z-index: 1001; /* Ensure it's above the overlay */
    min-width: 44px;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  /* Mobile Menu Overlay */
  .mobile-menu-overlay {
    position: fixed;
    top: 64px; /* Starts below the fixed navbar */
    left: 0;
    width: 100%;
    height: calc(100vh - 64px); /* Full height minus navbar height */
    background-color: var(--surface-page); /* White background for mobile menu */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 24px;
    z-index: 999; /* Below the toggle button, above other content */
    overflow-y: auto; /* Enable scrolling for long menus */
  }

  /* Vue Transition Classes for Mobile Menu */
  .mobile-menu-enter-active {
    transition: all 0.3s ease-out;
  }

  .mobile-menu-leave-active {
    transition: all 0.3s ease-in;
  }

  .mobile-menu-enter-from {
    opacity: 0;
    transform: translateY(-100%);
  }

  .mobile-menu-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }

  .mobile-navbar-links {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    margin-bottom: 32px;
  }

  .mobile-navbar-links li {
    margin-bottom: 8px; /* Consistent spacing between links */
  }

  .mobile-nav-link {
    font-size: 18px; /* More reasonable size for mobile */
    font-weight: 600;
    color: var(--gray-800);
    text-decoration: none;
    display: block; /* Make the whole area clickable */
    padding: 12px 16px;
    min-height: 44px; /* Proper touch target */
    display: flex;
    align-items: center;
    border-radius: 8px;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .mobile-nav-link:hover {
    color: var(--primary-600);
    background-color: var(--primary-50);
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
    padding: 8px;
    margin-top: 8px;
    background-color: var(--gray-50);
    border-radius: 8px;
    animation: fadeIn 0.2s ease-out;
  }

  .mobile-dropdown-menu li {
    margin-bottom: 4px;
  }

  .mobile-dropdown-menu li:last-child {
    margin-bottom: 0;
  }

  .mobile-dropdown-link {
    font-size: 16px; /* Appropriately sized for dropdown */
    font-weight: 500;
    color: var(--gray-700);
    text-decoration: none;
    display: flex;
    padding: 12px 24px;
    min-height: 44px;
    align-items: center;
    text-align: left;
    border-radius: 6px;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .mobile-dropdown-link:hover {
    background-color: var(--primary-50);
    color: var(--primary-600);
  }

  /* Mobile utility links styling */
  .mobile-nav-link-utility {
    color: var(--gray-600);
    font-weight: 500;
    text-align: center;
    justify-content: center;
    min-height: 48px; /* Slightly larger for utility buttons */
  }

  .mobile-nav-link-utility:hover {
    color: var(--gray-800);
    background-color: var(--gray-100);
  }

  /* Mobile CTA button styling */
  .mobile-nav-link-cta {
    background: var(--primary-500);
    color: var(--gray-0) !important;
    font-weight: 600;
    text-align: center;
    justify-content: center;
    border-radius: 8px;
    margin-top: 8px;
    min-height: 48px; /* Larger touch target for CTA */
  }

  .mobile-nav-link-cta:hover {
    background: var(--primary-600) !important;
    color: var(--gray-0) !important;
  }

  .mobile-navbar-utility-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    margin-top: auto; /* Push to bottom of menu */
    padding-top: 24px;
    border-top: 1px solid var(--gray-200);
  }

  /* --- Animations --- */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .navbar-links,
    .navbar-utility-links {
      display: none; /* Hide desktop nav and utility links */
    }

    .menu-toggle {
      display: flex; /* Show hamburger icon */
      color: var(--gray-800); /* Ensure icon color is visible against transparency */
    }

    .menu-toggle:hover {
      background-color: var(--gray-100);
      color: var(--gray-900);
    }

    .menu-toggle:active {
      background-color: var(--primary-50);
      color: var(--primary-600);
    }
  }

  /* Tablet and smaller desktop adjustments */
  @media (max-width: 1024px) {
    .navbar-content-wrapper {
      padding: 0 20px;
    }
  }

  /* Small tablet adjustments */
  @media (max-width: 640px) {
    .navbar-content-wrapper {
      padding: 0 16px;
    }

    .mobile-menu-overlay {
      padding: 20px 16px;
    }
  }

  /* Small mobile adjustments */
  @media (max-width: 480px) {
    .navbar-content-wrapper {
      padding: 0 12px;
    }

    .mobile-menu-overlay {
      padding: 16px 12px;
    }

    .mobile-nav-link {
      font-size: 17px;
      padding: 14px 16px;
    }

    .mobile-dropdown-link {
      padding: 12px 20px;
    }

    .mobile-navbar-utility-links {
      gap: 10px;
      padding-top: 20px;
    }
  }

  /* Very small mobile devices */
  @media (max-width: 360px) {
    .navbar-content-wrapper {
      padding: 0 8px;
    }

    .mobile-menu-overlay {
      padding: 12px 8px;
    }

    .mobile-nav-link {
      font-size: 16px;
      padding: 12px 14px;
    }

    .mobile-dropdown-link {
      font-size: 15px;
      padding: 10px 16px;
    }
  }
</style>
