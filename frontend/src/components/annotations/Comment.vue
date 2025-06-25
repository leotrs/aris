<script setup>
  import {} from "vue";

  defineProps({
    annotation: {
      type: Object,
      required: true,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <div class="comment">
    <div class="header"></div>
    <div v-if="!collapsed" class="content">
      {{ annotation.content }}
    </div>
    <div class="footer"></div>
  </div>
</template>

<style scoped>
  .comment {
    border: var(--border-extrathin) solid var(--border-primary);
    outline-style: solid;
    outline-color: transparent;
    outline-width: var(--border-extrathin);
    border-radius: 16px;
    padding-block: 3px;
    padding-inline: 12px;
    min-width: 264px;
    position: relative;
    top: 100px;
    z-index: 2;
    margin-inline: 8px;
    transition: outline-color 0.3s ease;
  }

  .comment:hover {
    outline-color: var(--border-primary);
    box-shadow: var(--shadow-strong);

    & .actions > :not(.no-hide) {
      opacity: 1;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .timestamp {
    font-size: 12px;
    color: var(--dark);
  }

  .actions {
    display: flex;
    gap: 0;

    & > :not(.no-hide) {
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    & :deep(button) {
      width: 24px;
      height: 24px;
    }

    & :deep(.tabler-icon) {
      color: var(--dark);
      margin: 0 !important;
      stroke-width: 1.75;
    }
  }

  .content {
    padding-block: 4px;
  }
</style>
