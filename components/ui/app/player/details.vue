<template>
  <div v-if="book" class="player-details">
    <button class="close-drawer-btn" @click="store.toggleDrawer(false)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
      </svg>
    </button>
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
};

onMounted(() => { playReadChapter(); });
</script>

<style scoped>
.player-details {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.close-drawer-btn {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cream);
  cursor: pointer;
  z-index: 100;
  transition: background 0.2s;
}

.close-drawer-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (min-width: 750px) {
  .close-drawer-btn {
    display: none;
  }
}
</style>
