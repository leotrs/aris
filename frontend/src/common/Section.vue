<script setup>
  import {} from "vue";
</script>

<template>
  <div class="section">
    <div v-if="$slots.title" class="title text-h5">
      <slot name="title" />
    </div>
    <div class="content"><slot name="content" /></div>
    <div v-if="$slots.footer" class="footer"><slot name="footer" /></div>
  </div>
</template>

<style scoped>
  .section {
    margin-bottom: 16px;
    border: var(--border-thin) solid transparent;
  }

  .section > * {
    padding-inline: 8px;
  }

  .section > :is(.content, .footer) {
    padding-bottom: 16px;
  }

  .section > .title {
    margin-bottom: 8px;
    border-bottom: var(--border-extrathin) solid var(--border-primary);
  }

  .section.danger {
    border-color: var(--border-error);
    border-radius: 8px;
  }

  .section.danger .title {
    background-color: var(--error-50);
    border-color: var(--border-error);
  }
</style>
