<template>
    <div v-if="book" class="book-card" :class="{ active: route.query.bookId === book._id }" @click="takeAction('view')">
        <img :src="book.cover" :alt="`${book.title}_cover`">
        <div class="book-details">
            <p>Title: {{ book.title }}</p>
            <p>Author: {{ book.authors.toString() }}</p>
        </div>
        <div class="btn">
            <UiSelect :data-list="actions" @selected="takeAction">
                <template v-slot:icon>
                    <img src="@/assets/images/context_menu.png" alt="" srcset="">
                </template>
            </UiSelect>
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

const view = () => {
    router.push({ query: { bookId: props.book._id, action: 'view' } })
}
const edit = () => {
    router.push({ query: { bookId: props.book._id, action: 'edit' } })
}

const takeAction = (action: string) => {
    switch (action) {
        case 'view':
            return view()
        case 'edit':
            return edit()
        default:
            return
    }
}
</script>
<style lang="css" scoped>
.active {
    border: 2px solid brown
}
</style>