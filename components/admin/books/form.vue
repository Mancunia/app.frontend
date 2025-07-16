<template>
    <CommonProgress v-if="uploading.loading" :progress="uploading.progress" :message="uploading.message"
        @done="emit('saved')" />
    <div v-else class="bookWrapper">
        <div class="cover">
            <img v-if="imageData" :src="imageData?.base64Url" />
            <UiUploadPicture v-else @submit="imageData = $event" type="image" />
            <div v-if="imageData" class="actions">
                <button @click="dropImage">DROP</button>
            </div>
        </div>
        <div class="book">
            <div class="bookDetails">
                <UiAdminInputField @update:model-value="form.title = $event" place-holder="Title" type="text"
                    :value="form.title" />
                <UiAdminInputField @update:model-value="form.authors = $event" place-holder="Authors" type="text"
                    :value="form.authors.toString()" />
                <UiAdminInputField @update:model-value="form.description = $event" place-holder="Description"
                    :value="form.description" type="text" />
                <div class="selectWrapper">
                    <UiSelectDropDown :data-list="languages ?? []" placeHolder="languages" generic="array"
                        @selected="form.languages = $event" :selected-option="form.languages" />
                    <UiSelectDropDown :data-list="categories ?? []" placeHolder="Categories" generic="array"
                        @selected="form.category = $event" :selected-option="form.category" />
                    <UiSelectDropDown :data-list="associates ?? [{ id: '', name: '' }]" placeHolder="Associates"
                        generic="array" @selected="form.associates = $event" @search="findAssociates" />
                </div>

            </div>
            <div class="submit">
                <UiAdminButton @click="save">SAVE</UiAdminButton>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { createBook, updateBook } from '~/services/admin/book';
import { getUserProfiles } from '~/services/admin/users';
import type { USER_PROFILE } from '~/types/auth';
import type { BOOK } from '~/types/book';

const emit = defineEmits(['saved']);

const { book } = defineProps({
    book: {
        type: Object as PropType<BOOK | null>,
        required: false
    }
})
const loading = ref<{ book: boolean, associates: boolean }>({ book: false, associates: false });
const uploading = ref<{ progress: number, loading: boolean, message: string }>({ progress: 0, loading: false, message: '' })
const imageData = ref()
const form = ref<BOOK>({
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
const associates = ref<{ id: string, name: string }[] | null>(null)

const { uploadFile, generateSignedUrl } = useAWS(USER_ROLES.ADMIN)
const { languages, categories } = useCommon(USER_ROLES.ADMIN)
const postBook = async () => {
    uploading.value.loading = true
    if (imageData.value) {
        uploading.value.message = 'Uploading image'
        uploading.value.progress = 20
        const response = await generateSignedUrl(imageData.value.file)
        if (response) {
            const imgLink = await uploadFile(imageData.value.file, response.signedURL)
            if (imgLink) {
                form.value.cover = imgLink
                uploading.value.progress = 50
            }
        }
    }
    uploading.value.message = 'Creating book'
    uploading.value.progress = 70
    const { data } = await createBook(form.value)
    if (data) {
        uploading.value.message = 'Book created'
        uploading.value.progress = 100
        emit('saved', data)
    }

}

const putBook = async () => {
    uploading.value.loading = true
    if (imageData.value) {
        uploading.value.message = 'Uploading image'
        uploading.value.progress = 20
        const response = await generateSignedUrl(imageData.value.file)
        if (response) {
            const imgLink = await uploadFile(imageData.value.file, response.signedURL)
            if (imgLink) {
                form.value.cover = imgLink
                uploading.value.progress = 50
            }
        }
    }
    uploading.value.message = 'Creating book'
    uploading.value.progress = 70
    const { data } = await updateBook(form.value.id, form.value)
    if (data) {
        uploading.value.message = 'Book updated'
        uploading.value.progress = 100
        emit('saved', data)
    }
}

const save = async () => {
    try {
        console.log('clicked saved')
        if (form.value.id) {
            console.log('on updated')
            return await putBook()
        }
        await postBook()
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
    }

}
const findAssociates = async (search: string) => {
    try {
        loading.value.associates = true
        const response = await getUserProfiles({ account: 2, search })
        associates.value = response.data.map((user: USER_PROFILE) => {
            return { id: user.id, name: user.email }
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching associates')
        }
    } finally {
        loading.value.associates = false
    }
}
const dropImage = () => {
    imageData.value = null
}

watch(() => book, () => {
    if (book) {
        form.value = book
    }
}, {
    deep: true,
    immediate: true
})
</script>
<style lang="css" scoped>
.bookWrapper {
    display: flex;
    justify-content: space-around;
    padding: 20px;
}

.cover {
    width: 200px;
    height: 200px;
    background-color: #f0f0f0;
}

.cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cover .actions {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.cover .actions button {
    background-color: #dc8b20;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    padding: 10px 20px;
}

.book {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 70%;
}

.bookDetails {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.selectWrapper {
    display: flex;
    gap: 20px;
}

.submit {
    display: flex;
    justify-content: flex-end;
}
</style>