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
    border: var(--border-thin) solid transparent;
  }

  .section > * {
    padding-inline: 8px;
  }

  .section > .title {
    margin-bottom: 8px;
  }

  .section.danger {
    border-color: var(--border-error);
    border-radius: 8px;
  }

  .section.danger .title {
    background-color: var(--error-50);
  }
</style>
