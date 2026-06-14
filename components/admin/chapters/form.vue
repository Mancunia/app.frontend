<template>
    <div>
        <CommonProgress v-if="uploading.isUploading" :progress="uploading.progress" :message="uploading.message"
            :error="uploading.isError" />
        <div v-else class="chapter-form">

            <div v-if="audioData || form.content">
                <input v-model="form.title" type="text" placeholder="enter chapter title">

                <div v-if="extension === 'pdf'">
                    <div style="display: flex; flex-direction: column; justify-content: space-evenly;">
                        <span style="display:flex; align-items: center;">
                            <button class="close-btn" @click="clear">✖</button>
                            <i class='bx  bx-file' style="font-size:30px"></i>
                            <span v-if="!audioData" style="padding:5px; font-size: 12px; color: gray;">(Existing PDF)</span>
                        </span>
                        <UiPassword v-model="form.password" />
                    </div>

                </div>
                <div v-else>
                    <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                        <button class="close-btn" @click="clear">✖</button>
                        <audio v-if="audioData" :src="audioData?.base64Url" controls style="height: 30px;"></audio>
                        <span v-else style="padding:5px; font-size: 12px; color: gray;">(Existing Audio)</span>
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
const uploading = ref<{ isUploading: boolean, isError: boolean, progress: number, message: string }>({ isUploading: false, isError: false, progress: 0, message: "" })
const form = ref<CHAPTER>({
    bookId: props.bookId,
    content: '',
    title: '',
    password: null,
    book: null,
    type: null
})

const { generateSignedUrl, uploadFile } = useAWS()

const extension = computed(() => {
    const content = audioData.value ? audioData.value.file?.name : form.value.content;
    if (!content) return null;
    return content.split('?')[0].split('.').pop()?.toLowerCase();
})

const clear = () => {
    if (form.value.id) {
        form.value.content = null
    }
    audioData.value = null
}
const save = async () => {
    const state = form.value.id ? 'updating' : 'creating'
    try {
        if (!audioData.value && state === 'creating') {
            throw new Error('Please select an audio file')
        }

        uploading.value.isUploading = true
        uploading.value.progress = 10

        if (audioData.value) {
            uploading.value.message = 'Uploading file'
            const response = await generateSignedUrl(audioData.value.file)
            if (response) {
                uploading.value.progress = 20
                const fileLoc = await uploadFile(audioData.value.file, response)
                if (fileLoc) {
                    form.value.content = fileLoc
                    uploading.value.progress = 30
                }
            }
        }

        if (!form.value.content) {
            throw new Error('File is required')
        }

        // Set type based on extension
        const ext = extension.value
        if (ext === 'pdf') {
            form.value.type = 'ebook'
        } else if (['mp3', 'wav'].includes(ext)) {
            form.value.type = 'audio'
        }

        uploading.value.progress = 40
        uploading.value.message = `${state} chapter`
        let data: unknown = null
        if (state === 'updating') {
            data = await updateChapter(form.value)
        }
        else {
            data = await createChapter(form.value)
        }
        if (data) {
            uploading.value.progress = 100
            uploading.value.message = `Chapter ${state} successfully`
            emits('done')
        }
        clear()
        useNotification().addSuccess(`Chapter ${state} successfully`)
    }
    catch (error) {
        useHandleError(error, {
            canShowModal: true, callback: () => {
                uploading.value.isError = true
            }
        })
    }
}



watch(audioData, () => {
    if (audioData.value) {
        form.value.title = audioData.value?.file?.name.replace(/\.(mp3|wav|pdf)$/i, '')
    }

})
watch(() => props.chapter, () => {
    if (props.chapter) {
        form.value = { ...props.chapter }
    } else {
        form.value = {
            bookId: props.bookId,
            content: '',
            title: '',
            password: null,
            book: null,
            type: null,
            page: null,
            seek: null
        }
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
    border: 1px solid var(--calabash);
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;

}

.save-btn {
    background-color: var(--kola-2);
    width: 300px;
    border: none;
    color: var(--cream);
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
    background-color: var(--ochre);
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