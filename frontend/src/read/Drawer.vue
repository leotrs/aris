<script setup>
  import {} from "vue";
</script>

<template>
  <div class="d-wrapper">
    <Button kind="tertiary" icon="LayoutSidebarRightExpand" />
  </div>
</template>

<style>
  .d-wrapper {
    position: fixed;
    right: calc(var(--outer-padding) + var(--scrollbar-size));
  }

  .d-wrapper button {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
