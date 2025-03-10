<template>
    <div v-if="chapter" class="chapter">
        <div class="cover">
            <img :src="checkForOldFile(chapter.book.cover)" alt="chapter.title" />
        </div>
        <div class="description">
            <h3>{{ chapter.title }}</h3>
            <UiLoader v-if="loading" :theme="{ color: 'black' }" />
            <button v-else-if="store.getPlaying.id !== chapter.id || !store.getPlayer.playing" @click="play">
                Play
            </button>
            <span v-else><img width="50" height="30" src="@/assets/playing.gif" /></span>

        </div>
    </div>
</template>

<script setup lang="ts">
import type { CHAPTER } from '~/types/book';
const props = defineProps({
    chapter: {
        type: Object as PropType<CHAPTER>,
        required: true
    }
})
const store = useAuthStore();
const { init, playAudio, fetchChapter, loading, player } = usePlayer(props.chapter.id, USER_ROLES.USER)
const { checkForOldFile } = useUtils()

const play = async () => {
    if (store.getPlaying.id !== props.chapter.id || !player.value) {
        store.setPlaying(props.chapter);
        await fetchChapter()
        await init()
    }
    await playAudio()

}

</script>

<style scoped>
.chapter {
    margin: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
    padding: 10px;
    border: 0px;
    background-color: #d2d1d123;
    border-radius: 10px;
    transition: 0.5s ease-in-out;
    margin-bottom: 10%;
}

.cover {
    width: 100px;
    /* height: 100px; */
    overflow: hidden;
}

.cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.description {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10%;
    font-size: 14px;
    gap: 10px;
    width: 100%;
}

.description h3 {
    width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.description button {
    width: 100px;
    height: 30px;
    background-color: #191413;
    color: white;
    border: none;
    border-radius: 5px;
}
</style>