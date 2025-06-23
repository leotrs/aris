<script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import logoFull from "@/assets/logo-32px.svg";

  const isMenuOpen = ref(false);
  const isScrolled = ref(false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
  };

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10;
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape" && isMenuOpen.value) {
      closeMenu();
    }
  };

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("keydown", handleKeydown);
  });
</script>

<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <NuxtLink to="/" class="navbar-brand" @click="closeMenu">
      <NuxtImg
        class="navbar-logo"
        :src="logoFull"
        alt="Aris logo"
        width="30"
        height="30"
        format="svg"
        loading="eager"
      />
      <span class="navbar-title">Aris</span>
    </NuxtLink>

    <button
      class="navbar-toggle"
      :aria-expanded="isMenuOpen"
      aria-label="Toggle navigation menu"
      aria-controls="navbar-menu"
      @click="toggleMenu"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line v-if="!isMenuOpen" x1="3" y1="6" x2="21" y2="6"></line>
        <line v-if="!isMenuOpen" x1="3" y1="12" x2="21" y2="12"></line>
        <line v-if="!isMenuOpen" x1="3" y1="18" x2="21" y2="18"></line>
        <line v-if="isMenuOpen" x1="18" y1="6" x2="6" y2="18"></line>
        <line v-if="isMenuOpen" x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <div 
      class="navbar-menu" 
      :class="{ 'navbar-menu--open': isMenuOpen }"
      id="navbar-menu"
    >
      <nav class="navbar-nav" role="navigation" aria-label="Main navigation">
        <NuxtLink to="/demo" @click="closeMenu" class="focus-visible">
          Try the Demo
        </NuxtLink>
        <NuxtLink to="/docs" @click="closeMenu" class="focus-visible">
          Documentation
        </NuxtLink>
        <NuxtLink to="/blog" @click="closeMenu" class="focus-visible">
          Blog
        </NuxtLink>
        <a 
          href="#signup" 
          @click="closeMenu" 
          class="btn btn-primary focus-visible"
        >
          Get Early Access
        </a>
      </nav>
    </div>

    <!-- Mobile overlay -->
    <div 
      v-if="isMenuOpen" 
      class="navbar-overlay"
      @click="closeMenu"
      aria-hidden="true"
    ></div>
  </nav>
</template>

<style scoped>
  /* Component-specific styles */
  .navbar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .navbar-nav .btn {
      margin-top: 1rem;
      align-self: center;
      width: auto;
    }
  }

  /* Enhanced focus styles for navigation */
  .navbar-nav a.router-link-active {
    color: var(--primary-600);
    background: var(--primary-50);
  }

  .navbar-nav a.router-link-active:hover {
    color: var(--primary-700);
    background: var(--primary-100);
  }

  /* Ensure button has proper contrast in navbar */
  .navbar-nav .btn-primary {
    background: var(--primary-500) !important;
    color: var(--gray-0) !important;
  }

  .navbar-nav .btn-primary:hover {
    background: var(--primary-600) !important;
    color: var(--gray-0) !important;
  }
</style>