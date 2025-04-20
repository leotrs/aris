<script setup>
  import { useTemplateRef } from "vue";
  import Separator from "../common/Separator.vue";

  const menuRef = useTemplateRef("menu-ref");
  const onClick = () => menuRef.value.toggle();
</script>

<template>
  <div class="um-wrapper" @click.stop="onClick">
    <Button kind="tertiary"><Avatar /></Button>
    <ContextMenu ref="menu-ref" icon="">
      <ContextMenuItem icon="User" caption="Account" />
      <ContextMenuItem icon="Settings" caption="Settings" />
      <Separator />
      <ContextMenuItem icon="Keyboard" caption="Shortcuts" />
      <ContextMenuItem icon="Lifebuoy" caption="Help" />
      <ContextMenuItem icon="MessageChatbot" caption="Feedback" />
      <Separator />
      <ContextMenuItem icon="Logout" caption="Logout" />
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
