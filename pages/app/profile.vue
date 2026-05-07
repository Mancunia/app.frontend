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
.page { display: flex; flex-direction: column; align-items: center; max-width: 400px; padding: var(--d-pad); gap: 32px; margin: 0 auto; }
.profile { width: 100%; }
.settings { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.links { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
.links a { font-family: var(--font-display); color: var(--ink); font-size: 1rem; border: 1px solid var(--hairline); border-radius: 999px; padding: 8px 20px; text-decoration: none; }
.links a:hover { background: var(--calabash); }
.logout { display: flex; padding: 0; }
.logout button { font-family: var(--font-display); font-size: 1.2rem; color: var(--cream); background: var(--ink); border: none; padding: 8px 24px; border-radius: 22px; cursor: pointer; }
.logout_form { display: flex; flex-direction: column; align-items: center; padding: var(--d-pad); gap: 24px; }
.logout_form h1 { font-family: var(--font-display); color: var(--ink); font-size: 1.2rem; text-align: center; margin: 0; }
.logout_form .buttons { display: flex; gap: 16px; }
.logout_form .buttons button { font-family: var(--font-display); font-size: 1rem; color: var(--cream); background: var(--ink); border: none; padding: 8px 20px; border-radius: 22px; cursor: pointer; }
</style>
