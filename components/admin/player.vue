<template>
    <section v-if="chapter?.id" class="player">
        <div class="controls">
            <div class="details">
                <img :src="checkForOldFile(chapter.book?.cover)" alt="">
                <div class="chapter">
                    <p class="typography">{{ chapter.title }}</p>
                    <p class="typography1">{{ chapter.book?.title }}</p>
                    <p class="typography2">By {{ chapter.book?.authors?.map(a => typeof a === 'string' ? a : a.name).join(', ') }}</p>
                    <p class="typography2">Narrated by {{ chapter.book?.narrators?.map(n => typeof n === 'string' ? n : n.name).join(', ') }}</p>
                </div>
            </div>
            <div class="media_controls">
                <button :disabled="!hasPrev" @click="playPrevInQueue">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ctrl-icon">
                      <path d="M15 18l-6-6 6-6"></path>
                    </svg>
                </button>
                <button @click="rewindAudio(10)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ctrl-icon">
                      <path d="M11 17l-5-5 5-5"></path>
                      <path d="M18 17l-5-5 5-5"></path>
                    </svg>
                </button>
                <button @click="toggleAudio">
                    <svg v-if="store.getPlayer.playing" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" class="ctrl-icon">
                      <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                      <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                    </svg>
                    <svg v-else width="30" height="30" viewBox="0 0 24 24" fill="currentColor" class="ctrl-icon">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                </button>
                <button @click="fastForwardAudio(10)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ctrl-icon">
                      <path d="M13 17l5-5-5-5"></path>
                      <path d="M6 17l5-5-5-5"></path>
                    </svg>
                </button>
                <button :disabled="!hasNext" @click="playNextInQueue">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ctrl-icon">
                      <path d="M9 18l6-6-6-6"></path>
                    </svg>
                </button>

            </div>

            <div class="extra">
                <input type="range" v-model="volume">

                <img src="@/assets/images/player/playlist.png" class="book-image">
            </div>
        </div>
    </section>

</template>

<script setup lang="ts">
import { playChapter } from '~/services/play';
import type { CHAPTER } from '~/types/book'
const store = useAuthStore()
const volume = ref(store.getPlayer.volume ?? 50)
const currentTime = ref(0)
const duration = ref(0)
const loading = ref(false)

const chapter = computed<CHAPTER | null>(() => {
    return store.getPlaying || null
})

const ended = computed(() => currentTime.value === duration.value)

const { checkForOldFile } = useUtils()
const {
    toggleAudio, pauseAudio, setVolume, fastForwardAudio, rewindAudio,
    hasNext, hasPrev, playNextInQueue, playPrevInQueue
} = usePlayer(store.getPlaying.id, USER_ROLES.ADMIN)


const getChapter = async () => {
    try {
        if (!chapter.value?.id) return
        stop()
        loading.value = true
        const { data } = await playChapter(chapter.value?.id ?? '', USER_ROLES.ADMIN)
        if (data) {
            store.setPlaying(data.chapter)
            store.setPlayer({
                ...data,
                playing: true,
                volume: volume.value
            })
        }

    } finally {
        loading.value = false
    }
}

watchEffect(() => {
    setVolume(volume.value)
})

watch(() => chapter, () => {
    getChapter()
}, {
    immediate: true
})

</script>

<style scoped>
.player {
    width: 100%;
    height: 5%;
    position: relative;
    padding: 5px;
    border-radius: 50px;
    background-color: var(--kola);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.controls {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    /* align-items: center; */
    /* padding: 0 20px; */
}

.controls .details {
    width: 30%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
}

.controls .details img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.controls .details .chapter {
    display: flex;
    flex-direction: column;
    gap: 2px;
    color: var(--cream);
    overflow: hidden;
    font-size: 10px;
}

.typography { font-weight: bold; margin: 0; }
.typography1 { opacity: 0.8; margin: 0; }
.typography2 { font-style: italic; opacity: 0.6; margin: 0; }

.controls .media_controls {
    width: 40%;
    display: flex;
    flex-direction: row;
    gap: 15px;
    justify-content: center;
    align-items: center;
    margin: 0;
}

.controls .media_controls button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
}

.controls .media_controls button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.ctrl-icon {
    transition: transform 0.1s;
}

.ctrl-icon:active {
    transform: scale(0.9);
}

.controls .extra {
    width: 30%;
    display: flex;
    flex-direction: row;
    gap: 20%;
    justify-content: center;
    align-items: center;
}

.controls .extra input[type="range"] {
    width: 100%;
    height: 10px;
    border-radius: 10px;
    background-color: var(--kola);
    cursor: pointer;
}
.controls img {
    width: 30px;
    height: 30px;
}
</style>