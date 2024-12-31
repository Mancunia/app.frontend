<template>
    <div class="page">
        <div class="search">
            <div class="search-box">
                <input class="search-input" type="search" name="search" id="search" placeholder="Search"
                    control-id="ControlID-3" v-model="searchOptions.search">
                <img @click="search" class="icon" src="@/assets/images/search.png" alt="">
            </div>

            <div class="filter-container">
                <UiSelectDropDown :data-list="categories ?? [{ id: '', name: 'Select Categories' }]"
                    place-holder="Categories" @selected="searchOptions.categories = $event" />

                <UiSelectDropDown :data-list="languages ?? [{ id: '', name: 'Select Categories' }]"
                    place-holder="Languages" @selected="searchOptions.languages = $event" />
            </div>
        </div>

        <div class="books">
            <UiAppSearchItem v-for="(book, index) in books" :key="index" :book="book" />
        </div>
    </div>

</template>

<script setup lang="ts">
import { filterBooks } from '~/services/book';
import type { BOOK } from '~/types/book';
const books = ref<BOOK[] | null>(null);

const { languages, categories } = useCommon()

const searchOptions = ref<{ page: number, limit: number, search: string, categories: string[], languages: string[] }>({
    page: 1,
    limit: 10,
    search: '',
    categories: [],
    languages: []
})

const { debounce } = useUtils();

const filter = async () => {
    try {
        const { data } = await filterBooks(searchOptions.value as Object, USER_ROLES.USER);
        if (data) {
            books.value = data;
        }
    } catch (error) {
        console.log(error);
    }
}
const search = () => {
    console.log('search')
    books.value = null
    filter()
}
const searchDebounced = debounce(search, 500);

watch(() => searchOptions.value.search, () => {
    if (searchOptions.value.search) {
        searchDebounced()
    }
})

onMounted(() => {
    filter();
})



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
    padding: 2%;
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

.filter-container {
    display: flex;
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