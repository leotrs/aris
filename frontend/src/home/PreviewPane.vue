<script setup>
 import { ref, watch } from 'vue';
 import axios from 'axios';
 import { useRouter } from 'vue-router';
 import { IconBook, IconFileCheck, IconVersions, IconX } from '@tabler/icons-vue';
 import useClosable from '@/composables/useClosable.js';

 const { doc } = defineProps({ doc: Object });
 const emit = defineEmits(["set-selected"]);
 const router = useRouter();

 const read = () => { router.push(`/${doc.id}/read`); }
 const close = () => { emit('set-selected', ""); }

 const selfRef = ref(null);
 const abstract = ref("<div>loading abstract...</div>");
 const loadAbstract = async () => {
     if (!selfRef) return;
     useClosable(close, selfRef, true, false);
     try {
         const response = await axios.get(`http://localhost:8000/documents/${doc.id}/sections/abstract`);
         abstract.value = response.data;
     } catch (error) {
         abstract.value = "<div>no abstract!</div>";
     }
 }
 loadAbstract();
 watch(() => doc, async () => { await loadAbstract() });
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
        <div><Avatar name="LT" /><span>{{ doc.last_edited_at }}</span></div>
      </div>
      <div class="pane-right">
        <ManuscriptWrapper :html="abstract" />
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
     overflow-y: auto;
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
