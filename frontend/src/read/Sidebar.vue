<script setup>
  import { ref, reactive } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import SidebarItem from "@/read/SidebarItem.vue";

  const router = useRouter();
  const emit = defineEmits(["showComponent", "hideComponent"]);

  const components = reactive({
    PanelChat: { icon: "Sparkles", label: "chat", preferredSide: "left", key: "a", state: false },
    PanelSearch: {
      icon: "Search",
      label: "search",
      preferredSide: "top",
      key: "f",
      state: false,
    },
    Minimap: { icon: "MapPin", label: "map", preferredSide: "left", key: "m", state: false },
    Comments: { icon: "Message", label: "notes", preferredSide: "left", key: "c", state: false },
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
    PanelFocus: {
      icon: "LayoutOff",
      label: "focus",
      preferredSide: "left",
      key: "d",
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
      Object.entries(components).map(([name, obj]) => [
        `p,${obj.key}`,
        () => togglePanel(name, obj),
      ])
    )
  );
</script>

<template>
  <div ref="sidebar-ref" class="sb-wrapper">
    <div id="logo" @click="router?.push('/')">
      <img src="../assets/logo-32px.svg" />
    </div>
    <div class="sb-menu">
      <SidebarItem
        v-for="(obj, name) in components"
        v-model="obj.state"
        :icon="obj.icon"
        :label="obj.label"
        :preferred-side="obj.preferredSide"
        @on="(side) => emit('showComponent', name, side)"
        @off="(side) => emit('hideComponent', name, side)"
      />
    </div>
  </div>
</template>

<style scoped>
  .sb-wrapper {
    height: 100%;
    min-width: 64px;
    max-width: 64px;
    padding-inline: 8px;
    padding-block: 8px;
    overflow-x: visible;
    background-color: var(--extra-light);
    position: fixed;
    z-index: 1;
    /* border-right: var(--border-thin) solid var(--border-primary); */
  }

  .btn-toggle {
    position: relative;
  }

  .sc-wrapper {
    display: none;
    position: fixed;
    left: calc(64px + 4px);
    top: calc(64px + 16px + 56px + 8px);
    z-index: 999;

    :deep(& > .sc-item) {
      padding-block: 0px !important;
      padding-inline: 0px !important;
    }
  }

  #logo {
    display: flex;
    padding: 9px;
    margin-top: 8px;

    &:hover {
      cursor: pointer;
    }

    & > img {
      margin: 0 auto;
    }
  }

  .sb-menu {
    padding-block: 16px;
    position: fixed;
    height: calc(100% - 48px + 4px);
    min-width: 64px;
    width: fit-content;
    left: 0;
    padding-inline: 8px;

    /* no scrollbar in any browser */
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    & > * {
      margin-bottom: 12px;
    }
  }
</style>
