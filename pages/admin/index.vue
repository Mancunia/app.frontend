<template>
    <div class="admin-main">
        <div class="sidebar">
            <UiAdminButton @click="addBook">ADD NEW BOOK</UiAdminButton>
            <AdminBooksBookList />
        </div>

        <div class="content-container">
            <div class="wrapper">
                <AdminBooksBookView />
                <AdminPlayer />
            </div>
        </div>
    </div>

</template>
<script setup lang="ts">

const router = useRouter()
const { setCommon } = useCommon()



const addBook = () => {
    router.push({ query: { action: 'new' } })
}

onMounted(() => {
    setCommon()
})
definePageMeta({
    title: 'Admin',
    middleware: 'admin',
    layout: 'admin-layout',
})
</script>