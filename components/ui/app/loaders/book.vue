<template>
    <div class="card">
        <div class="thumbnail-skeleton">
            <UiSkeletonLoader width="100%" height="100%" />
        </div>
        <UiSkeletonLoader width="80%" height="12px" />
        <UiSkeletonLoader width="60%" height="10px" />
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.thumbnail-skeleton {
    width: 100%;
    position: relative;
    height: 0;
    padding-bottom: 133.33%;
    border-radius: var(--d-radius);
    overflow: hidden;
}
</style>