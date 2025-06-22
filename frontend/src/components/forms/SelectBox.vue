<script setup>
  import { ref, computed, watch } from "vue";
  import ContextMenu from "@/components/navigation/ContextMenu.vue";
  import ContextMenuItem from "@/components/navigation/ContextMenuItem.vue";

  const props = defineProps({
    modelValue: { type: [String, Number], default: null },
    direction: { type: String, default: "row" },
    options: { type: Array, default: () => [] },
  });
  const emit = defineEmits(["update:modelValue"]);

  // Manage internal value for v-model
  const localValue = ref(props.modelValue);
  watch(
    () => props.modelValue,
    (v) => {
      localValue.value = v;
    }
  );
  watch(
    () => localValue.value,
    (v) => {
      emit("update:modelValue", v);
    }
  );
  defineOptions({ inheritAttrs: false });

  // Normalize options: allow primitives or {value,label} objects
  const normalizedOptions = computed(() =>
    props.options.map((opt) =>
      typeof opt === "object" && opt !== null ? opt : { value: opt, label: String(opt) }
    )
  );

  // Display label of current value
  const currentLabel = computed(() => {
    const found = normalizedOptions.value.find((o) => o.value === localValue.value);
    return found ? found.label : "";
  });
</script>

<template>
  <div class="select-box" :class="direction">
    <span class="current-label">{{ currentLabel }}</span>
    <ContextMenu variant="slot" placement="bottom-start">
      <template #trigger="{ toggle }">
        <ButtonToggle icon="CaretDownFilled" v-bind="$attrs" @click="toggle" />
      </template>
      <ContextMenuItem
        v-for="opt in normalizedOptions"
        :key="opt.value"
        icon=""
        :caption="opt.label"
        :class="{ active: opt.value === localValue }"
        @click="localValue = opt.value"
      />
    </ContextMenu>
  </div>
</template>

<style scoped>
  .select-box {
    display: flex;
    border: var(--border-thin) solid var(--border-primary);
    border-radius: 8px;
  }

  .select-box.row {
    width: fit-content;
    flex-direction: row;
    align-items: center;
  }

  .select-box.column {
    flex-direction: column;
    gap: 2px;
  }

  .current-label {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
    text-wrap: nowrap;
    background: var(--surface-page);
    padding-inline: 8px 4px;
    border-radius: 8px 0 0 8px;
  }

  :deep(.cm-btn) {
    width: 24px;
    height: calc(24px - var(--border-thin));
    padding: 0 !important;
    border-radius: 0 8px 8px 0 !important;

    & .tabler-icon {
      margin: 0;
    }
  }
</style>
