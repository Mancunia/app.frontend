<template>
    <div class="sidebar-content">
       
        <UiAdminInputField placeholder="Search Books" @update:model-value="pagination.search = $event" type="search" />
 {{pagination.search}}
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
const store = useAuthStore()
const pagination = ref<{ page: number, limit: number,search:string }>({ page: 1, limit: 40,search:'' })
const books = ref<{ data: BOOK[] | null, loading: boolean }>({ data: null, loading: false })
const fetchingMore = ref<boolean>(false)
const canFetchMore = ref<boolean>(true)

const {debounce} = useUtils()

const fetchBooks = async () => {
    try {
        books.value.loading = true
        const { data } = await getBooks(store.getAdmin.role, pagination.value)
        if (data) {
             books.value.data = data.results

            pagination.value.page = data.page
            pagination.value.limit = data.records
        }
    }
    finally {
        books.value.loading = false
        fetchingMore.value = false
    }
}

const searchBooks = debounce(fetchBooks, 500)

watch(()=>pagination.value.search, () => {
    console.log('searching')
        searchBooks()
})


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
