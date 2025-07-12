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
            <UiSelect :data-list="actions" @selected="handleAction">
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
import { deleteChapter } from '~/services/book';
const emit = defineEmits(['deleted']);
const props = defineProps({
    chapter: {
        type: Object as PropType<CHAPTER>,
        required: true
    }
});

const store = useAuthStore();
const route = useRoute();
const { addSuccess, addError } = useToast();


const { init, playAudio, pauseAudio, fetchChapter, player } = usePlayer(props.chapter.id, USER_ROLES.ADMIN);
const action = computed(() => route.query.action as string || 'view');

const actions = [{
    id: 'view', name: 'View'
}, {
    id: 'edit', name: 'Edit'
}, {
    id: 'delete', name: 'Delete'
}]

const handleAction = async (actionId: string) => {
    if (actionId === 'delete') {
        const confirmed = confirm('Are you sure you want to delete this chapter?');
        if (!confirmed) return;
        try {
            await deleteChapter(props.chapter.content);
        } catch (e) {
            addError('Failed to delete chapter');
            return;
        }
         addSuccess('Chapter deleted successfully');
         emit('deleted', props.chapter.id);
    }

    if (actionId === 'edit') {
        router.push({ path: '/admin/chapters/edit', query: { id: props.chapter.id } });
    }
};

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