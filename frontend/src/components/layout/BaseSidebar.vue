<script setup>
  import { ref, computed, inject, provide, watchEffect, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";
  import { File } from "@/models/File.js";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import BaseSidebarItem from "./BaseSidebarItem.vue";

  defineOptions({
    name: "BaseSidebar",
  });

  const props = defineProps({
    sidebarItems: {
      type: Array,
      default: () => [],
      validator: (items) => {
        return items.every((item) => item.separator || (item.text && (item.icon || item.action)));
      },
    },
    fab: { type: Boolean, default: true },
  });

  const emit = defineEmits(["action", "newEmptyFile", "showFileUploadModal"]);

  // Collapsing - use only the global state
  const collapsed = inject("sidebarIsCollapsed");
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value;
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
  const openRecentFile = (idx) => {
    const file = recentFiles.value[idx];
    if (!file) return;
    goTo(`file/${file.id}`);
  };

  // Handle sidebar item click
  const handleItemClick = (item) => {
    if (!item.clickable && item.clickable !== undefined) return;

    if (item.route) {
      router.push(item.route);
    } else if (item.action) {
      switch (item.action) {
        case "collapse":
          toggleCollapsed();
          break;
        case "newEmptyFile":
          emit("newEmptyFile");
          break;
        case "showFileUploadModal":
          emit("showFileUploadModal");
          break;
        default:
          emit("action", item.action);
      }
    } else if (item.onClick) {
      item.onClick();
    }
  };

  // Keys
  useKeyboardShortcuts(
    {
      "g,h": { fn: () => goTo(""), description: "go home" },
      "g,a": { fn: () => goTo("account"), description: "go to user account" },
      "g,s": { fn: () => goTo("settings"), description: "go to settings" },
      "g,1": { fn: () => openRecentFile(0), description: "open most recent file" },
      "g,2": { fn: () => openRecentFile(1), description: "open second most recent file" },
      "g,3": { fn: () => openRecentFile(2), description: "open third most recent file" },
      n: { fn: onCTAClick, description: "open new file menu" },
      c: { fn: toggleCollapsed, description: "collapse sidebar" },
    },
    true,
    "Main"
  );

  const ctaAttrs = computed(() => {
    return {
      text: mobileMode.value || collapsed.value ? "" : "New File",
      placement: mobileMode.value ? "top-end" : "bottom",
      kind: mobileMode.value ? "primary" : "secondary",
      class: collapsed.value ? "collapsed" : "",
    };
  });

  // Generate menu items including recent files
  const menuItems = computed(() => {
    const items = [];

    props.sidebarItems.forEach((item) => {
      if (item.includeRecentFiles) {
        // Add the "Recent Files" header
        items.push({
          icon: "Clock",
          text: "Recent Files",
          clickable: false,
        });

        // Add recent files
        recentFiles.value.forEach((file, idx) => {
          if (file) {
            items.push({
              icon: "File",
              text: file.title || "Untitled",
              tooltip: `Open "${file.title}"`,
              tooltipAlways: true,
              class: "recent-file",
              onClick: () => File.openFile(file, router),
            });
          }
        });
      } else {
        items.push(item);
      }
    });

    return items;
  });
</script>

<template>
  <div class="sb-wrapper" :class="{ mobile: mobileMode, collapsed: collapsed }">
    <template v-if="!mobileMode">
      <div id="logo">
        <Logo :type="collapsed ? 'small' : 'full'" alt="Aris logo" />
      </div>
    </template>

    <div v-if="!mobileMode || (mobileMode && fab)" class="cta" :class="{ fab: mobileMode }">
      <ContextMenu
        ref="menu-ref"
        data-testid="create-file-button"
        variant="slot"
        :placement="ctaAttrs.placement"
      >
        <template #trigger="{ toggle }">
          <Button :icon="'CirclePlus'" v-bind="ctaAttrs" @click="toggle" />
        </template>
        <ContextMenuItem icon="File" caption="Empty file" @click="emit('newEmptyFile')" />
        <ContextMenuItem icon="Upload" caption="Upload" @click="emit('showFileUploadModal')" />
      </ContextMenu>
    </div>

    <template v-if="!mobileMode">
      <div class="sb-menu">
        <template v-for="(item, index) in menuItems" :key="`item-${index}`">
          <Separator v-if="item.separator" />
          <BaseSidebarItem
            v-else
            :icon="item.icon"
            :icon-collapsed="item.iconCollapsed"
            :text="item.text"
            :tooltip="item.tooltip"
            :tooltip-always="item.tooltipAlways"
            :active="item.active"
            :clickable="item.clickable"
            :class="item.class"
            @click="handleItemClick(item)"
          />
        </template>
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
      width: 100%;
    }

    & .cta > .cm-wrapper :deep(button) {
      padding-left: 24px !important;
      padding-right: 30px !important;
      width: 100%;
      gap: 0px;
    }

    & > #logo > img {
      height: 64px;
      margin: 4px 0 0 6px;
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
      margin-bottom: 30px;
      padding-inline: 16px;

      & > img {
        margin: 0 0 -8px 0;
        width: 30px;
        height: 30px;
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
        margin-inline var(--transition-duration) ease-out;
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
    height: calc(100% - 64px - 32px - 16px - 16px - 8px);
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
    margin-block: 12px;
  }

  .sb-menu > :deep(.recent-file) {
    margin-block: 4px;
  }

  .sb-menu > :deep(.recent-file) > :deep(.tabler-icon) {
    color: var(--gray-800);
    transition:
      opacity 0.3s ease,
      color 0.3s ease;
  }

  .sb-menu > :deep(.recent-file.collapsed) > :deep(.tabler-icon) {
    opacity: 1;
  }

  .sb-menu > :deep(.recent-file:not(.collapsed)) > :deep(.tabler-icon) {
    opacity: 0;
  }

  .sb-menu > :deep(.recent-file:not(.collapsed):hover) {
    & > :deep(.tabler-icon) {
      opacity: 1;
      color: var(--extra-dark);
    }

    & > :deep(.sb-text) {
      color: var(--almost-black);
    }
  }

  .sb-menu > :deep(.recent-file.collapsed:hover) {
    & > :deep(.tabler-icon) {
      color: var(--almost-black);
    }
  }

  .sb-menu > :deep(.recent-file) > :deep(.sb-text) {
    max-width: calc(var(--expanded-width) - 32px - 4px - 16px - 4px) !important;
    overflow-x: clip;
    text-overflow: ellipsis;
  }

  .sb-menu > :deep(.recent-file) > :deep(*) {
    font-family: "Source Sans 3", sans-serif;
    text-transform: none;
    font-weight: 350;
    color: var(--gray-800);
    font-style: italic;
    font-size: 14px;
  }

  .sb-menu > :deep(.recent-file.collapsed) > :deep(*) {
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
