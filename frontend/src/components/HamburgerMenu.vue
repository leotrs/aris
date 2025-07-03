<script setup>
  import { ref, inject, computed } from "vue";

  const mobileMode = inject("mobileMode");
  const isMobile = computed(() => mobileMode?.value ?? true);
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
</style>
