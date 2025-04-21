<script setup>
  import {} from "vue";
  import Separator from "../common/Separator.vue";
</script>

<template>
  <div class="fm-wrapper">
    <ContextMenu ref="menu-ref" icon="Menu3">
      <ContextMenuItem icon="Bell" caption="Notifications" />
      <ContextMenuItem icon="Share3" caption="Share" />
      <ContextMenuItem icon="UserPlus" caption="Invite User" />
      <Separator />
      <ContextMenuItem icon="Clock" caption="History" />
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
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
