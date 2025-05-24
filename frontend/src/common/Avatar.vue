<script setup>
  import { inject } from "vue";
  const user = inject("user");
</script>

<template>
  <div class="av-wrapper">
    <span class="av-name">{{ user?.value?.name || "" }}</span>
  </div>
</template>

<style scoped>
  .av-wrapper {
    border-radius: 16px;
    width: 32px;
    height: 32px;
    background-color: var(--orange-300);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
