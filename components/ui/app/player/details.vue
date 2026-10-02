<template>
  <div class="player-details">
    <button class="close-drawer-btn" @click="store.toggleDrawer(false)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
      </svg>
    </button>
    <div v-if="book && store.getPlaying.type === 'ebook'" class="player-view">
      <UiAppPlayerEbookViewer />
    </div>
    <div v-else-if="book && showQueue" class="player-view">
      <UiAppPlayerQueue @close="showQueue = false" />
    </div>
    <div v-else class="player-view">
      <UiAppPlayerAudioPlayer @show-queue="showQueue = true" />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAuthStore();
const book = computed(() => store.getPlaying.book ?? null);
const showQueue = ref(false);

const { init, initPDF, fetchChapter, player } = usePlayer(USER_ROLES.USER);

const playReadChapter = async () => {
  if (!player.value) {
    if (store.getPlaying.id) {
      const res = await fetchChapter(store.getPlaying.id ?? '');
      if (res) {
        if (res.chapter.type === 'ebook') {
          if (res.chapter.id !== store.getPlaying.id) await store.setPlayingPage(1);
          await initPDF(res);
        } else {
          await init(res, false);
        }
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

.player-view {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
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
