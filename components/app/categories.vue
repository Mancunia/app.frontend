<template>
    <div class="categories">
        <UiAppCategory v-for="(category, index) in categories" :key="index" :title="category.name" />

    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    categories: {
        type: Array as PropType<any>

    }
})
const { categories } = useCommon()

</script>

<style scoped>
.categories {
    /* margin: 20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    width: 100%;
}
</style>