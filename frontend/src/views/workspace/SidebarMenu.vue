<script setup>
  import { toRef, watchEffect, inject, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import SidebarItem from "./SidebarItem.vue";

  const props = defineProps({
    items: { type: Array, required: true },
  });
  const emit = defineEmits(["on", "off"]);
  const items = toRef(() => props.items);

  const drawerOpen = inject("drawerOpen");
  const handleDrawerClick = (clickedIndex) => {
    const wasActive = items.value[clickedIndex].state;
    if (wasActive) {
      emit("off", clickedIndex);
      drawerOpen.value = false;
    } else {
      // Emit events to close all other drawers first
      items.value.forEach((item, index) => {
        if (item.type === "drawer" && item.state) emit("off", index);
      });
      emit("on", clickedIndex);
      drawerOpen.value = true;
    }
  };

  // Keys
  const userMenuRef = useTemplateRef("user-menu");
  const toggleUserMenu = () => {
    userMenuRef.value?.toggle();
  };
  watchEffect(() => {
    if (!items.value) return;
    useKeyboardShortcuts(
      Object.fromEntries([
        ...items.value
          .filter((obj) => obj.key && obj.type === "drawer")
          .map((obj) => {
            const index = items.value.indexOf(obj);
            return [`p,${obj.key}`, { fn: () => handleDrawerClick(index) }];
          }),
        ["u", { fn: () => toggleUserMenu(), description: "Toggle user menu" }],
      ])
    );
  });

  const focusMode = inject("focusMode");
  const mobileMode = inject("mobileMode");
  const xsMode = inject("xsMode");
  const router = useRouter();
</script>

<template>
  <div class="sb-menu" :class="[mobileMode ? 'mobile' : '', xsMode ? 'xs' : '']">
    <template v-if="!mobileMode">
      <template v-for="(it, idx) in items" :key="it.name + idx">
        <Separator v-if="it.name === 'Separator'" />
        <SidebarItem
          v-else-if="it.type === 'toggle'"
          :icon="it.icon"
          :label="it.label"
          @on="emit('on', idx)"
          @off="emit('off', idx)"
        />
        <SidebarItem
          v-else-if="it.type === 'drawer'"
          :icon="it.icon"
          :label="it.label"
          type="outline"
          @on="handleDrawerClick(idx)"
          @off="handleDrawerClick(idx)"
        />
      </template>
      <SidebarItem v-model="focusMode" icon="LayoutOff" label="focus" />
      <UserMenu ref="user-menu" />
    </template>

    <template v-if="mobileMode">
      <SidebarItem icon="Home" label="Home" @click="router.push('/')" />
      <template v-for="(it, idx) in items" :key="it.name + idx">
        <SidebarItem
          v-if="it.type === 'toggle'"
          :icon="it.icon"
          :label="it.label"
          @on="emit('on', idx)"
          @off="emit('off', idx)"
        />
      </template>
      <ContextMenu variant="slot">
        <template #trigger="{ toggle }">
          <Button icon="Menu3" @click="toggle" />
        </template>
        <template v-for="(it, idx) in items" :key="it.name + idx">
          <ContextMenuItem
            v-if="it.type === 'drawer'"
            :icon="it.icon"
            :caption="it.label"
            @on="emit('on', idx)"
            @off="emit('off', idx)"
          />
        </template>
      </ContextMenu>
    </template>
  </div>
</template>

<style scoped>
  .sb-menu {
    position: fixed;
    padding-bottom: 16px;
    left: 0;
    opacity: 1;
    will-change: opacity;
    height: calc(100% - 64px);
    display: flex;
  }

  .sb-menu > .sb-item:last-child {
    padding-inline: 4px;
    padding-block: 8px;
  }

  .sb-menu:not(.mobile) {
    height: 100%;
    width: 64px;
    padding-inline: 8px;
    flex-direction: column;

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

  .sb-menu.mobile {
    display: flex;
    width: 100%;
    padding-inline: 16px;
    justify-content: space-between;
    position: fixed;
    left: 0;
    opacity: 1;
    height: 100%;
    flex-direction: row;

    & .sb-item {
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

  .sb-menu.mobile.xs {
  }
</style>
