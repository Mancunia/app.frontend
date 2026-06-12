<template>
  <div v-if="book" class="audio-player ase-paper" data-dark="true">
    <UiAseFireMotes :count="8" style="opacity: 0.1" />

    <!-- 1. Cover Art -->
    <div class="cover-section">
      <img :src="checkForOldFile(book.cover)" class="cover-art" alt="Book cover" />
    </div>

    <!-- 2. Stats Row -->
    <div class="stats-row">
      <div class="stat-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stat-icon">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M2 12h20"></path>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span class="stat-text">{{ language }}</span>
      </div>
      <div class="stat-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stat-icon">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
        <span class="stat-text">{{ narrators }}</span>
      </div>
      <div class="stat-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stat-icon">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <span class="stat-text">{{ queueIndex >= 0 ? `ch. ${queueIndex + 1}/${queue.length}` : 'ch. —' }}</span>
      </div>
    </div>

    <!-- 3. Title & Author -->
    <div class="meta-section">
      <h1 class="display-title">{{ book.title }}</h1>
      <p class="serif-author">{{ authors }}</p>
    </div>

    <!-- 4. Progress -->
    <div class="progress-section">
      <div class="kente-wrap">
        <UiAseKenteWeft :progress="duration > 0 ? currentTime / duration : 0" :height="10" />
      </div>
      <div class="time-labels">
        <span class="time-elapsed">{{ secondsToMinutes(currentTime) }}</span>
        <span class="time-remaining">-{{ secondsToMinutes(Math.max(0, duration - currentTime)) }}</span>
      </div>
    </div>

    <!-- Secondary Actions (Speed & Chapters) -->
    <div class="secondary-actions">
      <span class="speed-group">
        <button @click="decreaseSpeed" class="action-btn speed-adj">−</button>
        <button class="action-btn speed-val">{{ playbackRate }}×</button>
        <button @click="increaseSpeed" class="action-btn speed-adj">+</button>
      </span>
      <button class="action-btn chapters-btn" @click="$emit('showQueue')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        Queue
      </button>
    </div>

    <!-- 5. Controls -->
    <div class="controls-section">
      <button @click="playPrevInQueue" class="icon-btn secondary-btn" :disabled="!hasPrev">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
      </button>

      <button @click="rewindAudio(15)" class="icon-btn secondary-btn skip-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 17l-5-5 5-5"></path>
          <path d="M18 17l-5-5 5-5"></path>
        </svg>
      </button>

      <button @click="toggleAudio" class="play-pause-btn">
        <svg v-if="playing" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1"></rect>
          <rect x="14" y="4" width="4" height="16" rx="1"></rect>
        </svg>
        <svg v-else width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"></path>
        </svg>
      </button>

      <button @click="fastForwardAudio(15)" class="icon-btn secondary-btn skip-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 17l5-5-5-5"></path>
          <path d="M6 17l5-5-5-5"></path>
        </svg>
      </button>

      <button @click="playNextInQueue" class="icon-btn secondary-btn" :disabled="!hasNext">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </button>
    </div>

    <!-- Volume -->
    <div class="volume-section">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="volume-icon">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
      <div class="volume-bar-wrap">
        <div class="volume-fill" :style="{ width: `${store.getPlayer.volume * 100}%` }"></div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          :value="store.getPlayer.volume * 100" 
          @input="handleVolumeChange"
          class="volume-slider"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['showQueue'])
const store = useAuthStore();
const { checkForOldFile, secondsToMinutes } = useUtils();
const book = computed(() => store.getPlaying.book ?? null);

const authors = computed(()=>{
  return book.value?.authors?.map(a => typeof a === 'string' ? a : a.name).join(', ') || 'Author'
})
const narrators = computed(()=>{
  return book.value?.narrators?.map(n => typeof n === 'string' ? n : n.name).join(', ') || 'Narrator'
})
const language = computed(()=>{
  return book.value?.languages[0] || 'unknown'
})

const {
  toggleAudio, duration, currentTime, fastForwardAudio, rewindAudio,
  setVolume, playbackRate, increaseSpeed, decreaseSpeed,
  hasNext, hasPrev, playNextInQueue, playPrevInQueue, queue, queueIndex
} = usePlayer(USER_ROLES.USER);

const playing = computed(() => store.getPlayer.playing);

const handleVolumeChange = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value);
  setVolume(val);
  store.setPlayer({ volume: val / 100 });
};
</script>

<style scoped>
.audio-player {
  position: relative;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 24px 0;
  background: var(--paper); /* Uses dark variant via data-dark="true" */
  color: #ffffff;
  box-sizing: border-box;
}

@media (min-width: 750px) {
  .audio-player {
    padding: 40px 24px 30px;
  }
}

/* 1. Cover */
.cover-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}
.cover-art {
  width: 240px;
  height: 280px;
  object-fit: cover;
  border-radius: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

/* 2. Stats Row */
.stats-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
  margin-bottom: 24px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.stat-icon {
  width: 20px;
  height: 20px;
  opacity: 0.9;
}
.stat-text {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: #ffffff;
}

/* 3. Meta */
.meta-section {
  text-align: center;
  margin-bottom: 24px;
}
.display-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  line-height: 1.1;
  margin: 0 0 10px;
  color: #ffffff;
}
.serif-author {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.1rem;
  opacity: 0.8;
  margin: 0;
  color: #ffffff;
}

/* 4. Progress */
.progress-section {
  width: 100%;
  margin-bottom: 24px;
}
.kente-wrap {
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
}
.time-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
}
.time-elapsed {
  color: #ffffff;
  opacity: 0.95;
}
.time-remaining {
  color: #ffffff;
  opacity: 0.6;
}

/* Secondary Actions */
.secondary-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 320px;
  margin-bottom: 24px;
}

.action-btn {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}
.action-btn:hover {
  background: rgba(255,255,255,0.18);
  border-color: rgba(255,255,255,0.25);
}

.speed-group {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.08);
  padding: 3px;
  border-radius: 14px;
}
.speed-adj {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  justify-content: center;
  font-size: 1.1rem;
  padding: 0;
}
.speed-val {
  background: none;
  border: none;
  min-width: 42px;
  justify-content: center;
}

.chapters-btn {
  border-radius: 14px;
  padding: 8px 14px;
}

/* 5. Controls */
.controls-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 32px;
}
.icon-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.icon-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.3);
}
.icon-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.secondary-btn {
  width: 50px;
  height: 50px;
}
.skip-btn {
  position: relative;
}
.play-pause-btn {
  width: 88px;
  height: 88px;
  background: var(--ochre);
  color: var(--ink);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(201, 122, 58, 0.4);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.play-pause-btn:active {
  transform: scale(0.92);
}

/* Volume Section */
.volume-section {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 300px;
  margin-bottom: 40px;
}

.volume-icon {
  color: #ffffff;
  opacity: 1;
}

.volume-bar-wrap {
  position: relative;
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.volume-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--ochre);
  border-radius: 2px;
  pointer-events: none;
}

.volume-slider {
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  height: 20px;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

/* Bottom Safety Spacer */
.audio-player::after {
  content: '';
  display: block;
  height: calc(80px + env(safe-area-inset-bottom));
  width: 100%;
  flex-shrink: 0;
}
</style>
