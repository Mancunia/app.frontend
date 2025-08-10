<template>
    <div class="admin-main">
        <div class="book-list-container">
            <UiAdminButton v-if="hasAccess()" @click="addBook">ADD NEW BOOK</UiAdminButton>
            <div class="sidebar-content">
                <UiAdminInputField placeholder="Search Books" @update:model-value="pagination.search = $event"
                    type="search" />
                <div class="card-container" v-if="books.loading">
                    <AdminBooksLoadersBookItemLoader />
                    <AdminBooksLoadersBookItemLoader />
                    <AdminBooksLoadersBookItemLoader />
                    <AdminBooksLoadersBookItemLoader />
                </div>
                <div class="card-container" v-else-if="!books.loading && books.data">
                    <AdminBooksBookItem v-for="(book, index) in books.data" :key="index" :book="book"
                        @click="selectBook(book)" />
                    <div v-if="fetchingMore">
                        <AdminBooksLoadersBookItemLoader />
                        <AdminBooksLoadersBookItemLoader />
                    </div>
                </div>
                <div class="card-container" v-else>
                    <p>No data</p>
                </div>
            </div>
        </div>

        <div class="book-view-container">
            <div class="wrapper">
                <AdminBooksBookView @refresh="fetchBooks" />
            </div>
            <AdminPlayer />
        </div>
    </div>
    <CommonModal v-model="isModalOpen">
        <AdminBooksForm @saved="onSave" />
    </CommonModal>
</template>
<script setup lang="ts">
import { getBooks } from "@/services/book"
import { type BOOK } from "~/types/book";
const router = useRouter()
const { debounce } = useUtils()
const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();
const { hasAccess } = useNavigation()
const { setCommon } = useCommon(USER_ROLES.ADMIN)

const pagination = ref<{ page: number, limit: number, search: string }>({ page: 1, limit: 40, search: '' })
const books = ref<{ data: BOOK[] | null, loading: boolean }>({ data: null, loading: false })
const fetchingMore = ref<boolean>(false)

const selectedBook = ref<BOOK | null>(null)




const addBook = () => {
    openModal()
}
const selectBook = (book: BOOK) => {
    router.push({ query: { bookId: book.id, action: 'view' } })
}

const onSave = (data: any) => {
    try {
        closeModal()
        router.push({ query: { bookId: data._id, action: 'view' } })
    }
    catch (error) {
        console.log(error)
    }

}


const fetchBooks = async () => {
    try {
        books.value.loading = true
        const { data } = await getBooks(USER_ROLES.ADMIN, pagination.value)
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

watch(() => pagination.value.search, () => {
    searchBooks()
})

onMounted(() => {
    fetchBooks()
    setCommon()
})
definePageMeta({
    title: 'Admin',
    middleware: 'admin',
    layout: 'admin-layout',
})
</script>
<style scoped>
.admin-main {
    display: flex;
    flex-direction: row;
    height: 90vh;
    background-color: #f5f5f5;
}

.book-list-container {
    width: 30%;
    padding: 20px;
    border-right: 1px solid #ddd;
    overflow-y: auto;
    overflow-x: hidden;
}

.book-view-container {
    width: 70%;
    padding: 20px;
    /* overflow-y: hidden; */
}

.wrapper {
    display: flex;
    flex-direction: row;
    height: 100%;
}

.sidebar-content {
    width: 90%;
    display: flex;
    flex-direction: column;

}
</style>