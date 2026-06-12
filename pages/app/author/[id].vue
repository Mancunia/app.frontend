<template>
    <div class="author-page">
        <div v-if="loading" class="loading-state">
            <UiSkeletonLoader width="60%" height="32px" />
            <UiSkeletonLoader width="40%" height="20px" />
        </div>

        <template v-if="author && !loading">
            <div class="author-header">
                <h1 class="author-name">{{ author.name }}</h1>
                <p v-if="author.bio" class="author-bio">{{ author.bio }}</p>
            </div>

            <div v-if="books.length" class="books-section">
                <h2 class="section-title">Books by {{ author.name }}</h2>
                <div class="book-grid">
                    <UiAppBook v-for="b in books" :key="b.id" :book="b" />
                </div>
            </div>
            <div v-else class="empty-state">
                <p class="empty-msg">No books found for this author.</p>
            </div>
        </template>

        <div v-if="!loading && !author" class="empty-state">
            <p class="empty-msg">Author not found.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAuthor } from '~/services/author';
import { filterBooks } from '~/services/book';
import type { AuthorType } from '~/types/admin/author';
import type { BOOK } from '~/types/book';

definePageMeta({
    title: 'Author',
    middleware: 'app',
    layout: 'app-layout'
})

const id = useRoute().params.id as string
const author = ref<AuthorType | null>(null)
const books = ref<BOOK[]>([])
const loading = ref(true)

const fetchData = async () => {
    try {
        loading.value = true
        const [authorRes, booksRes] = await Promise.all([
            getAuthor(id),
            filterBooks({ author: id }, USER_ROLES.USER)
        ])
        if (authorRes) author.value = authorRes as any
        if (booksRes) {
            const res = booksRes as any
            books.value = Array.isArray(res) ? res : (res.data?.data ?? res.data ?? res.results ?? [])
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

onMounted(fetchData)
</script>

<style scoped>
.author-page { padding: var(--d-pad); display: flex; flex-direction: column; gap: 24px; }
.loading-state { display: flex; flex-direction: column; gap: 12px; }
.author-header { border-bottom: 1px solid var(--hairline); padding-bottom: 16px; }
.author-name { font-family: var(--font-display); font-size: 1.6rem; color: var(--ink); margin: 0 0 8px; }
.author-bio { font-family: var(--font-serif); line-height: 1.7; color: var(--muted); margin: 0; }
.section-title { font-family: var(--font-display); font-size: 1rem; color: var(--ink); margin: 0; }
.book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--d-gap); }
.empty-state { padding: 48px 0; text-align: center; }
.empty-msg { font-family: var(--font-serif); font-style: italic; color: var(--muted); }
</style>
