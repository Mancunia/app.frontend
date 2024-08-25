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
</template>

<script setup lang="ts">
import { getChapters } from '~/services/book';
import type { CHAPTER } from '~/types/book';
const route = useRoute();
const chapters = ref<{ data: CHAPTER[] | null, loading: boolean }>({ data: null, loading: false });

const bookId = computed(() => route.query.bookId as string);
const fetchChapters = async () => {
    if (!bookId.value) {
        chapters.value.data = null;
        return
    };
    try {
        chapters.value.loading = true;
        const { data } = await getChapters(bookId.value);
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
