<template>
    <div class="categories">
        <UiAppCategory title="Love" />
        <UiAppCategory title="Hate" />
        <UiAppCategory title="Sad" />
        <UiAppCategory title="Happy" />
        <UiAppCategory title="Mad" />
        <UiAppCategory title="Sane" />
        <UiAppCategory title="Low" />
        <UiAppCategory title="High" />
        <UiAppCategory title="Cool" />
        <UiAppCategory title="Warm" />
        <UiAppCategory title="Like" />
        <UiAppCategory title="Luck" />

    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    categories:{
        type:Array as PropType<any>

    }
})
</script>

<style scoped>
.categories {
    margin: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
}
</style>