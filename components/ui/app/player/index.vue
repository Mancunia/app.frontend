<template>
  <div>
    <div class="time-row">
      <span class="time-elapsed">{{ secondsToMinutes(currentTime) }}</span>
      <span class="time-remaining">-{{ secondsToMinutes(Math.max(0, duration - currentTime)) }}</span>
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
        <div class="book-meta">
          <p class="meta-title">{{ store.getPlaying.book?.title }}</p>
          <p class="meta-author">{{ store.getPlaying.book?.authors?.map(a => typeof a === 'string' ? a : a.name).join(', ') }}</p>
        </div>
        <div class="controls">
          <div class="player-item">
            <button :disabled="!hasPrev" @click="playPrevInQueue" class="ctrl-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>
            <button @click="rewindAudio(5)" class="ctrl-btn">⏪</button>
            <button @click="toggleAudio" class="play-btn">
              {{ store.getPlayer.playing ? '⏸' : '▶' }}
            </button>
            <button @click="fastForwardAudio(5)" class="ctrl-btn">⏩</button>
            <button :disabled="!hasNext" @click="playNextInQueue" class="ctrl-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </button>
          </div>
        </div>
        <button @click="cycleSpeed" class="speed-badge">{{ playbackRate }}×</button>
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
  playerDetails, init, playbackRate, cycleSpeed,
  hasNext, hasPrev, playNextInQueue, playPrevInQueue
} = usePlayer(USER_ROLES.USER);

const getChapter = async () => {
  const c = chapter.value;
  if (!c?.id) return;
  const res = await playChapter(c.id);
  if (res) await init(res, false);
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
  color: #ffffff;
  padding: 0 4px 4px;
}
.time-elapsed {
  color: #ffffff;
  opacity: 0.95;
}
.time-remaining {
  color: #ffffff;
  opacity: 0.6;
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

.book-meta {
  flex: 1;
  min-width: 0;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.meta-title {
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}
.meta-author {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.7rem;
  color: #ffffff;
  opacity: 0.7;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls { flex: 0 0 auto; }
.player-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.ctrl-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  padding: 6px;
  opacity: 0.85;
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

.speed-badge {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  color: #ffffff;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 2px 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
  flex-shrink: 0;
  margin-left: 4px;
}
.speed-badge:hover { opacity: 1; }

@media only screen and (min-width: 750px) {
  .transport-bar { width: 100%; margin-left: 0; }
}
</style>
