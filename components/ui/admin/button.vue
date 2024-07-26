<template>
    <button @click="emit('click')">
        <div class="content">
            <slot></slot>
        </div>

    </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])

</script>

<style scoped>
button {
    width: 50%;
    display: inline-flex;
    padding: 8px 22px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 4px;
    background: #6E4C29;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20);
}

.content {
    display: flex;
    flex-direction: row;
}

button:hover {
    background: #4d3319;
}
</style>