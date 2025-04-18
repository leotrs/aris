<script setup>
import { ref } from 'vue';
import * as Icons from '@tabler/icons-vue';

const props = defineProps({
    iconLeft: String,
    iconRight: String,
    numberStops: { type: Number, default: 3 },
    defaultActive: { type: Number, default: 0 }
});
const active = ref(props.defaultActive);
</script>


<template>
    <div class="s-wrapper">
        <component :is="Icons['Icon' + iconLeft]" class="s-icon" />
        <div class="s-control">
            <span class="s-track"></span>
            <span v-for="idx in Array(numberStops).keys()" class="s-stop" :class="[{ 'active': idx == active }]"
                @click="active = idx">
            </span>
        </div>
        <component :is="Icons['Icon' + iconRight]" class="s-icon" />
    </div>
</template>


<style scoped>
.s-wrapper {
    display: flex;
    align-items: center;
}

 .s-icon {
   flex-shrink: 0;
 }

.s-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 32px);
    position: relative;
}

.s-track {
    position: absolute;
    height: 2px;
    width: 100%;
    background-color: var(--light);
    z-index: -1;
}

.s-stop {
    height: 8px;
    width: 8px;
    border-radius: 4px;
    background-color: var(--light);
    border: var(--border-thin) solid transparent;

    &.active {
        border-color: var(--primary-500);
        background-color: var(--primary-500);
    }

    &:not(.active) {
        cursor: pointer;

        &:hover {
            border-color: var(--primary-300);
            background-color: var(--primary-300);
        }
    }
}
</style>
