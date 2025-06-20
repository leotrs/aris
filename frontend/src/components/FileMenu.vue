<script setup>
  import { computed, useTemplateRef } from "vue";

  const props = defineProps({
    icon: { type: String, default: "Dots" },
    mode: { type: String, default: "ContextMenu" },
  });
  const emit_ = defineEmits(["rename", "duplicate", "delete"]);
  const emit = (event) => {
    menuRef.value?.toggle();
    emit_(event);
  };

  const comp = computed(() => (props.mode === "ContextMenu" ? "ContextMenuItem" : "Button"));
  const childProps = (icon, caption) => {
    if (props.mode === "ContextMenu") return { icon: icon, caption: caption };
    else if (props.mode === "ButtonRow")
      return { icon: icon, caption: caption, kind: "tertiary", size: "sm", textFloat: "bottom" };
  };

  const menuRef = useTemplateRef("menu-ref");
  defineExpose({ toggle: () => menuRef.value?.toggle() });
</script>

<template>
  <div class="fm-wrapper" :class="mode">
    <component :is="mode" ref="menu-ref" :icon="icon" button-size="btn-md">
      <template v-if="mode == 'ContextMenu'">
        <!-- <component :is="comp" v-bind="childProps('Bolt', 'Activity')" /> -->
        <!-- <component :is="comp" v-bind="childProps('Clock', 'History')" /> -->
      </template>
      <!-- <Separator /> -->
      <component :is="comp" v-bind="childProps('Share3', 'Share')" />
      <!-- <component :is="comp" v-bind="childProps('UserPlus', 'Collaborate')" /> -->
      <!-- <Separator /> -->
      <component :is="comp" v-bind="childProps('Download', 'Download')" />
      <!-- <component :is="comp" v-bind="childProps('FileExport', 'Export')" /> -->
      <Separator />
      <component :is="comp" v-bind="childProps('Edit', 'Rename')" @click="emit('rename')" />
      <component :is="comp" v-bind="childProps('Copy', 'Duplicate')" @click="emit('duplicate')" />
      <component
        :is="comp"
        v-bind="childProps('TrashX', 'Delete')"
        class="danger"
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
