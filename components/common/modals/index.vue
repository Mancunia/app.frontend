<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="visible" class="modal-overlay" @click="onBackdropClick">
                <transition name="scale">
                    <div v-show="visible" class="modal" ref="modalBox">
                        <!-- <button class="close" @click="close">✖</button> -->
                        <slot></slot>
                    </div>
                </transition>
            </div>
        </transition>
    </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    modelValue: boolean;
    text?: string;
    closeOnBackdropClick?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'ok'): void;
    (e: 'cancel'): void;
}>();

const visible = ref(props.modelValue);
const modalBox = ref<HTMLElement | null>(null);

watch(() => props.modelValue, val => {
    visible.value = val;
});

function close() {
    emit('update:modelValue', false);
}
function onBackdropClick(event: MouseEvent) {
    if (!props.closeOnBackdropClick) return;
    if (modalBox.value && !modalBox.value.contains(event.target as Node)) {
        close();
    }
}
</script>

<style scoped>
/* Overlay + Modal styles (same as before) */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 300px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.close {
    position: relative;
    top: 0px;
    right: 0px;
    float: right;
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
