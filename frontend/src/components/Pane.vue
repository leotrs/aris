<script setup>
  import { inject } from "vue";

  const props = defineProps({
    customHeader: { type: Boolean, default: false },
  });
  const mobileMode = inject("mobileMode");
</script>

<template>
  <div class="pane" :class="{ mobile: mobileMode }">
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
    padding-top: 16px;
    background-color: var(--surface-primary);
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    box-shadow: var(--shadow-soft);
  }

  .pane.mobile {
    border-radius: 0px;
    padding-block: 8px;
  }

  .pane > * {
    padding-inline: 16px;
  }

  .pane.mobile > * {
    padding-inline: 8px;
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
    overflow-x: auto;
    padding-block: 16px;
  }

  .content :deep(.section:last-child) {
    margin-bottom: 0px;
  }
</style>
