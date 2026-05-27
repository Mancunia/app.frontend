<template>
    <div class="home-page">
        <div v-if="false" class="category-container">
            <AppCategories />
        </div>

        <div class="greeting">
            <p class="greeting-eyebrow">Tonight's storyteller</p>
            <h1 class="greeting-headline">The fire is lit. Sit by it.</h1>
            <p class="greeting-sub">"Anansesem nti, yɛhwɛ." — Because of stories, we look.</p>
        </div>

        <h2 class="section-heading">By the firelight</h2>

        <div v-if="loading" class="book-grid">
            <UiAppLoadersBook />
            <UiAppLoadersBook />
            <UiAppLoadersBook />
            <UiAppLoadersBook />
            <UiAppLoadersBook />
            <UiAppLoadersBook />
            <UiAppLoadersBook />
            <UiAppLoadersBook />
        </div>
        <div v-else class="book-grid">
            <UiAppBook v-for="(book, index) in books" :key="index" :book="book" />
        </div>

        <div class="book-grid" v-if="fetchingMore">
            <UiAppLoadersBook />
            <UiAppLoadersBook />
            <UiAppLoadersBook />
            <UiAppLoadersBook />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BOOK } from '~/types/book';
import { getBooks } from '~/services/book';

const loading = ref<boolean>(false);
const books = ref<BOOK[] | null>(null);
const fetchingMore = ref<boolean>(false)
const canFetchMore = ref<boolean>(true)

const pagination = ref<{ page: number, limit: number, search: string }>({ page: 1, limit: 100, search: '' })

const store = useAuthStore()
const { setCommon } = useCommon(USER_ROLES.USER)

const fetchBooks = async () => {
    try {
        const { data } = await getBooks(USER_ROLES.USER, pagination.value);
        if (data) {
            if (data.results.length < pagination.value.limit) {
                canFetchMore.value = false
            }
            if (books.value?.length) {
                books.value.push(...data.results)
            } else {
                books.value = data.results
            }
            pagination.value.page = data.page
            pagination.value.limit = data.records
        }
    } finally {
        loading.value = false;
        fetchingMore.value = false;
    }

}

onMounted(() => {
    loading.value = true;
    Promise.all([fetchBooks(), setCommon()]);
})

definePageMeta({
    title: 'Login',
    middleware: 'app',
    layout: 'app-layout'
})
</script>

<style scoped>
.home-page {
    padding: var(--d-pad);
}

.greeting {
    margin-bottom: 16px;
}

.greeting-eyebrow {
    font-family: var(--font-sans);
    color: var(--muted);
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin: 0;
}

.greeting-headline {
    font-family: var(--font-display);
    color: var(--ink);
    font-size: clamp(1.4rem, 3vw, 2.2rem);
    margin: 4px 0;
}

.greeting-sub {
    font-family: var(--font-serif);
    font-style: italic;
    color: var(--muted);
    font-size: 0.85rem;
    margin: 0;
}

.section-heading {
    font-family: var(--font-serif);
    font-weight: 600;
    color: var(--ink);
    font-size: 1rem;
    margin: 8px 0 4px;
}

.book-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--d-gap);
}
</style>
