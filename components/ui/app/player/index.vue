<template>
    <h1>{{ ended }}-{{ (currentTime/60).toFixed(2) }}/{{ (duration/60).toFixed(2) }}mins</h1>
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
                        <img v-if="playerProps.playing" src="@/assets/images/player/pause.png" alt="forward button" />
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
</template>
<script setup lang="ts">
import sound from '@/assets/test-audio.mp3'
const props = defineProps({
    file: {
        type: String,
        required: true,
        default: '~/assets/test-audio.mp3'
    }
})
const seekTo = ref(5)
const currentTime = ref(0)
const duration = ref(0)
const player = document.createElement('audio')
player.src = sound

const ended = computed(() => currentTime.value === duration.value)

const { toggleAudio, pauseAudio, stopAudio, setVolume, muteAudio, unmuteAudio,fastForwardAudio,rewindAudio, playerProps } = usePlayer()
const play = () => {
    console.log('play', props.file)
    toggleAudio(player)
}
const fastForward = () => {
    fastForwardAudio(player, seekTo.value)
}
const rewind = () => {
    rewindAudio(player, seekTo.value)
}


player.addEventListener('loadedmetadata', () => {
    duration.value = player.duration
})

player.addEventListener('timeupdate', () => {
    currentTime.value = player.currentTime
})
onBeforeUnmount(() => {
    player.removeEventListener('loadedmetadata', () => {
        duration.value = player.duration
    })
    player.removeEventListener('timeupdate', () => {
        currentTime.value = player.currentTime
    })
    document.body.removeChild(player)
})
</script>
<style scoped>
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

.controls {
    display: flex;
    gap: 30%;
    width: 100%;

}

.book-art {
    width: 43px;
    height: 41px;
    flex-shrink: 0;
    border-radius: 8px;
    background: lightgray 50% / cover no-repeat;
    box-shadow: 3px 4px 8.8px 0px rgba(0, 0, 0, 0.25);
}

.player-item {
    display: flex;
    flex-direction: row;
    position: relative;
    gap: 10px;
    /* width: 10px;
    height: 59px; */
    flex-shrink: 0;
}

.player-item button {
    background: none;
    border: none;
    outline: none;
    box-shadow: none;

}

.play-button {
    flex-shrink: 0;
    background-color: #F1EEE3;
    border-radius: 50%;
    align-content: center;
    padding: 5%;
}
</style>