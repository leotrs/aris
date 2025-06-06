<script setup>
  import { computed, inject, reactive } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import SidebarItem from "./SidebarItem.vue";

  const router = useRouter();
  const emit = defineEmits(["showComponent", "hideComponent"]);
  const panelComponents = reactive({
    /* PanelChat: { icon: "Sparkles", label: "chat", preferredSide: "left", key: "a", state: false }, */
    DockableEditor: {
      name: "DockableEditor",
      icon: "Code",
      label: "source",
      preferredSide: "left",
      key: "e",
      state: false,
      type: "toggle",
    },
    DockableSearch: {
      name: "DockableSearch",
      icon: "Search",
      label: "search",
      preferredSide: "top",
      key: "f",
      state: false,
      type: "toggle",
    },
    Separator: { label: "Separator" },
    DrawerMargins: {
      // icon: "LayoutSidebarRight",
      icon: "LayoutDistributeVertical",
      label: "margins",
      preferredSide: "lef",
      key: "m",
      state: false,
      type: "drawer",
    },
    DrawerActivity: {
      // icon: "Versions",
      icon: "ProgressBolt",
      label: "activity",
      preferredSide: "left",
      key: "c",
      state: false,
      type: "drawer",
    },
    DrawerCollaborate: {
      icon: "UserShare",
      label: "share",
      preferredSide: "left",
      key: "c",
      state: false,
      type: "drawer",
    },
    DrawerMeta: {
      // icon: "Versions",
      icon: "FileText",
      label: "meta",
      preferredSide: "left",
      key: "c",
      state: false,
      type: "drawer",
    },
    DrawerSettings: {
      icon: "AdjustmentsHorizontal",
      label: "settings",
      preferredSide: "left",
      key: "c",
      state: false,
      type: "drawer",
    },
    Separator2: { label: "Separator" },
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
    Comments: {
      icon: "Message",
      label: "comments",
      preferredSide: "left",
      key: "c",
      state: false,
    },
  });

  // Drawer
  const drawerOpen = inject("drawerOpen");
  const onItemOn = (obj, side) => {
    if (obj.type == "drawer") drawerOpen.value = true;
    else emit("showComponent", obj.name, side);
  };
  const onItemOff = (obj, side) => {
    if (obj.type == "drawer") drawerOpen.value = false;
    else emit("hideComponent", obj.name, side);
  };
  const sidebarWidth = computed(() => (drawerOpen.value ? "calc(64px + 320px)" : "64px"));

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
        <template v-for="obj in panelComponents" :key="obj">
          <Separator v-if="obj.label == 'Separator'" />
          <SidebarItem
            v-else
            v-model="obj.state"
            :icon="obj.icon"
            :label="obj.label"
            :type="obj.type === 'drawer' ? 'outline' : 'filled'"
            @on="(side) => onItemOn(obj, side)"
            @off="(side) => onItemOff(obj, side)"
          />
        </template>
        <SidebarItem
          v-model="focusMode"
          icon="LayoutOff"
          label="focus"
          :with-side-control="false"
        />
        <UserMenu />
        <div class="newdrawer" :class="{ active: drawerOpen }">
          <Pane>
            <template #header>Margins</template>
            <Section>
              <template #title>Annotations</template>
              <template #content>Comments and notes</template>
            </Section>
            <Section>
              <template #title>Ari</template>
              <template #content>Artificial research intelligence</template>
            </Section>
            <Section>
              <template #title>Math Tools</template>
              <template #content>Symbols and results</template>
            </Section>
          </Pane>
        </div>
      </div>

      <div v-if="mobileMode" class="sb-menu-mobile" :class="{ xs: xsMode }">
        <SidebarItem
          icon="Home"
          label="home"
          :with-side-control="false"
          @click="router.push('/')"
        />

        <SidebarItem
          v-for="obj in panelComponentsMobile"
          :key="obj"
          v-model="obj.state"
          :icon="obj.icon"
          :label="obj.label"
          :preferred-side="obj.preferredSide"
          @on="(side) => emit('showComponent', obj, side)"
          @off="(side) => emit('hideComponent', obj, side)"
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
    width: v-bind(sidebarWidth);
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
    margin-top: 0px;
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
    left: 0;
    width: 64px;
    opacity: 1;
    will-change: opacity;
    height: calc(100% - 64px);
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
      margin-bottom: 8px;
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

  .newdrawer {
    background: var(--surface-page);
    position: absolute;
    top: calc(-64px + 8px);
    bottom: 0;
    left: -312px;
    width: calc(320px - 8px);
    border-radius: 16px;
    box-shadow: var(--shadow-soft);
    border: var(--border-med) solid var(--information-200);
    opacity: 0;
    transition:
      left 0.3s ease,
      opacity 0.3s ease;
  }

  .newdrawer.active {
    left: 64px;
    opacity: 1;
  }

  .pane {
    height: 100%;
  }

  .section {
    width: 100%;
  }
</style>
