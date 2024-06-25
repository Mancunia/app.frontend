<template>
    <div :style="{ width: `${props.width}`, height: `${props.height}` }" class="skeleton" />
</template>

<script setup lang="ts">
const props = defineProps({
    height: {
        type: String,
        default: "20px",
    },
    width: {
        type: String,
        default: "100%",
    },
});
</script>

<style>
.skeleton {
    overflow: hidden;
    background-color: #e5e7eb;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>
