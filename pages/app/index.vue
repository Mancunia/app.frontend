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

        <div class="section-row">
            <h2 class="section-heading">By the firelight</h2>
            <div class="search-bar">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" />
                </svg>
                <input
                    v-model="searchQuery"
                    class="search-input"
                    type="text"
                    placeholder="Search books…"
                    aria-label="Search books on this page"
                />
                <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="Clear search">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                </button>
            </div>
        </div>

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
        <div v-else-if="displayedBooks.length" class="book-grid">
            <UiAppBook v-for="(book, index) in displayedBooks" :key="index" :book="book" />
        </div>
        <div v-else-if="searchQuery" class="empty-state">
            <p class="empty-message">No books found for <strong>"{{ searchQuery }}"</strong></p>
            <NuxtLink :to="`/app/search?q=${encodeURIComponent(searchQuery)}`" class="empty-cta">
                Search the full library →
            </NuxtLink>
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
const searchQuery = ref<string>('');
const displayedBooks = ref<BOOK[]>([]);

watch([books, searchQuery], () => {
    const all = books.value ?? [];
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) { displayedBooks.value = all; return; }
    displayedBooks.value = all.filter(book =>
        (book.title ?? '').toLowerCase().includes(q) ||
        (book.authors ?? []).some(a => a.toLowerCase().includes(q)) ||
        (book.category ?? []).some(c => c.toLowerCase().includes(q))
    );
}, { immediate: true });
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

.section-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 4px;
}

.section-row .section-heading {
    margin: 0;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--surface, #f5f5f0);
    border: 1px solid var(--border, #e0ddd6);
    border-radius: 8px;
    padding: 5px 10px;
    flex: 1;
    max-width: 260px;
}

.search-icon {
    color: var(--muted);
    flex-shrink: 0;
}

.search-input {
    background: none;
    border: none;
    outline: none;
    font-family: var(--font-sans);
    font-size: 0.8rem;
    color: var(--ink);
    width: 100%;
    min-width: 0;
}

.search-input::placeholder {
    color: var(--muted);
}

.search-clear {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--muted);
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.search-clear:hover {
    color: var(--ink);
}

.empty-state {
    padding: 48px 0;
    text-align: center;
}

.empty-message {
    font-family: var(--font-sans);
    font-size: 0.9rem;
    color: var(--muted);
    margin: 0 0 12px;
}

.empty-cta {
    font-family: var(--font-sans);
    font-size: 0.85rem;
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 3px;
}

.empty-cta:hover {
    opacity: 0.7;
}
</style>
