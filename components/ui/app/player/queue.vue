<template>
  <div class="queue-panel">
    <div class="queue-header">
      <button class="back-btn" @click="$emit('close')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <div class="title-wrap">
        <h2 class="queue-title">Up Next</h2>
        <span class="beta-label">BETA</span>
      </div>
      <button v-if="queue.length" class="clear-btn" @click="store.clearQueue(); $emit('close')">Clear</button>
    </div>

    <div v-if="!queue.length" class="queue-empty">
      <p>No chapters in queue</p>
    </div>

    <div v-else class="queue-list">
      <div
        v-for="(item, index) in queue"
        :key="item.chapter.id ?? index"
        class="queue-item"
        :class="{ active: index === queueIndex, playing: index === queueIndex && store.getPlayer.playing }"
        @click="playChapterAt(index)"
      >
        <div class="item-index">
          <span v-if="index === queueIndex && store.getPlayer.playing" class="playing-indicator">▶</span>
          <span v-else class="index-num">{{ index + 1 }}</span>
        </div>
        <div class="item-info">
          <span class="item-title">{{ item.chapter.title }}</span>
          <span class="item-type">{{ item.chapter.type === 'ebook' ? '📖' : '🎤' }}</span>
        </div>
        <button class="remove-btn" @click.stop="store.removeFromQueue(index)" title="Remove">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
const store = useAuthStore();
const { queue, queueIndex, playChapterAt } = usePlayer(USER_ROLES.USER);
</script>

<style scoped>
.queue-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: var(--cream);
  padding: 20px;
}
.queue-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.back-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cream);
  cursor: pointer;
}
.back-btn:hover {
  background: rgba(255,255,255,0.2);
}
.queue-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  margin: 0;
}
.title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.beta-label {
  background: var(--ochre);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}
.clear-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px;
  color: var(--cream);
  font-family: var(--font-sans);
  font-size: 0.75rem;
  padding: 4px 12px;
  cursor: pointer;
  opacity: 0.6;
}
.clear-btn:hover {
  opacity: 1;
  background: rgba(255,255,255,0.1);
}
.queue-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  font-family: var(--font-serif);
  font-style: italic;
}
.queue-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.queue-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  cursor: pointer;
  transition: background 0.15s;
}
.queue-item:hover {
  background: rgba(255,255,255,0.1);
}
.queue-item.active {
  background: rgba(201, 122, 58, 0.15);
  border: 1px solid rgba(201, 122, 58, 0.3);
}
.item-index {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.index-num {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  opacity: 0.5;
}
.playing-indicator {
  color: var(--ochre);
  font-size: 0.8rem;
}
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.item-title {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-type {
  font-size: 0.7rem;
  opacity: 0.5;
}
.remove-btn {
  background: none;
  border: none;
  color: var(--cream);
  opacity: 0.3;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
}
.remove-btn:hover {
  opacity: 0.8;
}
</style>
