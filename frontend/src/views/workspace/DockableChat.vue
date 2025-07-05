<template>
  <div class="dockable-chat">
    <ChatPanel :file-id="fileId" />
  </div>
</template>

<script>
  import ChatPanel from "@/components/chat/ChatPanel.vue";

  export default {
    name: "DockableChat",
    components: {
      ChatPanel,
    },
    props: {
      fileId: {
        type: Number,
        default: null,
      },
    },
  };
</script>

<style scoped>
  .dockable-chat {
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 8px;
    border: 1px solid var(--border-primary);
    overflow: hidden;
    box-sizing: border-box;
  }

  /* Mobile chat removes border-radius like editor */
  :global(.outer.mobile) .dockable-chat {
    border-radius: 0;
  }
</style>
