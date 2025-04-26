<script setup>
  import { ref, computed, reactive, watch } from "vue";
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
  const focusMode = ref(false);
  watch(focusMode, (newVal) => emit("focusMode", newVal));
</script>

<template>
  <div ref="sidebar-ref" class="sb-wrapper">
    <Button
      v-show="focusMode"
      class="layout-on"
      kind="tertiary"
      icon="Layout"
      @click="focusMode = false"
    />

    <div v-show="!focusMode" id="logo" @click="router?.push('/')">
      <img src="../assets/logo-32px.svg" />
    </div>
    <div v-show="!focusMode" class="sb-menu">
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
      <SidebarItem v-model="focusMode" icon="LayoutOff" label="focus" :with-side-control="false" />
    </div>
  </div>
</template>

<style scoped>
  .sb-wrapper {
    height: 100%;
    position: fixed;
    z-index: 2;
    min-width: 64px;
    max-width: 64px;
    padding-block: 8px;
  }

  #logo {
    display: flex;
    padding: 9px;

    &:hover {
      cursor: pointer;
    }

    & > img {
      margin: 0 auto;
    }
  }

  .sb-menu {
    padding: 8px;
    position: fixed;
    height: calc(100% - 48px - 8px - 8px);
    min-width: 64px;
    width: fit-content;
    left: 0;

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
    position: absolute;
    bottom: 0;
    margin-inline: 8px;
    margin-block: 24px;
  }
</style>
