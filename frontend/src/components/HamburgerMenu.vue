<script setup>
  import { ref, inject, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";

  const mobileMode = inject("mobileMode");
  const isMobile = computed(() => mobileMode?.value ?? true);
  const route = useRoute();
  const router = useRouter();
  const isOpen = ref(false);

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const close = () => {
    isOpen.value = false;
  };

  const navigateTo = (path) => {
    router.push(path);
    close();
  };

  // Settings sub-items (matching BaseLayout contextSubItems logic)
  const settingsSubItems = computed(() => {
    if (!route.path.startsWith("/settings")) return [];

    return [
      {
        icon: "FileText",
        text: "File",
        active: route.path === "/settings" || route.path === "/settings/document",
        route: "/settings/document",
      },
      {
        icon: "Settings2",
        text: "Behavior",
        active: route.path === "/settings/behavior",
        route: "/settings/behavior",
      },
      {
        icon: "Shield",
        text: "Privacy",
        active: route.path === "/settings/privacy",
        route: "/settings/privacy",
      },
      {
        icon: "Lock",
        text: "Security",
        active: route.path === "/settings/security",
        route: "/settings/security",
      },
    ];
  });

  // Expose methods for testing
  defineExpose({
    toggle,
    close,
    get isOpen() {
      return isOpen.value;
    },
  });
</script>

<template>
  <div v-if="isMobile" class="mobile-nav">
    <Button kind="tertiary" :icon="isOpen ? 'X' : 'Menu'" @click="toggle" />

    <div v-if="isOpen" class="nav-overlay" @click="close">
      <div class="nav-drawer" :class="{ open: isOpen }" @click.stop>
        <div class="nav-header">
          <Logo type="small" />
          <Button kind="tertiary" icon="X" data-testid="nav-close" @click="close" />
        </div>

        <nav class="nav-menu">
          <div
            class="nav-item"
            :class="{ active: route.path === '/' || route.name === 'home' }"
            data-testid="nav-home"
            @click="navigateTo('/')"
          >
            <Icon name="Home" />
            <span>Home</span>
          </div>
          <div
            class="nav-item"
            :class="{ active: route.path.startsWith('/settings') }"
            data-testid="nav-settings"
            @click="navigateTo('/settings')"
          >
            <Icon name="Settings" />
            <span>Settings</span>
          </div>

          <!-- Settings sub-items -->
          <div v-if="settingsSubItems.length > 0" class="sub-items-container">
            <div
              v-for="subItem in settingsSubItems"
              :key="subItem.route"
              class="nav-item sub-item"
              :class="{ active: subItem.active }"
              :data-testid="`nav-settings-${subItem.text.toLowerCase()}`"
              @click="navigateTo(subItem.route)"
            >
              <Icon :name="subItem.icon" />
              <span>{{ subItem.text }}</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .mobile-nav {
    /* No positioning needed - inherits from parent .menus container */
  }

  .nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.3s ease-out;
  }

  .nav-drawer {
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

  .nav-drawer.open {
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

  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--gray-200);
  }

  .nav-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-item {
    --padding-inline: 16px;
    --border-left-width: var(--border-med);

    position: relative;
    height: 32px;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-block: 8px;
    border-left: var(--border-left-width) solid transparent;
    padding-left: calc(var(--padding-inline) - var(--border-left-width));
    padding-right: var(--padding-inline);
    transition: var(--transition-bg-color);
    cursor: pointer;
  }

  .nav-item:hover:not(.active) {
    background-color: var(--gray-200);
    border-left-color: var(--light);
  }

  .nav-item.active {
    background-color: var(--surface-primary);
    border-left-color: var(--border-action);
    box-shadow: var(--shadow-soft);
  }

  .nav-item.active :deep(svg) {
    stroke-width: 2px;
    color: var(--primary-600);
  }

  .nav-item.active span {
    font-weight: var(--weight-medium);
    color: var(--primary-600);
  }

  .nav-item span {
    font-size: 16px;
  }

  /* Sub-items container */
  .sub-items-container {
    background-color: var(--gray-200);
    border-radius: 8px;
    margin-inline: 8px;
    padding-block: 6px;
    margin-top: 4px;
  }

  .nav-item.sub-item {
    margin-block: 6px;
  }
</style>
