<template>
    <div ref="selectRef" class="select-menu" :class="{ 'active': active }">
        <div class="select-btn" @click="toggleActive">
            <div class="items">
                <span v-if="isAllChecked" class="item"> All {{ placeHolder }} Selected </span>
                <span v-else-if="!isAllChecked && checked.length" v-for="(item, index) in checked" :key="index"
                    class="item">
                    {{ dataList.find((opt) => opt.id === item)?.name || item }}
                </span>
                <span v-else class="placeholder">
                    Select {{ placeHolder }}
                </span>
            </div>
            <i class="bx bx-chevron-down chevron"></i>
        </div>
        
        <transition name="fade">
            <div v-if="active" class="options-container">
                <div v-if="canSearch || canCheckAll" class="options-header">
                    <div v-if="canSearch" class="search-box">
                        <i class="bx bx-search search-icon"></i>
                        <input type="text" :placeholder="`Search ${placeHolder}...`" v-model="searchTerm"
                            class="search-input" @click.stop />
                    </div>
                    <div v-if="canCheckAll" class="check-all" @click="checkAll">
                        <span class="check-all-text">{{ isAllChecked ? 'Deselect All' : 'Select All' }}</span>
                    </div>
                </div>
                <ul class="options-list">
                    <li v-for="(item, index) in currentItems" :key="index" @click="check(item.id)" class="option">
                        <div class="checkbox-wrapper">
                            <input class="form-check-input" type="checkbox" :checked="checked?.includes(item.id)" @click.stop="check(item.id)" />
                        </div>
                        <span class="option-text">{{ item.name }}</span>
                    </li>
                    <li v-if="currentItems.length === 0" class="no-results">
                        No {{ placeHolder.toLowerCase() }} found
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
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
    canCheckAll: {
        type: Boolean,
        default: false,
    },
    canSearch: {
        type: Boolean,
        default: true,
    },
    placeHolder: {
        type: String,
        default: 'Items',
    },
    generic: {
        type: String as PropType<'string' | 'array'>,
        default: 'string',
    },
});

const { debounce } = useUtils()
const emit = defineEmits(['selected', 'search']);

const selectRef = ref(null);
const checked = ref<string[]>([]);
const searchTerm = ref<string>('');
const active = ref<boolean>(false);

const toggleActive = () => active.value = !active.value;

onClickOutside(selectRef, () => {
    active.value = false;
});

const isAllChecked = computed(() => {
    return props.dataList.length > 0 && props.dataList.every(item => checked.value.includes(item.id));
});

const currentItems = computed(() => {
    if (!props.dataList) return [];
    if (!props.canSearch || searchTerm.value === '') {
        return props.dataList;
    }
    const searchLower = searchTerm.value.toLowerCase();
    return props.dataList.filter((item: { name?: string }) => item.name?.toLowerCase().includes(searchLower));
});

const check = (id: string) => {
    if (checked.value.includes(id)) {
        checked.value = checked.value.filter((item: string) => item !== id);
    } else {
        checked.value = [...checked.value, id];
    }
};

const checkAll = () => {
    if (isAllChecked.value) {
        checked.value = [];
    } else {
        checked.value = props.dataList.map((item: { id: string }) => item.id);
    }
};

watch(checked, (newVal) => {
    if (props.generic === 'string') {
        emit('selected', newVal.join(','));
    } else if (props.generic === 'array') {
        emit('selected', newVal);
    }
});

const sendText = debounce(() => {
    emit('search', searchTerm.value)
}, 600)

watch(searchTerm, () => {
    if (currentItems.value.length === 0) {
        sendText()
    }
});

const updateCheckedFromProps = () => {
    let newChecked: string[];
    if (typeof props.selectedOption === 'string') {
        newChecked = props.selectedOption.split(',').map(s => s.trim()).filter(s => s !== '');
    } else if (Array.isArray(props.selectedOption)) {
        newChecked = props.selectedOption.map(item => String(item || '').trim()).filter(item => item !== '');
    } else {
        return
    }
    if (JSON.stringify(checked.value) !== JSON.stringify(newChecked)) {
        checked.value = newChecked;
    }
}

watch(() => props.selectedOption, updateCheckedFromProps, { deep: true });

onMounted(() => {
    updateCheckedFromProps();
});
</script>

<style scoped>
.select-menu {
    position: relative;
    max-width: 330px;
    width: 100%;
    margin: 8px 0;
    user-select: none;
}

.select-btn {
    display: flex;
    height: 44px;
    background: var(--card);
    padding: 0 16px;
    font-size: 14px;
    font-weight: 400;
    border-radius: var(--d-radius, 12px);
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    box-shadow: 0 2px 8px var(--hairline);
    border: 1px solid var(--hairline);
    transition: all 0.3s ease;
    font-family: var(--font-sans);
}

.select-btn:hover {
    border-color: var(--ochre);
}

.select-menu.active {
    z-index: 101;
}

.select-menu.active .select-btn {
    border-color: var(--ochre);
    box-shadow: 0 0 0 3px rgba(201, 122, 58, 0.1);
}

.items {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
}

.placeholder {
    color: var(--muted);
}

.item {
    background: var(--calabash);
    color: var(--ink);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 500;
}

.chevron {
    font-size: 20px;
    transition: transform 0.3s ease;
    color: var(--paper);
}

.select-menu.active .chevron {
    transform: rotate(-180deg);
}

.options-container {
    position: absolute;
    width: 100%;
    top: calc(100% + 8px);
    background: var(--card);
    border-radius: var(--d-radius, 12px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    border: 1px solid var(--hairline);
    z-index: 100;
    overflow: hidden;
}

.options-header {
    padding: 12px;
    border-bottom: 1px solid var(--hairline);
    background: var(--paper);
}

.search-box {
    position: relative;
    margin-bottom: 8px;
}

.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    font-size: 16px;
}

.search-input {
    width: 100%;
    height: 36px;
    padding: 0 12px 0 36px;
    border-radius: 8px;
    border: 1px solid var(--hairline);
    background: var(--card);
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
}

.search-input:focus {
    border-color: var(--ochre);
}

.check-all {
    display: flex;
    justify-content: flex-end;
    padding: 0 4px;
}

.check-all-text {
    font-size: 12px;
    color: var(--ochre);
    cursor: pointer;
    font-weight: 500;
}

.check-all-text:hover {
    text-decoration: underline;
}

.options-list {
    max-height: 240px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--hairline) transparent;
    padding: 8px;
    margin: 0;
    list-style: none;
}

.options-list::-webkit-scrollbar {
    width: 6px;
}

.options-list::-webkit-scrollbar-thumb {
    background-color: var(--hairline);
    border-radius: 10px;
}

.option {
    display: flex;
    padding: 10px 12px;
    border-radius: 8px;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
}

.option:hover {
    background: var(--calabash);
}

.checkbox-wrapper {
    display: flex;
    align-items: center;
    margin-right: 12px;
}

.form-check-input {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    cursor: pointer;
    accent-color: var(--ochre);
}

.option-text {
    font-size: 14px;
    color: var(--ink);
}

.no-results {
    padding: 20px;
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