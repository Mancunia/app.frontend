<template>
    <div v-if="chapters.loading" class="chapter-content">
        <div class="cards-container-box">
            <AdminChaptersLoadersChapter />
            <AdminChaptersLoadersChapter />
            <AdminChaptersLoadersChapter />
            <AdminChaptersLoadersChapter />
        </div>
    </div>
    <div v-else class="chapter-content">
        <div v-if="chapters.data" class="cards-container-box">
            <AdminChaptersChapter v-for="(chapter, index) in chapters.data" :key="index" :chapter="chapter" />
        </div>
        <div v-else>
            <h1>No chapters found</h1>
        </div>
    </div>

    <button v-if="chapters.data" class="add-chapter" @click="openModal">Add Chapter</button>



    <CommonModal v-model="isModalOpen">
        <AdminChaptersForm :bookId="bookId" @done="fetchChapters" />
    </CommonModal>
</template>

<script setup lang="ts">
import { getChapters } from '~/services/book';
import type { CHAPTER } from '~/types/book';
const route = useRoute();
const chapters = ref<{ data: CHAPTER[] | null, loading: boolean }>({ data: null, loading: false });



const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();

const bookId = computed(() => route.query.bookId as string);

const fetchChapters = async () => {
    if (!bookId.value) {
        chapters.value.data = null;
        return
    };
    try {
        chapters.value.loading = true;
        const { data } = await getChapters(bookId.value,USER_ROLES.ADMIN);
        if (data) {
            chapters.value.data = data;
        }
    } finally {
        chapters.value.loading = false;
    }
}

watchEffect(() => {
    fetchChapters();
});
</script>

<style scoped>
.add-chapter {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    padding: 2%;
    width: 95%;
    border: 0px;
    background-color: #00000023;
    border-radius: 10px;
    transition: 0.5s ease-in-out;
}

.add-chapter:hover {
    background-color: #fff;
    box-shadow: inset -1px 1px 2px 0px #000000;
}
</style>
