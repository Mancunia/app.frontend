<template>
  <div class="stories">
    <header class="stories-header">
      <div>
        <h1 class="page-title">Stories</h1>
        <p class="page-sub">{{ totalBooks }} stories in library</p>
      </div>
      <NuxtLink :to="routes.admin.booksNew" class="add-btn">+ Add story</NuxtLink>
    </header>

    <div class="toolbar">
      <input
        v-model="search"
        type="search"
        class="search-input"
        placeholder="Search stories…"
        aria-label="Search stories"
      />
    </div>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading stories…</div>
      <p v-else-if="books.length === 0" class="empty">No stories found.</p>
      <table v-else class="books-table">
        <thead>
          <tr>
            <th>Story</th>
            <th>Category</th>
            <th>Played</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id || (book as any)._id" class="book-row">
            <td>
              <div class="book-cell">
                <img v-if="book.cover" :src="book.cover" class="book-thumb" alt="" />
                <div v-else class="book-thumb-placeholder">◆</div>
                <div class="book-info">
                  <span class="book-title">{{ book.title }}</span>
                  <span class="book-authors">{{ book.authors?.map(a => typeof a === 'string' ? a : a.name).join(', ') }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="tags">
                <span v-for="catId in book.category?.slice(0, 2)" :key="catId" class="tag">
                  {{ getCategoryName(catId) }}
                </span>
              </div>
            </td>
            <td class="num-cell">{{ book.meta?.played ?? '—' }}</td>
            <td class="num-cell">{{ book.meta?.views ?? '—' }}</td>
            <td>
              <div class="row-actions">
                <NuxtLink :to="`/admin/books/${book.id || (book as any)._id}`" class="action-link">Edit →</NuxtLink>
                <button class="action-del" @click="handleDelete(book)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CommonPagination
      v-if="totalBooks > limit"
      :page-index="page"
      :total-pages="totalPages"
      :total-records="totalBooks"
      @on-page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { getBooks } from '@/services/book';
import { deleteBook } from '@/services/admin/book';
import type { BOOK } from '~/types/book';
import { useAuthStore } from '~/stores';

definePageMeta({ title: 'Stories', middleware: 'admin', layout: 'admin-layout' });

const authStore = useAuthStore();
const { setCommon } = useCommon(USER_ROLES.ADMIN);
const search = ref('');
const loading = ref(false);
const books = ref<BOOK[]>([]);
const totalBooks = ref(0);
const page = ref(1);
const limit = 20;
const totalPages = computed(() => Math.ceil(totalBooks.value / limit));
const { debounce } = useUtils();

const getCategoryName = (id: string) => {
  const category = authStore.getCategories?.find((c) => c.id === id);
  return category?.name || id;
};

const fetchBooks = async () => {
  loading.value = true;
  try {
    const { data } = await getBooks(USER_ROLES.ADMIN, { page: page.value, limit, search: search.value });
    if (data) {
      books.value = data.results ?? [];
      totalBooks.value = data.records ?? 0;
    }
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (p: number) => {
  page.value = p;
  fetchBooks();
};

const handleDelete = async (book: BOOK) => {
  const bookId = book.id || (book as any)._id
  if (!window.confirm(`Delete "${book.title}" and all its chapters? This cannot be undone.`)) return
  await deleteBook(bookId)
  books.value = books.value.filter(b => (b.id || (b as any)._id) !== bookId)
  totalBooks.value = Math.max(0, totalBooks.value - 1)
}

const debouncedFetch = debounce(fetchBooks, 400);
watch(search, debouncedFetch);
onMounted(() => {
  fetchBooks();
  setCommon();
});
</script>

<style scoped>
.stories { display: flex; flex-direction: column; gap: 20px; }

.stories-header { display: flex; align-items: flex-start; justify-content: space-between; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0 0 4px; }
.page-sub { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }
.add-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; background: var(--ochre); color: var(--cream);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600;
  text-decoration: none; transition: background 0.15s;
}
.add-btn:hover { background: var(--ochre-deep); }

.toolbar { display: flex; gap: 12px; }
.search-input {
  flex: 1; max-width: 340px; padding: 9px 14px;
  background: var(--card); border: 1px solid var(--hairline);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink);
  outline: none;
}
.search-input:focus { border-color: var(--ochre); }

.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.books-table { width: 100%; border-collapse: collapse; }
.books-table th {
  font-family: var(--font-sans); font-size: 10px; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--muted); text-align: left;
  padding: 12px 16px; border-bottom: 1px solid var(--hairline);
}
.book-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.book-row:last-child td { border-bottom: none; }
.book-row:hover td { background: rgba(201,122,58,0.04); }

.book-cell { display: flex; align-items: center; gap: 12px; }
.book-thumb { width: 36px; height: 48px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
.book-thumb-placeholder {
  width: 36px; height: 48px; background: var(--calabash); border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: var(--ochre); flex-shrink: 0;
}
.book-info { display: flex; flex-direction: column; gap: 2px; }
.book-title { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.book-authors { font-family: var(--font-sans); font-size: 11.5px; color: var(--muted); }
.tags { display: flex; gap: 4px; flex-wrap: wrap; }
.tag {
  padding: 2px 8px; background: rgba(201,122,58,0.10); color: var(--ochre);
  border-radius: 20px; font-family: var(--font-sans); font-size: 11px; font-weight: 500;
}
.num-cell { font-family: var(--font-mono); font-size: 12.5px; color: var(--ink); }
.row-actions { display: flex; gap: 12px; align-items: center; }
.action-link { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); text-decoration: none; font-weight: 500; }
.action-link:hover { text-decoration: underline; }
.action-del { font-family: var(--font-sans); font-size: 12px; color: var(--hibiscus); background: none; border: none; cursor: pointer; padding: 0; }
.action-del:hover { text-decoration: underline; }
.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
</style>
