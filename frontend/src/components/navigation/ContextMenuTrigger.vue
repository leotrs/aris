<script setup>
  import { computed, ref, useTemplateRef, useSlots, Comment } from "vue";
  import ButtonDots from "@/components/base/ButtonDots.vue";
  import ButtonClose from "@/components/base/ButtonClose.vue";
  import Button from "@/components/base/Button.vue";

  const props = defineProps({
    variant: { type: String, default: "dots" }, // 'dots', 'close', 'custom', 'slot'
    size: { type: String, default: "md" }, // 'sm', 'md', 'lg'
    isOpen: { type: Boolean, required: true },

    // For custom variant
    component: { type: String, default: "ButtonToggle" },
    icon: { type: String, default: null },
    text: { type: String, default: null },
  });
  const emit = defineEmits(["toggle"]);
  const slots = useSlots();
  defineOptions({ inheritAttrs: false });

  // Determine effective variant
  const effectiveVariant = computed(() => {
    // Only use slot variant if there's actually meaningful slot content
    // Check if slot exists and has actual content (not just whitespace or comments)
    const hasSlotContent = slots.default && slots.default().some(vnode => 
      vnode.type !== Comment && 
      (typeof vnode.type === 'string' || typeof vnode.type === 'object' || typeof vnode.type === 'function')
    );
    return hasSlotContent ? "slot" : props.variant;
  });

  // Computed classes for trigger button
  const triggerClasses = computed(() => [
    "context-menu-trigger",
    `variant-${effectiveVariant.value}`,
    `size-${props.size}`,
  ]);

  // Correct trigger ref depends on variant
  const slotRef = useTemplateRef("slot-ref");
  const dotsRef = useTemplateRef("dots-ref");
  const customRef = useTemplateRef("custom-ref");
  const triggerRef = computed(() => {
    switch (effectiveVariant.value) {
      case "slot":
        return slotRef.value?.$el || slotRef.value;
      case "dots":
        return dotsRef.value?.$el || dotsRef.value;
      default:
        return customRef.value?.$el || customRef.value;
    }
  });
  const triggerId = `cm-trigger-${Math.random().toString(36).substr(2, 9)}`;

  // Touch interaction handling
  const touchStartTime = ref(0);
  const handleTouchStart = () => (touchStartTime.value = Date.now());
  const handleTouchEnd = () => {
    const touchDuration = Date.now() - touchStartTime.value;
    touchDuration < 300 ? handleToggle() : null; // Short tap
  };
  const handleToggle = () => emit("toggle");

  // Expose for parent components
  defineExpose({ triggerId, triggerRef });
</script>

<template>
  <div @click.stop @dblclick.stop @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <!-- Custom slot content -->
    <template v-if="effectiveVariant === 'slot'">
      <Button
        :id="triggerId"
        ref="slot-ref"
        kind="tertiary"
        :class="triggerClasses"
        :aria-expanded="isOpen"
        data-testid="trigger-button"
        v-bind="$attrs"
        :size="size"
        @click.stop="handleToggle"
      >
        <slot />
      </Button>
    </template>

    <!-- Dots variant -->
    <template v-else-if="effectiveVariant === 'dots'">
      <ButtonDots
        :id="triggerId"
        ref="dots-ref"
        :model-value="isOpen"
        :class="triggerClasses"
        :aria-expanded="isOpen"
        data-testid="trigger-button"
        v-bind="$attrs"
        @click="handleToggle"
        @update:model-value="handleToggle"
      />
    </template>

    <!-- Close variant -->
    <template v-else-if="effectiveVariant === 'close'">
      <ButtonClose
        :id="triggerId"
        ref="custom-ref"
        :class="triggerClasses"
        :aria-expanded="isOpen"
        data-testid="trigger-button"
        v-bind="$attrs"
        @click.stop="handleToggle"
      />
    </template>

    <!-- Custom component variant -->
    <template v-else>
      <component
        :is="component"
        :id="triggerId"
        ref="custom-ref"
        :model-value="isOpen"
        :icon="icon"
        :text="text"
        :size="size"
        :class="triggerClasses"
        hover-color="var(--surface-hint)"
        :aria-expanded="isOpen"
        data-testid="trigger-button"
        v-bind="$attrs"
        @update:model-value="handleToggle"
      />
    </template>
  </div>
</template>

<style scoped>
  .context-menu-trigger {
    transition: all 0.3s ease;
  }
</style>
