<template>
   <AdminUsers :userType="0" :actions="{ makeAssociate: true }" />
</template>

<script setup lang="ts">

definePageMeta({
   title: 'Associates',
   middleware: 'admin',
   layout: 'admin-layout',
})
</script>

<style scoped></style>