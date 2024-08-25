<template>
        <div class="admin-main">
            <div class="sidebar">
                <UiAdminButton @click="addBook" class="addbtn">ADD NEW BOOK</UiAdminButton>
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

const addBook=()=>{
    router.push({query:{action:'new'}})
}
definePageMeta({
    title: 'Admin',
    middleware: 'admin',
    layout: 'admin-layout',
})
</script>