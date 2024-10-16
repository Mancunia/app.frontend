<template>
    <div class="page">
        <div v-if="loading" class="book">
            <div class="book-image">
                <UiSkeletonLoader width="100%" height="200px" />
            </div>
            <div class="book-description">
                <UiSkeletonLoader width="100%" height="50px" />
                <UiSkeletonLoader width="100%" height="50px" />
            </div>
        </div>
        <div v-else-if="book" class="book">
            <div class="book-image">
                <img :src="book.cover" alt="book.title" />
            </div>
            <div class="book-description">
                <h1>{{ book.title }}</h1>
                <p>{{ book.description }}</p>
            </div>
        </div>
        <div class="tabs">
            <div class="tab" :class="{ active: tab === TABS.CHAPTERS }" @click="tab = TABS.CHAPTERS">Chapters {{
                tabData.chapters }}</div>
            <div class="tab" :class="{ active: tab === TABS.COMMENTS }" @click="tab = TABS.COMMENTS">Comments {{
                tabData.comments }}</div>
        </div>
        <div class="tabPage">
            <div v-if="tab === TABS.CHAPTERS">
                <div v-if="chapters.chapters">
                    <UiAppChapter v-for="(chapter, index) in chapters.chapters" :key="index" :chapter="chapter">
                    </UiAppChapter>
                </div>

            </div>
            <div v-else-if="tab === TABS.COMMENTS">
                <AppComments :id="id" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BOOK, CHAPTER } from '~/types/book';
import { getBook, getChapters } from '~/services/book';

enum TABS {
    CHAPTERS,
    COMMENTS
}

const tab = ref<TABS>(TABS.CHAPTERS)
const tabData = ref<{ chapters: number, comments: number }>({ chapters: 0, comments: 0 })
const book = useState<BOOK | null>('appBook')
const chapters = ref<{ chapters: CHAPTER[] | null, loading: boolean }>({ chapters: null, loading: false })
const loading = ref<boolean>(false);

const id = useRoute().params.id as string

const fetchBook = async () => {
    try {
        loading.value = true;
        const { data } = await getBook(id);
        if (data) {
            book.value = data
        }
    } finally {
        loading.value = false;
    }
}
const fetchChapters = async () => {
    try {
        chapters.value.loading = true;
        const { data } = await getChapters(id);
        if (data) {
            chapters.value.chapters = data
            tabData.value.chapters = data.length
        }
    } finally {
        chapters.value.loading = false;
    }
}


onMounted(() => {
    if (!id) navigateTo('/app/')
    if (!book.value) {
        fetchBook();
    }
    fetchChapters();

})
definePageMeta({
    title: 'Book',
    middleware: 'app',
    layout: 'app-layout'
})
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2%;
    gap: 20px;
}

.book {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 50vh;
    background-color: rgb(231, 231, 231);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20px;

}

.book-image {
    width: 100%;
    height: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    border-radius: 10px;
}

.book-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.book-description {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 60%;
    padding: 10px;
    overflow: scroll;
}

.tabs {
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    justify-content: center;
}

.tabs .tab {
    padding: 10px;
    border-radius: 10px;
    /* background-color: #f0f0f0; */
    cursor: pointer;
}

.active {
    background-color: #454343;
    color: #fff;
}
@media only screen and (min-width: 750px) {
    .book{
        flex-direction: row;
        height: max-content;
    }
    .book-image{
        width: 100%;
        height: 100%;
    }
    .book-description{
        width: 100%;
        height: 100%;
    }
}
/* .tabPage {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    box-sizing: border-box;
} */</style>