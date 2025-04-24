<script setup>
  import {} from "vue";
  const props = defineProps({ icon: { type: String, default: "Dots" } });
</script>

<template>
  <div class="fm-wrapper">
    <ContextMenu :icon="icon" button-size="btn-md">
      <ContextMenuItem icon="Bolt" caption="Activity" />
      <ContextMenuItem icon="Clock" caption="History" />
      <Separator />
      <ContextMenuItem icon="Share3" caption="Share" />
      <ContextMenuItem icon="UserPlus" caption="Collaborate" />
      <Separator />
      <ContextMenuItem icon="Download" caption="Download" />
      <ContextMenuItem icon="FileExport" caption="Export" />
      <Separator />
      <ContextMenuItem icon="Edit" caption="Rename" />
      <ContextMenuItem icon="Copy" caption="Duplicate" />
      <ContextMenuItem icon="TrashX" caption="Delete" class="danger" />
    </ContextMenu>
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
</style>
