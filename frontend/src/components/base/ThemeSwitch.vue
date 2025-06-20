<script setup>
  import { watch, onMounted, onUnmounted } from "vue";

  const props = defineProps({
    labels: { type: Boolean, default: false },
  });
  const mode = defineModel({ type: Number, default: -1 });
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const triggerThemeTransition = () => {
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300); // should match transition duration
  };

  const updateTheme = () => {
    triggerThemeTransition();
    if (mode.value === 0) {
      document.documentElement.classList.remove("dark-theme");
    } else if (mode.value === 2) {
      document.documentElement.classList.add("dark-theme");
    } else if (mode.value === 1) {
      if (prefersDark.matches) {
        document.documentElement.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark-theme");
      }
    }
  };
  watch(mode, () => updateTheme());

  onMounted(() => {
    prefersDark.addEventListener("change", updateTheme);
    updateTheme();
  });
  onUnmounted(() => prefersDark.removeEventListener("change", updateTheme));
</script>

<template>
  <SegmentedControl
    v-model="mode"
    :icons="['Sun', 'SunMoon', 'Moon']"
    :labels="labels ? ['Light', 'System', 'Dark'] : null"
    :default-active="1"
  />
</template>

<style>
  .theme-transition {
    --transition-duration: 0.3s;
    transition:
      background-color var(--transition-duration) ease,
      color var(--transition-duration) ease;
  }
</style>
