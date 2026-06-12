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
                    place-holder="Categories" :selected-option="searchOptions.category" generic="array"
                    @selected="searchOptions.category = $event" />

                <UiSelectDropDown :data-list="languages ?? [{ id: '', name: 'Select Categories' }]"
                    place-holder="Languages" :selected-option="searchOptions.language" generic="array"
                    @selected="searchOptions.language = $event" />

                <UiSelectDropDown :data-list="authorOptions" place-holder="Authors"
                    :selected-option="searchOptions.author" generic="array"
                    @selected="searchOptions.author = $event" />

                <UiSelectDropDown :data-list="narratorOptions" place-holder="Narrators"
                    :selected-option="searchOptions.narrator" generic="array"
                    @selected="searchOptions.narrator = $event" />
            </div>
        </div>

        <div class="books">
            <UiAppBook v-for="(book, index) in books" :key="index" :book="book" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { filterBooks } from '~/services/book';
import { getAuthors } from '~/services/author';
import { getNarrators } from '~/services/narrator';
import type { BOOK } from '~/types/book';
const books = ref<BOOK[] | null>(null);

const { languages, categories } = useCommon(USER_ROLES.USER)

const route = useRoute();
const router = useRouter();

const searchOptions = ref<{ page: number, limit: number, search: string, category: string[], language: string[], author: string[], narrator: string[] }>({
    page: Number(route.query.page) || 1,
    limit: Number(route.query.limit) || 10,
    search: (route.query.search as string) || '',
    category: route.query.category ? (Array.isArray(route.query.category) ? route.query.category : (route.query.category as string).split(',')) : [],
    language: route.query.language ? (Array.isArray(route.query.language) ? route.query.language : (route.query.language as string).split(',')) : [],
    author: route.query.author ? (Array.isArray(route.query.author) ? route.query.author : (route.query.author as string).split(',')) : [],
    narrator: route.query.narrator ? (Array.isArray(route.query.narrator) ? route.query.narrator : (route.query.narrator as string).split(',')) : []
})

const authorOptions = ref<{ id: string, name: string }[]>([])
const narratorOptions = ref<{ id: string, name: string }[]>([])

const { debounce } = useUtils();

const updateUrl = () => {
    const query: any = {}
    if (searchOptions.value.search) query.search = searchOptions.value.search
    if (searchOptions.value.category.length) query.category = searchOptions.value.category.join(',')
    if (searchOptions.value.language.length) query.language = searchOptions.value.language.join(',')
    if (searchOptions.value.author.length) query.author = searchOptions.value.author.join(',')
    if (searchOptions.value.narrator.length) query.narrator = searchOptions.value.narrator.join(',')
    if (searchOptions.value.page > 1) query.page = searchOptions.value.page
    
    router.replace({ query })
}

const filter = async () => {
    try {
        const params: any = { ...searchOptions.value }
        if (params.author?.length === 1) params.author = params.author[0]
        if (params.narrator?.length === 1) params.narrator = params.narrator[0]
        if (params.category?.length === 1) params.category = params.category[0]
        if (params.language?.length === 1) params.language = params.language[0]
        const res = await filterBooks(params, USER_ROLES.USER) as any;
        if (res) {
            books.value = Array.isArray(res) ? res : (res.data?.data ?? res.data ?? res.results ?? res)
        }
    } catch (error) {
        console.log(error);
    }
}

const search = () => {
    books.value = null
    updateUrl()
    filter()
}
const searchDebounced = debounce(search, 500);

watch(searchOptions, () => {
    searchDebounced()
}, { deep: true })

const fetchFilterOptions = async () => {
    const [authorRes, narratorRes] = await Promise.all([
        getAuthors({ limit: 100 }),
        getNarrators({ limit: 100 })
    ]) as any
    if (authorRes?.data) {
        const authors = authorRes.data.data ?? authorRes.data
        authorOptions.value = authors.map((a: any) => ({ id: a.id ?? a._id, name: a.name }))
    }
    if (narratorRes?.data) {
        const narrators = narratorRes.data.data ?? narratorRes.data
        narratorOptions.value = narrators.map((n: any) => ({ id: n.id ?? n._id, name: n.name }))
    }
}

onMounted(() => {
    filter();
    fetchFilterOptions();
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
