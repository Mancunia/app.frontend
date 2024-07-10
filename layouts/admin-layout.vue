<template>
    <div class="page">
        <div class="sidebar">
            <LayoutAdminSidebar />
        </div>
        <div class="body">
            <slot />
            
        </div>
    </div>

</template>

<script setup lang="ts">

</script>

<style scoped>
.page {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
}
.sidebar{
    width: 10%;

}

.body {
    padding: 20px;
    width: 80%;
    height: 100%;
}
</style>