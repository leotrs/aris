<script setup>
  import {} from "vue";

  const props = defineProps({
    text: { type: String, required: true },
    icon: { type: String, default: "" },
  });
  const active = defineModel({ type: Boolean, default: false });
</script>

<template>
  <div
    class="checkbox"
    :class="{ active }"
    tabindex="0"
    role="button"
    @click.stop="active = !active"
  >
    <div class="box"></div>
    <Icon v-if="icon" :name="icon" />
    <span class="text text-default">{{ text }}</span>
  </div>
</template>

<style scoped>
  .checkbox {
    display: flex;
    align-items: flex-end;
    border-radius: 4px;
  }

  .checkbox:hover {
    cursor: pointer;
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
    stroke-width: 1.5px;
    color: var(--text-disabled);
  }

  .text {
    color: var(--text-disabled);
    font-weight: 350;
  }

  .checkbox.active {
  }

  .checkbox.active .box {
    border-color: var(--border-action-hover);
    background-color: var(--surface-action);
  }

  .checkbox.active .tabler-icon {
    color: var(--almost-black);
  }

  .checkbox.active .text {
    color: var(--almost-black);
  }
</style>
