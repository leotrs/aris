<script setup>
  import {} from "vue";
  const props = defineProps({});
</script>

<template>
  <div class="btn-row" @click.stop @dblclick.stop>
    <slot />
  </div>
</template>

<style>
  .btn-row {
    display: flex;
    width: fit-content;
    gap: 4px;
  }
</style>
