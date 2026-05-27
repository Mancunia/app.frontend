<template>
    <div class='file'>
        <label for='input-file'>
            <i class='bx bxs-file-plus' v-if="type === 'audio'"></i>
            <i class='bx bxs-image-add' v-else-if="type === 'image'"></i>
            <i class='bx bxs-cloud-upload' v-else></i>Select {{ type === 'image' ? 'an Image' : 'a File' }}
        </label>
        <input id='input-file' type='file' :accept="accept" @change="handleFileChange">
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    allowedExt: {
        type: Array as PropType<string[]>,
        default: ['jpg', 'jpeg', 'png']
    },
    maxSize: {
        type: Number,
        default: 5 * 1024 * 1024
    },
    type: {
        type: String as PropType<'image' | 'audio'>,
    },
    accept: {
        type: String,
        default: 'image/*'
    }
})
const emit = defineEmits(['submit'])
const { validateFile, reduceImageSize } = useUtils()
const { addError } = useNotification()
const fileData = ref<{} | string | null>(null)

const handleFileChange = async (event: any) => {
    try {
        const file = event.target.files[0]
        const isValid = validateFile(file, props.allowedExt)
        if (isValid) {
            throw new Error(isValid)
        }
        if (file) {
            if (file.size > props.maxSize && props.type === 'image') {
                fileData.value = await reduceImageSize(file, 300, 300)
            } else {
                const reader = new FileReader()
                reader.onloadend = () => {
                    fileData.value = { file, base64Url: reader.result as string }
                }
                reader.readAsDataURL(file)
            }
        }
    } catch (error: any) {
        addError(error.message)
    }
}

watch(() => fileData.value, () => {
    emit('submit', fileData.value)
})
</script>

<style scoped>
.file { position: relative; display: flex; justify-content: center; align-items: center; }
.file > input[type='file'] { display: none; }
.file > label {
  font-family: var(--font-sans); color: var(--kola); cursor: pointer;
  border: 1px dashed var(--hairline); border-radius: var(--d-radius);
  padding: 10px 16px; display: inline-flex; align-items: center; gap: 6px;
}
.file > label:hover { background: var(--calabash); }
.file > label > i { padding-right: 5px; }
</style>