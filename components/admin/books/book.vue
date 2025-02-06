<template>
    <AdminBooksLoadersBookLoader v-if="loading" />
    <div v-else-if="state === State.VIEW" class="book-card-large">
        <img v-if="selectedBook.cover" :src="selectedBook?.cover" class="book-image">
        <img v-else src="@/assets/images/imagePlaceholder.webp" class="book-image">
        <div class="book-details-large">
            <p>Title: {{ selectedBook?.title }}</p>
            <p>Description: {{ selectedBook?.description }}</p>
            <p>Author: {{ selectedBook?.authors.toString() }}</p>
            <p>Language: {{ bookLanguages }}</p>
            <p>Genre: {{ bookCategories }}</p>
        </div>
        <button class="btn" @click="edit">EDIT</button>
    </div>
    <div v-else-if="state === State.EDIT || state === State.NEW" class="book-card-large-new">
        <img v-if="selectedBook.cover" :src="selectedBook?.cover" class="book-image" @click="dropImage">
        <UiUploadPicture v-else @submit="imageData = $event" type="image" />
        <div class="book-details-large">
            <div class="book-details-large">
                <div class="input-container">
                    <div class="label">
                        <h4>Title</h4>
                    </div>
                    <input type="text" placeholder="Enter title" v-model="selectedBook.title" />
                </div>
                <div class="input-container">
                    <div class="label">
                        <h4>Authors</h4>
                    </div>
                    <input type="text" placeholder="Emmanuel,Asabere" v-model="selectedBook.authors" />
                </div>
                <div class="input-container">
                    <div class="label">
                        <h4>Description</h4>
                    </div>
                    <textarea type="text" placeholder="Enter Additional Information" rows="4" cols="100"
                        v-model="selectedBook.description"></textarea>
                </div>
                <div class="input-container-btn">
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
const { languages, categories } = useCommon()
const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();

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

const state = computed(() => route.query.action as string || State.VIEW)
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