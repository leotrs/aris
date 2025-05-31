<script setup>
  import { ref, computed, inject, provide, watchEffect, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import SidebarItem from "./MainSidebarItem.vue";

  const props = defineProps({
    fab: { type: Boolean, default: true },
  });
  const emit = defineEmits(["newEmptyFile", "showFileUploadModal"]);

  // Collapsing
  const forceCollapsed = ref(false);
  const collapsed = ref(false);
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value;
    forceCollapsed.value = !forceCollapsed.value;
  };
  provide("collapsed", collapsed);

  // Breakpoints
  const mobileMode = inject("mobileMode");

  // CTA
  const menuRef = useTemplateRef("menu-ref");
  const onCTAClick = () => menuRef.value.toggle();

  const router = useRouter();
  const goTo = (page) => {
    router.push(`/${page}`);
  };

  // Recent files
  const fileStore = inject("fileStore");
  const recentFiles = ref(["", "", ""]);
  watchEffect(() => {
    recentFiles.value = fileStore.value?.getRecentFiles(3) || ["", "", ""];
  });

  // Keys
  useKeyboardShortcuts(
    {
      "g,h": { fn: () => goTo(""), description: "go home" },
      "g,a": { fn: () => goTo("account"), description: "go to user account" },
      "g,s": { fn: () => goTo("settings"), description: "go to settings" },
      n: { fn: onCTAClick, description: "open new file menu" },
      c: { fn: toggleCollapsed, description: "collapse sidebar" },
    },
    true,
    "Main"
  );
</script>

<template>
  <div
    :class="['sb-wrapper', mobileMode ? 'mobile' : '', !mobileMode && collapsed ? 'collapsed' : '']"
  >
    <template v-if="!mobileMode">
      <div id="logo">
        <img v-if="collapsed" src="../assets/logo-32px.svg" />
        <img v-else src="../assets/logotype.svg" />
      </div>
    </template>

    <div v-if="!mobileMode || (mobileMode && fab)" class="cta" :class="{ fab: mobileMode }">
      <ContextMenu
        ref="menu-ref"
        icon="CirclePlus"
        :text="mobileMode ? '' : 'New File'"
        :shadow="true"
        :placement="mobileMode ? 'top-end' : 'bottom'"
        btn-component="Button"
        kind="secondary"
        :class="{ collapsed }"
        @click="onCTAClick"
      >
        <ContextMenuItem icon="File" caption="Empty file" @click="emit('newEmptyFile')" />
        <ContextMenuItem icon="Upload" caption="Upload" @click="emit('showFileUploadModal')" />
      </ContextMenu>
    </div>

    <template v-if="!mobileMode">
      <div class="sb-menu">
        <SidebarItem icon="Home" text="Home" active @click="() => goTo('')" />
        <!-- <SidebarItem text="Feedback" /> -->
        <!-- <SidebarItem text="References" /> -->
        <!-- <Separator /> -->
        <!-- <SidebarItem text="Read" /> -->
        <!-- <SidebarItem text="Write" /> -->
        <!-- <SidebarItem text="Review" /> -->
        <Separator />
        <SidebarItem icon="Clock" text="Recent Files" />
        <SidebarItem
          class="recent-file"
          icon-collapsed="File"
          :text="recentFiles[0]?.title || ''"
        />
        <SidebarItem
          class="recent-file"
          icon-collapsed="File"
          :text="recentFiles[1]?.title || ''"
        />
        <SidebarItem
          class="recent-file"
          icon-collapsed="File"
          :text="recentFiles[2]?.title || ''"
        />
        <Separator />
        <SidebarItem icon="User" text="Account" @click="() => goTo('account')" />
        <SidebarItem icon="Settings" text="Settings" @click="() => goTo('settings')" />
        <Separator />
        <SidebarItem icon="LayoutSidebarLeftCollapse" text="Collapse" @click="toggleCollapsed" />
      </div>
    </template>
  </div>
</template>

<style scoped>
  .sb-wrapper {
    --expanded-width: 192px;
    --collapsed-width: 64px;
    --transition-duration: 0.3s;

    height: 100%;
    transition:
      min-width var(--transition-duration) ease-out,
      max-width var(--transition-duration) ease-out,
      flex-basis var(--transition-duration) ease-out;
  }

  .sb-wrapper:not(.mobile):not(.collapsed) {
    flex-basis: var(--expanded-width);
    min-width: var(--expanded-width);
    max-width: var(--expanded-width);
    flex-grow: 0;
    flex-shrink: 0;

    & .cta {
      display: flex;
      justify-content: center;
      padding-block: 12px;
      padding-inline: 16px;
    }

    & .cta > .cm-wrapper > :deep(button) {
      padding-left: 18px !important;
      padding-right: 24px !important;
      justify-content: center;
      margin: 0 auto;
      width: 100%;
      gap: 0px;
    }

    & > #logo > img {
      height: 64px;
      margin: 6px 0 -6px 6px;
    }
  }

  .sb-wrapper:not(.mobile).collapsed {
    padding-top: 16px;
    min-width: var(--collapsed-width);
    max-width: var(--collapsed-width);
    flex-basis: var(--collapsed-width);
    flex-grow: 0;

    & > * {
      margin: 0 auto;
    }

    & > #logo {
      margin-top: 8px;
      margin-bottom: 16px;
      padding-inline: 16px;

      & > img {
        margin: 0 0 -8px 0;
        width: 32px;
        height: 32px;
      }
    }

    & > .cta {
      padding-block: 12px;
      padding-inline: 8px;
    }

    & > .cta > .cm-wrapper > :deep(button) {
      width: 48px;
    }
  }

  .sb-wrapper:not(.mobile) {
    #logo img {
      transition:
        width var(--transition-duration) ease-out,
        height var(--transition-duration) ease-out,
        margin var(--transition-duration) ease-out;
    }
  }

  .sb-wrapper.mobile {
    width: 0;
    height: 0;
    position: fixed;
    z-index: 999;
  }

  #logo {
    display: flex;
    justify-content: center;

    & > img {
      margin: 0 auto;
    }
  }

  .sb-menu {
    padding-top: 8px;
    height: calc(100% - 64px - 32px - 16px - 16px);
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    & :deep(div.sb-item span.sb-text) {
      transition:
        opacity var(--transition-duration) ease-out,
        max-width var(--transition-duration) ease-out;
    }

    & :deep(div.sb-item:not(.collapsed) span.sb-text) {
      opacity: 1;
      max-width: var(--expanded-width);
    }

    & :deep(div.sb-item.collapsed span.sb-text) {
      opacity: 0;
      max-width: 0;
    }
  }

  .sb-menu > * {
    margin-block: 8px;
  }

  .sb-menu > .sep {
    margin-block: 16px;
  }

  .sb-menu > .recent-file > :deep(.sb-text) {
    padding-left: 38px;
  }

  .sb-menu > .recent-file > :deep(*) {
    font-family: "Source Sans 3", sans-serif;
    text-transform: none;
    font-weight: 300;
    font-size: 15px;
  }

  .sb-menu > .recent-file.collapsed > :deep(*) {
    stroke-width: 1.5px;
    color: var(--gray-700);
  }

  .sb-menu > *:first-child {
    margin-top: 2px;
  }

  .sb-menu > *,
  .cta > .cm-wrapper > :deep(button) {
    gap: 4px;
    text-wrap: nowrap;
    white-space: nowrap;
  }

  .cta.fab {
    position: fixed;
    bottom: 16px;
    right: 16px;
  }

  .cta {
    transition: padding-inline 0.2s ease 0.1s;
  }

  .cta:not(.mobile) > .cm-wrapper > :deep(button:has(> .btn-text)) {
  }

  .cta > .cm-wrapper > :deep(button) {
    overflow-x: hidden;
    transition:
      width var(--transition-duration) ease,
      padding var(--transition-duration) ease;
  }

  .cta > .cm-wrapper > :deep(button > .btn-text) {
    max-width: calc(var(--sidebar-width) - 16px - 32px);
    opacity: 1;
    transition:
      opacity var(--transition-duration) ease,
      width var(--transition-duration) ease,
      max-width var(--transition-duration) ease;
  }

  .cta > .cm-wrapper > :deep(button.collapsed > .btn-text) {
    width: 0;
    opacity: 0;
    max-width: 0;
  }

  /* Overwrite Button padding so collapsing transition works well */
  .cta > .cm-wrapper > :deep(button.collapsed) {
    padding: calc(8px - var(--border-thin)) !important;
    gap: 0px;
  }

  .sc-wrapper {
    margin-left: 20px;
    margin-bottom: 0;
  }
</style>
