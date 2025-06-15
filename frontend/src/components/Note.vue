<script setup>
  import {} from "vue";

  const props = defineProps({
    annotation: { type: Object, required: true },
  });

  const onDelete = () => {};
  const onLink = () => {};
  const onEdit = () => {};
  const onCollapse = () => {};
  const onComment = () => {};
</script>

<template>
  <div class="note">
    <div class="header">
      <div class="timestamp text-caption">8min ago</div>
      <div class="actions">
        <Button kind="tertiary" size="sm" icon="Trash" @click="onDelete" />
        <Button kind="tertiary" size="sm" icon="Link" @click="onLink" />
        <Button kind="tertiary" size="sm" icon="Edit" @click="onEdit" />
        <Button kind="tertiary" size="sm" icon="ChevronUp" @click="onCollapse" />
        <Button kind="tertiary" size="sm" icon="Message" @click="onComment" />
      </div>
    </div>
    <div class="content">
      {{ annotation.content }}
    </div>
    <div class="footer"></div>
  </div>
</template>

<style scoped>
  .note {
    border: var(--border-thin) solid var(--border-primary);
    border-radius: 16px;
    padding-block: 8px;
    padding-inline: 8px;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  .timestamp {
    color: var(--dark);
  }

  .actions {
    display: flex;
    gap: 0;

    & :deep(button) {
      width: 24px;
      height: 24px;
    }

    & :deep(.tabler-icon) {
      color: var(--dark);
    }
  }
</style>
