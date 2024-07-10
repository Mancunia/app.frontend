<template>
    <main>
        <h1>Expandable Sidebar</h1>
        <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem ab non
            dolorem reiciendis harum quasi inventore a eum soluta. Suscipit id
            asperiores libero veritatis ducimus sapiente minus reprehenderit
            eligendi pariatur.
        </p>
    </main>


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
    try {
        if (!selectedBook.value) return;
        loading.value = true;
        const { data } = await getChapters(selectedBook.value._id, USER_ROLES.ADMIN);
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
    middleware: 'admin',
    layout: 'admin-layout',
})
</script>

<style scoped>
@import url("~/assets/css/admin/index.css");
</style>