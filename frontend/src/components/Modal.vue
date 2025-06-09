<script setup>
  import {} from "vue";
  import useClosable from "@/composables/useClosable.js";

  const props = defineProps({
    customHeader: { type: Boolean, default: false },
  });
  const emit = defineEmits(["close"]);

  useClosable({
    onClose: () => emit("close"),
    closeOnEsc: true,
    closeOnOutsideClick: true,
    closeOnCloseButton: true,
    autoActivate: true,
  });
</script>

<template>
  <div class="modal">
    <div class="content">
      <Pane>
        <template #header>
          <slot name="header" />
        </template>
        <slot />
      </Pane>
    </div>
  </div>
</template>

<style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .content {
    background: var(--surface-primary);
    border-radius: 12px;
    max-width: 500px;
    max-height: 80vh;
    width: 90%;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }
</style>
