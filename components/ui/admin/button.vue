<template>
    <div class="button">
        <button @click="emit('click')" :style="style">
            <slot></slot>
        </button>
        <UiLoader v-if="loading" :theme="{ color: '#fff' }" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    style: {
        type: String,
        default: 'button'
    },
    loading: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['click'])

</script>

<style scoped>
.button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px 16px 6px 16px;
}

.button button {
    font-family: "Rammetto One";
    font-size: 1.5rem;
    color: #ffffff;
    background-color: #673305;
    border: none;
    padding: 5px 10px;
    border-radius: 22px;
}

button:hover {
    background-color: #4d3319;
}
</style>