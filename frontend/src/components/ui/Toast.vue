<template>
  <Teleport to="body">
    <div v-if="visible" class="toast-container" :class="type">
      <div class="toast" :class="{ 'toast-entering': entering, 'toast-leaving': leaving }">
        <div class="toast-icon">
          <Icon v-if="type === 'success'" name="Check" />
          <Icon v-else-if="type === 'error'" name="X" />
          <Icon v-else-if="type === 'warning'" name="AlertTriangle" />
          <Icon v-else name="Info" />
        </div>
        <div class="toast-content">
          <div class="toast-message">{{ message }}</div>
          <div v-if="description" class="toast-description">{{ description }}</div>
        </div>
        <button v-if="dismissible" class="toast-close" @click="dismiss">
          <Icon name="X" size="16" />
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
    align-items: flex-start;
    gap: 12px;
    min-width: 300px;
    max-width: 400px;
    padding: 16px;
    border-radius: 8px;
    box-shadow: var(--shadow-soft);
    border: var(--border-thin) solid;
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
    border-color: var(--border-success);
    background-color: var(--surface-success);
  }

  .toast-container.error .toast {
    border-color: var(--border-danger);
    background-color: var(--surface-danger);
  }

  .toast-container.warning .toast {
    border-color: var(--border-warning);
    background-color: var(--surface-warning);
  }

  .toast-container.info .toast {
    border-color: var(--border-information);
    background-color: var(--surface-information);
  }

  .toast-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-top: 2px;
  }

  .toast-container.success .toast-icon {
    color: var(--success-600);
  }

  .toast-container.error .toast-icon {
    color: var(--danger-600);
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
  }

  .toast-message {
    font-weight: var(--weight-medium);
    font-size: 14px;
    color: var(--text-primary);
    line-height: 1.4;
  }

  .toast-description {
    font-size: 13px;
    color: var(--text-secondary);
    margin-top: 4px;
    line-height: 1.4;
  }

  .toast-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    transition: color 0.2s ease;
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
