<template>
    <div class="page-content">
        <div>
            <UiAdminButton style="align-self: center;">
                Add Book
            </UiAdminButton>
            <div class="viewBooksCollection">
                <UiLoader v-if="loading" />
                <div v-else>
                    <div v-for="(book, index) in books" :key="index">
                        <UiAdminBookView :book="book" @click="selectedBook = book" />
                    </div>

                </div>
            </div>
        </div>

        <div>
            <div class="book">
                {{ chapters }}
            </div>
            <UiAdminPlayer />
        </div>


    </div>

</template>
<script setup lang="ts">
import type { BOOK, CHAPTER } from '~/types/book';

import { getBooks, getChapters } from '~/services/book';
import { USER_ROLES } from '#imports';

const books = ref<BOOK[] | null>(null);
const chapters = ref<CHAPTER[] | null>(null);
const selectedBook = ref<BOOK | null>(null);
const loading = ref(false);

const fetchBooks = async () => {
    console.log('fetching books')
    try {
        loading.value = true;
        const { data } = await getBooks(USER_ROLES.ADMIN);
        if (data) {
            console.log({ data })
            books.value = data;
        }
    } finally {
        loading.value = false;
    }
};
const fetchChapters = async () => {
    console.log('fetching chapters')
    try {
        loading.value = true;
        const { data } = await getChapters(selectedBook.value._id,USER_ROLES.ADMIN);
        if (data) {
            console.log({ data })
            chapters.value = data;
        }
    } finally {
        loading.value = false;
    }
};

watch(selectedBook, () => {
    fetchChapters();

});

onMounted(() => {
    fetchBooks();
});

definePageMeta({
    title: 'Admin',
    middleware: 'admin'
})
</script>

<style scoped>
@import url("~/assets/css/admin/index.css");
</style>