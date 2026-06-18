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
      <p class="meta-author">{{ book.authors?.map(a => typeof a === 'string' ? a : a.name).join(', ') }}</p>
      <p v-if="book.narrators?.length" class="meta-narrator">Narrated by: {{ book.narrators.map(n => typeof n === 'string' ? n : n.name).join(', ') }}</p>
      <div class="meta-chips">
        <span class="chip" v-for="g in resolvedGenres" :key="g" v-if="resolvedGenres.length">{{ g }}</span>
        <span class="chip" v-if="resolvedLanguages">{{ resolvedLanguages }}</span>
        <span class="chip" v-if="book.edition">{{ book.edition }}</span>
        <span class="chip" v-if="book.publishedYear">{{ book.publishedYear }}</span>
        <span class="chip" v-if="book.duration">{{ book.duration }}</span>
        <span class="chip">{{ book.meta?.views ?? 0 }} views</span>
      </div>
    </div>

    <!-- Synopsis -->
    <div v-if="book && !loading" class="synopsis">
      <div class="synopsis-content" :class="{ clamped: !synopsisExpanded }">
        <div class="synopsis-text" v-html="book.description"></div>
        <div v-if="!synopsisExpanded" class="synopsis-fade"></div>
      </div>
      <button class="synopsis-toggle" @click="synopsisExpanded = !synopsisExpanded">
        {{ synopsisExpanded ? 'Read less' : 'Read more' }}
      </button>
    </div>

    <!-- Access CTA -->
    <div v-if="book && !loading && !hasAccess" class="access-cta">
      <div class="access-lock">
        <span class="lock-icon">🔒</span>
        <h3 class="lock-title">Limited Access</h3>
        <p class="lock-msg">This book is not included in your current plan.</p>
        <button class="upgrade-btn" @click="navigateTo('/app/subscription')">Upgrade Plan</button>
      </div>
    </div>

    <!-- Reaction -->
    <div v-if="hasAccess" class="reaction">
      <button class="like-btn" @click="like">👍 Like</button>
    </div>

  

    <!-- Tabs -->
    <div v-if="hasAccess" class="tabs">
      <button class="tab" :class="{ active: tab === TABS.CHAPTERS }" @click="tab = TABS.CHAPTERS">
        Chapters {{ tabData.chapters }}
      </button>
      <button class="tab" :class="{ active: tab === TABS.COMMENTS }" @click="tab = TABS.COMMENTS">
        Comments
      </button>
    </div>

    <!-- Chapter list -->
    <div v-if="hasAccess" class="tab-content">
      <div v-if="tab === TABS.CHAPTERS && chapters.chapters">
        <div class="play-all-row">
          <button class="play-all-btn" @click="playAllChapters">▶ Play All Audio Chapters</button>
        </div>
        <UiAppChapter
          v-for="(chapter, index) in chapters.chapters"
          :key="index"
          :chapter="chapter"
          :loading="loadingChapter === chapter.id"
          @play="playReadChapter(chapter)"
          @add-to-queue="store.addToQueue({ chapter })"
        />
      </div>

      <div v-if="tab === TABS.COMMENTS">
        <AppComments :id="id" />
      </div>
    </div>
      <!-- More by this author -->
    <div v-if="moreByAuthor.length" class="more-row">
      <h3 class="more-heading">More by this author</h3>
      <div class="more-scroll">
        <UiAppBook v-for="b in moreByAuthor" :key="b.id" :book="b" />
      </div>
    </div>

    <!-- More by this narrator -->
    <div v-if="moreByNarrator.length" class="more-row">
      <h3 class="more-heading">More by this narrator</h3>
      <div class="more-scroll">
        <UiAppBook v-for="b in moreByNarrator" :key="b.id" :book="b" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BOOK, CHAPTER, QUEUE_ITEM } from '~/types/book';
import { getBook, getChapters, likeBook, disLikeBook, filterBooks } from '~/services/book';
import routes from '~/routes';

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
const moreByAuthor = ref<BOOK[]>([])
const moreByNarrator = ref<BOOK[]>([])

const id = useRoute().params.id as string

const { checkForOldFile } = useUtils()
const store = useAuthStore();
const { languages, genres, setCommon } = useCommon(USER_ROLES.USER)

const resolvedGenres = computed(() => {
    if (!book.value?.genres?.length) return []
    const genreMap = new Map(genres.value.map(g => [g.id, g]))
    return book.value.genres.map((g: any) => {
        const id = typeof g === 'string' ? g : g.id || (g as any)._id
        const resolved = genreMap.get(id)
        return resolved?.name || resolved?.title || id
    })
})

const resolvedLanguages = computed(() => {
    if (!book.value?.languages?.length) return ''
    const langMap = new Map(languages.value.map(l => [l.id, l]))
    return book.value.languages.map((l: any) => {
        const id = typeof l === 'string' ? l : l.id || (l as any)._id
        const resolved = langMap.get(id)
        return resolved?.name || id
    }).join(', ')
})

const { init, initPDF, playAudio, stopAudio, fetchChapter, loading: playerLoading, player } = usePlayer(USER_ROLES.USER)

const hasAccess = computed(() => {
    if (!book.value) return true
    const user = store.getUser
    if (!user || !user.subscription || !user.subscription.active) return false

    if (user.subscription.books && user.subscription.books.length > 0) {
        return user.subscription.books.includes(id)
    }

    return true
})

const fetchMoreByAuthor = async () => {
    if (!book.value?.authors?.length) return
    const authorId = typeof book.value.authors[0] === 'string' ? book.value.authors[0] : book.value.authors[0].id
    try {
        const res = await filterBooks({ author: authorId, limit: 10 }, USER_ROLES.USER) as any
        if (res) {
            const results = Array.isArray(res) ? res : (res.data?.data ?? res.data ?? res.results ?? [])
            moreByAuthor.value = results.filter((b: BOOK) => b.id !== id)
        }
    } catch {}
}

const fetchMoreByNarrator = async () => {
    if (!book.value?.narrators?.length) return
    const narratorId = typeof book.value.narrators[0] === 'string' ? book.value.narrators[0] : book.value.narrators[0].id
    try {
        const res = await filterBooks({ narrator: narratorId, limit: 10 }, USER_ROLES.USER) as any
        if (res) {
            const results = Array.isArray(res) ? res : (res.data?.data ?? res.data ?? res.results ?? [])
            moreByNarrator.value = results.filter((b: BOOK) => b.id !== id)
        }
    } catch {}
}

const fetchBook = async () => {
    try {
        loading.value = true;
        const res = await getBook(id);
        if (res) {
            book.value = res
        }
    } finally {
        loading.value = false;
    }
}
const fetchChapters = async () => {
    try {
        chapters.value.loading = true;
        const res = await getChapters(id);
        if (res) {
            chapters.value.chapters = res
            tabData.value.chapters = res.length
        }
    } finally {
        chapters.value.loading = false;
    }
}

const like = async () => {
    await likeBook(id);
}
const buildQueueFromChapters = (fromChapterId?: string): QUEUE_ITEM[] => {
    const all = chapters.value.chapters ?? []
    const audioChapters = all.filter(c => c.type === 'audio')
    if (!fromChapterId) return audioChapters.map(c => ({ chapter: c }))
    const startIdx = audioChapters.findIndex(c => c.id === fromChapterId)
    if (startIdx === -1) return audioChapters.map(c => ({ chapter: c }))
    return [
        ...audioChapters.slice(startIdx).map(c => ({ chapter: c })),
        ...audioChapters.slice(0, startIdx).map(c => ({ chapter: c })),
    ]
}

const playAllChapters = async () => {
    const audioChapters = buildQueueFromChapters()
    if (!audioChapters.length) return
    store.setQueue(audioChapters)
    store.setQueueIndex(0)
    await playReadChapter(audioChapters[0].chapter)
}

const playReadChapter = async (chapter: CHAPTER) => {
    try {
        if (!chapter) throw new Error('No chapter provided');
        await store.clearPageAndSeek();
        const playerEle = document.getElementById('player')
        if (store.getPlaying.id !== chapter.id || !player.value) {
            const q = buildQueueFromChapters(chapter.id)
            store.setQueue(q)
            store.setQueueIndex(0)
            store.setPlaying(chapter);
            await stopAudio()
            const res = await fetchChapter(chapter.id ?? '');
            if (res) {
                if (res.chapter.type === 'ebook') {
                    if (res.chapter.id !== store.getPlaying.id) {
                        await store.setPlayingPage(1);
                    }
                    await initPDF(res)
                }
                else {
                    await init(res)
                }
            }
        }
        if (playerEle) {
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
    Promise.all([fetchChapters(), fetchBook(), setCommon()]).then(() => {
        fetchMoreByAuthor()
        fetchMoreByNarrator()
    })
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
.meta-author { font-family: var(--font-serif); font-style: italic; color: var(--muted); margin: 0 0 4px; font-size: 0.9rem; }
.meta-narrator { font-family: var(--font-sans); font-size: 0.8rem; color: var(--ochre); margin: 0 0 10px; }
.meta-link { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
.meta-link:hover { opacity: 0.7; }
.meta-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { background: var(--calabash); color: var(--ink); font-family: var(--font-mono); font-size: 0.7rem; border-radius: 999px; padding: 2px 8px; }
.synopsis { padding: 0 var(--d-pad) 8px; position: relative; }
.synopsis-content { position: relative; }
.synopsis-content.clamped { max-height: 120px; overflow: hidden; }
.synopsis-fade { position: absolute; bottom: 0; left: 0; right: 0; height: 48px; background: linear-gradient(to top, var(--paper), transparent); pointer-events: none; }
.synopsis-text { font-family: var(--font-serif); line-height: 1.7; color: var(--ink); margin: 0 0 6px; }
.synopsis-text :deep(p) { margin: 0 0 0.6em; }
.synopsis-text :deep(h1),
.synopsis-text :deep(h2),
.synopsis-text :deep(h3) { font-family: var(--font-display); margin: 1em 0 0.4em; color: var(--ink); }
.synopsis-text :deep(ul),
.synopsis-text :deep(ol) { padding-left: 1.5em; margin: 0 0 0.6em; }
.synopsis-text :deep(li) { margin-bottom: 0.3em; }
.synopsis-text :deep(blockquote) { border-left: 3px solid var(--ochre); padding-left: 1em; margin: 0 0 0.6em; color: var(--muted); font-style: italic; }
.synopsis-text :deep(strong) { font-weight: 700; }
.synopsis-text :deep(em) { font-style: italic; }
.synopsis-toggle { background: none; border: none; color: var(--kola); font-family: var(--font-sans); font-size: 0.85rem; cursor: pointer; padding: 0; margin-top: 4px; }
.access-cta { padding: 0 var(--d-pad) 24px; }
.access-lock { background: var(--card); border: 1px solid var(--hairline); border-radius: var(--d-radius); padding: 32px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; box-shadow: 0 4px 20px var(--hairline); }
.lock-icon { font-size: 2rem; }
.lock-title { font-family: var(--font-display); font-size: 1.1rem; color: var(--ink); margin: 0; }
.lock-msg { font-family: var(--font-sans); font-size: 0.9rem; color: var(--muted); margin: 0; }
.upgrade-btn { background: var(--ochre); color: var(--cream); border: none; border-radius: 999px; padding: 10px 24px; font-family: var(--font-display); font-size: 0.85rem; cursor: pointer; transition: background 0.2s; margin-top: 8px; }
.upgrade-btn:hover { background: var(--kola-2); }
.reaction { padding: 0 var(--d-pad) 8px; }
.like-btn { background: var(--calabash); border: 1px solid var(--hairline); border-radius: 999px; font-family: var(--font-sans); color: var(--muted); padding: 6px 16px; cursor: pointer; }
.like-btn:hover { background: var(--ochre); color: var(--ink); }
.more-row { padding: 8px var(--d-pad); }
.more-heading { font-family: var(--font-display); font-size: 0.95rem; color: var(--ink); margin: 0 0 8px; }
.more-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; -ms-overflow-style: none; }
.more-scroll::-webkit-scrollbar { display: none; }
.more-scroll > * { flex: 0 0 110px; width: 110px; min-width: 0; }
.tabs { display: flex; border-bottom: 1px solid var(--hairline); padding: 0 var(--d-pad); }
.tab { background: none; border: none; border-bottom: 2px solid transparent; color: var(--muted); font-family: var(--font-display); font-size: 0.85rem; padding: 8px 14px; cursor: pointer; margin-bottom: -1px; }
.tab.active { color: var(--kola); border-bottom-color: var(--kola); }
.tab-content { padding: var(--d-pad); }
.play-all-row { padding: 0 0 12px; }
.play-all-btn {
  background: var(--ochre);
  color: var(--cream);
  border: none;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.85rem;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}
.play-all-btn:hover { background: var(--kola-2); }
</style>
