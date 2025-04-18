<script setup>
import * as Icons from "@tabler/icons-vue";
import { ref, onMounted } from "vue";

const props = defineProps({
    icons: Array,
    defaultActive: { type: Number, default: -1 },
});
const active = defineModel({ type: Number, default: 0 });
active.value = props.defaultActive;

const click = (idx) => {
    active.value = idx;
};
</script>

<template>
    <div class="sc-wrapper">
        <span v-for="(icon, idx) in icons" :key="idx" class="sc-item" :class="['sc-btn', { active: idx == active }]"
            @click="click(idx)">
            <component :is="Icons['Icon' + icon]" class="sc-icon" />
        </span>
    </div>
</template>

<style scoped>
.sc-wrapper {
    border-radius: 16px;
    display: flex;
    gap: 4px;
}

.sc-item {
    --padding-inline: 10px;

    padding-block: 6px;
    display: flex;
    align-items: center;
    padding-inline: calc(var(--padding-inline) - 2 * var(--border-thin));
    border-radius: 4px;
    border-width: var(--border-thin);
    border-style: solid;

    &:first-child,
    &:last-child {
        padding-left: calc(var(--padding-inline) - 2 * var(--border-thin));
        padding-right: calc(var(--padding-inline) - 2 * var(--border-thin));
    }

    &:first-child {
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
    }

    &:last-child {
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
    }

    &.active {
        color: var(--extra-dark);
        background-color: var(--surface-information);
        border-color: var(--border-action);
    }

    &:not(.active) {
        cursor: pointer;
        color: var(--dark);
        background-color: var(--surface-hover);
        border-color: var(--surface-hover);

        &>.sc-icon {
            color: var(--dark);
        }

        &:hover {
            border-color: var(--dark);

            &>.sc-icon {
                color: var(--extra-dark);
            }
        }
    }
}
</style>
