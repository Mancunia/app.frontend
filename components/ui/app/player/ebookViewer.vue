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
      <div class="pdf-container">
        <div v-if="rendering" class="pdf-loader">
          <UiLoader />
        </div>
        <ClientOnly>
          <VuePdfEmbed
            v-if="pdfSource"
            :source="pdfSource"
            :page="currentPage"
            :scale="fontSize"
            text-layer
            annotation-layer
            class="pdf-view"
            @loaded="onPdfLoaded"
            @rendered="rendering = false"
            @loading-failed="onLoadingFailed"
            @password-requested="onPasswordRequested"
          />
        </ClientOnly>
      </div>
    </main>

    <footer class="reader-footer">
      <UiAseKenteWeft :progress="pdfTotalPages > 0 ? currentPage / pdfTotalPages : 0" :height="5" />
      <div class="footer-controls">
        <button class="page-btn" :disabled="currentPage <= 1" @click="prevPage">‹</button>
        <div class="font-controls">
          <button class="font-btn" @click="decreaseFontSize">A−</button>
          <button class="font-btn" @click="increaseFontSize">A+</button>
        </div>
        <button class="page-btn" :disabled="currentPage >= pdfTotalPages" @click="nextPage">›</button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'
import * as pdfjs from 'pdfjs-dist'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import type { PdfFileData } from '~/types/book';

// Set worker source to match the project's pdfjs-dist version
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const pdfFile = useState<PdfFileData | null>('pdfData');
const store = useAuthStore();

const currentPage = ref<number>(1);
const fontSize = ref(1.2);
const pdfTotalPages = ref(0);
const rendering = ref(false);

const book = computed(() => store.getPlaying.book ?? null);
const totalPages = computed(() => pdfTotalPages.value);

/**
 * VuePdfEmbed has no `password` prop — the password must be embedded in the
 * source object itself (DocumentInitParameters from pdfjs-dist).
 * Passing `:password` as a separate prop is silently ignored by Vue.
 */
const pdfSource = computed(() => {
  if (!pdfFile.value?.data) return null;
  const src: Record<string, unknown> = { data: pdfFile.value.data };
  if (pdfFile.value.password) src.password = pdfFile.value.password;
  return src;
});

// VuePdfEmbed has no @loading event; watch source changes to show the spinner.
watch(pdfSource, (val) => { if (val) rendering.value = true; });

function onPdfLoaded(pdf: any) {
  pdfTotalPages.value = pdf.numPages;
}

function onLoadingFailed(err: Error) {
  rendering.value = false;
  console.error('[ebookViewer] PDF loading failed:', err.message);
}

/**
 * Fallback: if pdfjs still requests a password after we embed it in source
 * (e.g. wrong / missing password), surface the error rather than silently hanging.
 */
function onPasswordRequested({ isWrongPassword }: { callback: (pwd: string) => void; isWrongPassword: boolean }) {
  rendering.value = false;
  console.error('[ebookViewer] Password requested — embedded password was', isWrongPassword ? 'wrong' : 'missing');
}

function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < pdfTotalPages.value) currentPage.value++; }
function increaseFontSize() { if (fontSize.value < 2.0) fontSize.value = Math.round((fontSize.value + 0.1) * 10) / 10; }
function decreaseFontSize() { if (fontSize.value > 0.6) fontSize.value = Math.round((fontSize.value - 0.1) * 10) / 10; }

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
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.pdf-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.pdf-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* Force the PDF to fill the container using CSS instead of component props to avoid blanking bugs */
.pdf-view {
  width: 100% !important;
  background: white;
  display: block;
}
:deep(.pdf-view canvas),
:deep(.pdf-view > div) {
  width: 100% !important;
  height: auto !important;
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
