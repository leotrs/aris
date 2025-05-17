<script setup>
  import { ref, inject, useTemplateRef } from "vue";
  import { IconMenu3 } from "@tabler/icons-vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import SidebarItem from "./SidebarItem.vue";

  const emit = defineEmits(["showFileUploadModal"]);

  // Collapsing
  const forceCollapsed = ref(false);
  const collapsed = ref(false);
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value;
    forceCollapsed.value = !forceCollapsed.value;
  };

  // Breakpoints
  const breakpoints = inject("breakpoints");
  const isMobile = inject("isMobile");
  const showMobileMenu = ref(false);

  // Keys
  useKeyboardShortcuts({
    n: () => emit("showFileUploadModal"),
    c: toggleCollapsed,
  });

  // CTA
  const menuRef = useTemplateRef("menu-ref");
  const onCTAClick = () => menuRef.value.toggle();
</script>

<template>
  <div :class="['sb-wrapper', isMobile ? 'mobile' : '', !isMobile && collapsed ? 'collapsed' : '']">
    <template v-if="!isMobile">
      <div id="logo">
        <img v-if="collapsed" src="../assets/logo-32px.svg" />
        <img v-else src="../assets/logotype.svg" />
      </div>
    </template>

    <!-- {{ breakpoints.active() }} -->

    <div class="cta" :class="{ fab: isMobile }">
      <Button
        kind="secondary"
        icon="CirclePlus"
        text="New File"
        :shadow="true"
        :class="{ collapsed }"
        @click="onCTAClick"
      />
      <ContextMenu ref="menu-ref" icon="">
        <ContextMenuItem icon="File" caption="Empty file" />
        <ContextMenuItem icon="Upload" caption="Upload" @click="emit('showFileUploadModal')" />
      </ContextMenu>
    </div>

    <template v-if="isMobile">
      <div class="sb-btn mobile" @click.stop="showMobileMenu = !showMobileMenu">
        <IconMenu3 />
      </div>
      <div v-if="showMobileMenu" class="sb-menu mobile">
        <SidebarItem :collapsed="false" text="Home" />
        <SidebarItem :collapsed="false" text="Feedback" />
        <SidebarItem :collapsed="false" text="References" />
        <Separator />
        <SidebarItem :collapsed="false" text="Read" />
        <SidebarItem :collapsed="false" text="Write" />
        <SidebarItem :collapsed="false" text="Review" />
        <SidebarItem :collapsed="false" text="All Files" active />
        <Separator />
        <SidebarItem :collapsed="false" text="Settings" />
        <SidebarItem :collapsed="false" text="Account" />
      </div>
    </template>

    <template v-else>
      <div class="sb-menu">
        <SidebarItem :collapsed="collapsed" text="Home" />
        <SidebarItem :collapsed="collapsed" text="Feedback" />
        <SidebarItem :collapsed="collapsed" text="References" />
        <Separator />
        <SidebarItem :collapsed="collapsed" text="Read" />
        <SidebarItem :collapsed="collapsed" text="Write" />
        <SidebarItem :collapsed="collapsed" text="Review" />
        <SidebarItem :collapsed="collapsed" text="All Files" active />
        <Separator />
        <SidebarItem :collapsed="collapsed" text="Collapse" @click="toggleCollapsed" />
        <ThemeSwitch />
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

    & .cta > button {
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

    & > .cta > button {
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

  .sb-wrapper.mobile.collapsed {
  }

  #logo {
    display: flex;
    justify-content: center;

    & > img {
      margin: 0 auto;
    }
  }

  .sb-menu {
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

  .sb-menu > *:first-child {
    margin-top: 2px;
  }

  .sb-menu > *,
  .cta > button {
    gap: 4px;
    text-wrap: nowrap;
    white-space: nowrap;
  }

  .cta {
    transition: padding-inline 0.2s ease 0.1s;
  }

  .cta > button {
    justify-content: unset !important;
    padding-left: 24px !important;
    overflow-x: hidden;
    transition:
      width var(--transition-duration) ease,
      padding var(--transition-duration) ease;
  }

  .cta > button > :deep(.btn-text) {
    max-width: calc(var(--sidebar-width) - 16px - 32px);
    opacity: 1;
    transition:
      opacity var(--transition-duration) ease,
      width var(--transition-duration) ease,
      max-width var(--transition-duration) ease;
  }

  .cta > button.collapsed > :deep(.btn-text) {
    width: 0;
    opacity: 0;
    max-width: 0;
  }

  /* Overwrite Button padding so collapsing transition works well */
  .cta > button.collapsed {
    padding: calc(8px - var(--border-thin)) !important;
    gap: 0px;
  }

  .sc-wrapper {
    margin-left: 20px;
    margin-bottom: 0;
  }
</style>
