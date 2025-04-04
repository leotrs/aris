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
  <Tag v-for="tag in tags" :name="tag.name" />
  <span><IconCirclePlus @click.prevent="toggleMenu" /></span>
  <div class="menu" v-if="active">
    <Tag
        v-for="tag in userTags"
        :name="tag.name"
        :default-state="tags.map((t) => t.id).includes(tag.tag_id)"
        @on="$emit('on', tag.tag_id)"
        @off="$emit('off', tag.tag_id)" />
    <span class="new-tag">new tag...</span>
  </div>
</template>


<style scoped>
 .menu {
     display: flex;
     flex-direction: column;
     gap: 8px;
     position: absolute;
     top: 0;
     left: 0;
     transform: translateY(40px);
     z-index: 999;
     background-color: var(--surface-primary);
     border-radius: 16px;
     box-shadow: 0px 1px 2px rgba(0, 0, 0, 30%), 0px 2px 6px rgba(0, 0, 0, 15%);
     padding-block: 8px;
     padding-inline: 8px;
 }
</style>
