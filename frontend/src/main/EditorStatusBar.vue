<script setup>
  import { IconCheck, IconClock, IconDeviceFloppy, IconX, IconMapPin } from "@tabler/icons-vue";
  import { useScrollShadows } from "@/composables/useScrollShadows.js";

  defineProps({
    saveStatus: {
      type: String,
      default: "idle",
      validator: (value) => ["idle", "pending", "saving", "saved", "error"].includes(value),
    },
  });

  const { scrollElementRef, showLeftShadow, showRightShadow } = useScrollShadows();
</script>

<template>
  <div class="statusbar">
    <div class="left">
      <Button kind="tertiary" size="sm" icon="ArrowUpRight" text="Go to" />
    </div>
    <div class="middle-container">
      <div ref="scrollElementRef" class="middle">
        <IconMapPin />
        <span class="crumb">main.rsm</span>
        <span class="crumb-sep">></span>
        <span class="crumb">sec. 1.3.1</span>
        <span class="crumb-sep">></span>
        <span class="crumb">para.</span>
        <span class="crumb-sep">></span>
        <span class="crumb">span</span>
      </div>

      <div class="shadow-overlay shadow-left" :class="{ active: showLeftShadow }"></div>
      <div class="shadow-overlay shadow-right" :class="{ active: showRightShadow }"></div>
    </div>
    <div class="right">
      <IconClock v-if="saveStatus === 'pending'" class="icon-pending" />
      <IconDeviceFloppy v-if="saveStatus === 'saving'" class="icon-saving" />
      <IconCheck
        v-if="saveStatus === 'saved' || saveStatus === 'idle'"
        :class="{ 'icon-idle': saveStatus === 'idle', 'icon-saved': saveStatus === 'saved' }"
      />
      <IconX v-if="saveStatus === 'error'" class="icon-error" />
    </div>
  </div>
</template>

<style scoped>
  .statusbar {
    flex: 0;
    border-top: var(--border-extrathin) solid var(--border-primary);
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .statusbar * {
    font-size: 12px !important;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: var(--dark);
  }

  .statusbar :deep(.btn-text) {
    font-size: 11px !important;
  }

  .middle-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding-right: 8px;
  }

  .statusbar > :is(.left, .middle) > :deep(svg) {
    color: var(--dark);
  }

  .statusbar .middle {
    padding-inline: 8px;
    gap: 4px;
    overflow-x: auto;
    white-space: nowrap;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .statusbar .middle::-webkit-scrollbar {
    display: none;
  }

  .statusbar .middle > :deep(svg) {
    margin-right: 8px;
    flex-shrink: 0;
  }

  .statusbar > .left {
    flex: 1;
  }

  .statusbar > .left > button {
    height: 24px;
  }

  .crumb {
    text-wrap: nowrap;
    flex-shrink: 0;
  }

  .crumb:hover {
    background-color: var(--surface-hint);
  }

  .crumb-sep {
    flex-shrink: 0;
  }

  .statusbar > :is(.left, .right) {
    flex: 0;
  }

  .statusbar > .right {
    padding-inline: 8px;
  }

  .statusbar > * > :deep(svg) {
    margin: 0;
    transition: color 0.3s ease;
  }

  .icon-idle {
    color: var(--text-tertiary);
    opacity: 0.5;
  }

  .icon-pending {
    color: var(--warning-500);
  }

  .icon-saving {
    color: var(--primary-500);
  }

  .icon-saved {
    color: var(--success-500);
  }

  .icon-error {
    color: var(--error-500);
  }
</style>
