<template>
    <div class="bod">
        <div class="chapter" :title="chapter.title">
            <p class="typography">{{ chapter.title }}</p>

            <div class="btn-group">
                <button v-if="store.getPlaying.id === chapter.id" class="btn" @click="pauseAudio">Playing...</button>
                <button v-else class="btn" @click="play">Play</button>
                <div class="special" v-if="hasAccess()">
                    <button class="edit" @click="$emit('edit', chapter)"><i class='bx  bx-edit'></i> </button>
                    <button class="delete" @click="$emit('delete', chapter)"><i class='bx  bx-trash-alt'></i>
                    </button>
                </div>

            </div>

        </div>
    </div>

</template>

<script setup lang="ts">
import { type CHAPTER } from '~/types/book';
defineEmits(['edit', 'delete'])
const props = defineProps({
    chapter: {
        type: Object as PropType<CHAPTER>,
        required: true
    }
});

const store = useAuthStore();
const route = useRoute();
const { hasAccess } = useNavigation()


const { init, playAudio, pauseAudio, fetchChapter, player } = usePlayer(props.chapter.id as string, USER_ROLES.ADMIN);


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
.bod {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 200px;
    height: 100px;
    margin: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    padding: 10px;
}

.chapter {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 10px;
    align-items: center;
    padding: 10px;
}

.chapter:hover {
    background-color: #f5f5f5;
}

.typography {
    width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.btn-group {
    display: flex;
    align-items: center;
}

.btn-group .btn {
    background: #dc8b20;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
    font-size: 8px;
    margin-right: 10px;
    padding: 10px 20px;
}

.btn-group .special button {
    background: unset;
    border: unset;
    font-size: 20px;
    filter: grayscale(100%);
}

.btn-group .special button:hover {
    filter: grayscale(0%);
}

.edit {
    color: blue;
}

.delete {
    color: red;
}
</style>