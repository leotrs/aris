<script setup>
  import { ref, inject, computed } from "vue";

  const mobileMode = inject("mobileMode");
  const isMobile = computed(() => mobileMode?.value ?? false);
  const mobileDrawerOpen = inject("mobileDrawerOpen", ref(false));

  const toggle = () => {
    mobileDrawerOpen.value = !mobileDrawerOpen.value;
  };

  const close = () => {
    mobileDrawerOpen.value = false;
  };

  // Expose methods for testing
  defineExpose({
    toggle,
    close,
    get isOpen() {
      return mobileDrawerOpen.value;
    },
  });
</script>

<template>
  <div v-if="isMobile" class="mobile-nav">
    <Button
      kind="tertiary"
      :icon="mobileDrawerOpen ? 'X' : 'Menu'"
      data-testid="mobile-menu-button"
      @click="toggle"
    />
  </div>
</template>

<style scoped>
  .mobile-nav {
    display: flex;
    align-items: center;
  }

  /* Show mobile nav on small screens when mobile mode detection fails */
  @media (max-width: 640px) {
    .mobile-nav {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: relative !important;
      z-index: 1002 !important;
    }
  }
</style>
