<template>
    <div class="sidebar-content">
        <UiAdminInputField placeholder="Search Books" @update="searchTerm = $event" type="text" />

        <div class="card-container" v-if="books.loading">
            <AdminBooksLoadersBookItemLoader />
            <AdminBooksLoadersBookItemLoader />
            <AdminBooksLoadersBookItemLoader />
            <AdminBooksLoadersBookItemLoader />
        </div>
        <div class="card-container" v-else-if="!books.loading && books.data">
            <AdminBooksBookItem v-for="(book, index) in books.data" :key="index" :book="book" />
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
const pagination = ref<{ page: number, limit: number }>({ page: 1, limit: 40 })
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


onMounted(() => {
    books.value.loading = true
    fetchBooks()
})
</script>

<style scoped>
.search-contain {
    box-sizing: border-box;
    width: 237px;
    height: 50px;
    border-radius: 5px;
    background: #fdfdfd;
    border-bottom: 2px solid;
    margin-bottom: 20px;
}
</style>
