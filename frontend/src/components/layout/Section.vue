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
    border-radius: calc(8px + var(--border-thin));
    background-color: var(--surface-page);
    border: var(--border-thin) solid var(--border-primary);
    margin-bottom: 16px;
    width: fit-content;
  }

  .section > * {
    padding-inline: 8px;
  }

  .section > .title {
    height: 40px;
    border-bottom: 2px solid var(--border-primary);
    margin-bottom: 8px;
    padding-inline: 8px;
    background-color: var(--gray-200);
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
  }

  .section > :is(.content, .footer) {
    display: flex;
    flex-direction: column;
    padding-inline: 8px;
    gap: 16px;
    padding-bottom: 16px;
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
