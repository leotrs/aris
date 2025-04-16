<script setup>
  const props = defineProps({
    title: { type: String },
  });
</script>

<template>
  <div class="tb-wrapper">
    <div class="left-column">
      <div class="title">{{ title }}</div>
    </div>

    <div class="middle-column"></div>

    <div class="right-column">
      <Button kind="tertiary" icon="Sparkles" />
      <Button kind="tertiary" icon="Share3" />
      <Button kind="tertiary" icon="Lifebuoy" />
      <Button kind="tertiary">
        <Avatar name="TER" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
  .tb-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;

    display: flex;
    height: calc(var(--sidebar-width) - var(--outer-padding));
    width: calc(100% - var(--sidebar-width) - var(--outer-padding));
    position: fixed;
    top: 8px;
    background-color: transparent;
    z-index: 1;

    &:has(> .middle-column.empty) {
      background-color: transparent;

      & > .left-column,
      & > .right-column {
        background-color: var(--surface-page);
      }
    }
  }

  .left-column,
  .middle-column,
  .right-column {
    background-color: var(--surface-page);
  }

  .left-column,
  .right-column {
    flex-basis: 292px;
    display: flex;
    align-items: center;
  }

  .left-column {
    border-top-left-radius: 16px;
    padding-inline: 16px;
  }
  .right-column {
    border-top-right-radius: 16px;
    justify-content: flex-end;
    padding-inline: 8px;
    gap: 8px;
  }

  .middle-column {
    flex-grow: 1;
  }

  .middle-column.empty {
    background-color: var(--surface-page);
  }
</style>
