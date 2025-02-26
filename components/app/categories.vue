<template>
    <div class="category">

        <UiAppCategory v-for="(category, index) in categories" :key="index" :title="category.name" />
        <UiAppCategory title="All" />
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
.category,
.section-title {
    width: 800px;
    margin: 50px auto;
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.section-title {
    font-size: 30px;
    font-weight: 700;
}
</style>