<template>
    <div v-if="book" class="book-card" :class="{ active: route.query.bookId === book.id }">
        <img :src="checkForOldFile(book.cover)" :alt="`${book.title}_cover`">
        <div class="book-details">
            <header>{{ book.title }}</header>
            <p>{{ book.authors?.toString() }}</p>
        </div>

    </div>
</template>

<script setup lang="ts">
import { type BOOK } from '~/types/book';
const props = defineProps({
    book: {
        type: Object as PropType<BOOK>,
        required: true
    }
})
const actions = [{
    id: 'view', name: 'View'
}, {
    id: 'edit', name: 'Edit'
}, {
    id: 'delete', name: 'Delete'
}]
const router = useRouter()
const route = useRoute()
const { checkForOldFile } = useUtils()

const view = () => {
    router.push({ query: { bookId: props.book.id, action: 'view' } })
}
const edit = () => {
    router.push({ query: { bookId: props.book.id, action: 'edit' } })
}

</script>
<style lang="css" scoped>
.active {
    border: 2px solid brown
}
.book-card{
    display:flex;
    flex-direction: row;
   gap:10px;
    width:100%;
    padding: 10px;
    margin-bottom: 30px;
    border-radius: 10px;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

}
.book-card img {
    width: 80px;
    height: 100px;
    border-radius: 10px;
    object-fit: cover;
}
.book-card .book-details {
    padding: 10px;
    bottom: 0;
    width: 100%;
}
</style>