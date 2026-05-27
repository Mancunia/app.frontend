<template>
    <div class="modal-content">
        <div class="modal-icon">
            <i :class='icon.icon' :style="`font-size:${icon.fontSize}; color:${icon.color};`"></i>
        </div>
        <div class="modal-text">{{ text }}
            <slot></slot>
        </div>
        <div class="modal-buttons">
            <button v-for="(btn, index) in buttons" :type="btn.type" :key="index" class="modal-button"
                :loading="btn.loading" :disabled="btn.disabled" :class="btn.classNames" @click="btn.onClick">
                {{ btn.label }}
            </button>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { PropType } from 'vue';

type ModalButtons = {
    loading: boolean,
    disabled: boolean
    onClick: () => void
    classNames: "primary" | "secondary" | "danger" | "info" | "subtle",
    label: string
    type?: "submit" | "button" | "reset"
}
type IconSettings = {
    icon: string,
    fontSize: string,
    color: string
}

defineProps({
    buttons: {
        type: Array as PropType<ModalButtons[]>,
        required: true,
        validator: (value: ModalButtons[]) => value.length <= 2
    },
    text: {
        type: String,
        default: "Information"
    },
    icon: {
        type: Object as PropType<IconSettings>,
        default: {
            icon: "bx bx-info-octagon",
            fontSize: "30px",
            color: "green"
        }
    }
})

</script>

<style scoped>
.modal-icon {
    display: flex;
    justify-content: center;
    align-content: center;
    font-size: 3rem;
    color: var(--ochre);
    margin-bottom: 1rem;
}

.modal-text {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    margin-bottom: 1.5rem;
    color: var(--ink);
}

.modal-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.modal-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
}

.modal-button.primary {
    background-color: var(--ochre);
    color: var(--cream);
}

.modal-button.danger {
    background-color: var(--hibiscus);
    color: var(--cream);
}

.modal-button.secondary {
    background-color: var(--calabash);
    color: var(--ink);
}

.modal-button.info {
    background-color: var(--ink);
    color: var(--cream);
}

.modal-button.subtle {
    background-color: unset;
    border: unset;
    color: var(--ink);
    border-bottom: 1px dashed var(--ink);
}
</style>