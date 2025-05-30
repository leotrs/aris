<script setup>
  import {} from "vue";
</script>

<template>
  <div class="pane">
    <div v-if="$slots.header">
      <Header class="text-h4">
        <slot name="header" />
      </Header>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .pane {
    background-color: var(--surface-primary);
    padding: 16px 16px 0 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 16px;
    box-shadow: var(--shadow-soft);
    overflow-x: auto;
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
</style>
