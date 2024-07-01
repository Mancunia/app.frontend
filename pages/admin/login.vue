<template>
    <div class="background">
        <section class="card align-center">
            <form @submit.prevent="login">
                <h2>Login</h2>
                <UiAdminInputField placeHolder="Email" v-model="form.email" />
                <UiAdminInputField placeHolder="Password" v-model="form.password" type="password" />
                <UiAdminButton>
                    <UiLoader v-if="loading" />
                    Login
                </UiAdminButton>
            </form>
        </section>
    </div>
</template>

<script setup lang="ts">
const form = ref({
    email: '',
    password: ''
});

const {admin_login,loading}=useAuth();

const login = async () => {
    await admin_login(form.value);
};

definePageMeta({
    title: 'Admin Login',
    middleware:'admin'
})

</script>

<style scoped>
@import url("~/assets/css/admin/login.css");
</style>