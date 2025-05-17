<script setup>
  import {} from "vue";
  const props = defineProps({
    isSaving: { type: Boolean, required: true },
    saveStatus: { type: String, required: true },
  });
  const emit = defineEmits(["compile"]);
</script>

<template>
  <div class="topbar">
    <Button class="cta" kind="primary" text="compile" @click="emit('compile')" />
    <span
      class="save-status"
      :class="{
        saving: isSaving,
        saved: saveStatus === 'Saved',
        error: saveStatus === 'Save failed',
      }"
    >
      {{ saveStatus }}
    </span>
  </div>
</template>

<style scoped>
  .topbar {
    background-color: var(--surface-page);
    height: 64px;
    position: fixed;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    width: calc(100% - var(--sidebar-width) - var(--outer-padding));
    display: flex;
    justify-content: center;
    padding: 16px;
    border-bottom: var(--border-extrathin) solid var(--border-primary);
  }

  .cta {
    padding-inline: 24px;
  }

  .save-status {
    font-size: 0.8rem;
    margin-left: 10px;
    opacity: 0.8;
    transition: all 0.3s ease;
  }
  .save-status.saving {
    color: #f59e0b;
  }
  .save-status.saved {
    color: #10b981;
  }
  .save-status.error {
    color: #ef4444;
  }
</style>
