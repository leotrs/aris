<script setup>
  import {} from "vue";

  const props = defineProps({
    label: { type: String, default: "" },
    type: { type: String, default: "text" },
    direction: { type: String, default: "row" },
    placeholder: { type: String, default: "" },
  });
  const value = defineModel({ type: String });
  defineOptions({ inheritAttrs: false });
</script>

<template>
  <div class="input-text" :class="direction">
    <label v-if="label" class="text-label"
      >{{ label }}<span v-if="direction === 'row'">:</span></label
    >
    <input
      v-bind="$attrs"
      v-model="value"
      class="text-caption"
      :type="type"
      :placeholder="placeholder"
    />
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
    padding-block: 4px;
    padding-inline: 8px;
    margin: 0;
    outline: none;
    width: fit-content;
    height: 100%;
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
