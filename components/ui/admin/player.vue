<template>
    <div class="player">
        
    </div>
</template>

<script setup lang="ts">
import { playChapter } from '~/services/play';
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

const chapter = computed(() =>
    store.getPlaying
)
const player = ref<HTMLAudioElement | null>(null)

const ended = computed(() => currentTime.value === duration.value)

const { toggleAudio, pauseAudio, stopAudio, setVolume, muteAudio, unmuteAudio, fastForwardAudio, rewindAudio, playerProps } = usePlayer()
const play = () => {
    console.log('play', props.file)
    if (player.value) {
        toggleAudio(player.value)
    }
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
        const res = await playChapter(chapter.value._id)
        console.log(res)
    } finally {
        console.log('done')
    }
}


onMounted(() => {
    getChapter()
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


<style scoped>
.player {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 1083px;
    height: 83px;
    margin-top: 20px;
    flex-shrink: 0;
    border-radius: 16px;
    background: #6E4C29;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}
</style>