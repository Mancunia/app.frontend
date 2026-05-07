<template>
  <div v-if="book" class="audio-player">
    <UiAseFireMotes :count="6" style="opacity: 0.15" />

    <div class="eyebrow">Now playing</div>

    <div class="cover-wrap">
      <img :src="checkForOldFile(book.cover)" class="cover-art" alt="Book cover" />
    </div>

    <div class="book-meta">
      <h2 class="book-title">{{ book.title }}</h2>
      <p class="book-author">{{ book.authors?.join(', ') }}</p>
    </div>

    <div class="progress-section">
      <UiAseKenteWeft :progress="duration > 0 ? currentTime / duration : 0" :height="9" />
      <div class="time-row">
        <span>{{ secondsToMinutes(currentTime) }}</span>
        <span>{{ secondsToMinutes(duration) }}</span>
      </div>
    </div>

    <div class="transport">
      <button @click="rewindAudio(5)" class="ctrl-btn" title="Rewind 5s">⏪</button>
      <button @click="toggleAudio" class="play-btn">{{ playing ? '⏸' : '▶' }}</button>
      <button @click="fastForwardAudio(5)" class="ctrl-btn" title="Forward 5s">⏩</button>
    </div>

    <div class="ghost-row">
      <span>1.0×</span>
      <span>Chapters</span>
      <span>Sleep</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAuthStore();
const { checkForOldFile, secondsToMinutes } = useUtils();
const book = computed(() => store.getPlaying.book ?? null);

const {
  toggleAudio, duration, currentTime, fastForwardAudio, rewindAudio, seekAudio
} = usePlayer(USER_ROLES.USER);

const playing = computed(() => store.getPlayer.playing);
</script>

<style scoped>
.audio-player {
  position: relative;
  overflow: hidden;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 16px;
  color: var(--cream);
}
.eyebrow {
  font-family: var(--font-sans);
  font-size: 0.55rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.5;
  color: var(--cream);
  z-index: 1;
}
.cover-wrap { z-index: 1; }
.cover-art {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.5);
  display: block;
}
.book-meta { text-align: center; z-index: 1; }
.book-title {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--cream);
  line-height: 1.05;
  margin: 0 0 4px;
}
.book-author {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.85rem;
  color: var(--cream);
  opacity: 0.6;
  margin: 0;
}
.progress-section { width: 100%; z-index: 1; }
.time-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--cream);
  opacity: 0.6;
  margin-top: 6px;
}
.transport {
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1;
}
.ctrl-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 50%;
  color: var(--cream);
  width: 40px;
  height: 40px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ctrl-btn:hover { background: rgba(255,255,255,0.12); }
.play-btn {
  background: var(--ochre);
  color: var(--ink);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-btn:hover { background: var(--ochre-deep); }
.ghost-row {
  display: flex;
  gap: 20px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--cream);
  opacity: 0.5;
  z-index: 1;
}
</style>
