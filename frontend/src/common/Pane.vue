<script setup>
  import {} from "vue";

  const props = defineProps({
    customHeader: { type: Boolean, default: false },
  });
</script>

<template>
  <div class="pane">
    <div v-if="$slots.header">
      <template v-if="customHeader">
        <slot name="header" />
      </template>
      <template v-else>
        <Header class="text-h4">
          <slot name="header" />
        </Header>
      </template>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .pane {
    background-color: var(--surface-primary);
    padding-block: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    box-shadow: var(--shadow-soft);
  }

  .pane > * {
    padding-inline: 16px;
  }

  .pane-header {
    height: 48px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .pane-header > .title {
    margin-left: 4px;
  }

  .content {
    padding-top: 16px;
    overflow-x: auto;
  }

  .content :deep(.section:last-child) {
    margin-bottom: 16px;
  }
</style>
