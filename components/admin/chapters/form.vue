<template>
    <div>
        <CommonProgress v-if="uploading.isUploading" :progress="uploading.progress" :message="uploading.message" />
        <div v-else class="chapter-form">

            <div v-if="audioData || form.content">
                <div v-if="extension?.toLowerCase() === 'pdf'">
                    <div style="display: flex; flex-direction: column; justify-content: space-evenly;">
                        <span style="display:flex; justify-self: center;">
                            <button class="close-btn" @click="clear">✖</button>
                            <i class='bx  bx-file' style="font-size:30px"></i>
                            <span style="padding:5px;">{{ form.title }}</span>
                        </span>
                        <UiPassword @password="form.password = $event" />
                    </div>

                </div>
                <div v-else>
                    <input v-model="form.title" type="text" placeholder="enter chapter title">
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <button class="close-btn" @click="clear">✖</button>
                        <audio :src="audioData?.base64Url" controls></audio>
                    </div>
                </div>


                <button class="save-btn" @click="save">Save</button>
            </div>
            <UiUploadPicture v-else @submit="audioData = $event" :allowed-ext="acceptedFormats"
                accept=".mp3,.wav,.pdf" />


        </div>

    </div>
</template>

<script setup lang="ts">
import { createChapter, updateChapter } from '~/services/admin/chapter';
import type { CHAPTER } from '~/types/book';
const emits = defineEmits(['done'])
const props = defineProps({
    bookId: {
        type: String,
        required: true
    },
    chapter: {
        type: Object as PropType<CHAPTER | null>
    }
})
const acceptedFormats = ['mp3', 'wav', 'pdf']
const audioData = ref()
const uploading = ref<{ isUploading: boolean, progress: number, message: string }>({ isUploading: false, progress: 0, message: "" })
const form = ref<CHAPTER>({
    bookId: props.bookId,
    content: '',
    title: '',
    password: null,
    book: null
})

const { generateSignedUrl, uploadFile } = useAWS()

const extension = computed(() => form.value.title?.split('.').pop())

const clear = () => {
    if (form.value.id) {
        form.value.content = null
    }
    audioData.value = null
}

const post = async () => {
    if (!audioData.value) {
        throw new Error('Please select an audio file')
    }
    uploading.value.isUploading = true
    uploading.value.progress = 10
    uploading.value.message = 'Uploading audio file'
    const response = await generateSignedUrl(audioData.value.file)
    if (response) {
        uploading.value.progress = 20
        const fileLoc = await uploadFile(audioData.value.file, response.signedURL)
        if (fileLoc) {
            form.value.content = fileLoc
            uploading.value.progress = 30
        }

    }
    uploading.value.progress = 40
    uploading.value.message = 'Creating chapter'
    const { data } = await createChapter(form.value)
    if (data) {
        uploading.value.progress = 100
        uploading.value.message = 'Chapter created successfully'
        emits('done')
    }
    clear()
    useNotification().addSuccess('Chapter created successfully')
}
const put = async () => {
    if (!audioData.value) {
        throw new Error('Please select an audio file')
    }
    let updatingFile = {}
    uploading.value.isUploading = true
    uploading.value.progress = 10
    uploading.value.message = 'Uploading audio file'
    const response = await generateSignedUrl(audioData.value.file)
    if (response) {
        uploading.value.progress = 20
        const fileLoc = await uploadFile(audioData.value.file, response.signedURL)
        if (fileLoc) {
            form.value.content = fileLoc
            uploading.value.progress = 30
        }

    }
    uploading.value.progress = 40
    uploading.value.message = 'Updating chapter'

    const { data } = await updateChapter(form.value)
    if (data) {
        uploading.value.progress = 100
        uploading.value.message = 'Chapter updated successfully'
        emits('done')
    }
    clear()
    useNotification().addSuccess('Chapter updated successfully')

}

const save = () => {
    try {
        if (form.value.id) {
            return put()
        }
        post()
    }
    catch (error) {
        uploading.value.progress = 0
        useNotification().addError(error.message)
    }


}

watch(audioData, () => {
    if (audioData.value) {
        form.value.title = audioData.value?.file?.name.replace(['.', 'mp3'], '')
    }

})
watch(() => props.chapter, () => {
    if (props.chapter) {
        form.value = props.chapter
    }
}, {
    deep: true,
    immediate: true
})

</script>

<style scoped>
.chapter-form {
    width: 300px;
}

.chapter-form input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;

}

.save-btn {
    background-color: #6e4c29;
    width: 300px;
    border: none;
    color: white;
    padding: 5px 40px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.save-btn:hover {
    background-color: #8c5a28;
}

.close-btn {
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}
</style>