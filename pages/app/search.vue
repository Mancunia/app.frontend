<template>
    <div class="page">
        <div class="search">
            <div class="search-box">
                <input class="search-input" type="search" name="search" id="search" placeholder="Search"
                    control-id="ControlID-3" v-model="searchOptions.search">
                <button class="search-icon" @click="search">🔍</button>
            </div>

            <div class="filter-container">
                <UiSelectDropDown :data-list="categories ?? [{ id: '', name: 'Select Categories' }]"
                    place-holder="Categories" @selected="searchOptions.categories = $event" />

                <UiSelectDropDown :data-list="languages ?? [{ id: '', name: 'Select Categories' }]"
                    place-holder="Languages" @selected="searchOptions.languages = $event" />
            </div>
        </div>

        <div class="books">
            <UiAppBook v-for="(book, index) in books" :key="index" :book="book" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { filterBooks } from '~/services/book';
import type { BOOK } from '~/types/book';
const books = ref<BOOK[] | null>(null);

const { languages, categories } = useCommon(USER_ROLES.USER)

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
    books.value = null
    filter()
}
const searchDebounced = debounce(search, 500);

watch(() => searchOptions.value.search, () => {
    searchDebounced()

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
.page { display: flex; flex-direction: column; padding: var(--d-pad); gap: 20px; }
.search-box { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; max-width: 480px; border-radius: var(--d-radius); border: 1px solid var(--hairline); background: var(--card); }
.search-box input { width: 100%; border: none; outline: none; background: none; font-size: 1rem; font-family: var(--font-sans); color: var(--ink); }
.search-icon { color: var(--muted); font-size: 1rem; cursor: pointer; background: none; border: none; }
.filter-container { display: flex; gap: 8px; flex-wrap: wrap; }
.books { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--d-gap); width: 100%; }
</style>
