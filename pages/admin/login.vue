<template>
    <div class="admin-container">
        <div class="auth-container">
            <div class="auth-login">
                <div class="auth-card">
                    <h2>Login</h2>
                    <UiAdminInputField @update:model-value="form.email = $event" label="Email" />
                    <UiAdminInputField @update:model-value="form.password = $event" label="Password" />
                    <UiAdminButton @click="login">
                        <UiLoader v-if="loading" :theme="{ color: '#fff' }" />
                        Login
                    </UiAdminButton>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
const form = ref({
    email: '',
    password: ''
});

const { admin_login, loading } = useAuth();

const login = async () => {
    await admin_login(form.value);
};

definePageMeta({
    title: 'Admin Login',
    middleware: 'admin'
})

</script>

<style scoped>
@import url('@/assets/css/admin/styles.css');
</style>