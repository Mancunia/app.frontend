<template>
    <div class="player">
        <div class="rectangleParent">
            <div class="book-art">
                <img :src="store.getPlaying.book.cover" alt="book art" />
            </div>
            <div class="controls">
                <div class="player-item">
                    <button>
                        <img src="@/assets/images/player/previous.png" alt="previous button" />
                    </button>
                    <button @click="rewindAudio(5)">
                        <img src="@/assets/images/player/backward.png" alt="backward button" />
                    </button>

                    <div class="play-button">
                        <button @click="toggleAudio">
                            <img v-if="store.getPlayer.playing" src="@/assets/images/player/pause.png"
                                alt="forward button" />
                            <img v-else src="@/assets/images/player/backward.png" alt="backward button" />
                        </button>
                    </div>

                    <button @click="fastForwardAudio(5)">
                        <img src="@/assets/images/player/forward.png" alt="play button" />
                    </button>
                    <button>
                        <img src="@/assets/images/player/next.png" alt="forward button" />
                    </button>
                    <button
                        @click="playerDetails({ showDetails: !store.getPlayer.showDetails, playing: store.getPlayer.playing })">
                        <img src="@/assets/images/player/playlist.png" alt="forward button" />
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
const showControls = ref(false)
const store = useAuthStore()

const chapter = computed(() =>
    store.getPlaying
)

const { toggleAudio, stopAudio, setVolume, muteAudio, unmuteAudio, fastForwardAudio, rewindAudio, playerDetails } = usePlayer()


const getChapter = async () => {
    try {
        const res = await playChapter(chapter.value.id)
    } finally {
        console.log('done')
    }
}




onMounted(() => {
    getChapter()
    if (store.getPlayer.playing) {
        toggleAudio()
    }

    onBeforeUnmount(() => {

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
    width: 10%;
    height: 100%;
}

.book-art {
    width: 43px;
    height: 41px;
    flex-shrink: 0;
    background: lightgray 50% / cover no-repeat;
    box-shadow: 3px 4px 8.8px 0px rgba(0, 0, 0, 0.25);
}

.book-art img {
    width: 100%;
    height: 100%;
    border-radius: 20%;
    object-fit: cover;
}

/* book details */

/* player */
.rectangleParent {
    display: flex;
    flex-direction: row;
    gap: 10%;
    align-items: center;
    margin-left: 5%;
    width: 351px;
    height: 59px;
    border-radius: 19px;
    background: #4D2316;
    padding: 5px 10px;
    transition: 0.5s ease-in-out;
    transform: translateX(85%)
}

.rectangleParent:hover {
    transform: translateX(0%)
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
    padding: 0px 0px;
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

    .player-item>button:hover {
        border-bottom: 2px solid #F1EEE3;
        cursor: pointer;
    }

    .rectangleParent {
        transform: translateX(0%)
    }

}
</style>