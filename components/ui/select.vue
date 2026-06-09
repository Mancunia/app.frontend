<template>
    <div ref="selectRef" class="select-menu" :class="{ 'active': active }">
        <div class="trigger" @click="toggleActive">
            <slot name="icon"></slot>
        </div>
        
        <transition name="fade">
            <ul v-if="active" class="options">
                <li v-for="(item, index) in dataList" :key="index" @click="clicked(item.id)" class="option">
                    <span class="option-text">{{ item.name }}</span>
                </li>
                <li v-if="dataList.length === 0" class="no-results">
                    No items available
                </li>
            </ul>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
    dataList: {
        type: Array as PropType<{ name?: string; id: string }[]>,
        required: true,
    },
    selectedOption: {
        type: [String, Array] as PropType<string | string[]>,
        default: () => [],
    },
});

const emit = defineEmits(['selected']);
const selectRef = ref(null);
const active = ref<boolean>(false);

const toggleActive = () => active.value = !active.value;

onClickOutside(selectRef, () => {
    active.value = false;
});

const clicked = (item: string) => {
    emit('selected', item)
    active.value = false
}
</script>

<style scoped>
.select-menu {
    position: relative;
    display: inline-block;
}

.trigger {
    cursor: pointer;
}

.options {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 160px;
    background: var(--card);
    border-radius: var(--d-radius, 12px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    border: 1px solid var(--hairline);
    z-index: 100;
    padding: 6px;
    margin: 0;
    list-style: none;
}

.option {
    display: flex;
    padding: 10px 16px;
    border-radius: 8px;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
}

.option:hover {
    background: var(--calabash);
}

.option-text {
    font-size: 14px;
    color: var(--ink);
    font-family: var(--font-sans);
    white-space: nowrap;
}

.no-results {
    padding: 12px 16px;
    text-align: center;
    color: var(--muted);
    font-size: 14px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>