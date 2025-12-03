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
                <img :src="checkForOldFile(book.cover)" alt="book.title" />
            </div>
            <div class="book-description">
                <h1>{{ book.title }}</h1>
                <p>{{ book.description }}</p>
            </div>
        </div>
        <div class="reaction">
            <button @click="like"><i class='bx  bx-thumb-up'></i> </button>
            <!-- <button @click="disLike"><i class='bx  bx-thumb-down'></i> </button> -->
        </div>
        <div class="tabs">
            <div class="tab" :class="{ active: tab === TABS.CHAPTERS }" @click="tab = TABS.CHAPTERS">Chapters {{
                tabData.chapters }}</div>
            <div class="tab" v-if="false" :class="{ active: tab === TABS.COMMENTS }" @click="tab = TABS.COMMENTS">
                Comments {{
                    book?.meta.comments }}</div>
        </div>
        <div class="tabPage">
            <div v-if="tab === TABS.CHAPTERS">
                <div class="chapters" v-if="chapters.chapters">
                    <UiAppChapter v-for="(chapter, index) in chapters.chapters" :key="index" :chapter="chapter"
                        :loading="loadingChapter === chapter.id" @play="playReadChapter(chapter)" />
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
import { getBook, getChapters, likeBook, disLikeBook } from '~/services/book';

enum TABS {
    CHAPTERS,
    COMMENTS
}

const tab = ref<TABS>(TABS.CHAPTERS)
const tabData = ref<{ chapters: number, comments: number }>({ chapters: 0, comments: 0 })
const book = useState<BOOK | null>('appBook')
const chapters = ref<{ chapters: CHAPTER[] | null, loading: boolean }>({ chapters: null, loading: false })
const loading = ref<boolean>(false);
const loadingChapter = ref('')

const id = useRoute().params.id as string

const { checkForOldFile } = useUtils()
const store = useAuthStore();
const { init, initPDF, playAudio, stopAudio, fetchChapter, loading: playerLoading, player } = usePlayer(USER_ROLES.USER)

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

const like = async () => {
    await likeBook(id);
}
const playReadChapter = async (chapter: CHAPTER) => {
    try {
        console.log('Playing chapter:', chapter);
        if (!chapter) throw new Error('No chapter provided');
        const playerEle = document.getElementById('player')
        if (store.getPlaying.id !== chapter.id || !player.value) {
            store.setPlaying(chapter);
            stopAudio()
            const { data } = await fetchChapter(chapter.id ?? '');
            if (data) {
                if (data.chapter.type === 'ebook') {
                    initPDF(data)
                }
                else {
                    await init(data)
                    playAudio()
                }
            }
        }
        if (playerEle) {
            // trigger hover or click automatically
            playerEle.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            playerEle.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            playerEle.click();
        }
    }
    catch (err) {
        console.error('Error playing chapter:', err);
    }

}


onMounted(() => {
    if (!id) navigateTo('/app/')
    Promise.all([fetchChapters(), fetchBook()]);
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
    margin-bottom: 30%;
    gap: 20px;
}

.book {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: inherit;
    height: 50vh;
    background-color: rgb(231, 231, 231);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    transition-duration: 1s ease-in-out;

}

.reaction {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.reaction button {
    background-color: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.reaction button:hover {
    color: #454343;
    scale: 1.5;
    transition-duration: 5s ease-in-out;
}

.book-image {
    width: inherit;
    height: 70%;
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

.tabs .chapters {
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: scroll;
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
    .page {
        margin-bottom: unset;
    }

    .book {
        flex-direction: row;
        height: 20rem;
    }

    .book-image {
        width: 30rem;
        height: inherit;

    }

    .book-description {
        width: 100%;
        height: 100%;
    }

    .tabPage {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 10px;
        padding: 10px;
        box-sizing: border-box;
    }
}
</style>