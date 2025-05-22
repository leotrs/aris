<script setup>
  import { toRef, ref, watchEffect } from "vue";
  import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/vue";

  const props = defineProps({
    anchor: { type: [Object, null], required: true },
    content: { type: String, default: "" },
    placement: { type: String, default: "bottom" },
  });

  const selfRef = ref(null);
  const isVisible = ref(false);

  const { floatingStyles } = useFloating(
    toRef(() => props.anchor),
    selfRef,
    {
      middleware: [offset(4), flip(), shift()],
      placement: props.placement,
      strategy: "fixed",
      whileElementsMounted: autoUpdate,
    }
  );

  watchEffect(() => {
    if (!props.anchor) return;
    const show = () => (isVisible.value = true);
    const hide = () => (isVisible.value = false);
    props.anchor.addEventListener("mouseenter", show);
    props.anchor.addEventListener("mouseleave", hide);
  });
</script>

<template>
  <Teleport to="body">
    <div
      v-if="anchor"
      ref="selfRef"
      class="tooltip"
      :style="{
        ...floatingStyles,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }"
    >
      <slot>{{ content }}</slot>
    </div>
  </Teleport>
</template>

<style scoped>
  .tooltip {
    position: fixed;
    z-index: 1000;
    background-color: var(--gray-800);
    color: var(--extra-light);
    padding: 8px;
    border-radius: 8px;
    font-size: 14px;
    max-width: 250px;
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
    box-shadow: var(--shadow-soft);
    pointer-events: none;
  }
</style>
