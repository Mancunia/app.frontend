<template>
    <section v-if="chapter?.id" class="player">
        <div class="controls">
            <div class="details">
                <img :src="checkForOldFile(chapter.book.cover)" alt="">
                <div class="chapter">
                    <p class="typography">{{ chapter.title }}</p>
                    <p class="typography1">{{ chapter.book.title }}</p>
                </div>
            </div>
            <div class="media_controls">
                <button>
                    <img class="controls-book-chapter-btns-img" src="@/assets/images/Component 29.png" alt=""
                        >
                </button>
                <button @click="rewindAudio(10)">
                    <img class="controls-book-chapter-btns-img" src="@/assets/images/player/backward.png" alt=""
                        >
                </button>
                <button @click="toggleAudio">
                    <img v-if="store.getPlayer.playing" class="controls-book-chapter-btns-img" 
                        src="@/assets/images/player/pause1.png" alt="">
                    <img v-else class="controls-book-chapter-btns-img" src="@/assets/images/player/play.svg"  alt="">
                </button>
                <button @click="fastForwardAudio(10)">
                    <img class="controls-book-chapter-btns-img" src="@/assets/images/player/forward.png" alt=""
                        >
                </button>
                <button>
                    <img class="controls-book-chapter-btns-img" src="@/assets/images/Component 28.png" alt="" >
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
const { toggleAudio, pauseAudio, setVolume, fastForwardAudio, rewindAudio } = usePlayer(store.getPlaying.id, USER_ROLES.ADMIN)


const getChapter = async () => {
    try {
        if (!chapter.value?.id) return
        stop()
        loading.value = true
        const { data } = await playChapter(chapter.value?.id ?? '', USER_ROLES.ADMIN)
        if (data) {
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
    background-color: #4D2316;
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
    gap: 5px;
    color: whitesmoke;
    overflow-x: scroll;
    font-size: 10px;
}

.controls .media_controls {
    width: 40%;
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
    align-items: center;
    margin: 5%
}

.controls .media_controls button {
    background: none;
    border: none;
    cursor: pointer;
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
    background-color: #4D2316;
    color: rgb(173, 38, 38);
    cursor: pointer;
}
.controls img {
    width: 30px;
    height: 30px;
}
</style>