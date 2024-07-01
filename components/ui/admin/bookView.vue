<template>
    <div class="rectangleDiv">
        <!-- image -->
        <div class="image">
            <img :src="`https://www.anansesemfie.com${book.cover}`" alt="book_art" />
        </div>
        <!-- book details -->
        <div class="details">
            <h3>{{ book.title }}</h3>
            <p>Author</p>
        </div>
    </div>
</template>
<script setup lang="ts">

import { type BOOK } from '~/types/book';
const props = defineProps({
    book: {
        type: Object as PropType<BOOK>,
        required: true
    },
});

</script>
<style scoped>
.rectangleDiv {
    display: flex;
    flex-direction: row;
    gap: 10%;
    width: 80%;
    margin-top: 10px;
    padding: 0% 4%;
    align-self: center;
    position: relative;
    box-shadow: 0px 4px 9.9px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    background-color: #f4eded;
    height: 125px;
}

.image {
    width: 88px;
    height: inherit;
    flex-shrink: 0;
    border-radius: 5px;
    align-content: center;
}

.image img {
    width: 100%;
    position: relative;
    border-radius: 5px;
    max-width: 100%;
    overflow: hidden;
    height: 95px;
    object-fit: cover;

}

.details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 100%;
    height: inherit;
}
</style>