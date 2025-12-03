<template>
    <div>
        {{ secondsToMinutes(currentTime) }} / {{ secondsToMinutes(duration) }}
        <input class="seek" type="range" min="0" :max="duration" :value="currentTime"
            @input="seekAudio(Number(($event.target as HTMLInputElement).value))" />

        <div v-if="store.getPlaying.book" class="player">
            <div class="rectangleParent">
                <div class="book-art">
                    <img :src="checkForOldFile(store.getPlaying.book?.cover)" alt="book art" />
                </div>

                <div class="controls">
                    <div class="player-item">
                        <button disabled>
                            <img src="@/assets/images/player/previous.png" alt="previous button" />
                        </button>

                        <button @click="rewindAudio(5)">
                            <img src="@/assets/images/player/backward.png" alt="backward button" />
                        </button>

                        <div class="play-button">
                            <button @click="toggleAudio">
                                <img v-if="store.getPlayer.playing" src="@/assets/images/player/pause.png"
                                    alt="pause" />
                                <img v-else src="@/assets/images/player/play.svg" alt="play" width="25" height="25" />
                            </button>
                        </div>

                        <button @click="fastForwardAudio(5)">
                            <img src="@/assets/images/player/forward.png" alt="forward" />
                        </button>

                        <button disabled>
                            <img src="@/assets/images/player/next.png" alt="next button" />
                        </button>

                        <button disabled
                            @click="playerDetails({ showDetails: !store.getPlayer.showDetails, playing: store.getPlayer.playing })">
                            <img src="@/assets/images/player/playlist.png" alt="playlist" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { playChapter } from '~/services/play'

const store = useAuthStore()
const { checkForOldFile,secondsToMinutes } = useUtils()

const chapter = computed(() => store.getPlaying)

const {
    toggleAudio,
    stopAudio,
    setVolume,
    muteAudio,
    unmuteAudio,
    duration,
    currentTime,
    fastForwardAudio,
    rewindAudio,
    seekAudio,
    playerDetails,
    init
} = usePlayer(USER_ROLES.USER)

const getChapter = async () => {
    const c = chapter.value
    if (!c?.id) return
    const res = await playChapter(c.id)
    if (res) await init(res)
}

onMounted(async () => {
    await getChapter()
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
.seek{
    width:90%;
}



/* player */
.rectangleParent {
    display: flex;
    flex-direction: row;
    gap: 0%;
    align-items: center;
    margin-left: 15px;
    width: 300px;
    height: 59px;
    border-radius: 19px;
    background: #4D2316;
    padding: 0px 10px;
    transform: translateX(45%)
}

.rectangleParent .controls {
    display: flex;
    gap: 10%;
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
    gap: 1px;
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
    .player {
        width: unset;
    }

    .bookDetails {
        background: rgba(255, 255, 255, 0.2);
    }

    .player-item>button:hover {
        border-bottom: 2px solid #F1EEE3;
        cursor: pointer;
    }

    .rectangleParent {
        width: 100%;
        transform: translateX(0%)
    }


}
</style>