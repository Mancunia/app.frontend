<template>
    <div class="narrator-page">
        <div v-if="loading" class="loading-state">
            <UiSkeletonLoader width="60%" height="32px" />
            <UiSkeletonLoader width="40%" height="20px" />
        </div>

        <template v-if="narrator && !loading">
            <div class="narrator-header">
                <h1 class="narrator-name">{{ narrator.name }}</h1>
                <p v-if="narrator.bio" class="narrator-bio">{{ narrator.bio }}</p>
            </div>

            <div v-if="books.length" class="books-section">
                <h2 class="section-title">Narrated by {{ narrator.name }}</h2>
                <div class="book-grid">
                    <UiAppBook v-for="b in books" :key="b.id" :book="b" />
                </div>
            </div>
            <div v-else class="empty-state">
                <p class="empty-msg">No books found for this narrator.</p>
            </div>
        </template>

        <div v-if="!loading && !narrator" class="empty-state">
            <p class="empty-msg">Narrator not found.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getNarrator } from '~/services/narrator';
import { filterBooks } from '~/services/book';
import type { NarratorType } from '~/types/admin/narrator';
import type { BOOK } from '~/types/book';

definePageMeta({
    title: 'Narrator',
    middleware: 'app',
    layout: 'app-layout'
})

const id = useRoute().params.id as string
const narrator = ref<NarratorType | null>(null)
const books = ref<BOOK[]>([])
const loading = ref(true)

const fetchData = async () => {
    try {
        loading.value = true
        const [narratorRes, booksRes] = await Promise.all([
            getNarrator(id),
            filterBooks({ narrator: id }, USER_ROLES.USER)
        ])
        if (narratorRes) narrator.value = narratorRes as any
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
.narrator-page { padding: var(--d-pad); display: flex; flex-direction: column; gap: 24px; }
.loading-state { display: flex; flex-direction: column; gap: 12px; }
.narrator-header { border-bottom: 1px solid var(--hairline); padding-bottom: 16px; }
.narrator-name { font-family: var(--font-display); font-size: 1.6rem; color: var(--ink); margin: 0 0 8px; }
.narrator-bio { font-family: var(--font-serif); line-height: 1.7; color: var(--muted); margin: 0; }
.section-title { font-family: var(--font-display); font-size: 1rem; color: var(--ink); margin: 0; }
.book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--d-gap); }
.empty-state { padding: 48px 0; text-align: center; }
.empty-msg { font-family: var(--font-serif); font-style: italic; color: var(--muted); }
</style>
