<template>
    <NuxtLink v-if="book" style="text-decoration: none; color:#000" :to="`${routes.app.book}${props.book.id}`"
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
.story-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

.story-thumbnail {
    width: 250px;
    /* Set the width of the container */
    height: 300px;
    /* Set the height of the container */
    overflow: hidden;
    /* Hide any overflow */
    border-radius: 20px;
    margin-bottom: 10px;
}

.story-thumbnail img {
    width: 100%;
    /* Make the image full width */
    height: 100%;
    /* Make the image full height */
    object-fit: cover;
    /* Scale the image to cover the container */
    transition: transform 0.5s;
    /* Add a transition effect */
}

.thumb-n:hover {
    transform: scale(1.1);
    /* Scale the image on hover */
}

.story-title {
    font-weight: 700;
    width: 250px;

}

.writer {
    font-size: 12px;
    font-weight: 600;
}
</style>