<template>
    <div class="profile">
        <div class="dp">
            <img v-if="user.dp" :src="user.dp" alt="">
            <img v-else src="@/assets/images/profile.png" alt="profile" />
        </div>
        <div class="name">
            {{ user.username }}
        </div>
        <div class="edit">
            <UiAdminButton @click="pageSettings.isEditFormOpen = true">edit</UiAdminButton>
        </div>
    </div>
    <CommonModal v-model="pageSettings.isEditFormOpen">

    </CommonModal>

</template>

<script setup lang="ts">

const pageSettings = ref<{
    isEditFormOpen: boolean
}>({
    isEditFormOpen: false
})

const user = useAuthStore().getUser



</script>

<style scoped>
.profile {
    width: inherit;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px;
    border-radius: 22px;
    background-color: #e8bf8d;
    margin-top: 10%;
}

.profile .dp img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}

.profile .name {
    font-family: "Rammetto One";
    font-size: 1.5rem;
    color: #020202;
}

.edit {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10% 20%;
}

.edit button {
    font-family: "Rammetto One";
    font-size: 1.5rem;
    color: #563F29;
    background-color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 22px;
}
</style>