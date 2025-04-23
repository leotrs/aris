<script setup>
  import { ref } from "vue";

  const props = defineProps({
    colors: { type: Array, required: true },
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
  }

  .circle {
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    border: var(--border-thin) solid var(--gray-500);

    &:hover {
      cursor: pointer;
      box-shadow: var(--shadow-strong);
      border-color: var(--border-active);
    }

    &.active {
      border-color: var(--border-active);
      box-shadow: var(--shadow-strong);
    }
  }
</style>
