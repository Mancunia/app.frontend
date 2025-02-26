<template>
    <div class="select-menu" :class="{ 'active': active }">
        <div class="select-btn" @click="toggleActive">
            <div class="items">
                <span v-if="isAllChecked" class="item"> All {{ placeHolder }} Selected

                </span>
                <span v-else-if="!isAllChecked && checked.length" v-for="(item, index) in checked" :key="index"
                    class="item">{{ dataList.find((opt) => opt.id
                        === item)?.name
                    }}</span>
                <span v-else>
                    Select {{ placeHolder }}
                </span>
            </div>

            <i class="bx bx-chevron-down"></i>
        </div>
        <ul class="options">
            <li class="option">
                <input type="text" v-if="canSearch" :placeholder="`Search for ${placeHolder}`" v-model="searchTerm"
                    class="form-control in-dropdown text-truncate" />
            </li>
            <li @click.stop v-for="(item, index) in currentItems" :key="index" @click="check(item.id)" class="option">
                <input class="form-check-input" type="checkbox" id="checkbox3-0bd498f163534f0aa5e58d3aed78842e"
                    :checked="checked?.includes(item.id)" />
                <span class="option-text">{{ item.name }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">

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

const emit = defineEmits(['selected', 'search']);
const checked = ref<string[]>([]);
const searchTerm = ref<string>('');
const active = ref<boolean>(false);

const toggleActive = () => active.value = !active.value;
const isAllChecked = computed(() => {
    if(props.dataList.length > 0){
        return checked.value.length === props.dataList.length;
    }else{
        emit('search', searchTerm.value);
        return []
    }
});

const currentItems = computed(() => {
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

watch(checked, () => {
    if (props.generic === 'string') {
        emit('selected', checked.value.join(','));
    } else if (props.generic === 'array') {
        emit('selected', checked.value);
    }
});


onMounted(() => {
    if (typeof props.selectedOption === 'string') {
        checked.value = props.selectedOption.split(',').filter((item: string) => item.trim() !== '');
    } else if (Array.isArray(props.selectedOption)) {
        checked.value = props.selectedOption.filter((item: string) => item.trim() !== '');
    }
});

</script>

<style scoped>
.select-menu {
    max-width: 330px;
    margin: 20px auto;
}

.select-menu .select-btn {
    display: flex;
    height: 30px;
    background: #fff;
    padding: 20px;
    font-size: 12px;
    font-weight: 400;
    border-radius: 8px;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.select-menu .options {
    display: none;
    position: absolute;
    width: inherit;
    overflow-y: auto;
    max-height: 295px;
    padding: 10px;
    margin-top: 10px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    animation-name: fadeInDown;
    -webkit-animation-name: fadeInDown;
    animation-duration: 0.35s;
    animation-fill-mode: both;
    -webkit-animation-duration: 0.35s;
    -webkit-animation-fill-mode: both;
}

.select-menu .options .option {
    display: flex;
    height: 55px;
    cursor: pointer;
    padding: 0 16px;
    border-radius: 8px;
    align-items: center;
    background: #fff;
}

.select-menu .options .option:hover {
    background: #f2f2f2;
}

.select-menu .options .option i {
    font-size: 25px;
    margin-right: 12px;
}

.select-menu .options .option .option-text {
    font-size: 18px;
    color: #333;
}

.select-btn i {
    font-size: 25px;
    transition: 0.3s;
}

.select-menu.active .select-btn i {
    transform: rotate(-180deg);
}

.items {
    display: flex;
    flex-direction: row;
    gap: 2px;
    overflow: hidden;
}

.item {
    background-color: rgb(165, 161, 161);
    color: #fff;
    border-radius: 5px;
    padding: 2px 4px;
    text-wrap: nowrap;
}

.select-menu.active .options {
    display: block;
    opacity: 0;
    z-index: 10;
    animation-name: fadeInUp;
    -webkit-animation-name: fadeInUp;
    animation-duration: 0.4s;
    animation-fill-mode: both;
    -webkit-animation-duration: 0.4s;
    -webkit-animation-fill-mode: both;
}

.options .option input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #f2f2f2;
    border-radius: 8px;
    margin-bottom: 10px;
}

.options .option input[type="checkbox"] {
    border: 1px solid #f2f2f2;
    border-radius: 8px;
    accent-color: #6e4c29;
}

.option-text {
    margin-left: 10px;
}

@keyframes fadeInUp {
    from {
        transform: translate3d(0, 30px, 0);
    }

    to {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}

@keyframes fadeInDown {
    from {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }

    to {
        transform: translate3d(0, 20px, 0);
        opacity: 0;
    }
}
</style>