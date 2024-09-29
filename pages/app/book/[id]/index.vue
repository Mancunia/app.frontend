<template>
    <div>
        <h1>{{ id }}</h1>
    </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id as string
definePageMeta({
    title: 'Book',
    middleware: 'app',
    layout: 'app-layout'
})
</script>

<style scoped></style>