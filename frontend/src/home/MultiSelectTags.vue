<script setup>
 import { IconCirclePlus } from '@tabler/icons-vue';
 import { inject } from 'vue';

 const props = defineProps({
     tags: { type: Array, required: true }
 })
 const { userTags, updateUserTags } = inject("userTags");
 const emit = defineEmits(["on", 'off']);

 const active = defineModel();
 const toggleMenu = () => { active.value = !active.value };
</script>


<template>
  <Tag v-for="tag in tags" :name="tag.name" :active="true" />
  <ContextMenu icon="CirclePlus">
    <TagControl
        v-for="tag in userTags"
        class="item"
        :name="tag.name"
        :initial-state="tags.map((t) => t.id).includes(tag.tag_id)"
        @on="$emit('on', tag.tag_id)"
        @off="$emit('off', tag.tag_id)" />
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
</style>
