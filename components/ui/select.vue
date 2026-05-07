<template>
    <div class="select-menu" :class="{ 'active': active }">
        <div @click="toggleActive">
            <slot name="icon"></slot>
        </div>
        <ul class="options">
            <li @click.stop v-for="(item, index) in dataList" :key="index" @click="clicked(item.id)" class="option">
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
});

const emit = defineEmits(['selected']);
const active = ref<boolean>(false);

const toggleActive = () => active.value = !active.value;

const clicked = (item: string) => {
    emit('selected', item)
    return toggleActive()
}

</script>

<style scoped>
.select-menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 330px;
    margin: 50px auto;

}

.select-menu .select-btn {
    height: 30px;
    background: var(--card);
    padding: 20px;
    font-size: 12px;
    font-weight: 400;
    border-radius: 8px;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    box-shadow: 0 2px 8px var(--hairline);
    border: 1px solid var(--hairline); font-family: var(--font-sans);
}

.select-menu .options {
    display: none;
    position: absolute;
    width: inherit;
    overflow-y: auto;
    max-height: 100px;
    padding: 10px;
    margin: 135px 0px 0px -66px;
    border-radius: 8px;
    background: var(--card);
    box-shadow: 0 4px 16px var(--hairline); border: 1px solid var(--hairline);
    animation-name: fadeInDown;
    -webkit-animation-name: fadeInDown;
    animation-duration: 0.35s;
    animation-fill-mode: both;
    -webkit-animation-duration: 0.35s;
    -webkit-animation-fill-mode: both;
}

.select-menu .options .option {
    display: flex;
    cursor: pointer;
    padding: 0 16px;
    border-radius: 8px;
    align-items: center;
    background: var(--card);
}

.select-menu .options .option:hover {
    background: var(--calabash);
}

.select-menu .options .option i {
    font-size: 25px;
    margin-right: 12px;
}

.select-menu .options .option .option-text {
    font-size: 18px;
    color: var(--ink);
    font-family: var(--font-sans);
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
    background: var(--calabash); color: var(--ink);
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
    border: 1px solid var(--paper);
    border-radius: 8px;
    margin-bottom: 10px;
}

.options .option input[type="checkbox"] {
    border: 1px solid var(--paper);
    border-radius: 8px;
    accent-color: var(--kola-2);
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