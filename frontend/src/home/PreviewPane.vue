<script setup>
import axios from "axios";
import useClosable from "@/composables/useClosable.js";
import { ref, watch, useTemplateRef, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IconBook, IconFileCheck, IconVersions, IconX } from "@tabler/icons-vue";
import { onKeyUp, onClickOutside, useCurrentElement, useFocus } from "@vueuse/core";

const { doc, container } = defineProps({
  doc: { type: Object, required: true },
  container: { type: Object, required: true },
});
const emit = defineEmits(["set-selected"]);
const router = useRouter();

const read = () => {
  router.push(`/${doc.id}/read`);
};
const close = () => {
  emit("set-selected", "");
};

const selfRef = useTemplateRef("self-ref");
const abstract = ref("<div>loading abstract...</div>");

onMounted(async () => {
  console.log("hi");
  if (!selfRef) return;
  console.log("ho");
  useClosable(close, selfRef, true, false);
  try {
    const response = await axios.get(`http://localhost:8000/documents/${doc.id}/sections/abstract`);
    abstract.value = response.data;
  } catch (error) {
    abstract.value = "<div>no abstract!</div>";
  }
});
</script>

<template>
  <div id="preview" class="pane" ref="self-ref">
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
        <div>
          <Avatar name="LT" /><span>{{ doc.last_edited_at }}</span>
        </div>
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
