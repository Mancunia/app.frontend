<template>
    <div class="player">


        <div class="rectangleParent">
            <div class="book-art">
                <img src="@/assets/images/player/picture.png" alt="book art" />
            </div>
            <div class="controls">
                <div class="player-item">
                    <button>
                        <img src="@/assets/images/player/previous.png" alt="previous button" />
                    </button>
                    <button @click="rewind">
                        <img src="@/assets/images/player/backward.png" alt="backward button" />
                    </button>

                    <div class="play-button">
                        <button @click="play">
                            <img v-if="playerProps.playing" src="@/assets/images/player/pause.png"
                                alt="forward button" />
                            <img v-else src="@/assets/images/player/backward.png" alt="backward button" />
                        </button>
                    </div>

                    <button @click="fastForward">
                        <img src="@/assets/images/player/forward.png" alt="play button" />
                    </button>
                    <button>
                        <img src="@/assets/images/player/next.png" alt="forward button" />
                    </button>
                </div>
            </div>

        </div>
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
        const res = await playChapter(chapter.value.id)
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
    flex-direction: column;
    gap: 10%;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

/* book details */

/* player */
.rectangleParent {
    display: flex;
    flex-direction: row;
    gap: 10%;
    align-items: center;
    width: 351px;
    height: 59px;
    border-radius: 19px;
    background: #4D2316;
    padding: 5px 10px;
}

.rectangleParent .controls {
    display: flex;
    gap: 30%;
    width: 100%;

}

.rectangleParent .book-art {
    width: 43px;
    height: 41px;
    flex-shrink: 0;
    border-radius: 8px;
    background: lightgray 50% / cover no-repeat;
    box-shadow: 3px 4px 8.8px 0px rgba(0, 0, 0, 0.25);
}

.rectangleParent .player-item {
    display: flex;
    flex-direction: row;
    position: relative;
    gap: 10px;
    /* width: 10px;
    height: 59px; */
    flex-shrink: 0;
}

.rectangleParent .player-item button {
    background: none;
    border: none;
    outline: none;
    box-shadow: none;

}

.rectangleParent .play-button {
    flex-shrink: 0;
    background-color: #F1EEE3;
    border-radius: 50%;
    align-content: center;
    padding: 5%;
}

@media only screen and (min-width: 750px) {
    .bookDetails {
        background: rgba(255, 255, 255, 0.2);
    }
}
</style>