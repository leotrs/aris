<script setup>
import { ref, provide, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { onKeyUp } from "@vueuse/core";
import axios from "axios";
import Sidebar from "./Sidebar.vue";
import ArisManuscript from "./ArisManuscript.vue";

const docID = `${useRoute().params.doc_id}`;
const doc = ref({});

onBeforeMount(async () => {
    try {
        const response = await axios.get(`http://localhost:8000/documents/${docID}`);
        doc.value = response.data;
    } catch (error) {
        console.error(`Failed to fetch document ${docID}`, error);
    }
});
provide("doc", doc);

const shownComponents = ref({ left: "", right: "", top: "" });
const showComponent = (compName) => {
    console.log("show", compName);
    shownComponents.value.left = compName;
};
const hideComponent = (compName) => {
    console.log("hide", compName);
    shownComponents.value.left = null;
};
onKeyUp(["m", "M"], (e) => {
    e.preventDefault();
    shownComponents.value.left = "Minimap";
});
onKeyUp(["s", "S"], (e) => {
    e.preventDefault();
    shownComponents.value.left = "FileSettings";
});
</script>

<template>
    <div class="read-view">
        <Sidebar @showComponent="showComponent" @hideComponent="hideComponent" />

        <ArisManuscript :left="shownComponents.left" :right="shownComponents.right" :top="shownComponents.top" />

        <div class="links">
            <Button kind="tertiary" icon="Share3" />
            <Button kind="tertiary" icon="Lifebuoy" />
            <Button kind="tertiary">
                <Avatar name="TER" />
            </Button>
        </div>
    </div>
</template>

<style scoped>
.read-view {
    display: flex;
    width: 100%;
    background-color: transparent;
}

.links {
    position: absolute;
    right: 8px;
    top: 8px;
    height: calc(64px - var(--border-extrathin));
    display: flex;
    z-index: 3;
    padding: 8px;
    background-color: var(--surface-page);
    border-top-right-radius: 16px;
}
</style>
