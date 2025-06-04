<script setup>
  import { inject, reactive } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import SidebarItem from "./SidebarItem.vue";

  const router = useRouter();
  const emit = defineEmits(["showComponent", "hideComponent"]);
  const panelComponents = reactive({
    /* PanelChat: { icon: "Sparkles", label: "chat", preferredSide: "left", key: "a", state: false }, */
    DockableEditor: {
      icon: "Code",
      label: "source",
      preferredSide: "left",
      key: "e",
      state: false,
    },
    DockableSearch: {
      icon: "Search",
      label: "search",
      preferredSide: "top",
      key: "f",
      state: false,
    },
    // always on!
    /* DockableMinimap: {
     *   icon: "MapPin",
     *   label: "map",
     *   preferredSide: "right",
     *   key: "m",
     *   state: true,
     * }, */
    Comments: { icon: "Message", label: "comments", preferredSide: "left", key: "c", state: false },
    /* PanelSymbols: {
     *   icon: "Variable",
     *   label: "symbols",
     *   preferredSide: "left",
     *   key: "x",
     *   state: false,
     * }, */
    /* PanelClaims: { icon: "Bulb", label: "claims", preferredSide: "left", key: "t", state: false }, */
  });
  const panelComponentsMobile = reactive({
    /* PanelChat: { icon: "Sparkles", label: "chat", preferredSide: "left", key: "a", state: false }, */
    DockableEditor: {
      icon: "Code",
      label: "source",
      preferredSide: "left",
      key: "e",
      state: false,
    },
    DockableSearch: {
      icon: "Search",
      label: "search",
      preferredSide: "top",
      key: "f",
      state: false,
    },
    Comments: { icon: "Message", label: "comments", preferredSide: "left", key: "c", state: false },
  });

  // Keys
  useKeyboardShortcuts(
    Object.fromEntries(
      Object.entries(panelComponents).map(([name, obj]) => [
        `p,${obj.key}`,
        () => (obj.state = !obj.state),
      ])
    )
  );

  // Focus mode
  const focusMode = inject("focusMode");

  // Responsiveness
  const mobileMode = inject("mobileMode");
</script>

<template>
  <div ref="sidebar-ref" class="sb-wrapper" :class="{ focus: focusMode, mobile: mobileMode }">
    <Button
      v-show="focusMode"
      class="layout-on"
      kind="tertiary"
      icon="Layout"
      @click="focusMode = false"
    />

    <div v-if="!mobileMode" id="logo" role="button" tabindex="0" @click="router?.push('/')">
      <img src="../assets/logo-32px.svg" />
    </div>

    <div class="sb-menu">
      <div v-if="!mobileMode" class="sb-menu-std">
        <SidebarItem
          v-for="(obj, name) in panelComponents"
          :key="obj"
          v-model="obj.state"
          :icon="obj.icon"
          :label="obj.label"
          :preferred-side="obj.preferredSide"
          @on="(side) => emit('showComponent', name, side)"
          @off="(side) => emit('hideComponent', name, side)"
        />
        <SidebarItem
          v-model="focusMode"
          icon="LayoutOff"
          label="focus"
          :with-side-control="false"
        />
      </div>

      <div v-if="mobileMode" class="sb-menu-mobile">
        <SidebarItem icon="Home" label="home" :with-side-control="false" />

        <SidebarItem
          v-for="(obj, name) in panelComponentsMobile"
          :key="obj"
          v-model="obj.state"
          :icon="obj.icon"
          :label="obj.label"
          :preferred-side="obj.preferredSide"
          @on="(side) => emit('showComponent', name, side)"
          @off="(side) => emit('hideComponent', name, side)"
        />
        <SidebarItem icon="Share3" label="share" :with-side-control="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .sb-wrapper {
    position: fixed;
    height: 100%;
    z-index: 2;
    width: 64px;
    top: 0;

    transform: translateX(0);
    will-change: transform;
    transition:
      opacity var(--transition-duration) ease,
      transform var(--transition-duration) ease;
  }

  .sb-wrapper.focus {
    transform: translateX(-100%);
  }

  .sb-wrapper > :is(#logo, .sb-menu) {
    opacity: 1;
    will-change: opacity;
    transition: opacity var(--transition-duration) ease;
  }

  .sb-wrapper.focus > :is(#logo, .sb-menu) {
    opacity: 0;
  }

  #logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    width: 64px;
    margin-top: 16px;
    opacity: 1;
    &:hover {
      cursor: pointer;
    }

    & img {
      width: 30px;
      height: 30px;
    }
  }

  .sb-menu {
    padding: 8px 4px 24px 4px;
    position: fixed;
    height: calc(100% - 48px - 8px - 8px);
    max-width: 64px;
    left: 0;
    width: 64px;
    opacity: 1;
    will-change: opacity;
  }

  .sb-menu > .sb-item:last-child {
    padding-inline: 4px;
    padding-block: 8px;
  }

  .sb-menu-std {
    height: 100%;
    padding-block: 8px;
    padding-inline: 4px;

    /* no scrollbar in any browser */
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    & > *:not(:last-child) {
      margin-bottom: 12px;
    }
  }

  .layout-on {
    position: fixed;
    bottom: 21px;
    margin: 8px;
    left: 64px;
  }

  .sb-wrapper.mobile {
    padding: 0;
    height: calc(64px);
    width: 100%;
    top: unset;
    bottom: 0;
    border-top: var(--border-thin) solid var(--border-primary);
    background-color: var(--surface-hover);
    border-radius: 16px 16px 0 0;
  }

  .sb-wrapper.mobile > .sb-menu {
    padding: 0;
    position: fixed;
    left: 0;
    max-width: 100%;
    width: 100%;
    opacity: 1;
  }

  .sb-menu-mobile {
    display: flex;
    width: 100%;
    padding-inline: 24px;
    justify-content: space-between;

    & .sb-item {
      padding-block: 8px;
      padding-inline: 0;
      align-items: center;
    }

    & .sb-item > :deep(.sb-item-label) {
      width: 32px;
    }
  }
</style>
