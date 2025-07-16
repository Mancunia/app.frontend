<template>
    <div v-if="book" class="content">
        <div class="top">
            <div v-if="hasAccess()" class="actions">
                <button class="edit" @click="openModal('edit')"><i class='bx  bx-edit'></i>Edit </button>
                <button class="delete" @click="openModal('delete')"><i class='bx  bx-trash-alt'>Delete</i></button>
            </div>
            <div class="bookWrapper">

                <div class="cover">
                    <img v-if="book.cover" :src="checkForOldFile(book?.cover)" class="book-image">
                    <img v-else src="@/assets/images/imagePlaceholder.webp" class="book-image">
                </div>
                <div class="details">
                    <div class="info">
                        <p><span class="title">Title:</span> <span class="titleText">{{ book?.title }}</span>
                        </p>
                        <p><span class="title">Description:</span> <span class="description">{{ book?.description
                        }}</span></p>
                        <p><span class="title">Authors:</span> <span class="titleText">{{
                            book?.authors?.toString()
                                }}</span></p>
                        <p><span class="title">Language:</span> <span class="titleText">{{ bookLanguages }}</span></p>
                        <p><span class="title">Genre:</span> <span class="titleText">{{ bookCategories }}</span></p>
                    </div>
                </div>

            </div>
            <div class="tabs">
                <button :class="`${tab === Tabs.CHAPTERS ? 'active' : ''}`"
                    @click="setTab(Tabs.CHAPTERS)">CHAPTERS</button>
                <button :class="`${tab === Tabs.METRICS ? 'active' : ''}`"
                    @click="setTab(Tabs.METRICS)">METRICS</button>
            </div>
        </div>
        <div class="bottom">
            <div v-if="bookId" class="chapterWrapper">
                <div class="page">
                    <AdminChapters :key="bookId" v-if="tab === Tabs.CHAPTERS" />
                    <AdminBooksMetrics v-else-if="tab === Tabs.METRICS" />
                </div>

            </div>
        </div>
    </div>

    <CommonModal v-model="modals.edit">
        <AdminBooksForm :book @saved="done" />
    </CommonModal>
    <CommonModal v-model="modals.delete" :closeOnBackdropClick="true">
        <CommonProgress v-if="deleting.isDeleting" :progress="deleting.progress" :message="deleting.message"
            @done="deleteDone" :autoComplete="true" />
        <CommonModalsBody v-else :icon="{
            icon: 'bx bx-trash',
            fontSize: '30px',
            color: 'red'
        }" text="Do you want to delete this book ?" :buttons="[{
            loading: false,
            disabled: false,
            onClick: dropBook,
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
import { deleteBook } from '~/services/admin/book';
import { getBook } from '~/services/book';
import type { BOOK } from '~/types/book'


const Tabs = {
    CHAPTERS: 'CHAPTERS',
    METRICS: 'METRICS'
}
const emit = defineEmits(['refresh'])
const route = useRoute()
const { languages, categories } = useCommon(USER_ROLES.ADMIN)
const { checkForOldFile } = useUtils()
const { hasAccess } = useNavigation()

const tab = ref(Tabs.CHAPTERS)
const book = ref<BOOK | null>(null)

const bookId = computed(() => route.query.bookId as string)
const setTab = (currentTab: string) => tab.value = currentTab
const loading = ref({
    book: false,
    chapters: false,
    metrics: false
})
const modals = reactive({
    edit: false,
    delete: false
})
const deleting = reactive({
    isDeleting: false,
    progress: 0,
    message: ''
})



const bookLanguages = computed(() => {
    if (book.value?.languages) {
        return languages.value?.filter((lang: { id: any; }) => book.value?.languages.includes(lang.id)).map((lang: { name: any; }) => lang.name).join(', ')
    }
    return 'none'
})
const bookCategories = computed(() => {
    if (book.value?.category) {
        return categories.value?.filter((cate: { id: any; }) => book.value?.category.includes(cate.id)).map((cate: { name: any; }) => cate.name).join(', ')
    }
    return 'none'
})
const openModal = (id: "edit" | "delete") => {
    modals[id] = true
}
const closeModal = (id: "edit" | "delete" | null) => {
    if (!id) {
        modals['edit'] = false
        modals['delete'] = false
        return
    }
    modals[id] = false
}


const fetchBook = async () => {
    try {
        loading.value.book = true
        const { data } = await getBook(bookId.value as string, USER_ROLES.ADMIN)
        if (data) {
            book.value = data
        }

    } finally {
        loading.value.book = false
    }
}

const dropBook = async () => {
    try {
        deleting.isDeleting = true,
            deleting.progress = 20
        deleting.message = 'deleting book and chapters'
        await deleteBook(book.value?.id ?? '')
        deleting.progress = 100
        deleting.message = 'deleted book and chapters'

    }
    catch (error) {

    }
}

const done = () => {
    closeModal(null)
    deleting.isDeleting = false
    deleting.progress = 0
    deleting.message = ''
    emit('refresh')
}
const deleteDone = () => {
    closeModal(null)
    deleting.isDeleting = false
    deleting.progress = 0
    deleting.message = ''
    book.value = null
    route.query.book = null
    emit('refresh')
}

watch(bookId,
    () => {
        if (!bookId.value) {
            book.value = null;
            return;
        }
        fetchBook()
    }

    , {
        immediate: true
    }
)
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    overflow-y: auto;
    width: inherit;
}

.top {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}


.bottom {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.bookWrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
}

.chapterWrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.tabs button {
    background: unset;
    padding: 5px;
    color: black;
    border: unset;
    border-bottom: 1px solid black;
    margin: 0px 5px
}

.tabs .active {
    border-bottom: 5px solid black;
}

.btn {
    background: #dc8b20;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    margin-right: 10px;
    padding: 10px 20px;
}

.page {
    width: 100%;
    height: auto;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: scroll;
    gap: 40px;
    background: unset;
}

.bookWrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.cover {
    width: 30%;
    height: 15rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}

.details {
    width: 70%;
    height: 200px;
    background-color: beige;
    padding: 30px;
    overflow-y: auto;
}

.info {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

}

.info p {
    display: flex;
    flex-direction: column;
    margin-bottom: 3%;
}

.info p .title {
    font-size: small;
    color: rgb(47, 47, 47);
}

.info p .titleText {
    font-size: large;
    color: rgb(47, 47, 47);
}

.info p .description {
    font-size: large;
    background-color: rgba(47, 47, 47, 0.313);
    color: rgb(0, 0, 0);
    max-height: 100px;
    overflow-y: auto;
    padding: 20px;
}

.actions button {
    background: unset;
    border: unset;
    font-size: 20px;
    filter: grayscale(100%);
}

.actions button:hover {
    filter: grayscale(0%);
}

.edit {
    color: blue;
}

.delete {
    color: red;
}
</style>
