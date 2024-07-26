<template>
    <AppCategories />
    <div class="list-container">
        <div class="list-container-appbar">
            <p class="allcat m">All</p>
            <button class="btnallcat m">See All</button>
        </div>
        <div v-if="loading">
            <div class="list-card-container">>
                loading...
            </div>
        </div>
        <div v-else class="list-card-container">
            <UiAppBook v-for="(book, index) in books" :key="index" :book="book" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BOOK } from '~/types/book';
import { getBooks } from '~/services/book';

const loading = ref<boolean>(false);
const books = ref<BOOK[] | null>(null);

const fetchBooks = async () => {
    try {
        loading.value = true;
        const { data } = await getBooks();

        if (data) {
            books.value = data;
        }
    } finally {
        loading.value = false;
    }

}
const store = useAuthStore()

onMounted(() => {
    fetchBooks();
})
definePageMeta({
    title: 'Login',
    middleware: 'app',
    layout: 'app-layout'
})
</script>

<style scoped>
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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    gap: 3%;
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
</style>