<template>
    <NuxtLink v-if="book" class="book-link" :to="`${routes.app.book}${props.book.id}`"
        @click="selectBook = book">
        <div class="story-item">
            <div class="story-thumbnail"><img :src="checkForOldFile(book.cover)" alt=""></div>
            <div class="story-title">{{ book.title }}</div>
            <div class="writer">{{ String(book.authors) }}</div>
        </div>

    </NuxtLink>
</template>

<script setup lang="ts">
import routes from '~/routes';
import type { BOOK } from '~/types/book';

const props = defineProps({
    book: {
        type: Object as PropType<BOOK>,
        required: true
    }

})
const selectBook = useState<BOOK | null>('appBook', () => null)
const { checkForOldFile } = useUtils()
</script>

<style scoped>
.book-link { text-decoration: none; color: var(--ink); }
.story-item { display: flex; flex-direction: column; }
.story-thumbnail {
  width: 100%; aspect-ratio: 3/4; height: auto;
  border-radius: var(--d-radius); overflow: hidden;
  box-shadow: 0 4px 14px var(--hairline); margin-bottom: 6px;
}
.story-thumbnail img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.story-thumbnail img:hover { transform: scale(1.04); }
.story-title {
  font-family: var(--font-serif); font-weight: 600; font-size: 0.85rem; color: var(--ink);
  margin-top: 6px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
}
.writer { font-family: var(--font-serif); font-style: italic; font-size: 0.75rem; color: var(--muted); }
</style>