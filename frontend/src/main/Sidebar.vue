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
    DockableMinimap: {
      icon: "MapPin",
      label: "map",
      preferredSide: "right",
      key: "m",
      state: false,
    },
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

    <div id="logo" @click="router?.push('/')">
      <img src="../assets/logo-32px.svg" />
    </div>

    <div class="sb-menu">
      <div class="sb-menu-inner">
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
    </div>
  </div>
</template>

<style scoped>
  .sb-wrapper {
    position: fixed;
    height: 100%;
    z-index: 2;
    max-width: 64px;
    width: 64px;
    top: 0;

    transform: translateX(0);
    will-change: transform;
    transition:
      opacity var(--transition-duration) ease,
      transform var(--transition-duration) ease;
  }

  .sb-wrapper.mobile {
    display: none;
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
    height: 64px;
    padding: 25px 17px 9px 17px;
    width: 64px;
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

  .sb-menu-inner {
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
</style>
