<script setup>
  import {
    IconFiles,
    IconCode,
    IconCheck,
    IconClock,
    IconDeviceFloppy,
    IconX,
  } from "@tabler/icons-vue";

  defineProps({
    saveStatus: {
      type: String,
      default: "idle",
      validator: (value) => ["idle", "pending", "saving", "saved", "error"].includes(value),
    },
  });
</script>

<template>
  <div class="statusbar">
    <div class="left"><IconFiles /></div>
    <div class="middle"><IconCode /><span>main.rsm > Subsubsec. 1.3.1 > Fig. 1.3.1</span></div>
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
    padding-inline: 8px;
  }

  .statusbar > * {
    font-size: 12px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: var(--dark);
    padding-block: 2px;
  }

  .statusbar > .left {
    padding-right: 8px;
  }

  .statusbar > :is(.left, .middle) > :deep(svg) {
    color: var(--dark);
  }

  .statusbar > .middle > :deep(svg) {
    margin-right: 8px;
  }

  .statusbar > .middle {
    flex: 1;
  }

  .statusbar > .middle:hover {
    background-color: var(--surface-hint);
  }

  .statusbar > :is(.left, .right) {
    flex: 0;
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
