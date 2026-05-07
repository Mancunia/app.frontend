<template>
    <div v-if="chapter" class="chapter">
        <div class="cover">
            <img :src="checkForOldFile(chapter.book?.cover ?? '')" alt="chapter.title" />
        </div>
        <div class="description">
            <h3>{{ chapter.title }}</h3>
            <UiLoader v-if="loading" :theme="{ color: 'var(--ink)' }" />
            <button v-else-if="store.getPlaying.id !== chapter.id || !store.getPlayer.playing" @click="play">
                {{ chapter.type === 'ebook' ? 'Read' : 'Play' }}
            </button>
            <span v-else><img width="50" height="30" src="@/assets/playing.gif" /></span>

        </div>
    </div>
</template>

<script setup lang="ts">
import type { CHAPTER } from '~/types/book';
const emits = defineEmits(['play'])
const props = defineProps({
    chapter: {
        type: Object as PropType<CHAPTER>,
        required: true
    },
    loading: {
        type: Boolean
    }
})
const store = useAuthStore();
const { checkForOldFile } = useUtils()

const play = async () => emits('play',)

</script>

<style scoped>
.chapter {
    margin: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
    padding: 10px;
    background: var(--card); border: 1px solid var(--hairline);
    border-radius: 10px;
    transition: 0.5s ease-in-out;
    margin-bottom: 10%;
}

.cover {
    width: 100px;
    overflow: hidden;
}

.cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
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
    font-family: var(--font-serif); font-weight: 600; color: var(--ink);
}

.description button {
    width: 100px;
    height: 30px;
    background-color: var(--ink);
    color: var(--cream);
    border: none;
    border-radius: 20px;
    font-family: var(--font-display); font-size: 0.85rem; padding: 4px 14px;
}
</style>