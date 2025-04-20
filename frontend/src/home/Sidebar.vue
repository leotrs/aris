<script setup>
  import { ref, inject, onMounted, onUnmounted } from "vue";
  import SidebarItem from "./SidebarItem.vue";
  import Separator from "@/common/Separator.vue";
  import { IconMenu3 } from "@tabler/icons-vue";

  const isMobile = inject("isMobile");
  const showMobileMenu = ref(false);
  const emit = defineEmits(["showFileUploadModal"]);
  const forceCollapsed = ref(false);
  const collapsed = ref(false);
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value;
    forceCollapsed.value = !forceCollapsed.value;
  };

  const sidebarRef = ref(null);
  let observer;
  onMounted(() => {
    if (sidebarRef.value) {
      observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (!forceCollapsed.value) {
            if (entry.contentRect.width < 165 && !collapsed.value) {
              collapsed.value = true;
            } else if (entry.contentRect.width > 80 && collapsed.value) {
              collapsed.value = false;
            }
          }
        }
      });
      observer.observe(sidebarRef.value);
    }
  });
  onUnmounted(() => {
    if (observer) observer.disconnect();
  });
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

    <div class="cta" :class="{ fab: isMobile }">
      <Button
        kind="secondary"
        icon="CirclePlus"
        :text="!isMobile && !collapsed ? 'New File' : ''"
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
      </div>
    </template>
  </div>
</template>

<style scoped>
  .sb-wrapper {
    height: 100%;

    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .sb-wrapper:not(.mobile):not(.collapsed) {
    flex-basis: 204px;
    max-width: 204px;
    flex-grow: 0;
    flex-shrink: 0;

    & .cta {
      display: flex;
      margin-top: 12px;
      margin-bottom: 12px;
      justify-content: center;
      padding-inline: 16px;
    }

    & .cta > button {
      padding-left: 6px;
      justify-content: center;
      margin: 0 auto;
      width: 100%;
    }

    & > #logo > img {
      height: 64px;
      margin: 6px 0 -6px 6px;
    }
  }

  .sb-wrapper:not(.mobile).collapsed {
    padding-top: 16px;
    min-width: 64px;
    max-width: 64px;
    flex-grow: 0;

    & > * {
      margin: 0 auto;
    }

    & > #logo {
      margin-top: 8px;
      margin-bottom: 16px;
      padding-inline: 16px;

      & > img {
        margin: 0 0 -16px 0;
        width: 32px;
        height: 32px;
      }
    }

    & > .cta {
      padding-top: 12px;
      padding-inline: 8px;
      margin-bottom: 12px;
    }
  }

  .sb-wrapper.mobile:not(.collapsed) {
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

  .sb-menu > *,
  .cta > * {
    margin-block: 8px;
    gap: 4px;
  }
</style>
