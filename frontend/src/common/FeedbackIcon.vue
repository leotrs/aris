<script setup()>
  import {} from "vue";
</script>

<template>
  <div class="feedback">
    <ContextMenu ref="menu-ref" icon="MoodPlus" placement="left-start">
      <ContextMenuItem icon="BookmarkFilled" caption="Bookmark" />
      <ContextMenuItem icon="StarFilled" caption="Favorite" />
      <ContextMenuItem icon="HeartFilled" caption="Love it" />
      <ContextMenuItem icon="CircleCheckFilled" caption="???" />
      <ContextMenuItem icon="AlertTriangleFilled" caption="Important" />
      <ContextMenuItem icon="HelpSquareRoundedFilled" caption="Confusing" />
      <Separator />
      <ContextMenuItem icon="X" caption="Remove" />
    </ContextMenu>
  </div>
</template>

<style scoped></style>
