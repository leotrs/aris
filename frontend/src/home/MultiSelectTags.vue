<script setup>
 import { IconCirclePlus } from '@tabler/icons-vue';
 import { inject } from 'vue';

 const props = defineProps({
     tags: { type: Array, required: true }
 })
 const { userTags, updateUserTags } = inject("userTags");
 const emit = defineEmits(["on", 'off', 'set-color']);

 const active = defineModel();
 const toggleMenu = () => { active.value = !active.value };
</script>


<template>
  <Tag v-for="tag in tags" :tag="tag" :active="true" />
  <ContextMenu icon="CirclePlus">
    <TagControl
        v-for="tag in userTags"
        class="item"
        :tag="tag"
        :initial-state="tags.map((t) => t.id).includes(tag.id)"
        @on="$emit('on', tag.id)"
        @off="$emit('off', tag.id)"
        @set-color="(c) => $emit('set-color', c, tag)"
        @delete="(t) => $emit('delete', t)" />
    <span class="item new-tag">new tag...</span>
  </ContextMenu>
</template>


<style scoped>
 .pill {
     margin-right: 4px;
 }

 .menu > .item {
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding-inline: 8px;
     gap: 8px;
 }

 :deep(.icon > svg) {
     color: var(--light);
 }

</style>
