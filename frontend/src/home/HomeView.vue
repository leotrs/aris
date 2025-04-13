<script setup>
import { ref, provide, computed, useTemplateRef, onMounted, onUnmounted } from "vue";
import { useDraggable } from "@vueuse/core";
import axios from "axios";
import Sidebar from "./Sidebar.vue";
import DocumentsPane from "./DocumentsPane.vue";
import PreviewPane from "./PreviewPane.vue";
import UploadFileModal from "./UploadFileModal.vue";

const showModal = ref(false);
const currentMode = ref("list");
const selfRef = useTemplateRef("selfRef");

/*********** userID ***********/
const userID = 1;
provide("userID", userID);

/*********** isMobile ***********/
const isMobile = ref(false);
const setIsMobile = (el) => {
  if (el?.contentRect) {
    isMobile.value = el.contentRect.width < 432;
  }
};
let observer;
onMounted(() => {
  if (selfRef.value) {
    observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setIsMobile(entry);
      }
    });
    observer.observe(selfRef.value);
    setIsMobile(selfRef.value);
  }
});
onUnmounted(() => {
  if (observer) observer.disconnect();
});
provide("isMobile", isMobile);

/*********** userDocs ***********/
const userDocs = ref([]);
const reloadDocs = async (docID) => {
  try {
    const response = await axios.get(`http://localhost:8000/users/${userID}/documents`);
    if (!userDocs.value) {
      userDocs.value = response.data.map((doc) => ({ ...doc, filtered: false }));
    } else {
      /* FIX ME: take the filtered value from the current userDocs, not from response.data */
      userDocs.value = response.data.map((doc) => ({ ...doc, filtered: false }));
    }
  } catch (error) {
    console.error(`Failed to fetch document`, error);
  }
};
const sortDocs = async (func) => {
  userDocs.value.sort((a, b) => func(a, b));
};
const filterDocs = async (func) => {
  userDocs.value = userDocs.value.map((doc) => ({ ...doc, filtered: func(doc) }));
};
const clearFilterDocs = async () => {
  filterDocs((doc) => false);
};
provide("userDocs", { userDocs, reloadDocs, sortDocs, filterDocs, clearFilterDocs });
onMounted(async () => {
  reloadDocs();
});

/*********** userTags ***********/
const userTags = ref([]);
const updateUserTag = async (oldTag, newTag) => {
  if (oldTag) {
    const url = `http://localhost:8000/users/${userID}/tags/${oldTag.id}`;
    try {
      if (newTag == null) {
        await axios.delete(url);
      } else {
        await axios.put(url, newTag);
      }
      reloadDocs();
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  }

  try {
    const response = await axios.get(`http://localhost:8000/users/${userID}/tags`);
    userTags.value = response.data;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
  }
};
const createTag = async (name, color = null) => {
  try {
    const response = await axios.post(`http://localhost:8000/users/${userID}/tags`, {
      name: name,
      color: color || "",
    });
    reloadDocs();
  } catch (error) {
    console.error("Error creating tag:", error);
  }
};
const addOrRemoveTag = async (tagID, docID, mode) => {
  const url = `http://localhost:8000/users/${userID}/documents/${docID}/tags/${tagID}`;
  if (mode == "add") {
    try {
      await axios.post(url);
      reloadDocs();
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  } else if (mode == "remove") {
    try {
      await axios.delete(url);
      reloadDocs();
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  }
};
provide("userTags", { userTags, updateUserTag, createTag, addOrRemoveTag });
onMounted(async () => {
  updateUserTag();
});

/*********** draggable Preview pane ***********/
const container = useTemplateRef("separator-container-ref");
const separator = useTemplateRef("separator-ref");

const previewHeight = ref("50%");
const onSeparatorDragged = (pos, _) => {
  const rect = container.value.getBoundingClientRect();
  console.log(pos.y, rect.height);
  previewHeight.value = `calc(30% + ${rect.height}px - ${pos.y}px)`;
};
const style = ref({});
const selectedForPreview = ref(null);
const separatorPointerEvents = computed(() => (selectedForPreview.value ? "all" : "none"));
const setSelectedForPreview = (doc) => {
  selectedForPreview.value = doc;
  if (!doc) return;
  if (!container.value) return;
  const { style } = useDraggable(separator, {
    initialValue: { x: 0, y: container.value.getBoundingClientRect().height / 2 - 2 },
    preventDefault: true,
    axis: "y",
    onMove: onSeparatorDragged,
    containerElement: container,
  });
  return style;
};
</script>

<template>
  <div :class="['view-wrapper', isMobile ? 'mobile' : '']" ref="selfRef">
    <Sidebar @showFileUploadModal="showModal = true" />

    <div class="views-row">
      <Button kind="tertiary" icon="Settings" />
      <Button kind="tertiary">
        <Avatar name="TER" />
      </Button>
    </div>

    <div class="panes">
      <div id="documents" class="pane">
        <DocumentsPane
          @set-selected="(doc) => (style = setSelectedForPreview(doc))"
          :mode="currentMode"
        />
      </div>

      <div class="separator-container" ref="separator-container-ref">
        <div class="separator" ref="separator-ref" :style="style"></div>
      </div>

      <PreviewPane
        v-if="!isMobile && selectedForPreview"
        ref="preview-ref"
        :doc="selectedForPreview"
        @set-selected="(doc) => (style = setSelectedForPreview(doc))"
      />
    </div>

    <div class="modal" v-if="showModal">
      <UploadFileModal @close="showModal = false" />
    </div>
  </div>
</template>

<style scoped>
.view-wrapper {
  position: relative;
  display: flex;
  flex-grow: 2;
  padding: 16px 16px 16px 0;
  height: 100%;
}

.view-wrapper.mobile {
  padding: 0;
}

.separator-container {
  height: 40%;
  position: absolute;
  width: 100%;
  top: 30%;
  pointer-events: none;
}

.separator {
  position: absolute;
  bottom: 0;
  background-color: transparent;
  width: 100%;
  height: 12px;
  z-index: 1;
  pointer-events: v-bind(separatorPointerEvents);

  &:hover {
    cursor: row-resize;
  }
}

.panes {
  position: relative;
  flex-grow: 1;
  height: 100%;

  & :deep(.pane) {
    background-color: var(--almost-white);
    padding: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 16px;
  }

  & :deep(#documents:not(:has(~ .pane))) {
    min-height: 100%;
    max-height: 100%;
  }

  & :deep(#documents:has(~ .pane)) {
    min-height: 20%;
    max-height: 80%;
  }

  & :deep(#preview) {
    min-height: 20%;
    max-height: 80%;
  }
}

.view-wrapper.mobile {
  & :deep(.pane) {
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 16px;
  }
}

#documents {
  margin-bottom: 8px;
  height: calc(100% - v-bind(previewHeight));
}

#preview {
  height: v-bind(previewHeight);
}

.modal {
  position: absolute;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(2px) brightness(0.9);
}
.views-row {
  position: absolute;
  right: 32px;
  top: 32px;
  z-index: 1;
  display: flex;
  gap: 4px;
  white-space: nowrap;
}
</style>
