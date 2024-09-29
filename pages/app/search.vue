<template>
    <div class="page">
        <div class="search">
            <div class="search-box">
                <input class="search-input" type="search" name="search" id="search" placeholder="Search"
                    control-id="ControlID-3">
                <img class="icon" src="@/assets/images/search.png" alt="">
            </div>

            <div class="filter-container mt10">
                <select class="select" id="category" name="category" control-id="ControlID-4">
                    <option value="categoryOption1">Category 1</option>
                    <option value="categoryOption2">Category 2</option>
                    <option value="categoryOption3">Category 3</option>
                    <option value="categoryOption4">Category 4</option>
                </select>

                <select class="select" id="language" name="language" control-id="ControlID-5">
                    <option value="languageOption1">Language 1</option>
                    <option value="languageOption2">Language 2</option>
                    <option value="languageOption3">Language 3</option>
                    <option value="languageOption4">Language 4</option>
                </select>
            </div>
        </div>

        <div class="books">
            <!-- <UiAppSearchItem /> -->
        </div>
    </div>

</template>

<script setup lang="ts">

definePageMeta({
    title: 'Search',
    middleware: 'app',
    layout: 'app-layout'
})
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.search {}

.search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    width: 400px;
    height: auto;
    border-radius: 10px;
    border: 2px solid #503519;
}

.search-box input {
    width: 100%;
    border: none;
    outline: none;
    background: none;
    font-size: 14px;
}

.search-box .icon {
    width: 20px;
    height: 20px;
}

.books {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
}

@media only screen and (min-width: 750px) {
    .books {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
    }
}
</style>