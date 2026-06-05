<template>
  <Transition name="slide-up">
    <div v-if="chapter?.id" class="hearth-card" @click="toggleDrawer">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      
      <div class="card-content">
        <div class="book-info">
          <div class="cover-thumb">
            <img :src="checkForOldFile(chapter.book?.cover)" alt="Cover" />
          </div>
          <div class="text-meta">
            <p class="chapter-title">{{ cleanTitle(chapter.title ?? '') }}</p>
            <p class="book-title">{{ chapter.book?.title }}</p>
          </div>
        </div>

        <div class="controls">
          <button class="play-pause-btn" @click.stop="toggleAudio">
            <svg v-if="playerState.playing" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const store = useAuthStore();
const { checkForOldFile, cleanTitle } = useUtils();
const router = useRouter();

const { toggleAudio, duration, currentTime } = usePlayer(USER_ROLES.USER);

const chapter = computed(() => store.getPlaying);
const playerState = computed(() => store.getPlayer);

const progress = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

const toggleDrawer = () => {
  if (chapter.value?.id) {
    store.toggleDrawer(true);
  }
};
</script>

<style scoped>
.hearth-card {
  position: fixed;
  bottom: 95px; /* Above the fixed navigator */
  left: 16px;
  right: 16px;
  background: var(--ink);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 110;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  width: 100%;
}

.progress-fill {
  height: 100%;
  background: var(--ochre);
  transition: width 0.3s linear;
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
}

.book-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.cover-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--calabash);
}

.cover-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-meta {
  flex: 1;
  min-width: 0;
}

.chapter-title {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--cream);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-title {
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls {
  margin-left: 12px;
}

.play-pause-btn {
  background: none;
  border: none;
  color: var(--ochre);
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
}

.play-pause-btn:active {
  transform: scale(0.9);
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100px);
  opacity: 0;
}

@media (min-width: 750px) {
  .hearth-card {
    display: none;
  }
}
</style>
