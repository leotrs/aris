<script setup>
  import { inject, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";

  /**
   * UserMenu - User account dropdown menu
   *
   * A dropdown menu component that displays user avatar and provides navigation
   * to account settings, user profile, and logout functionality. Integrates with
   * the application's authentication and routing systems.
   *
   * @displayName UserMenu
   * @example
   * // Basic usage (requires user injection)
   * <UserMenu />
   *
   * @example
   * // Programmatic control
   * <UserMenu ref="userMenuRef" />
   * // userMenuRef.value.toggle()
   */

  const menuRef = useTemplateRef("menu-ref");

  const router = useRouter();
  const goTo = (page) => router.push(`/${page}`);

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  /**
   * Exposes methods for parent components
   * @expose {Function} toggle - Toggle the menu open/closed state
   */
  defineExpose({ toggle: () => menuRef.value.toggle() });
  const user = inject("user");
</script>

<template>
  <div class="um-wrapper">
    <ContextMenu ref="menu-ref" variant="slot">
      <template #trigger="{ toggle }">
        <Button kind="tertiary" data-testid="user-menu" @click="toggle">
          <Avatar :user="user" :tooltip="false" />
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
