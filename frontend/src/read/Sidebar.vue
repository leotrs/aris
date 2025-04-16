<script setup>
  import { ref, onMounted, onUpdated, onUnmounted, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";
  import SidebarItem from "@/read/SidebarItem.vue";

  const emit = defineEmits(["showComponent", "hideComponent"]);

  const components = {
    Minimap: "MapPin",
    Search: "Search",
    Quote: "Quote",
    Variable: "Variable",
    Blocks: "Blocks",
    Message: "Message",
    Sparkles: "Sparkles",
    FileSettings: "FileSettings",
  };
  const router = useRouter();
</script>

<template>
  <div class="sb-wrapper" ref="sidebar-ref">
    <div id="logo" @click="router?.push('/')">
      <img src="../assets/logo-32px.svg" />
    </div>
    <div class="sb-menu">
      <SidebarItem
        v-for="(compIcon, compName) in components"
        :icon="compIcon"
        @on="emit('showComponent', compName)"
        @off="emit('hideComponent', compName)"
      />
    </div>
  </div>
</template>

<style scoped>
  .sb-wrapper {
    height: 100%;
    min-width: 64px;
    max-width: 64px;
    padding-inline: 8px;
    padding-block: 8px;
    background-color: var(--extra-light);
    position: fixed;
    z-index: 1;
    /* border-right: var(--border-thin) solid var(--border-primary); */

    /* no scrollbar in any browser */
    overflow-y: auto;
    scrollbar-width: none;
    /* firefox */
    -ms-overflow-style: none;

    /* Edge */
    &::-webkit-scrollbar {
      /* Chrome */
      display: none;
    }
  }

  .btn-toggle {
    position: relative;
  }

  .sc-wrapper {
    display: none;
    position: fixed;
    left: calc(64px + 4px);
    top: calc(64px + 16px + 56px + 8px);
    z-index: 999;

    :deep(& > .sc-item) {
      padding-block: 0px !important;
      padding-inline: 0px !important;
    }
  }

  #logo {
    display: flex;
    padding: 9px;
    margin-top: 8px;

    &:hover {
      cursor: pointer;
    }

    & > img {
      margin: 0 auto;
    }
  }

  .sb-menu {
    padding-block: 16px;

    & > * {
      margin-bottom: 8px;
      gap: 8px;
    }
  }
</style>
