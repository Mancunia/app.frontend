<template>
   <AdminUsers :userType="2" />
</template>

<script setup lang="ts">

definePageMeta({
   title: 'Associates',
   middleware: 'admin',
   layout: 'admin-layout',
})
</script>

<style scoped></style>