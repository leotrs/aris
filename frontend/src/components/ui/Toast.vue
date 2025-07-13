<template>
  <Teleport to="body">
    <div v-if="visible" class="toast-container" :class="type">
      <div class="toast" :class="{ 'toast-entering': entering, 'toast-leaving': leaving }">
        <div class="toast-icon">
          <Icon v-if="type === 'success'" name="CircleCheckFilled" size="16" />
          <Icon v-else-if="type === 'error'" name="CircleXFilled" size="16" />
          <Icon v-else-if="type === 'warning'" name="AlertTriangleFilled" size="16" />
          <Icon v-else name="InfoCircleFilled" size="16" />
        </div>
        <div class="toast-content">
          <div class="toast-message">{{ message }}</div>
          <div v-if="description" class="toast-description">{{ description }}</div>
        </div>
        <button v-if="dismissible" class="toast-close" @click="dismiss">
          <Icon name="X" size="14" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from "vue";

  const props = defineProps({
    message: { type: String, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      default: "info",
      validator: (v) => ["success", "error", "warning", "info"].includes(v),
    },
    duration: { type: Number, default: 4000 },
    dismissible: { type: Boolean, default: true },
  });

  const emit = defineEmits(["dismiss"]);

  const visible = ref(false);
  const entering = ref(false);
  const leaving = ref(false);
  let timeoutId = null;

  const dismiss = () => {
    if (leaving.value) return;

    leaving.value = true;
    setTimeout(() => {
      visible.value = false;
      emit("dismiss");
    }, 200);
  };

  const show = () => {
    visible.value = true;
    entering.value = true;

    setTimeout(() => {
      entering.value = false;
    }, 200);

    if (props.duration > 0) {
      timeoutId = setTimeout(() => {
        dismiss();
      }, props.duration);
    }
  };

  onMounted(() => {
    show();
  });

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  defineExpose({ dismiss });
</script>

<style scoped>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    pointer-events: auto;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 12px;
    width: fit-content;
    height: 44px;
    padding: 0 16px;
    border-radius: 22px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid;
    background-color: var(--surface-primary);
    transition: all 0.2s ease;
    transform: translateX(0);
    opacity: 1;
  }

  .toast-entering {
    transform: translateX(100%);
    opacity: 0;
  }

  .toast-leaving {
    transform: translateX(100%);
    opacity: 0;
  }

  .toast-container.success .toast {
    border-color: var(--success-200);
    background-color: var(--success-50);
  }

  .toast-container.error .toast {
    border-color: var(--error-200);
    background-color: var(--error-50);
  }

  .toast-container.warning .toast {
    border-color: var(--warning-200);
    background-color: var(--warning-50);
  }

  .toast-container.info .toast {
    border-color: var(--information-200);
    background-color: var(--information-50);
  }

  .toast-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
  }

  .toast-icon :deep(svg) {
    flex-shrink: 0;
  }

  .toast-container.success .toast-icon {
    color: var(--success-600);
  }

  .toast-container.error .toast-icon {
    color: var(--error-600);
  }

  .toast-container.warning .toast-icon {
    color: var(--warning-600);
  }

  .toast-container.info .toast-icon {
    color: var(--information-600);
  }

  .toast-content {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .toast-message {
    font-weight: var(--weight-medium);
    font-size: 14px;
    color: var(--text-primary);
    line-height: 1.2;
    white-space: nowrap;
  }

  .toast-description {
    font-size: 13px;
    color: var(--text-secondary);
    margin-top: 4px;
    line-height: 1.4;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .toast-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 0;
    border-radius: 2px;
    transition: color 0.2s ease;
    margin-left: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-close:hover {
    color: var(--text-secondary);
  }

  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .toast-container {
      right: 16px;
      left: 16px;
      top: 16px;
    }

    .toast {
      min-width: auto;
      max-width: none;
    }
  }
</style>
