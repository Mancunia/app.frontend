<template>
    <div class="grid-item" :title="chapter.title">
        <p class="typography">{{ chapter.title }}</p>

        <button v-if="store.getPlaying.id === chapter.id" class="btn" @click="handlePlay">Playing...</button>
        <button v-else class="btn" @click="handlePlay">Play</button>
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
const action = computed(() => route.query.action as string || 'view');

const actions = [{
    id: 'view', name: 'View'
}, {
    id: 'edit', name: 'Edit'
}, {
    id: 'delete', name: 'Delete'
}]

const handlePlay = () => {
    store.setPlaying(props.chapter);
}

const handlePause = () => {
    store.setPlaying(null);
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