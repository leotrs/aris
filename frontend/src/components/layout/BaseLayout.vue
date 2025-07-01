<script setup>
  /**
   * BaseLayout - The main layout component for application views.
   *
   * This component provides the overall structure including a configurable sidebar,
   * top-right menus (notifications, user menu), and a main content area via its default slot.
   * It manages the display of file upload modals and integrates with keyboard shortcuts
   * for navigation and user menu access.
   *
   * @displayName BaseLayout
   * @example
   * // Basic usage with sidebar items
   * <BaseLayout :sidebar-items="navItems">
   *   <Pane>Your main content goes here.</Pane>
   * </BaseLayout>
   *
   * @example
   * // With floating action button disabled
   * <BaseLayout :sidebar-items="navItems" :fab="false">
   *   <Pane>Content without FAB.</Pane>
   * </BaseLayout>
   */
  import { ref, computed, inject, useTemplateRef } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import UploadFile from "@/views/home/ModalUploadFile.vue";

  const props = defineProps({
    sidebarItems: {
      type: Array,
      default: () => [],
      validator: (items) => {
        return items.every((item) => item.separator || (item.text && (item.icon || item.action)));
      },
    },
    fab: { type: Boolean, default: true },
  });

  const emit = defineEmits(["newEmptyFile", "showFileUploadModal"]);

  const mobileMode = inject("mobileMode");
  const fileStore = inject("fileStore");
  const user = inject("user");

  // New empty file
  const router = useRouter();
  const newEmptyFile = async () => {
    try {
      const newFile = await fileStore.value.createFile({
        title: "New File",
        ownerId: user.value.id,
        source: ":rsm:\n# New File\n\nThe possibilities are *endless*!\n\n::\n",
      });
      router.push(`/file/${newFile.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const showModal = ref(false);
  const route = useRoute();
  const isHome = computed(() => route.fullPath === "/");

  const userMenuRef = useTemplateRef("user-menu");
  const toggleUserMenu = () => {
    if (!userMenuRef.value) return;
    userMenuRef.value.toggle();
  };

  useKeyboardShortcuts(
    { u: { fn: () => toggleUserMenu(), description: "Toggle user menu" } },
    true,
    "Menus"
  );

  // Handle sidebar item actions
  const handleSidebarAction = (action) => {
    switch (action) {
      case "newEmptyFile":
        newEmptyFile();
        break;
      case "showFileUploadModal":
        showModal.value = true;
        break;
      default:
        console.warn(`Unknown sidebar action: ${action}`);
    }
  };
</script>

<template>
  <div class="view" :class="{ mobile: mobileMode }">
    <BaseSidebar
      :sidebar-items="sidebarItems"
      :fab="fab"
      @action="handleSidebarAction"
      @new-empty-file="newEmptyFile"
      @show-file-upload-modal="showModal = true"
    />

    <div class="menus" :class="{ mobile: mobileMode }">
      <Button v-if="mobileMode && !isHome" kind="tertiary" icon="Home" @click="router.push('/')" />
      <Button kind="tertiary" icon="Bell" />
      <UserMenu ref="user-menu" />
    </div>

    <slot />

    <div v-if="showModal" class="modal">
      <UploadFile @close="showModal = false" />
    </div>
  </div>
</template>

<style scoped>
  .view {
    --transition-duration: 0.3s;

    position: relative;
    display: flex;
    flex-grow: 2;
    padding: 8px 8px 8px 0;
    height: 100%;
  }

  .view.mobile {
    padding: 0;
  }

  .menus {
    position: absolute;
    right: 24px;
    top: 24px;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .menus.mobile {
    top: 8px;
    right: 8px;
  }

  .modal {
    position: absolute;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(2px) brightness(0.9);
    z-index: 999;
  }
</style>
