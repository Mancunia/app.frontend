<template>
  <div>
    <div class="time-row">
      <span>{{ secondsToMinutes(currentTime) }}</span>
      <span>{{ secondsToMinutes(duration) }}</span>
    </div>
    <div class="seek-wrap">
      <UiAseKenteWeft :progress="duration > 0 ? currentTime / duration : 0" :height="6" />
      <input class="seek-input" type="range" min="0" :max="duration" :value="currentTime"
        @input="seekAudio(Number(($event.target as HTMLInputElement).value))" />
    </div>

    <div v-if="store.getPlaying.book" class="player">
      <div class="transport-bar">
        <div class="book-art">
          <img :src="checkForOldFile(store.getPlaying.book?.cover)" alt="book art" />
        </div>
        <div class="controls">
          <div class="player-item">
            <button disabled class="ctrl-btn">⏮</button>
            <button @click="rewindAudio(5)" class="ctrl-btn">⏪</button>
            <button @click="toggleAudio" class="play-btn">
              {{ store.getPlayer.playing ? '⏸' : '▶' }}
            </button>
            <button @click="fastForwardAudio(5)" class="ctrl-btn">⏩</button>
            <button disabled class="ctrl-btn">⏭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { playChapter } from '~/services/play';

const store = useAuthStore();
const { checkForOldFile, secondsToMinutes } = useUtils();
const chapter = computed(() => store.getPlaying);

const {
  toggleAudio, stopAudio, setVolume, muteAudio, unmuteAudio,
  duration, currentTime, fastForwardAudio, rewindAudio, seekAudio,
  playerDetails, init
} = usePlayer(USER_ROLES.USER);

const getChapter = async () => {
  const c = chapter.value;
  if (!c?.id) return;
  const res = await playChapter(c.id);
  if (res) await init(res);
};

watch(currentTime, (newTime) => { store.setPlayingSeek(newTime); });

onMounted(async () => {
  await getChapter();
  const storeSeek = store.getPlaying.seek;
  if (storeSeek) seekAudio(storeSeek);
});
</script>

<style scoped>
.time-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--cream);
  opacity: 0.6;
  padding: 0 4px 4px;
}
.seek-wrap { position: relative; width: 90%; margin: 0 auto 8px; }
.seek-input {
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
}

.transport-bar {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 10px;
  height: 59px;
  border-radius: 20px;
  background: var(--ink);
  margin-left: 15px;
  width: 300px;
}
.book-art {
  width: 43px;
  height: 41px;
  flex-shrink: 0;
  border-radius: 8px;
  background: var(--calabash);
  overflow: hidden;
}
.book-art img { width: 100%; height: 100%; object-fit: cover; }
.controls { flex: 1; }
.player-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.ctrl-btn {
  background: none;
  border: none;
  color: var(--cream);
  font-size: 1rem;
  cursor: pointer;
  padding: 6px;
  opacity: 0.8;
}
.ctrl-btn:hover { opacity: 1; }
.ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.play-btn {
  background: var(--ochre);
  color: var(--ink);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media only screen and (min-width: 750px) {
  .transport-bar { width: 100%; margin-left: 0; }
}
</style>
