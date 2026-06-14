<template>
    <NuxtLink v-if="book" class="book-link" :to="`${routes.app.book}${props.book.id}`"
        @click="selectBook = book">
        <div class="story-item">
            <div class="story-thumbnail"><img :src="checkForOldFile(book.cover)" alt=""></div>
            <div class="story-title">{{ book.title }}</div>
            <div v-if="book.authors?.length" class="writer">
                By: {{ book.authors.map(a => typeof a === 'string' ? a : a.name).join(', ') }}
            </div>
            <div v-if="book.narrators?.length" class="narrator">
                Narrated by: {{ book.narrators.map(n => typeof n === 'string' ? n : n.name).join(', ') }}
            </div>
            <div class="tooltip">
                <div class="tooltip-content">
                    <div v-if="book.authors?.length" class="tooltip-row">
                        <span class="tooltip-label">Authors:</span>
                        {{ book.authors.map(a => typeof a === 'string' ? a : a.name).join(', ') }}
                    </div>
                    <div v-if="book.narrators?.length" class="tooltip-row">
                        <span class="tooltip-label">Narrators:</span>
                        {{ book.narrators.map(n => typeof n === 'string' ? n : n.name).join(', ') }}
                    </div>
                    <div v-if="resolvedGenres.length" class="tooltip-row">
                        <span class="tooltip-label">Genres:</span>
                        {{ resolvedGenres.join(', ') }}
                    </div>
                    <div v-if="resolvedCategories.length" class="tooltip-row">
                        <span class="tooltip-label">Categories:</span>
                        {{ resolvedCategories.join(', ') }}
                    </div>
                    <div v-if="resolvedLanguages.length" class="tooltip-row">
                        <span class="tooltip-label">Languages:</span>
                        {{ resolvedLanguages.join(', ') }}
                    </div>
                </div>
            </div>
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
const store = useAuthStore()

const resolvedGenres = computed(() => {
    return props.book.genres?.map(g => typeof g === 'string' ? g : g.name) ?? []
})

const resolvedCategories = computed(() => {
    const cats = store.getCategories
    return props.book.category?.map(cat => {
        if (typeof cat === 'string') {
            return cats.find(c => c.id === cat)?.name || cat
        }
        return cat.name
    }) ?? []
})
const resolvedLanguages = computed(() => {
    const langs = store.getLanguages
    return props.book.languages?.map(lang => {
        if (typeof lang === 'string') {
            return langs.find(l => l.id === lang)?.name || lang
        }
        return lang.name
    }) ?? []
})
</script>

<style scoped>
.book-link { text-decoration: none; color: var(--ink); }
.story-item { display: flex; flex-direction: column; position: relative; }
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
.narrator { font-family: var(--font-sans); font-size: 0.7rem; color: var(--ochre); margin-top: 1px; }
.tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  margin-bottom: 8px;
  pointer-events: none;
}
.story-item:hover .tooltip {
  display: block;
}
.tooltip-content {
  background: var(--ink);
  color: var(--cream);
  padding: 10px 14px;
  border-radius: var(--d-radius);
  font-family: var(--font-sans);
  font-size: 0.72rem;
  line-height: 1.6;
  white-space: nowrap;
  max-width: 280px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--ink);
}
.tooltip-row { white-space: normal; }
.tooltip-label { font-weight: 600; margin-right: 3px; }
</style>
