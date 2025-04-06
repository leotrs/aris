<script setup>
 import { ref, reactive, inject, computed, watch, watchEffect } from 'vue';
 import { IconCirclePlus } from '@tabler/icons-vue';

 const props = defineProps({
     tags: { type: Array, required: true },
     docID: { type: Number, required: true }
 })
 const { userTags, _, createTag } = inject("userTags");


 const tagsIDs = computed(() => props.tags.map((t) => t.id));
 const currentAssignment = computed(() => userTags.value.map((t) => tagsIDs.value.includes(t.id)));
 const tagIsAssigned = ref([]);
 watchEffect(() => {
     if (tagIsAssigned.value.length === 0) { tagIsAssigned.value = [...currentAssignment.value] }
 });
 watch(tagIsAssigned, () => {
     console.log(tagIsAssigned.value, currentAssignment.value);
 })

 const newTagPlaceholder = {
     id: null,
     name: 'new tag...',
     color: 'new-tag-color'
 }
 const renaming = ref(false);
</script>


<template>
  <Tag v-for="tag in tags" :tag="tag" :active="true" />
  <ContextMenu icon="CirclePlus">
    <TagControl
        v-for="(tag, idx) in userTags"
        class="item"
        :tag="tag"
        :key="tag"
        :docID="docID"
        v-model="tagIsAssigned[idx]" />
    <Tag
        :tag="newTagPlaceholder"
        :active="false"
        @rename="(name) => createTag(name)"
        v-model="renaming"
        @click.stop="renaming=true"
        @dblclick.stop />
  </ContextMenu>
</template>


<style scoped>
 .pill {
     margin-right: 4px;
     border-radius: 16px;
     padding-inline: 8px;
     padding-block: 4px;
     text-wrap: nowrap;
 }

 .cm-wrapper > :deep(.cm-btn) {
     color: var(--light);
 }

 .cm-wrapper > :deep(.cm-menu) {
     right: unset;
     left: 0;
     transform: translateX(32px) translateY(-8px);
 }

 .cm-wrapper > :deep(.cm-menu > .item) {
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding-inline: 8px;
     gap: 8px;
 }

 .new-tag {
     &:hover {
         background-color: var(--surface-hint);
     }
 }
</style>
