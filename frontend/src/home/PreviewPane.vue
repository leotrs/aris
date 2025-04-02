<script setup>
 import { ref, onMounted } from 'vue';
 import { useRouter } from 'vue-router';
 import { IconBook, IconFileCheck, IconVersions, IconX } from '@tabler/icons-vue';
 import useClosable from '@/composables/useClosable.js';

 const props = defineProps({
     doc: Object
 });

 const emit = defineEmits(["set-selected"]);
 const router = useRouter();

 const read = () => { router.push(`/${props.doc.id}/read`); }
 const close = () => { emit('set-selected', ""); }

 const selfRef = ref(null);
 onMounted(() => {
     if (!selfRef) return;
     useClosable(close, selfRef, true, false);
 })
</script>


<template>
  <div ref="selfRef">
    <div class="pane-header">
      <div class="actions-left">
        <Button kind="primary" class="btn-sm" text="Read" icon="Book" @click="read"></Button>
        <Button kind="tertiary" class="btn-sm" text="Review" icon="FileCheck"></Button>
        <Button kind="tertiary" class="btn-sm" text="Revisions" icon="Versions"></Button>
      </div>
      <div class="actions-right">
        <ButtonClose @close="close" />
      </div>
    </div>
    <div class="pane-content">
      <div class="pane-left">
        <div class="text-h4">{{ doc.title }}</div>
        <div>{{ doc.last_edited_at }}</div>
        <div>LT</div>
      </div>
      <div class="pane-right">
        <div class="text">{{ doc.abstract }}</div>
      </div>
    </div>
  </div>
</template>


<style scoped>
 .pane-header {
     display: flex;
     justify-content: space-between;
     flex-wrap: wrap;
     padding: 8px;
 }

 .pane-content {
     display: flex;
     gap: 48px;
     padding-inline: 8px;
 }

 .actions-left {
     display: flex;
     flex-wrap: wrap;
     row-gap: 16px;
     column-gap: 8px;
 }

 .pane-left {
     flex: 1;
     display: flex;
     flex-direction: column;
     gap: 8px;
 }

 .pane-right {
     flex: 2;
     padding-block: 8px;
 }

</style>
