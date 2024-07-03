<template>
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
</template>

<script setup lang="ts">
const form = ref({
    email: '',
    password: ''
});

const { user_login, loading } = useAuth();

const login = async () => {
    await user_login(form.value);
};

definePageMeta({
    title: 'Login',
    middleware: 'app'
})
</script>

<style scoped>

</style>