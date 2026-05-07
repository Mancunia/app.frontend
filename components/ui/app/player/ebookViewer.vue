<template>
  <div class="pdf-reader">
    <header class="reader-header">
      <div class="header-meta">
        <span class="book-title">{{ book?.title }}</span>
        <span class="chapter-name">{{ store.getPlaying.chapterTitle ?? 'Chapter' }}</span>
      </div>
      <span class="page-indicator">p. {{ currentPage }} / {{ totalPages }}</span>
    </header>

    <main class="reader-body">
      <div class="pdf-page" :style="{ fontSize: fontSize + 'rem' }">
        {{ currentPageDetails }}
      </div>
    </main>

    <footer class="reader-footer">
      <UiAseKenteWeft :progress="totalPages > 0 ? currentPage / totalPages : 0" :height="5" />
      <div class="footer-controls">
        <button class="page-btn" :disabled="currentPage <= 1" @click="prevPage">‹</button>
        <div class="font-controls">
          <button class="font-btn" @click="decreaseFontSize">A−</button>
          <button class="font-btn" @click="increaseFontSize">A+</button>
        </div>
        <button class="page-btn" :disabled="currentPage >= totalPages" @click="nextPage">›</button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { PdfFileData } from '~/types/book';

const pdfFile = useState<PdfFileData | null>('pdfData');
const store = useAuthStore();

const currentPage = ref<number>(1);
const fontSize = ref(1);
const book = computed(() => store.getPlaying.book ?? null);
const totalPages = computed(() => pdfFile.value?.pages?.length ?? 0);
const currentPageDetails = computed(() => pdfFile.value?.pages[currentPage.value - 1]?.textContent ?? '');

function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }
function increaseFontSize() { if (fontSize.value < 1.4) fontSize.value = Math.round((fontSize.value + 0.1) * 10) / 10; }
function decreaseFontSize() { if (fontSize.value > 0.8) fontSize.value = Math.round((fontSize.value - 0.1) * 10) / 10; }

watch(currentPage, (newPage) => { store.setPlayingPage(newPage); });

onMounted(() => {
  nextTick(() => {
    const storePage = store.getPlaying.page;
    if (storePage) currentPage.value = storePage;
  });
});
</script>

<style scoped>
.pdf-reader {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
}
.reader-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 8px 12px;
  flex-shrink: 0;
}
.header-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}
.book-title {
  font-family: var(--font-serif);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cream);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chapter-name {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--cream);
  opacity: 0.5;
}
.page-indicator {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--ochre);
  white-space: nowrap;
  flex-shrink: 0;
}
.reader-body {
  flex: 1;
  overflow-y: auto;
  background: var(--paper);
  padding: 14px;
}
.pdf-page {
  font-family: var(--font-serif);
  line-height: 1.75;
  color: var(--ink-soft);
  white-space: pre-wrap;
}
.reader-footer {
  background: rgba(255,255,255,0.04);
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}
.footer-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-btn {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  color: var(--cream);
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.font-controls { display: flex; gap: 8px; }
.font-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  color: var(--cream);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  padding: 4px 10px;
  cursor: pointer;
}
.font-btn:hover { background: rgba(255,255,255,0.12); }
</style>
