<script setup>
  import {} from "vue";

  const props = defineProps({
    label: { type: String, default: "" },
    type: { type: String, default: "text" },
    direction: { type: String, default: "row" },
  });
  const value = defineModel({ type: String });
  defineOptions({ inheritAttrs: false });
</script>

<template>
  <div class="input-text" :class="direction">
    <label v-if="label" class="text-label">
      {{ label }}
      <template v-if="direction == 'row'">:</template>
    </label>
    <input v-bind="$attrs" v-model="value" :type="type" />
  </div>
</template>

<style scoped>
  .input-text {
    display: flex;
  }

  .input-text.row {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .input-text.column {
    flex-direction: column;
    gap: 2px;
  }

  input {
    background: transparent;
    border: none;
    padding: 4px;
    margin: 0;
    font: inherit;
    color: inherit;
    outline: none;
    width: fit-content;
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 8px;
  }

  input:focus {
    border-color: var(--border-action);
    background-color: var(--white);
  }

  input[disabled] {
    background-color: var(--surface-disabled);
    cursor: not-allowed;
  }
</style>
