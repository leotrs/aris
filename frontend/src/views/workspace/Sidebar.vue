<script setup>
  import { watch, inject, reactive, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import SidebarItem from "./SidebarItem.vue";
  import Drawer from "./Drawer.vue";

  const router = useRouter();
  const emit = defineEmits(["showComponent", "hideComponent"]);
  const items = reactive([
    {
      name: "DockableEditor",
      icon: "Code",
      label: "source",
      key: "e",
      state: false,
      type: "toggle",
    },
    {
      name: "DockableSearch",
      icon: "Search",
      label: "search",
      key: "f",
      state: false,
      type: "toggle",
    },
    { name: "Separator", state: false },
    {
      name: "DrawerMargins",
      icon: "LayoutDistributeVertical",
      label: "margins",
      key: "m",
      state: false,
      type: "drawer",
    },
    {
      name: "DrawerActivity",
      icon: "ProgressBolt",
      label: "activity",
      key: "a",
      state: false,
      type: "drawer",
    },
    {
      name: "DrawerCollaborate",
      icon: "UserShare",
      label: "share",
      key: "s",
      state: false,
      type: "drawer",
    },
    {
      name: "DrawerMeta",
      icon: "FileText",
      label: "meta",
      key: "i",
      state: false,
      type: "drawer",
    },
    {
      name: "DrawerSettings",
      icon: "AdjustmentsHorizontal",
      label: "settings",
      key: "t",
      state: false,
      type: "drawer",
    },
    { name: "Separator", state: false },
  ]);
  const itemsMobile = reactive([]);

  // Drawer
  const drawerOpen = inject("drawerOpen");
  const handleDrawerClick = (clickedIndex) => {
    const wasActive = items[clickedIndex].state;

    if (wasActive) {
      // Deactivating: close drawer
      items[clickedIndex].state = false;
      drawerOpen.value = false;
    } else {
      // Activating: Close all other drawers first and then open this one
      items.forEach((item) => item.type === "drawer" && (item.state = false));
      // Open the clicked drawer
      items[clickedIndex].state = true;
      drawerOpen.value = true;
    }
  };

  // Simple watcher for toggles only
  watch(
    () => items.filter((item) => item.type === "toggle").map((obj) => obj.state),
    (newStates, oldStates) => {
      const toggleItems = items.filter((item) => item.type === "toggle");

      newStates.forEach((isOn, idx) => {
        const wasOn = oldStates[idx];
        if (isOn && !wasOn) {
          emit("showComponent", toggleItems[idx].name, "right");
        } else if (!isOn && wasOn) {
          emit("hideComponent", toggleItems[idx].name, "right");
        }
      });
    }
  );

  // Keys
  const userMenuRef = useTemplateRef("user-menu");
  const toggleUserMenu = () => {
    if (!userMenuRef.value) return;
    userMenuRef.value.toggle();
  };
  useKeyboardShortcuts(
    Object.fromEntries([
      // Toggles
      ...items
        .filter((obj) => obj.key && obj.type === "toggle")
        .map((obj) => [`p,${obj.key}`, { fn: () => (obj.state = !obj.state) }]),

      // Drawers
      ...items
        .filter((obj) => obj.key && obj.type === "drawer")
        .map((obj, _, drawerItems) => {
          const originalIndex = items.indexOf(obj);
          return [`p,${obj.key}`, { fn: () => handleDrawerClick(originalIndex) }];
        }),

      // Other
      ["u", { fn: () => toggleUserMenu(), description: "Toggle user menu" }],
    ])
  );

  // Focus mode
  const layoutOnRef = useTemplateRef("layout-on-ref");
  const focusMode = inject("focusMode");

  // Responsiveness
  const mobileMode = inject("mobileMode");
  const xsMode = inject("xsMode");
</script>

<template>
  <div
    ref="sidebar-ref"
    class="sb-wrapper"
    :class="{ focus: focusMode, mobile: mobileMode, xs: xsMode }"
  >
    <Button
      v-show="focusMode"
      ref="layout-on-ref"
      class="layout-on"
      kind="tertiary"
      icon="Layout"
      @click="focusMode = false"
    />
    <Tooltip :anchor="layoutOnRef?.btn ?? null" content="Focus mode off" placement="top" />

    <div v-if="!mobileMode" id="logo" role="button" tabindex="0" @click="router?.push('/')">
      <img src="../../assets/logo-32px.svg" />
    </div>

    <div class="sb-menu">
      <div v-if="!mobileMode" class="sb-menu-std">
        <template v-for="(it, idx) in items" :key="it">
          <Separator v-if="it.name == 'Separator'" />
          <SidebarItem
            v-else-if="it.type === 'toggle'"
            v-model="items[idx].state"
            :icon="it.icon"
            :label="it.label"
          />
          <SidebarItem
            v-else-if="it.type === 'drawer'"
            :model-value="items[idx].state"
            :icon="it.icon"
            :label="it.label"
            type="outline"
            @click.stop="handleDrawerClick(idx)"
          />
        </template>
        <SidebarItem
          v-model="focusMode"
          icon="LayoutOff"
          label="focus"
          :with-side-control="false"
        />
        <UserMenu ref="user-menu" />
      </div>

      <Drawer :component="items.find((it) => it.type == 'drawer' && it.state)?.name ?? ''" />

      <div v-if="mobileMode" class="sb-menu-mobile" :class="{ xs: xsMode }">
        <SidebarItem
          icon="Home"
          label="home"
          :with-side-control="false"
          @click="router.push('/')"
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
    width: var(--sidebar-width);
    top: 16px;

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
    height: 48px;
    width: 64px;
    margin-bottom: 8px;
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
    position: fixed;
    max-width: 64px;
    padding-bottom: 16px;
    left: 0;
    width: 64px;
    opacity: 1;
    will-change: opacity;
    height: calc(100% - 64px);
    display: flex;
  }

  .sb-menu > .sb-item:last-child {
    padding-inline: 4px;
    padding-block: 8px;
  }

  .sb-menu-std {
    height: 100%;
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
    & > *:last-child {
      margin-bottom: 0px;
    }
  }

  .layout-on {
    position: fixed;
    bottom: 16px;
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
      margin: 0;
      display: flex;
      justify-content: center;
    }
  }

  .sb-menu-mobile.xs {
    padding-inline: 16px;
  }

  .sep {
    margin-block: 8px;
    padding-block: 4px;
  }
</style>
