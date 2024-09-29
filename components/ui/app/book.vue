<template>
    <NuxtLink style="text-decoration: none;" :to="`/app/book/${props.book._id}`">
        <div class="card">
            <img :src="`${book.cover}` ?? '@/assets/images/placeHolder.png'" alt="">
            <div class="description">
                <h2 class="title">{{ book.title }}</h2>
                <h3 class="author">{{ String(book.authors) }}</h3>
            </div>
        </div>

    </NuxtLink>
</template>

<script setup lang="ts">
import type { BOOK } from '~/types/book';

const props = defineProps({
    book: {
        type: Object as PropType<BOOK>,
        required: true
    }

})
</script>

<style scoped>
.card {
    width: 12rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: transparent;
    border: none;
    padding: 2%
}

.card .description {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
}

.card .title {
    font-size: 16px;
    font-weight: 600;
    color: #000;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: unset;
}

.card .author {
    font-size: 10px;
    font-weight: 500;
    color: #000;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;

}
</style>