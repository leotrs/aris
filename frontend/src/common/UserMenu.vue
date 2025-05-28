<script setup>
  import { useTemplateRef } from "vue";
  import { useRouter } from "vue-router";

  const menuRef = useTemplateRef("menu-ref");
  const onClick = () => menuRef.value.toggle();

  const router = useRouter();
  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  defineExpose({ toggle: () => menuRef.value.toggle() });
</script>

<template>
  <div class="um-wrapper" @click.stop="onClick">
    <ContextMenu ref="menu-ref" icon="">
      <template #trigger>
        <Avatar />
      </template>
      <ContextMenuItem icon="User" caption="Account" />
      <ContextMenuItem icon="Settings" caption="Settings" />
      <Separator />
      <ContextMenuItem icon="Keyboard" caption="Shortcuts" />
      <ContextMenuItem icon="Lifebuoy" caption="Help" />
      <ContextMenuItem icon="MessageChatbot" caption="Feedback" />
      <Separator />
      <ContextMenuItem icon="Logout" caption="Logout" @click="onLogout" />
    </ContextMenu>
  </div>
</template>

<style scoped>
  .um-wrapper {
    border-radius: 16px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
