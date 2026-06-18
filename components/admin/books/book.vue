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
                <p><span class="title">Authors:</span> <span class="titleText">{{ selectedBook?.authors?.map(a => typeof a === 'string' ? a : a.name).join(', ')
                        }}</span></p>
                <p><span class="title">Narrators:</span> <span class="titleText">{{ selectedBook?.narrators?.map(n => typeof n === 'string' ? n : n.name).join(', ') || 'none' }}</span></p>
                <p><span class="title">Language:</span> <span class="titleText">{{ bookLanguages }}</span></p>
                <p><span class="title">Genre:</span> <span class="titleText">{{ bookCategories }}</span></p>
                <p><span class="title">Genres:</span> <span class="titleText">{{ bookGenres }}</span></p>
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
            <UiAdminInputField @update:model-value="selectedBook.description = $event" place-holder="Description"
                :value="selectedBook.description" type="text" />

            <div class="selectWrapper">
                <UiSelectDropDown
                    :data-list="authorOptions"
                    placeHolder="Authors"
                    generic="array"
                    @selected="selectedAuthorIds = $event; selectedBook.authors = $event"
                    :selected-option="selectedAuthorIds"
                />
                <UiSelectDropDown
                    :data-list="narratorOptions"
                    placeHolder="Narrators"
                    generic="array"
                    @selected="selectedNarratorIds = $event; selectedBook.narrators = $event"
                    :selected-option="selectedNarratorIds"
                />
                <UiSelectDropDown :data-list="languages ?? []" placeHolder="languages" generic="array"
                    @selected="selectedBook.languages = $event" :selected-option="selectedBook.languages" />
                <UiLoader v-if="Langs.loading" />
                <UiSelectDropDown :data-list="categories ?? []" placeHolder="Categories" generic="array"
                    @selected="selectedBook.category = $event" :selected-option="selectedBook.category" />
                <UiLoader v-if="Cates.loading" />
                <UiSelectDropDown :data-list="genreOptions" placeHolder="Genres" generic="array"
                    @selected="selectedBook.genres = $event" :selected-option="selectedBook.genres" />

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
import { getAuthors } from '~/services/admin/author';
import { getNarrators } from '~/services/admin/narrator';
import { getGenres } from '~/services/admin/genre';
import { USER_ROLES } from '~/constants';

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

const defaultBook: BOOK = {
    meta: {
        played: 0,
        views: 0,
        likes: 0,
        dislikes: 0,
        comments: 0
    },
    authors: [],
    narrators: [],
    cover: '',
    title: '',
    description: '',
    languages: [],
    category: [],
    genres: [],
    associates: [],
}
const selectedBook = ref<BOOK & { _id?: string | null }>({
    meta: {
        played: 0,
        views: 0,
        likes: 0,
        dislikes: 0,
        comments: 0
    },
    authors: [],
    narrators: [],
    cover: '',
    title: '',
    description: '',
    languages: [],
    category: [],
    genres: [],
    associates: [],
})

const authorOptions = ref<{ id: string; name: string }[]>([])
const narratorOptions = ref<{ id: string; name: string }[]>([])
const genreOptions = ref<{ id: string; name: string }[]>([])
const selectedAuthorIds = ref<string[]>([])
const selectedNarratorIds = ref<string[]>([])
const loading = ref(false)
const uploading = ref<{ progress: number, loading: boolean, message: string }>({ progress: 0, loading: false, message: '' })
const imageData = ref()
const Langs = ref<{ data: Languages[] | null, loading: boolean }>({ data: null, loading: false })
const Cates = ref<{ data: Categories[] | null, loading: boolean }>({ data: null, loading: false })

const { uploadFile, generateSignedUrl } = useAWS()

const state = computed(() => route.query.action as string ?? State.VIEW)
const edit = () => {
    router.push({ query: { bookId: selectedBook.value?.id || selectedBook.value?._id, action: 'edit' } })
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

const bookGenres = computed(() => {
    if (selectedBook.value.genres?.length) {
        return selectedBook.value.genres.map((g: any) => typeof g === 'string' ? g : g.name).join(', ')
    }
    return 'none'
})

const postBook = async () => {
    try {
        selectedBook.value._id = null
        selectedBook.value.id = undefined
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
        const data = await createBook(selectedBook.value)
        if (data) {
            uploading.value.message = 'Book created'
            uploading.value.progress = 100
            selectedBook.value = data
            router.push({ query: { bookId: (data as any).id || (data as any)._id, action: 'view' } })
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
        const data = await updateBook((selectedBook.value.id || selectedBook.value._id) as string, selectedBook.value)
        if (data) {
            uploading.value.message = 'Book updated'
            uploading.value.progress = 100
            router.push({ query: { bookId: (data as any).id || (data as any)._id, action: 'view' } })
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
    if (selectedBook.value.id || selectedBook.value._id) {
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
        const data = await getBook(bookId.value as string, store.getAdmin.role)
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
watch(selectedBook, (book) => {
    if (book) {
        selectedAuthorIds.value = (book.authors ?? []).map((a: any) => a.id ?? a._id ?? a)
        selectedNarratorIds.value = (book.narrators ?? []).map((n: any) => n.id ?? n._id ?? n)
    }
}, { immediate: true, deep: true })
onMounted(async () => {
    const [authorsRes, narratorsRes, genresRes] = await Promise.all([
        getAuthors(),
        getNarrators(),
        getGenres(),
    ])
    if (authorsRes) {
        const list = Array.isArray(authorsRes) ? authorsRes : (authorsRes as any).data || (authorsRes as any).results || []
        authorOptions.value = list.map((a: any) => ({ id: a.id ?? a._id, name: a.name }))
    }
    if (narratorsRes) {
        const list = Array.isArray(narratorsRes) ? narratorsRes : (narratorsRes as any).data || (narratorsRes as any).results || []
        narratorOptions.value = list.map((n: any) => ({ id: n.id ?? n._id, name: n.name }))
    }
    if (genresRes) {
        const result = genresRes as any
        const list = Array.isArray(result) ? result : (result.data ?? result.results ?? [])
        genreOptions.value = list.filter((g: any) => g.active).map((g: any) => ({ id: g.id ?? g._id, name: g.name }))
    }
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
    background: var(--kola);
    border-right: 3px solid var(--ochre);
    color: var(--cream);
    padding: 4px 8px;
    border-radius: 4px 0 0 4px;
    font-family: var(--font-sans);
    font-size: 0.8rem;
}

.details .info p .titleText {
    font-family: var(--font-serif);
    font-size: 1rem;
    background: var(--card);
    color: var(--ink);
    padding: 4px 8px;
    border: 1px solid var(--hairline);
    border-radius: 0 4px 4px 0;
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