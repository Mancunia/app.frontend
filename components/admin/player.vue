<template>
    <div v-if="chapter?.id" class="controls">
        <div class="controls-book-chapter">
            <img class="controls-book-chapter-img" :src="chapter.book.cover" alt="" srcset="">
            <div class="controls-book-chapter-details">
                <p class="typography">{{ chapter.title }}</p>
                <p class="typography1">{{ chapter.book.authors.join(',') }}</p>
            </div>
        </div>
        <div class="controls-book-chapter-btns">
            <img class="controls-book-chapter-btns-img" src="@/assets/images/Component 29.png" alt="" srcset="">
            <img class="controls-book-chapter-btns-img" src="@/assets/images/forward-10.png" alt="" srcset="">
            <img class="controls-book-chapter-btns-img" src="@/assets/images/player/pause1.png" alt="" srcset="">
            <img class="controls-book-chapter-btns-img" src="@/assets/images/next-10.png" alt="" srcset="">
            <img class="controls-book-chapter-btns-img" src="@/assets/images/Component 28.png" alt="" srcset="">
        </div>

        <div class="slider-container">
            <div class="slider">
                <div class="progress">
                    <div class="circle"></div>
                </div>
            </div>

            <img src="@/assets/images/player/playlist.png" class="book-image">
        </div>
    </div>
</template>

<script setup lang="ts">
import { playChapter } from '~/services/play';
import type { CHAPTER } from '~/types/book'
const props = defineProps({
    file: {
        type: String,
        required: true,
        default: '~/assets/test-audio.mp3'
    }
})
const store = useAuthStore()
const seekTo = ref(5)
const currentTime = ref(0)
const duration = ref(0)

const chapter = computed<CHAPTER | null>(() => {
    return store.getPlaying || null
})
const player = useState<HTMLAudioElement | null>('PLAYING', () => null)

const ended = computed(() => currentTime.value === duration.value)

const { toggleAudio, pauseAudio, stopAudio, setVolume, muteAudio, unmuteAudio, fastForwardAudio, rewindAudio, playerProps } = usePlayer()
const play = () => {
    console.log('play', props.file)
    if (player.value) {
        toggleAudio(player.value)
    }
}
const stop = () => {
    if (player.value)
        stopAudio(player.value)
}
const fastForward = () => {
    if (player.value)
        fastForwardAudio(player.value, seekTo.value)
}
const rewind = () => {
    if (player.value)
        rewindAudio(player.value, seekTo.value)
}

const getChapter = async () => {
    try {
        stop()
        const { data } = await playChapter(chapter.value.id)
        if (data) {
            player.value = new Audio(data.content)
            play()
        }

    } finally {
        console.log('done')
    }
}

watch(() => chapter, () => {
    getChapter()
}, {
    immediate: true
})


onMounted(() => {
    if (player.value) {
        player.value.addEventListener('loadedmetadata', () => {
            if (player.value)
                duration.value = player.value.duration
        })
        player.value.addEventListener('timeupdate', () => {
            if (player.value)
                currentTime.value = player.value.currentTime
        })
    }
    onBeforeUnmount(() => {
        if (player.value) {
            player.value.removeEventListener('loadedmetadata', () => {
                if (player.value)
                    duration.value = player.value.duration
            })
            player.value.removeEventListener('timeupdate', () => {
                if (player.value)
                    currentTime.value = player.value.currentTime
            })
            document.body.removeChild(player.value)
        }
    })
})
</script>