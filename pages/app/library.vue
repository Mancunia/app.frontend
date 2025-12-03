<template>
    <div class="list-container">
        <div v-if="loading">
            <div class="list-card-container">
                <UiAppLoadersBook v-for="i in 5" />
            </div>
        </div>
        <div v-else class="list-card-container">
            <UiAppBook v-for="(book, index) in books" :key="index" :book="book" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getLikedBooks } from '~/services/book';
import type{ BOOK } from '~/types/book';

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
.list-container {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
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
</style>