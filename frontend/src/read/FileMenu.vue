<script setup>
  import {} from "vue";
  import Separator from "../common/Separator.vue";
</script>

<template>
  <div class="um-wrapper" @click.stop="onClick">
    <ContextMenu ref="menu-ref" icon="Dots">
      <ContextMenuItem icon="Inbox" caption="Notifications" />
      <ContextMenuItem icon="Share3" caption="Share" />
      <ContextMenuItem icon="UserPlus" caption="Invite User" />
      <Separator />
      <ContextMenuItem icon="Versions" caption="Revisions" />
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
  .um-wrapper {
    border-radius: 16px;
    width: 32px;
    height: 32px;
    background-color: var(--orange-300);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
