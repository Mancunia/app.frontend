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

const chapter = computed(() =>
    store.getPlaying
)

const { toggleAudio, pauseAudio, stopAudio, setVolume, muteAudio, unmuteAudio, fastForwardAudio, rewindAudio } = usePlayer()

const getChapter = async () => {
    try {
    if(!chapter.value?.id) return
        const res = await playChapter(chapter.value.id)
        console.log(res)
    } finally {
        console.log('done')
    }
}


onMounted(() => {
    getChapter()
    onBeforeUnmount(() => {
      
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