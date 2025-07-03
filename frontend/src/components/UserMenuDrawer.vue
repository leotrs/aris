<script setup>
  import { ref, inject, computed, useTemplateRef } from "vue";
  import { useRoute, useRouter } from "vue-router";

  const mobileMode = inject("mobileMode");
  const isMobile = computed(() => mobileMode?.value ?? false);
  const user = inject("user");
  const route = useRoute();
  const router = useRouter();
  const isOpen = ref(false);
  const menuRef = useTemplateRef("menu-ref");

  const emit = defineEmits(["showFeedback", "logout"]);

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const close = () => {
    isOpen.value = false;
  };

  // Expose methods and state for testing
  defineExpose({
    toggle,
    close,
    get isOpen() {
      return isOpen.value;
    },
  });

  const navigateTo = (path) => {
    router.push(path);
    close();
  };

  const handleFeedback = () => {
    emit("showFeedback");
    close();
  };

  const handleLogout = () => {
    emit("logout");
    close();
  };

  const handleHelp = () => {
    navigateTo("/help");
  };
</script>

<template>
  <div class="user-menu-wrapper" :class="{ mobile: isMobile, desktop: !isMobile }">
    <!-- Desktop: Context Menu -->
    <ContextMenu v-if="!isMobile" ref="menu-ref" variant="slot">
      <template #trigger="{ toggle: toggleMenu }">
        <Button kind="tertiary" data-testid="user-avatar" @click="toggleMenu">
          <Avatar :user="user" size="md" :tooltip="false" />
        </Button>
      </template>

      <!-- Account Section -->
      <ContextMenuItem icon="User" caption="Profile" @click="navigateTo('/account/profile')" />
      <ContextMenuItem icon="Shield" caption="Security" @click="navigateTo('/account/security')" />
      <ContextMenuItem icon="Lock" caption="Privacy" @click="navigateTo('/account/privacy')" />
      <Separator />

      <!-- Actions Section -->
      <ContextMenuItem icon="HelpCircle" caption="Help" @click="handleHelp" />
      <ContextMenuItem icon="MessageSquare" caption="Feedback" @click="handleFeedback" />
      <ContextMenuItem icon="Keyboard" caption="Shortcuts" />
      <Separator />

      <!-- Logout Section -->
      <ContextMenuItem icon="LogOut" caption="Logout" @click="handleLogout" />
    </ContextMenu>

    <!-- Mobile: Avatar Trigger -->
    <div v-else class="avatar-trigger" data-testid="user-avatar" @click="toggle">
      <Avatar :user="user" size="md" :tooltip="false" />
    </div>

    <!-- Mobile: Drawer Overlay -->
    <div v-if="isMobile && isOpen" class="user-overlay" @click="close">
      <div class="user-drawer" :class="{ open: isOpen }" @click.stop>
        <div class="user-header">
          <Logo type="small" />
          <Button kind="tertiary" icon="X" data-testid="user-close" @click="close" />
        </div>

        <nav class="user-menu">
          <!-- Account Section -->
          <div class="user-section" data-testid="account-section">
            <div class="section-title">Account</div>
            <div
              class="user-item"
              :class="{ active: route.path === '/account/profile' }"
              data-testid="account-profile"
              @click="navigateTo('/account/profile')"
            >
              <Icon name="User" />
              <span>Profile</span>
            </div>
            <div
              class="user-item"
              :class="{ active: route.path === '/account/security' }"
              data-testid="account-security"
              @click="navigateTo('/account/security')"
            >
              <Icon name="Shield" />
              <span>Security</span>
            </div>
            <div
              class="user-item"
              :class="{ active: route.path === '/account/privacy' }"
              data-testid="account-privacy"
              @click="navigateTo('/account/privacy')"
            >
              <Icon name="Lock" />
              <span>Privacy</span>
            </div>
          </div>

          <!-- Actions Section -->
          <div class="user-section">
            <div class="user-item" data-testid="user-help" @click="handleHelp">
              <Icon name="HelpCircle" />
              <span>Help</span>
            </div>
            <div class="user-item" data-testid="user-feedback" @click="handleFeedback">
              <Icon name="MessageSquare" />
              <span>Feedback</span>
            </div>
            <div v-if="!isMobile" class="user-item" data-testid="user-shortcuts">
              <Icon name="Keyboard" />
              <span>Shortcuts</span>
            </div>
          </div>

          <!-- Logout Section -->
          <div class="user-section">
            <div class="user-item logout" data-testid="user-logout" @click="handleLogout">
              <Icon name="LogOut" />
              <span>Logout</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .user-menu-mobile {
    /* No positioning needed - inherits from parent .menus container */
  }

  .avatar-trigger {
    cursor: pointer;
    border-radius: 50%;
    transition: transform 0.2s ease;
  }

  .avatar-trigger:hover {
    transform: scale(1.05);
  }

  .user-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.3s ease-out;
  }

  .user-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background: var(--gray-50);
    border-left: 1px solid var(--gray-200);
    padding: 16px;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .user-drawer.open {
    transform: translateX(0);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--gray-200);
  }

  .user-menu {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .user-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .section-title {
    font-size: 14px;
    font-weight: var(--weight-medium);
    color: var(--gray-600);
    margin-bottom: 8px;
    padding-left: 16px;
  }

  .user-item {
    --padding-inline: 16px;
    --border-left-width: var(--border-med);

    position: relative;
    height: 32px;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-block: 4px;
    border-left: var(--border-left-width) solid transparent;
    padding-left: calc(var(--padding-inline) - var(--border-left-width));
    padding-right: var(--padding-inline);
    transition: var(--transition-bg-color);
    cursor: pointer;
  }

  .user-item:hover:not(.active) {
    background-color: var(--gray-200);
    border-left-color: var(--light);
  }

  .user-item.active {
    background-color: var(--surface-primary);
    border-left-color: var(--border-action);
    box-shadow: var(--shadow-soft);
  }

  .user-item.active :deep(svg) {
    stroke-width: 2px;
    color: var(--primary-600);
  }

  .user-item.active span {
    font-weight: var(--weight-medium);
    color: var(--primary-600);
  }

  .user-item span {
    font-size: 16px;
  }

  .user-item.logout {
    color: var(--red-600);
  }

  .user-item.logout:hover {
    background-color: var(--red-50);
    border-left-color: var(--red-200);
  }

  .user-item.logout :deep(svg) {
    color: var(--red-600);
  }

  .user-menu-desktop {
    /* Desktop context menu styling would go here */
  }
</style>
