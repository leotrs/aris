<script setup>
  import {} from "vue";
</script>

<template>
  <div class="section">
    <div class="title text-h5">
      <slot name="title" />
    </div>
    <slot name="content" />
    <slot name="footer" />
  </div>
</template>

<style scoped>
  .section {
    margin-bottom: 32px;
  }

  .section.danger {
    border: var(--border-thin) solid var(--border-error);
    border-radius: 8px;
  }

  .section.danger > * {
    padding: 4px;
  }

  .section.danger .title {
    background-color: var(--error-50);
  }
</style>
