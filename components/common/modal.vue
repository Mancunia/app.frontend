<template>
    <teleport to="body">
        <div v-if="isOpen" class="modal-backdrop" @click.self="close">
            <div class="modal-content">
                <button class="close-btn" @click="close">✖</button>
                <slot></slot>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue;
});

const close = () => {
    isOpen.value = false;
    emit('update:modelValue', false);
};
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-content {
    background: white;
    padding: 2%;
    border-radius: 10px;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}
</style>
