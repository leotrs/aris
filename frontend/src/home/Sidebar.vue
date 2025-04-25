<script setup>
  import { ref, inject, watch } from "vue";
  import { IconMenu3 } from "@tabler/icons-vue";
  import SidebarItem from "./SidebarItem.vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";

  const emit = defineEmits(["showFileUploadModal"]);

  /* Collapsing */
  const forceCollapsed = ref(false);
  const collapsed = ref(false);
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value;
    forceCollapsed.value = !forceCollapsed.value;
  };
  useKeyboardShortcuts({ c: toggleCollapsed });

  /* Change the theme */
  const modeActive = ref(-1);
  watch(modeActive, (newVal) => {
    if (newVal == 0) {
      document.documentElement.classList.remove("dark-theme");
    }
    if (newVal == 2) {
      document.documentElement.classList.add("dark-theme");
    }
  });

  /* New file upload */
  useKeyboardShortcuts({ n: () => emit("showFileUploadModal") });

  /* Breakpoints */
  const breakpoints = inject("breakpoints");
  const isMobile = inject("isMobile");
  const showMobileMenu = ref(false);
</script>

<template>
  <div
    ref="sidebarRef"
    :class="['sb-wrapper', isMobile ? 'mobile' : '', !isMobile && collapsed ? 'collapsed' : '']"
  >
    <template v-if="!isMobile">
      <div id="logo">
        <img v-if="collapsed" src="../assets/logo-32px.svg" />
        <img v-else src="../assets/logotype.svg" />
      </div>
    </template>

    {{ breakpoints.active() }}

    <div class="cta" :class="{ fab: isMobile }">
      <Button
        kind="secondary"
        icon="CirclePlus"
        text="New File"
        :shadow="true"
        :class="{ collapsed }"
        @click="$emit('showFileUploadModal')"
      />
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
        <SegmentedControl
          v-model="modeActive"
          :icons="['Sun', 'SunMoon', 'Moon']"
          :default-active="1"
        />
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

  .sb-menu > *,
  .cta > button {
    gap: 4px;
    text-wrap: nowrap;
    white-space: nowrap;
  }

  .cta {
    transition: padding-inline var(--transition-duration) ease;
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
  }
</style>
