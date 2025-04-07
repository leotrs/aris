<script setup>
 import { ref, reactive, inject, computed, watch, watchEffect } from 'vue';
 import { IconCirclePlus } from '@tabler/icons-vue';

 const props = defineProps({
     tags: { type: Array, required: true },
     docID: { type: Number, default: -1 },
     icon: { type: String, default: 'CirclePlus'}
     
 })
 const { userTags, createTag, addOrRemoveTag } = inject("userTags");

 const tagsIDs = computed(() => props.tags.map((t) => t.id));
 const currentAssignment = computed(() => userTags.value.map((t) => tagsIDs.value.includes(t.id)));
 const tagIsAssigned = ref([]);
 watchEffect(() => {
     if (tagIsAssigned.value.length === 0) { tagIsAssigned.value = [...currentAssignment.value] }
 });
 watch(tagIsAssigned.value, () => {
     console.log(tagIsAssigned);
     tagIsAssigned.value.forEach((el, idx) => {
         if (tagIsAssigned.value[idx] && !currentAssignment.value[idx]){
             addOrRemoveTag(userTags.value[idx].id, props.docID, 'add');
         }
         if (!tagIsAssigned.value[idx] && currentAssignment.value[idx]) {
             addOrRemoveTag(userTags.value[idx].id, props.docID, 'remove');
         }
     })
 })

 const newTagPlaceholder = {
     id: null,
     name: 'new tag...',
     color: 'new-tag-color'
 }
 const renaming = ref(false);
</script>


<template>
  <ContextMenu :icon="icon">
    <TagControl
        v-for="(tag, idx) in userTags"
        class="item"
        :tag="tag"
        :key="tag"
        v-model="tagIsAssigned[idx]" />
    <div class="new-tag-wrapper item">
      <Tag
          :tag="newTagPlaceholder"
          :active="false"
          @rename="(name) => createTag(name)"
          v-model="renaming"
          @click.stop="renaming=true"
          @dblclick.stop />
    </div>
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

 .cm-wrapper > :deep(.cm-click-target > .cm-btn) {
     color: var(--light);
 }

 .cm-wrapper > :deep(.cm-menu) {
     right: 0;
     transform: translateX(0) translateY(32px);
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
