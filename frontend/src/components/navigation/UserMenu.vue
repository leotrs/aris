<script setup>
  import { inject, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";

  const menuRef = useTemplateRef("menu-ref");

  const router = useRouter();
  const goTo = (page) => router.push(`/${page}`);

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  defineExpose({ toggle: () => menuRef.value.toggle() });
  const user = inject("user");
</script>

<template>
  <div class="um-wrapper">
    <ContextMenu ref="menu-ref" data-testid="user-menu" variant="slot">
      <template #trigger="{ toggle }">
        <Button kind="tertiary">
          <Avatar :user="user" :tooltip="false" @click="toggle" />
        </Button>
      </template>
      <ContextMenuItem icon="User" caption="Account" @click="() => goTo('account')" />
      <ContextMenuItem icon="Settings" caption="Settings" @click="() => goTo('settings')" />
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
