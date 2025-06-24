<script setup>
  import { computed, useTemplateRef } from "vue";
  import ContextMenu from "./ContextMenu.vue";

  defineOptions({
    name: "FileMenu",
  });

  const props = defineProps({
    icon: { type: String, default: "Dots" },
    mode: { type: String, default: "ContextMenu" },
  });
  const emit_ = defineEmits(["rename", "duplicate", "delete"]);
  const emit = (event) => {
    // Only try to toggle if the ref is available and has the toggle method
    if (menuRef.value && typeof menuRef.value.toggle === "function") {
      menuRef.value.toggle();
    }
    emit_(event);
  };

  const comp = computed(() => (props.mode === "ContextMenu" ? "ContextMenuItem" : "Button"));
  const menuComponent = computed(() => (props.mode === "ContextMenu" ? ContextMenu : "div"));
  const childProps = (icon, caption) => {
    if (props.mode === "ContextMenu") return { icon: icon, caption: caption };
    else if (props.mode === "ButtonRow")
      return { icon: icon, caption: caption, kind: "tertiary", size: "sm", textFloat: "bottom" };
  };

  const menuRef = useTemplateRef("menu-ref");
  defineExpose({ toggle: () => menuRef.value?.toggle() });
</script>

<template>
  <div class="fm-wrapper" data-testid="file-menu" :class="mode">
    <component :is="menuComponent" ref="menu-ref" variant="dots">
      <component :is="comp" v-bind="childProps('Share3', 'Share')" data-testid="file-menu-share" />
      <component :is="comp" v-bind="childProps('Download', 'Download')" data-testid="file-menu-download" />
      <Separator />
      <component :is="comp" v-bind="childProps('Edit', 'Rename')" data-testid="file-menu-rename" @click="emit('rename')" />
      <component :is="comp" v-bind="childProps('Copy', 'Duplicate')" data-testid="file-menu-duplicate" @click="emit('duplicate')" />
      <component
        :is="comp"
        v-bind="childProps('TrashX', 'Delete')"
        class="danger"
        data-testid="file-menu-delete"
        @click="emit('delete')"
      />
    </component>
  </div>
</template>

<style scoped>
  .fm-wrapper {
    width: fit-content;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fm-wrapper.ButtonRow {
    height: 32px;
  }

  :deep(.danger) {
    color: var(--text-error);
  }
  :deep(.danger:hover) {
    background-color: var(--surface-error) !important;
    color: var(--text-error);
    border-color: var(--surface-error) !important;
  }
  :deep(.danger) .tabler-icon {
    color: var(--icon-error);
  }
  :deep(.danger:hover) .tabler-icon {
    color: var(--icon-error);
  }
</style>
