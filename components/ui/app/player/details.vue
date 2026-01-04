<template>
    <div v-if="book" class="bookDetails">
        <div v-if="store.getPlaying.type == 'ebook'">
            <ui-app-player-ebook-viewer />
        </div>
        <div v-else>
            <ui-app-player-audio-player />
        </div>
    </div>
</template>

<script setup lang="ts">

const store = useAuthStore();
const book = computed(() => store.getPlaying.book ?? null)
const chapter = computed(() => store.getPlaying)
const showDetails = computed(() => store.getPlayer.showDetails)

const { init, initPDF, playAudio, stopAudio, fetchChapter, loading: playerLoading, player } = usePlayer(USER_ROLES.USER)
const playReadChapter = async () => {
    const playerEle = document.getElementById('player')
    if (store.getPlaying.id !== chapter.value.id || !player.value) {
        store.setPlaying(chapter.value);
        stopAudio()
        const { data } = await fetchChapter(chapter.value.id ?? '');
        if (data) {
            if (data.chapter.type === 'ebook') {

                console.log('Initializing PDF for chapter:', { api: data.chapter.id, store: store.getPlaying.id, same: data.chapter.id !== store.getPlaying.id });
                if (data.chapter.id !== store.getPlaying.id) {
                    console.log('reset page', data)
                    await store.setPlayingPage(1);
                }
                await initPDF(data)
            }
            else {
                await init(data)
                playAudio()
            }
        }
    }
    if (playerEle) {
        // trigger hover or click automatically
        playerEle.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        playerEle.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        playerEle.click();
    }
}

onMounted(() => {
    playReadChapter();
})
</script>
