<script setup>
import { ref, watch } from "vue";
const props = defineProps({ icon: { type: String, required: true } });
const emit = defineEmits(["on", "off"]);

const controlVisibility = ref("hidden");
const isHoveringButton = ref(false);
const isHoveringControl = ref(false);
const updateVisibility = () => {
    controlVisibility.value = (isHoveringButton.value || isHoveringControl.value)
        ? "visible"
        : "hidden";
};

let hideTimeout = null;
const onMouseEnterButton = () => {
    isHoveringButton.value = true;
    clearTimeout(hideTimeout);
    updateVisibility();
};
const onMouseLeaveButton = () => {
    isHoveringButton.value = false;
    hideTimeout = setTimeout(updateVisibility, 500);
};
const onMouseEnterControl = () => {
    isHoveringControl.value = true;
    clearTimeout(hideTimeout);
    updateVisibility();
};
const onMouseLeaveControl = () => {
    isHoveringControl.value = false;
    hideTimeout = setTimeout(updateVisibility, 500);
};

const controlState = ref(-1);
const sides = ["left", "top", "right"];
watch(controlState, (newVal) => {
    clearTimeout(hideTimeout);
    controlVisibility.value = "hidden";
    buttonState.value = true;
    emit('on', sides[newVal]);
})

const buttonState = ref(false);
watch(buttonState, (pressed) => {
    if (pressed) {
        emit('on', sides[controlState.value]);
    } else {
        emit('off');
        clearTimeout(hideTimeout);
        controlVisibility.value = "hidden";
    }
})
</script>

<template>
    <div class="sb-item">
        <ButtonToggle :icon="icon" v-model="buttonState" @mouseenter="onMouseEnterButton"
            @mouseleave="onMouseLeaveButton" />
        <SegmentedControl :icons="['LayoutSidebarFilled', 'LayoutNavbarFilled', 'LayoutSidebarRightFilled']"
            :default-ative="-1" v-model="controlState" @mouseenter="onMouseEnterControl"
            @mouseleave="onMouseLeaveControl" />
    </div>
</template>

<style scoped>
.sb-item {
    display: flex;
    gap: 16px;
}

/* .btn-toggle:hover+.sc-wrapper {
    visibility: visible;
} */

.sc-wrapper {
    visibility: v-bind("controlVisibility");
}
</style>
