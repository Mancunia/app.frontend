<template>
    <AdminBooksLoadersBookLoader v-if="loading" />
    <div v-else-if="state === State.VIEW" class="bookWrapper">
        <div class="cover">
            <img v-if="selectedBook.cover" :src="checkForOldFile(selectedBook?.cover)" class="book-image">
            <img v-else src="@/assets/images/imagePlaceholder.webp" class="book-image">
        </div>
        <div class="details">
            <div class="info">
                <p><span class="title">Title:</span> <span class="titleText">{{ selectedBook?.title }}</span></p>
                <p><span class="title">Description:</span> <span class="titleText">{{ selectedBook?.description
                        }}</span></p>
                <p><span class="title">Authors:</span> <span class="titleText">{{ selectedBook?.authors.toString()
                        }}</span></p>
                <p><span class="title">Language:</span> <span class="titleText">{{ bookLanguages }}</span></p>
                <p><span class="title">Genre:</span> <span class="titleText">{{ bookCategories }}</span></p>
            </div>
            <div class="btn">
                <UiAdminButton @click="edit">EDIT</UiAdminButton>
            </div>

        </div>

    </div>
    <div v-else-if="state === State.EDIT || state === State.NEW" class="bookWrapper">
        <div class="cover">
            <img v-if="selectedBook.cover" :src="checkForOldFile(selectedBook?.cover)" @click="dropImage">
            <UiUploadPicture v-else @submit="imageData = $event" type="image" />
        </div>
        <div class="details">
            <UiAdminInputField @update:model-value="selectedBook.title = $event" place-holder="Title" type="text"
                :value="selectedBook.title" />
            <UiAdminInputField @update:model-value="selectedBook.authors = $event" place-holder="Authors" type="text"
                :value="selectedBook.authors.toString()" />
            <UiAdminInputField @update:model-value="selectedBook.description = $event" place-holder="Description"
                :value="selectedBook.description" type="text" />

            <div class="selectWrapper">
                <UiSelectDropDown :data-list="languages ?? []" placeHolder="languages" generic="array"
                    @selected="selectedBook.languages = $event" :selected-option="selectedBook.languages" />
                <UiLoader v-if="Langs.loading" />
                <UiSelectDropDown :data-list="categories ?? []" placeHolder="Categories" generic="array"
                    @selected="selectedBook.category = $event" :selected-option="selectedBook.category" />
                <UiLoader v-if="Cates.loading" />

                <div class="save-btn">
                    <UiAdminButton @click="submit">SAVE</UiAdminButton>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <h1>No book selected</h1>
    </div>
    <CommonModal v-model="isModalOpen">
        <CommonProgress v-if="uploading.loading" :progress="uploading.progress" :message="uploading.message" />
    </CommonModal>
</template>

<script setup lang="ts">
import type { BOOK } from '~/types/book';
import type { Languages, Categories } from '~/types/common';
import { getBook } from '~/services/book';
import { createBook, updateBook } from '~/services/admin/book';

const State = {
    VIEW: 'view',
    EDIT: 'edit',
    NEW: 'new'
}
const route = useRoute()
const router = useRouter()
const store = useAuthStore()
const { languages, categories } = useCommon(USER_ROLES.ADMIN)
const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();
const { checkForOldFile } = useUtils()

const defaultBook = {
    meta: {
        played: 0,
        views: 0,
        comments: 0
    },
    _id: '',
    status: 0,
    authors: [],
    cover: '',
    moment: '',
    title: '',
    description: '',
    folder: '',
    uploader: '',
    __v: 0,
    collections: [],
    languages: [],
    category: [],
    createdAt: '',
    associates: [],
    updatedAt: ''
}
const selectedBook = ref<BOOK>({
    meta: {
        played: 0,
        views: 0,
        comments: 0
    },
    status: 0,
    authors: [],
    cover: '',
    moment: '',
    title: '',
    description: '',
    folder: '',
    uploader: '',
    __v: 0,
    collections: [],
    languages: [],
    category: [],
    createdAt: '',
    associates: [],
    updatedAt: ''
})

const loading = ref(false)
const uploading = ref<{ progress: number, loading: boolean, message: string }>({ progress: 0, loading: false, message: '' })
const imageData = ref()
const Langs = ref<{ data: Languages[] | null, loading: boolean }>({ data: null, loading: false })
const Cates = ref<{ data: Categories[] | null, loading: boolean }>({ data: null, loading: false })

const { uploadFile, generateSignedUrl } = useAWS()

const state = computed(() => route.query.action as string ?? State.VIEW)
const edit = () => {
    router.push({ query: { bookId: selectedBook.value?._id, action: 'edit' } })
}
const bookId = computed(() => route.query.bookId as string)
const bookLanguages = computed(() => {
    if (selectedBook.value.languages) {
        return languages.value?.filter((lang: { id: any; }) => selectedBook.value?.languages.includes(lang.id)).map((lang: { name: any; }) => lang.name).join(', ')
    }
    return 'none'
})

const bookCategories = computed(() => {
    if (selectedBook.value.category) {
        return categories.value?.filter((cate: { id: any; }) => selectedBook.value?.category.includes(cate.id)).map((cate: { name: any; }) => cate.name).join(', ')
    }
    return 'none'
})

const postBook = async () => {
    try {
        selectedBook.value._id = null
        uploading.value.loading = true
        openModal()
        if (imageData.value) {
            uploading.value.message = 'Uploading image'
            uploading.value.progress = 20
            const response = await generateSignedUrl(imageData.value.file)
            if (response) {
                const imgLink = await uploadFile(imageData.value.file, response.signedURL)

                if (imgLink) {
                    uploading.value.progress = 50
                    selectedBook.value.cover = imgLink
                }
            }
        }
        uploading.value.message = 'Creating book'
        uploading.value.progress = 70
        const { data } = await createBook(selectedBook.value)
        if (data) {
            uploading.value.message = 'Book created'
            uploading.value.progress = 100
            selectedBook.value = data
            router.push({ query: { bookId: data._id, action: 'view' } })
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error uploading book')
        }
    } finally {
        imageData.value = null
    }
}

const putBook = async () => {
    try {
        uploading.value.loading = true
        openModal()
        if (imageData.value) {
            uploading.value.message = 'Uploading image'
            uploading.value.progress = 20
            const response = await generateSignedUrl(imageData.value.file)
            if (response) {
                const imgLink = await uploadFile(imageData.value.file, response.signedURL)
                if (imgLink) {
                    uploading.value.progress = 50
                    selectedBook.value.cover = imgLink
                }
            }
        }
        uploading.value.message = 'Updating book'
        uploading.value.progress = 70
        const { data } = await updateBook(selectedBook.value)
        if (data) {
            uploading.value.message = 'Book updated'
            uploading.value.progress = 100
            router.push({ query: { bookId: data._id, action: 'view' } })
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error uploading book')
        }
    }
    finally {
        imageData.value = null
    }

}

const submit = () => {
    if (selectedBook.value._id) {
        putBook()
    }
    else {
        postBook()
    }
}

const fetchBook = async () => {
    try {
        if (!bookId.value) {
            selectedBook.value = defaultBook
            return
        }
        loading.value = true
        const { data } = await getBook(bookId.value as string, store.getAdmin.role)
        if (data) {
            selectedBook.value = data
        }

    } finally {
        loading.value = false
    }
}
const dropImage = () => {
    selectedBook.value.cover = ''
    imageData.value = null
}

watchEffect(() => {
    fetchBook()
})
watch(imageData, () => {
    if (imageData.value) {
        selectedBook.value.cover = imageData.value.base64Url
    }
})
onMounted(() => {
    if (state.value !== State.NEW) {
        fetchBook()
    }
})
</script>

<style scoped>
.bookWrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.cover {
    width: 20rem;
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
    display: flex;
    flex-direction: column;
    width: 100%;
}

.details .info p {
    font-size: 1.2rem;
    margin-top: 2%;
}

.details .info p .title {
    font-weight: bold;
    background-color: #0000008c;
    border-right: 5px solid #000;
    color: #fff;
    padding: 1%;
}

.details .info p .titleText {
    font-weight: black;
    background-color: #ffffff8c;
    color: #000000;
    padding: 1%;
}

.details .btn {
    width: 200px;
    align-self: flex-end;
}

.details .selectWrapper {
    display: flex;
    flex-direction: row;
    gap: 20px;
}
</style>