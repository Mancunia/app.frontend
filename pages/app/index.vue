<template>
    <div v-if="false" class="category-container">
        <AppCategories />
    </div>
    <div class="list-container">
        <div v-if="loading">
            <div class="list-card-container">
                <UiAppLoadersBook />
                <UiAppLoadersBook />
                <UiAppLoadersBook />
                <UiAppLoadersBook />
                <UiAppLoadersBook />
                <UiAppLoadersBook />
                <UiAppLoadersBook />
                <UiAppLoadersBook />
            </div>
        </div>
        <div v-else class="list-card-container">
            <UiAppBook v-for="(book, index) in books" :key="index" :book="book" />
        </div>
        <div class="list-card-container" v-if="fetchingMore">
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

const pagination = ref<{ page: number, limit: number,search:string }>({ page: 1, limit: 100,search:'' })


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
.category-container {
    width: 80%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: 10px;
    padding: 10px;
    box-sizing: border-box;
}

.list-container {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}

.list-container-appbar {
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
}

.list-card-container {
    width: 100%;
    /* margin-bottom: 60%; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    /* Center children horizontally */
    gap: 1%;
}

.list-container-appbar {
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
}

.btnallcat {
    color: #000;
    font-size: 16px;
    font-family: Pontano Sans;
    font-weight: 500;
    word-wrap: break-word;
    text-align: center;
    border: none;
    cursor: pointer;
    background-color: transparent;
}

@media only screen and (min-width: 750px) {

    .list-card-container {
        margin-bottom: 10%;
        justify-content: space-evenly;
    }
}
</style>