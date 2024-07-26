<template>
    <div class="page">
        <div class="body">
            <LayoutAppNavBar />

            <div class="container">
                <div class="items-container">
                    <slot />
                    <div class="bottom-bar-container">
                        <UiAppNavigator />
                    </div>
                </div>

                <div class="divider-container">
                    <div class="divider">
                    </div>
                </div>

                <div class="details-container">
                    <UiAppPlayer />
                </div>
            </div>

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


.body {
    width: 100%;
    height: 100%;
}

.container {
    width: 100%;
    height: 100%;
    margin: auto;
    display: flex;
}

.items-container {
    position: relative;
    width: 60%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0 20px;
    overflow: scroll;
}

.divider-container {
    height: 100%;
    width: 8px;
    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9;
}

.divider-container .divider {
    background-color: #d9d9d9;
    width: 100%;
    height: 80%;
    border-radius: 10px;
}

.bottom-bar-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
}
</style>