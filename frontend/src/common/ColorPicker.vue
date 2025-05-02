<script setup>
  import { ref } from "vue";

  const props = defineProps({
    colors: { type: Object, required: true },
    defaultActive: { type: String, default: "" },
  });
  const emit = defineEmits(["change"]);

  const activeColor = ref("");

  const onClick = (name) => {
    activeColor.value = name;
    emit("change", name);
  };
</script>

<template>
  <span class="cp-wrapper">
    <span
      v-for="(color, name) in colors"
      class="circle"
      :class="[name, activeColor == name ? 'active' : '']"
      :style="{ 'background-color': color }"
      @click="onClick(name)"
    >
    </span>
  </span>
</template>

<style scoped>
  .cp-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 4px;
  }

  .circle {
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    border: var(--border-thin) solid var(--gray-800);

    &:hover {
      cursor: pointer;
      border-color: var(--almost-black);
      box-shadow: var(--shadow-strong);
    }

    &.active {
      border-color: var(--almost-black);
      box-shadow: var(--shadow-strong);
    }
  }
</style>
