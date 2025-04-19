<script setup>
  import { ref, reactive } from "vue";
  import { IconQuote, IconUserEdit, IconCalendar, IconBook2 } from "@tabler/icons-vue";

  const tabInfo = reactive([
    {
      label: "Cite",
      icon: IconQuote,
      content:
        "Citation content lorem ipsum. Citation content lorem ipsum. Citation content lorem ipsum. Citation content lorem ipsum. Citation content lorem ipsum. Citation content lorem ipsum. ",
    },
    { label: "Author", icon: IconUserEdit },
    { label: "Source", icon: IconBook2 },
    { label: "Date", icon: IconCalendar },
  ]);
  const activeIndex = ref(0);
</script>

<template>
  <div ref="selfRef" class="panel citation">
    <div class="pn-header">
      <div
        v-for="(obj, idx) in tabInfo"
        class="tab"
        :class="{ active: idx === activeIndex }"
        @click.stop="activeIndex = idx"
      >
        <component :is="obj.icon" />
        <span class="tab-label text-default">{{ obj.label }}</span>
      </div>
    </div>
    <div class="pn-content">
      <div class="pn-content-title">
        <div class="left">
          <div class="text-label">{{ tabInfo[activeIndex].label }}</div>
        </div>
        <div class="right">
          <Button kind="tertiary" icon="Clipboard" />
        </div>
      </div>
      <div class="pn-content-main">
        <div>{{ tabInfo[activeIndex].content }}</div>
        <SegmentedControl
          v-if="tabInfo[activeIndex].label == 'Cite'"
          :labels="['Plain', 'BibTex']"
          :default-active="0"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .panel {
    min-width: calc(48px * 4);
    max-width: 216px;
    display: flex;
    flex-direction: column;
    background-color: var(--surface-primary);
    border: var(--border-thin) solid var(--border-primary);
    border-radius: 16px;
    position: fixed;
    z-index: 100;
  }

  .pn-header {
    display: flex;
    justify-content: space-between;
    background-color: var(--gray-75);
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    color: var(--dark);
    & svg {
      color: var(--dark);
    }
  }

  .tab {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    height: 40px;
    border-bottom: var(--border-thin) solid transparent;
    &:first-child {
      border-top-left-radius: calc(16px - var(--border-thin));
    }
    &:last-child {
      border-top-right-radius: calc(16px - var(--border-thin));
    }

    &:not(.active):hover {
      cursor: pointer;
      border-bottom-color: var(--extra-dark);
      color: var(--extra-dark);
      & .tab-label {
        display: block;
      }
      & > svg {
        color: var(--extra-dark);
      }
    }

    &.active {
      background-color: var(--information-100);
      border-bottom-color: var(--border-action);
      color: var(--text-action);
      & > svg {
        color: var(--icon-action);
      }
    }
  }

  .tab-label {
    position: absolute;
    top: calc(100% + 4px);
    display: none;
  }

  .pn-content {
    padding: calc(12px + 4px) 12px 12px 12px;
    font-size: 15px;
  }

  .pn-content-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & .left {
    }

    & .right {
      display: flex;
      gap: 4px;
    }

    & :deep(button.tertiary) {
      padding: 0 !important;
    }
  }

  .pn-content-main {
    display: flex;
    flex-direction: column;
    gap: 8px;
    & :deep(.sc-item) {
      padding: 4px !important;
    }
    & :deep(.sc-item:first-child) {
      padding-left: 6px !important;
    }
    & :deep(.sc-item:last-child) {
      padding-right: 6px !important;
    }
  }
</style>
