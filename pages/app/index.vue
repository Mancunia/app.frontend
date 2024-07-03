<template>{{ store.getUser }}
    <div>
        Home
    </div>
    <UiAppPlayer/>
    <UiAppNavigator />
</template>

<script setup lang="ts">

const store = useAuthStore()
definePageMeta({
    title: 'Login',
    middleware: 'app'
})
</script>

<style scoped></style>