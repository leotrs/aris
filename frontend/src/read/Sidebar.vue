<script setup>
  import { ref, inject, computed, reactive, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import SidebarItem from "@/read/SidebarItem.vue";

  const router = useRouter();
  const emit = defineEmits(["showComponent", "hideComponent", "focusMode"]);

  const panelComponents = reactive({
    PanelChat: { icon: "Sparkles", label: "chat", preferredSide: "left", key: "a", state: false },
    PanelSearch: {
      icon: "Search",
      label: "search",
      preferredSide: "top",
      key: "f",
      state: false,
    },
    Minimap: { icon: "MapPin", label: "map", preferredSide: "left", key: "m", state: false },
    Comments: { icon: "Message", label: "comments", preferredSide: "left", key: "c", state: false },
    PanelCitation: {
      icon: "Quote",
      label: "citation",
      preferredSide: "left",
      key: "b",
      state: false,
    },
    PanelTags: {
      icon: "Tags",
      label: "tags",
      preferredSide: "top",
      key: "t",
      state: false,
    },
    PanelSymbols: {
      icon: "Variable",
      label: "symbols",
      preferredSide: "left",
      key: "x",
      state: false,
    },
    PanelClaims: { icon: "Bulb", label: "claims", preferredSide: "left", key: "t", state: false },
    PanelSettings: {
      icon: "FileSettings",
      label: "settings",
      preferredSide: "left",
      key: "s",
      state: false,
    },
  });

  const togglePanel = (name, obj) => {
    obj.state
      ? emit("hideComponent", name, obj.preferredSide)
      : emit("showComponent", name, obj.preferredSide);
    obj.state = !obj.state;
  };

  useKeyboardShortcuts(
    Object.fromEntries(
      Object.entries(panelComponents).map(([name, obj]) => [
        `p,${obj.key}`,
        () => togglePanel(name, obj),
      ])
    )
  );

  /* Focus mode */
  const focusMode = inject("focusMode");
</script>

<template>
  <div ref="sidebar-ref" class="sb-wrapper" :class="{ focus: focusMode }">
    <Button
      v-show="focusMode"
      class="layout-on"
      kind="tertiary"
      icon="Layout"
      @click="focusMode = false"
    />

    <div id="logo" :class="{ focus: focusMode }" @click="router?.push('/')">
      <img src="../assets/logo-32px.svg" />
    </div>

    <div class="sb-menu" :class="{ focus: focusMode }">
      <Separator />
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
      </div>
      <Separator />
      <SidebarItem v-model="focusMode" icon="LayoutOff" label="focus" :with-side-control="false" />
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
    will-change: width, top;
    transition:
      width var(--transition-duration) ease,
      top var(--transition-duration) ease;
  }

  .sb-wrapper.focus {
    width: 0;
    /* do NOT delete this! */
    top: 0;
  }

  #logo {
    height: 64px;
    padding: 25px 17px 9px 17px;
    width: 64px;
    opacity: 1;
    will-change: width, opacity;
    transition:
      width var(--transition-duration) ease,
      opacity var(--transition-duration) ease;

    &:hover {
      cursor: pointer;
    }

    & img {
      width: 30px;
      height: 30px;
    }
  }

  #logo.focus {
    opacity: 0;
    width: 0;
  }

  .sb-menu {
    padding: 8px 4px 24px 4px;
    position: fixed;
    height: calc(100% - 48px - 8px - 8px);
    max-width: 64px;
    left: 0;
    width: 64px;
    opacity: 1;
    will-change: width, opacity;
    transition:
      width var(--transition-duration) ease,
      opacity var(--transition-duration) ease;
  }

  .sb-menu.focus {
    opacity: 0;
    width: 0;
  }

  .sb-menu > .sb-item:last-child {
    padding-inline: 4px;
    padding-block: 8px;
  }

  .sb-menu-inner {
    height: calc(100% - 48px - 16px);
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
  }
</style>
