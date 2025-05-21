<script setup>
  import { ref, reactive, watch, watchEffect } from "vue";
  import { useFloating, offset, flip, shift } from "@floating-ui/vue";

  const props = defineProps({
    anchor: { type: [Object, null], required: true },
    content: { type: String, default: "" },
    placement: { type: String, default: "bottom" },
  });

  const selfRef = ref(null);
  const floatingStyles = reactive({ left: "", top: "" });
  const isVisible = ref(false);

  watch(
    () => props.anchor,
    (newVal, oldVal) => {
      if (oldVal == null && !!newVal) {
        console.log("here", props.anchor);
        const { floatingStyles: styles } = useFloating(props.anchor, selfRef, {
          /* middleware: [offset(8), flip(), shift()], */
          placement: props.placement,
          strategy: "absolute",
        });
        watch(styles, (newStyles) => {
          console.log("inner", newStyles);
          floatingStyles.left = newStyles.x;
          floatingStyles.top = newStyles.y;
        });
      }
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
  <div
    v-if="anchor"
    ref="selfRef"
    class="tooltip"
    :style="{
      left: floatingStyles.left,
      top: floatingStyles.top,
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' : 'hidden',
    }"
  >
    <slot>{{ content }}</slot>
  </div>
</template>

<style scoped>
  .tooltip {
    position: absolute;
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
