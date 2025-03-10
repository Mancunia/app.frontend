<template>
    <div class="body">
        <div class="chapter" :title="chapter.title">
            <p class="typography">{{ chapter.title }}</p>

            <div class="btn-group">
                <button v-if="store.getPlaying.id === chapter.id" class="btn" @click="pauseAudio">Playing...</button>
                <button v-else class="btn" @click="play">Play</button>
            </div>

        </div>
        <div v-if="action === actions[1].id" class="">
            <UiSelect :data-list="actions">
                <template v-slot:icon>
                    <div class="">
                        <img src="@/assets/images/context_menu.png" alt="" srcset="">
                    </div>

                </template>
            </UiSelect>
        </div>
    </div>

</template>

<script setup lang="ts">
import { type CHAPTER } from '~/types/book';
const props = defineProps({
    chapter: {
        type: Object as PropType<CHAPTER>,
        required: true
    }
});

const store = useAuthStore();
const route = useRoute();


const { init, playAudio, pauseAudio, fetchChapter, player } = usePlayer(props.chapter.id, USER_ROLES.ADMIN);
const action = computed(() => route.query.action as string || 'view');

const actions = [{
    id: 'view', name: 'View'
}, {
    id: 'edit', name: 'Edit'
}, {
    id: 'delete', name: 'Delete'
}]


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
.body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.chapter {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #cdcbcb;
    border-bottom: 1px solid #e0e0e0;
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

.btn-group button {
    background: #dc8b20;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
    font-size: 8px;
    margin-right: 10px;
    padding: 10px 20px;
}
</style>