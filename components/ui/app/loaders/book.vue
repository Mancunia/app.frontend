<template>
    <div class="card">
        <UiSkeletonLoader width="100%" height="80%" />
        <UiSkeletonLoader width="100%" height="10%" />
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.card {
    width: 12rem;
    height: 250px;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: transparent;
    border: none;
    gap: 10px;
    padding: 2%
}
</style>