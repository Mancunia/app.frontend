<template>
    <h1>Web</h1>
</template>

<script setup lang="ts">
const { setCommon } = useCommon()

onMounted(() => {
    setCommon()
})
definePageMeta({
    layout: "default",
    title: "Blank Page"
});
</script>
