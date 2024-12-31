<template>
    <div class="grid-item" :title="chapter.title">
        <p class="typography">{{ chapter.title }}</p>

        <button v-if="store.getPlaying.id === chapter.id" class="btn" @click="pauseAudio">Playing...</button>
        <button v-else class="btn" @click="play">Play</button>
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


const { init, playAudio,pauseAudio } = usePlayer()
const action = computed(() => route.query.action as string || 'view');

const actions = [{
    id: 'view', name: 'View'
}, {
    id: 'edit', name: 'Edit'
}, {
    id: 'delete', name: 'Delete'
}]


const play = async () => {
    if (store.getPlaying.id !== props.chapter.id) {
        store.setPlaying(props.chapter);
    }
    init(props.chapter?.content ?? '')
    await playAudio()

}
</script>
<style scoped>
.typography {
    width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>