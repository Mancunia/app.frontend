<template>
  <div class="book-page">
    <!-- Loading skeleton -->
    <div v-if="loading">
      <UiSkeletonLoader width="100%" height="260px" />
      <div class="skeleton-wrap">
        <UiSkeletonLoader width="60%" height="28px" />
        <UiSkeletonLoader width="40%" height="20px" />
      </div>
    </div>

    <!-- Book hero -->
    <div v-else-if="book" class="hero-wrap">
      <img :src="checkForOldFile(book.cover)" class="hero-img" :alt="book.title" />
      <div class="hero-overlay"></div>
    </div>

    <!-- Meta strip -->
    <div v-if="book && !loading" class="meta-strip">
      <h1 class="meta-title">{{ book.title }}</h1>
      <p class="meta-author">{{ book.authors?.join(', ') }}</p>
      <div class="meta-chips">
        <span class="chip" v-if="book.language">{{ book.language }}</span>
        <span class="chip">{{ book.meta?.views ?? 0 }} views</span>
      </div>
    </div>

    <!-- Synopsis -->
    <div v-if="book && !loading" class="synopsis">
      <p class="synopsis-text" :class="{ clamped: !synopsisExpanded }">{{ book.description }}</p>
      <button class="synopsis-toggle" @click="synopsisExpanded = !synopsisExpanded">
        {{ synopsisExpanded ? 'Read less' : 'Read more' }}
      </button>
    </div>

    <!-- Reaction -->
    <div class="reaction">
      <button class="like-btn" @click="like">👍 Like</button>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab" :class="{ active: tab === TABS.CHAPTERS }" @click="tab = TABS.CHAPTERS">
        Chapters {{ tabData.chapters }}
      </button>
    </div>

    <!-- Chapter list -->
    <div class="tab-content">
      <div v-if="tab === TABS.CHAPTERS && chapters.chapters">
        <UiAppChapter
          v-for="(chapter, index) in chapters.chapters"
          :key="index"
          :chapter="chapter"
          :loading="loadingChapter === chapter.id"
          @play="playReadChapter(chapter)"
        />
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
const synopsisExpanded = ref(false)

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
        if (!chapter) throw new Error('No chapter provided');
        await store.clearPageAndSeek();
        const playerEle = document.getElementById('player')
        if (store.getPlaying.id !== chapter.id || !player.value) {
            store.setPlaying(chapter);
            stopAudio()
            const { data } = await fetchChapter(chapter.id ?? '');
            if (data) {
                if (data.chapter.type === 'ebook') {
                    if (data.chapter.id !== store.getPlaying.id) {
                        await store.setPlayingPage(1);
                    }
                    await initPDF(data)
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
.book-page { display: flex; flex-direction: column; padding-bottom: var(--d-pad); }
.skeleton-wrap { padding: var(--d-pad); }
.hero-wrap { position: relative; width: 100%; }
.hero-img { width: 100%; max-height: 260px; object-fit: cover; border-radius: var(--d-radius) var(--d-radius) 0 0; display: block; }
.hero-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(to top, var(--paper), transparent); }
.meta-strip { padding: 16px var(--d-pad) 8px; }
.meta-title { font-family: var(--font-serif); font-weight: 600; font-size: 1.4rem; color: var(--ink); margin: 0 0 4px; }
.meta-author { font-family: var(--font-serif); font-style: italic; color: var(--muted); margin: 0 0 10px; }
.meta-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { background: var(--calabash); color: var(--ink); font-family: var(--font-mono); font-size: 0.7rem; border-radius: 999px; padding: 2px 8px; }
.synopsis { padding: 0 var(--d-pad) 8px; }
.synopsis-text { font-family: var(--font-serif); line-height: 1.7; color: var(--ink); margin: 0 0 6px; }
.synopsis-text.clamped { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.synopsis-toggle { background: none; border: none; color: var(--kola); font-family: var(--font-sans); font-size: 0.85rem; cursor: pointer; padding: 0; }
.reaction { padding: 0 var(--d-pad) 8px; }
.like-btn { background: var(--calabash); border: 1px solid var(--hairline); border-radius: 999px; font-family: var(--font-sans); color: var(--muted); padding: 6px 16px; cursor: pointer; }
.like-btn:hover { background: var(--ochre); color: var(--ink); }
.tabs { display: flex; border-bottom: 1px solid var(--hairline); padding: 0 var(--d-pad); }
.tab { background: none; border: none; border-bottom: 2px solid transparent; color: var(--muted); font-family: var(--font-display); font-size: 0.85rem; padding: 8px 14px; cursor: pointer; margin-bottom: -1px; }
.tab.active { color: var(--kola); border-bottom-color: var(--kola); }
.tab-content { padding: var(--d-pad); }
</style>
