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
    --box-size: 12px;
    outline: var(--border-extrathin) solid var(--blue-300);
    margin-block: auto;
    background-color: var(--blue-100);
    width: var(--box-size);
    height: var(--box-size);
    transition: all 0.3s ease;
    border-radius: 2px;
    position: relative;
  }

  .tabler-icon {
    margin-block: 0px;
    stroke-width: 1.5px;
    color: var(--gray-600);
    transition: color 0.3s ease;
  }

  .text {
    color: var(--gray-600);
    font-weight: 350;
    transition: color 0.3s ease;
  }

  .checkbox.active {
  }

  .checkbox.active .box {
    background-color: var(--blue-300);
    outline-color: var(--blue-700);
    box-shadow: var(--shadow-strong);
  }

  .checkbox.active .box::after {
    --size: 8px;
    position: absolute;
    left: calc((var(--box-size) - var(--size)) * 0.5);
    top: calc((var(--box-size) - var(--size)) * 0.5);
    content: "";
    background: var(--blue-900);
    width: var(--size);
    height: var(--size);
    border-radius: 2px;
  }

  .checkbox.active .tabler-icon {
    color: var(--almost-black);
  }

  .checkbox.active .text {
    color: var(--almost-black);
  }
</style>
