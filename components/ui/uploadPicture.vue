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
.file {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.file>input[type='file'] {
    display: none
}

.file>label {
    font-size: 1rem;
    font-weight: 300;
    cursor: pointer;
    outline: 0;
    user-select: none;
    border-color: rgb(216, 216, 216) rgb(209, 209, 209) rgb(186, 186, 186);
    border-style: solid;
    border-radius: 4px;
    border-width: 1px;
    background-color: hsl(0, 0%, 100%);
    color: hsl(0, 0%, 29%);
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.file>label:hover {
    border-color: hsl(0, 0%, 21%);
}

.file>label:active {
    background-color: hsl(0, 0%, 96%);
}

.file>label>i {
    padding-right: 5px;
}
</style>