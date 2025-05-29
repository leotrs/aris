<script setup>
  import { inject } from "vue";

  const emit = defineEmits(["compile"]);
  const focusMode = inject("focusMode");
</script>

<template>
  <div class="tb-wrapper" :class="{ focus: focusMode }">
    <div class="left">
      <Tabs :labels="['Source', 'Files']" :icons="['Code', 'Files']">
        <TabPage />
        <TabPage />
      </Tabs>
    </div>
    <!-- <div class="middle">Go to...</div> -->
    <div class="right">
      <!-- <div class="version">
           <span class="text-default">v2</span>
           <Button kind="tertiary" size="sm" icon="CaretDownFilled" />
           </div> -->
      <Button kind="tertiary" size="sm" icon="Versions" />
      <Button kind="tertiary" size="sm" icon="Lifebuoy" />
      <Button kind="tertiary" size="sm" icon="Settings" />
      <Button kind="primary" size="sm" text="compile" class="cta" @click="emit('compile')" />
    </div>
  </div>
</template>

<style scoped>
  .tb-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --links-width: 151px;

    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 48px;
    border-top-left-radius: 16px;
    opacity: 1;
    transform: translateY(0);
    will-change: opacity, transform, width;
    transition:
      opacity var(--transition-duration) ease,
      transform var(--transition-duration) ease,
      width var(--transition-duration) ease;
  }

  .tabs-wrapper :deep(.tabs-header) {
    border-radius: 8px 8px 0 0 !important;
  }

  .tabs-wrapper :deep(.tab-wrapper) {
    width: 56px;
  }

  .tabs-wrapper :deep(.tabs-content) {
    display: none !important;
    padding: 0px !important;
    margin: 0px !important;
  }

  .right {
    display: flex;
    gap: 4px;
    height: 100%;
    padding-block: 8px;
  }

  .right .version {
    display: flex;
    align-items: center;
  }
</style>
