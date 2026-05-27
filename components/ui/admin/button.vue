<template>
    <div class="button">
        <button v-bind="$attrs" :class="['btn', variant && `btn--${variant}`]" @click="emit('click')">
            <slot></slot>
        </button>
        <UiLoader v-if="loading" :theme="{ color: 'var(--cream)' }" />
    </div>
</template>

<script setup lang="ts">
defineOptions({
    inheritAttrs: false
})
const props = defineProps({
    variant: {
        type: String,
        default: ''
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

.btn {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--cream);
    background-color: var(--kola);
    border: none;
    padding: 5px 10px;
    border-radius: 22px;
}

.btn:hover { background-color: var(--kola-2); }
.btn--dark  { background-color: var(--ink); }
.btn--dark:hover { background-color: var(--ink-soft); }
.btn--accent { background-color: var(--ochre); }
.btn--accent:hover { background-color: var(--ochre-deep); }
</style>