<template>
  <div v-if="book" class="player-details">
    <div v-if="store.getPlaying.type === 'ebook'" style="height: 100%">
      <UiAppPlayerEbookViewer />
    </div>
    <div v-else>
      <UiAppPlayerAudioPlayer />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAuthStore();
const book = computed(() => store.getPlaying.book ?? null);

const { init, initPDF, playAudio, fetchChapter, player } = usePlayer(USER_ROLES.USER);

const playReadChapter = async () => {
  const playerEle = document.getElementById('player');
  if (!player.value) {
    const { data } = await fetchChapter(store.getPlaying.id ?? '');
    if (data) {
      if (data.chapter.type === 'ebook') {
        if (data.chapter.id !== store.getPlaying.id) await store.setPlayingPage(1);
        await initPDF(data);
      } else {
        await init(data);
        playAudio();
      }
    }
  }
  if (playerEle) {
    playerEle.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    playerEle.click();
  }
};

onMounted(() => { playReadChapter(); });
</script>

<style scoped>
.player-details {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
