<template>
    <div class="pdf-reader">
        <header>
            <h1>Page: {{ currentPage }}</h1>
            <div class="controls">
                <button v-if="pdfFile?.pages && currentPage > 1" @click.prevent="prevPage">Prev</button>
                <button v-if="pdfFile?.pages && currentPage < pdfFile?.pages?.length"
                    @click.prevent="nextPage">Next</button>
                <button @click="zoomIn">Zoom In</button>
                <button @click="zoomOut">Zoom Out</button>
            </div>
        </header>

        <main>
            <div id="pdf-container">
                <div class="pdf-page" :style="{ transform: `scale(${scale})` }">
                    {{ currentPageDetails }}
                </div>
            </div>
        </main>

        <footer>
            {{ book?.title }}
        </footer>
    </div>
</template>

<script setup lang="ts">
import type { PdfFileData } from '~/types/book';

const pdfFile = useState<PdfFileData | null>("pdfData");
const store = useAuthStore();

const currentPage = ref<number>(1)
const scale = ref(1)
const hasMounted = ref(false);

const book = computed(() => store.getPlaying.book ?? null)
const currentPageDetails = computed(() => {
    return pdfFile.value?.pages[currentPage.value - 1].textContent
})

function prevPage() {
    currentPage.value--
}

function nextPage() {
    if (
        pdfFile.value &&
        pdfFile.value.pages &&
        currentPage.value - 1 <= pdfFile.value.pages.length
    ) {
        currentPage.value++
    }
}

function zoomIn() {
    scale.value += 0.1
}

function zoomOut() {
    if (scale.value > 0.2) scale.value -= 0.1
}
watch(currentPage, (newPage) => {
    store.setPlayingPage(newPage)
})

onMounted(() => {
    const storePage = store.getPlaying.page
    nextTick(() => {
        if (storePage) {
            currentPage.value = storePage
        }
    });

})

</script>


<style scoped>
.pdf-reader {
    display: flex;
    position: relative;
    flex-direction: column;
    height: 90vh;
    font-family: Arial, sans-serif;
    background: var(--calabash);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

header {
    background: var(--ink);
    color: var(--cream);
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header h1 {
    font-size: 1.2rem;
}

.controls {
    display: flex;
    gap: 10px;
}

.controls button {
    background: var(--kola);
    color: var(--cream);
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.controls button:hover {
    background: var(--kola-2);
}

main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
    padding: 20px;
    background: var(--hairline);
}

#pdf-container {
    width: 100%;
    max-width: 900px;
    /* background-color: #fff; */
    border-radius: 8px;
    /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); */
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pdf-page {
    width: 100%;
    position: relative;
    /* background-color: #e5e7eb; */
    display: flex;
    justify-content: center;
    align-items: flex-start;
    font-size: 1rem;
    border-radius: 4px;
    transition: transform 0.2s ease;
    transform-origin: top center;
}

footer {
    background-color: #1f2937;
    color: var(--cream);
    padding: 10px 20px;
    text-align: center;
}

@media only screen and (min-width: 750px) {
   
}
</style>
