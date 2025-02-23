<template>
    <div class="book-card">
        <div class="img-box">
            <img :src="checkForOldFile(book.cover)" alt="">
        </div>
        <div class="details">
            <span style="display: flex; flex-direction: row; justify-content: space-between;">
                <p>{{ book.title }}</p>
                <span v-if="store.getPlaying.book._id === book._id"><img src="@/assets/playing.gif" width="30"
                        height="15" /></span>
            </span>
            <p>Author: <span>{{ book.authors.toString() }}</span></p>
            <p>Played: <span>{{ book.meta.played }}</span></p>
            <!-- <p>Category: <span>{{ book.category.map((cate: string) => categories.find((cat) => cat.id === cate)?.name)
                    }}</span></p> -->
            <div class="link">
                <NuxtLink :to="`${routes.app.book}${book._id}`">View</NuxtLink>
            </div>
        </div>
    </div>
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

const store = useAuthStore();
const { checkForOldFile } = useUtils()
</script>

<style scoped>
.book-card {
    display: flex;
    flex-direction: row;
    background-color: #f0e6e3;
    height: 170px;
    border-radius: 10px;
    align-items: center;
    cursor: pointer;
}

.img-box {
    width: 50%;
    height: 100%;
    align-items: center;
}

.img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px 0 0 10px;
}

.details {
    box-sizing: border-box;
    flex: 1;
    width: 50%;
    height: 100%;
    padding: 15px 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.details .link a {
    color: black;
    font-size: 15px;
    font-family: Pontano Sans;
    font-weight: 400;
    text-decoration: none;
    word-wrap: break-word;
    justify-content: end;
}
</style>