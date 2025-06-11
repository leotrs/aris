<script setup>
  import {} from "vue";

  const props = defineProps({
    text: { type: String, required: true },
    icon: { type: String, default: "" },
  });
</script>

<template>
  <div class="checkbox">
    <div class="box"></div>
    <Icon v-if="icon" :name="icon" />
    <span class="text text-default">{{ text }}</span>
  </div>
</template>

<style scoped>
  .checkbox {
    display: flex;
    align-items: flex-end;
  }

  .box {
    border: var(--border-extrathin) solid var(--blue-300);
    margin-block: 4px;
    background-color: var(--blue-100);
    width: 12px;
    height: 12px;
    border-radius: 4px;
  }

  .tabler-icon {
    margin-block: 0px;
  }
</style>
