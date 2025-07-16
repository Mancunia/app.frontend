<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="isOpen" class="modal-backdrop" @click.self="onBackdropClick">
                <transition name="scale">
                    <div class="modal-content">
                        <button class="close-btn" @click="close">✖</button>
                        <slot></slot>
                    </div>
                </transition>
            </div>
        </transition>

    </teleport>
</template>

<script setup>
import { defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    closeOnBackdropClick: {
        type: Boolean,
        default: true
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

function onBackdropClick() {
    if (!props.closeOnBackdropClick) return;
    close()
}
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
    padding: 4%;
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
/* Fade for overlay */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Scale for modal */
.scale-enter-active,
.scale-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
