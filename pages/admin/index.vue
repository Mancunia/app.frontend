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
    <CommonModal v-model="isModalOpen">
        <AdminBooksForm @saved="onSave" />
    </CommonModal>
</template>
<script setup lang="ts">

const router = useRouter()
const { setCommon } = useCommon(USER_ROLES.ADMIN)

const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();

const addBook = () => {
    openModal()
}

const onSave = (data: any) => {
    try {
        console.log('saved', data)
        closeModal()
        router.push({ query: { bookId: data._id, action: 'view' } })
    }
    catch (error) {
        console.log(error)
    }

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
<style scoped>
.admin-main {
    display: flex;
    flex-direction: row;
    height: 100%;
    background-color: #f5f5f5;
}
</style>