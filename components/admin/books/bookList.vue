<template>
    <div class="sidebar-content">
        <div class="search-container">
            <UiAdminInputField placeholder="Search Books" @update="searchTerm = $event" />
        </div>
        <div class="card-container" v-if="books.loading">
            <AdminBooksLoadersBookItemLoader />
            <AdminBooksLoadersBookItemLoader />
            <AdminBooksLoadersBookItemLoader />
            <AdminBooksLoadersBookItemLoader />
        </div>
        <div class="card-container" v-else-if="!books.loading && books.data">
            <AdminBooksBookItem v-for="(book, index) in books.data" :key="index" :book="book" />
            <UiInfiniteScroll @more="viewMore" :options="options" />
            <div v-if="fetchingMore">
                <AdminBooksLoadersBookItemLoader />
                <AdminBooksLoadersBookItemLoader />
            </div>
        </div>
        <div class="card-container" v-else>
            <p>No data</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getBooks } from "@/services/book"
import { type BOOK } from "~/types/book";
const searchTerm = ref<string | null>(null);
const store = useAuthStore()
const pagination = ref<{ page: number, limit: number }>({ page: 1, limit: 7 })
const books = ref<{ data: BOOK[] | null, loading: boolean }>({ data: null, loading: false })
const fetchingMore = ref<boolean>(false)
const canFetchMore = ref<boolean>(true)

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
} as const

const fetchBooks = async () => {
    try {
        const { data } = await getBooks(store.getAdmin.role, pagination.value)
        if (data) {
            if (data.results.length < pagination.value.limit) {
                canFetchMore.value = false
            }
            if (books.value.data?.length) {
                books.value.data.push(...data.results)
            } else {
                books.value.data = data.results
            }
            pagination.value.page = data.page
            pagination.value.limit = data.records
        }
    }
    finally {
        books.value.loading = false
        fetchingMore.value = false
    }
}

const viewMore = () => {
    if (!canFetchMore.value) return
    fetchingMore.value = true
    pagination.value.page = Number(pagination.value.page) + 1
    fetchBooks()
}

onMounted(() => {
    books.value.loading = true
    fetchBooks()
})
</script>