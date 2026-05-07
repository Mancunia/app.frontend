<template>
  <div class="library-page">
    <h2 class="section-heading">Your library</h2>
    <div v-if="loading" class="book-grid">
      <UiAppLoadersBook v-for="i in 5" :key="i" />
    </div>
    <div v-else-if="books && books.length" class="book-grid">
      <UiAppBook v-for="(book, index) in books" :key="index" :book="book" />
    </div>
    <div v-else class="empty-state">
      <UiAseAdinkraGlyph />
      <p class="empty-text">No books yet</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLikedBooks } from '~/services/book';
import type { BOOK } from '~/types/book';

const books = ref<BOOK[] | null>(null);
const loading = ref<boolean>(true);

const fetchLikedBooks = async () => {
    try {
        loading.value = true;
        const response = await getLikedBooks(USER_ROLES.USER);
        if (response) {
            books.value = response.data;
        }
    } catch (error) {
        console.log(error);
    }
    finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchLikedBooks();
});

definePageMeta({
    title: 'library',
    middleware: 'app',
    layout: 'app-layout'
})
</script>

<style scoped>
.library-page { padding: var(--d-pad); }
.section-heading { font-family: var(--font-serif); font-weight: 600; font-size: 1.1rem; color: var(--ink); margin: 0 0 16px; }
.book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--d-gap); }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 0; gap: 16px; }
.empty-text { font-family: var(--font-serif); color: var(--muted); margin: 0; }
</style>
