<template>
    <div v-if="loading.base" class="chapter-content">
        <div class="cards-container-box">
            <AdminChaptersLoadersChapter />
            <AdminChaptersLoadersChapter />
            <AdminChaptersLoadersChapter />
            <AdminChaptersLoadersChapter />
        </div>
    </div>

    <div v-else-if="chapters" class="chapter-content">
        <AdminChaptersChapter v-for="(chapter, index) in chapters" :key="index" :chapter="chapter"
            @edit="InitEdit($event)" @delete="InitDelete($event)" />
    </div>
    <div v-else>
        <h1>No chapters found</h1>
    </div>

    <button v-if="chapters" @click="openModal('new')" class="float">
        +
    </button>
    <CommonModal v-model="modalState.new" :closeOnBackdropClick="false">
        <AdminChaptersForm :bookId="bookId" @done="fetchChapters" :chapter="selectedChapter" />
    </CommonModal>
    <CommonModal v-model="modalState.delete" :closeOnBackdropClick="true">
        <CommonProgress v-if="deleting.isDeleting" :progress="deleting.progress" :message="deleting.message"
            @done="done" :autoComplete="true" />
        <CommonModalsBody v-else :icon="{
            icon: 'bx bx-trash',
            fontSize: '30px',
            color: 'red'
        }" text="Do you want to delete this chapter ?" :buttons="[{
            loading: false,
            disabled: false,
            onClick: dropChapter,
            classNames: 'subtle',
            label: 'Yes, delete'
        }, {
            loading: false,
            disabled: false,
            onClick: () => closeModal('delete'),
            classNames: 'info',
            label: 'No'
        }]"></CommonModalsBody>
    </CommonModal>
</template>

<script setup lang="ts">
import { getChapters } from '~/services/book';
import { deleteChapter } from '~/services/admin/chapter';
import type { CHAPTER } from '~/types/book';
const route = useRoute();
const chapters = ref<CHAPTER[] | null>(null);
const selectedChapter = ref<CHAPTER | null>(null)

const modalState = reactive({
    new: false,
    delete: false,
})
const loading = ref({
    base: false
})

const deleting = reactive({
    isDeleting: false,
    progress: 0,
    message: ''
})

const bookId = computed(() => route.query.bookId as string);

const openModal = (id: "new" | "delete") => {
    modalState[id] = true
}
const closeModal = (id: "new" | "delete" | null) => {
    if (!id) {
        modalState['new'] = false
        modalState['delete'] = false
        return
    }
    modalState[id] = false
}


const InitDelete = (chapter: CHAPTER) => {
    selectedChapter.value = null
    selectedChapter.value = chapter
    openModal('delete')
}
const InitEdit = (chapter: CHAPTER) => {
    selectedChapter.value = null
    selectedChapter.value = chapter
    openModal('new')
}

const dropChapter = async () => {
    try {
        deleting.isDeleting = true
        deleting.progress = 20
        deleting.message = 'Deletion in progress'
        await deleteChapter(selectedChapter.value?.id ?? '')
        deleting.progress = 100
        deleting.message = 'Deletion completed'
    }
    catch (error: any) {

    }
}
const done = () => {
    closeModal(null)
    deleting.isDeleting = false
    deleting.progress = 0
    deleting.message = ''
    fetchChapters()

}
const fetchChapters = async () => {
    if (!bookId.value) {
        chapters.value = null;
        return
    };
    try {

        loading.value.base = true;
        const { data } = await getChapters(bookId.value, USER_ROLES.ADMIN);
        if (data) {
            chapters.value = data;
        }
    } finally {
        loading.value.base = false;
    }
}

watchEffect(() => {
    fetchChapters();
});
</script>

<style scoped>
.chapter-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
}


.add-chapter {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    padding: 2%;
    width: 95%;
    border: 0px;
    background-color: #00000023;
    border-radius: 10px;
    transition: 0.5s ease-in-out;
}

.add-chapter:hover {
    background-color: #fff;
    box-shadow: inset -1px 1px 2px 0px #000000;
}

.float {
    position: absolute;
    width: 60px;
    height: 60px;
    bottom: 120px;
    /* right: 40px; */
    left: 42%;
    background-color: #0C9;
    color: #FFF;
    border: unset;
    border-radius: 50px;
    text-align: center;
    box-shadow: 2px 2px 3px #999;
}

.my-float {
    margin-top: 22px;
}
</style>
