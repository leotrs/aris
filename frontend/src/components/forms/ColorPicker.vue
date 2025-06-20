<script setup>
  import { ref } from "vue";

  const props = defineProps({
    colors: { type: Object, required: true },
    defaultActive: { type: String, default: "" },
    labels: { type: Boolean, default: true },
  });
  const emit = defineEmits(["change"]);

  const activeColor = ref(props.defaultActive);

  const onClick = (name) => {
    activeColor.value = name;
    emit("change", name);
  };
</script>

<template>
  <span class="cp-wrapper">
    <div
      v-for="(color, name) in colors"
      :key="name"
      class="swatch"
      :class="[name, activeColor === name ? 'active' : '']"
      @click="onClick(name)"
    >
      <button
        type="button"
        class="circle"
        :style="{ 'background-color': color }"
        @keydown.enter.prevent="onClick(name)"
        @keydown.space.prevent="onClick(name)"
      />
      <span v-if="labels" class="label text-caption">{{ name }}</span>
    </div>
  </span>
</template>

<style scoped>
  .cp-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    flex-wrap: wrap;
  }

  .swatch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    border-radius: 4px;
    padding: 8px;
    width: 60px;
    transition: var(--transition-bg-color);

    &:active {
      background-color: var(--purple-400) !important;
    }

    &:hover {
      cursor: pointer;
      background-color: var(--purple-100);
      color: var(--extra-dark);

      & .circle {
        box-shadow: var(--shadow-strong);
      }
    }
  }

  .swatch.active {
    background-color: var(--purple-300);
  }

  .swatch.active .circle {
    border-color: var(--almost-black);
    box-shadow: var(--shadow-soft);
  }

  .swatch.active .label {
    color: var(--almost-black);
    font-weight: var(--weight-medium);
  }

  .circle {
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    border: var(--border-thin) solid var(--gray-700);
    pointer-events: none;

    &:focus-visible {
      border-color: var(--almost-black);
      box-shadow: var(--shadow-strong);
    }
  }

  .label {
    color: var(--extra-dark);
  }
</style>
