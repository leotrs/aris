<script setup>
  import { ref, inject, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import UploadFile from "../home/ModalUploadFile.vue";

  const props = defineProps({
    active: { type: String, default: "" },
    fab: { type: Boolean, default: true },
  });
  const mobileMode = inject("mobileMode");
  const fileStore = inject("fileStore");
  const user = inject("user");

  // New empty file
  const router = useRouter();
  const newEmptyFile = async () => {
    console.log("new empty file for user with id", user.value.id);
    try {
      const newFile = await fileStore.value.createFile({
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
</script>

<template>
  <div class="view" :class="{ mobile: mobileMode }">
    <HomeSidebar
      :fab="fab"
      :active="active"
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
    padding: 16px 16px 16px 0;
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
