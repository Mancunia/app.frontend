<template>
    <div class="page">
        <div class="profile">
            <AppProfile />
        </div>
        <div class="settings">
            <div class="links">
                <NuxtLink to="/app/subscription">
                    <i class="n"></i>
                    Subscription
                </NuxtLink>
            </div>
            <div class="logout">
                <button @click="pageSettings.isLogoutOpen = true">
                    Logout
                </button>
            </div>

        </div>
    </div>
    <CommonModal v-model="pageSettings.isLogoutOpen">
        <div class="logout_form">
            <h1>Are you sure you want to logout?</h1>
            <div class="buttons">
                <button @click="pageSettings.isLogoutOpen = false">No</button>
                <button @click="logout">Yes</button>
            </div>
        </div>
    </CommonModal>
</template>

<script setup lang="ts">
definePageMeta({
    title: 'Profile',
    middleware: 'app',
    layout: 'app-layout'
})
const pageSettings = ref<{
    isLogoutOpen: boolean
}>({
    isLogoutOpen: false
})

const { user_logout } = useAuth()

const logout = () => {
    try {
        user_logout()
    }
    catch (error: unknown) {
        console.log(error)
    }
    finally {
        pageSettings.value.isLogoutOpen = false
    }
}
</script>

<style scoped>
.page {
    justify-self: center;
    display: flex;
    width: 400px;
    padding:5%;
    flex-direction: column;
    gap: calc(50px + 1vh);
    justify-content: center;
    align-items: center;
}

.profile {
    width: 100%;
}

.settings {
    width: 100%;
    align-items: center;
}

.links {
    display: flex;
    justify-content: center;
    gap: 20px;
}
.links a{
    font-family: "Rammetto One";
    font-size: 1rem;
    color: #0a0a0a;
    border: none;
    border-radius: 22px;

}
.logout {
    /* width: 100%; */
    display: flex;
    padding: 10% 20%;
}

.logout button {
    font-family: "Rammetto One";
    font-size: 1.5rem;
    color: #ffffff;
    background-color: #0a0a0a;
    border: none;
    padding: 5px 10px;
    border-radius: 22px;
}

.logout_form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10% 20%;
}

.logout_form .buttons {
    display: flex;
    gap: 20px;
}

.logout_form .buttons button {
    font-family: "Rammetto One";
    font-size: 1.5rem;
    color: #ffffff;
    background-color: #0a0a0a;
    border: none;
    padding: 5px 10px;
    border-radius: 22px;
}
</style>