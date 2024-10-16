<template>
    <div>
        <CommonProgress v-if="uploading.isUploading" :progress="uploading.progress" />
        <div v-else class="chapter-form">

            <div v-if="audioData">
                <input v-model="form.title" type="text" placeholder="enter chapter title">
                <div style="display: flex; flex-direction: row; justify-content: space-between;">
                    <button class="close-btn" @click="clear">✖</button>
                    <audio :src="audioData?.base64Url" controls></audio>
                </div>

                <button class="save-btn">Save</button>
            </div>
            <UiUploadPicture v-else @submit="audioData = $event" type="audio" :allowed-ext="acceptedFormats"
                accept="audio/*" />


        </div>

    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    bookId: {
        type: String,
        required: true
    }
})
const acceptedFormats = ['mp3', 'wav']
const audioData = ref()
const uploading = ref<{ isUploading: boolean, progress: number }>({ isUploading: false, progress: 0 })
const form = ref({
    bookID: props.bookId,
    content: null,
    title: null
})

const clear = () => audioData.value = null

watch(audioData, () => {
    if (audioData.value) {
        form.value.title = audioData.value?.file?.name.replace('mp3', '')
    }

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