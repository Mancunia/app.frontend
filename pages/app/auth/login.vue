<template>
    <section>
        <form class="card align-center" @submit.prevent="login">
            <h2 class="title">Login</h2>
            <UiAdminInputField :style="'appAuthInput'" placeHolder="Email" v-model="form.email" />
            <UiAdminInputField :style="'appAuthInput'" placeHolder="Password" v-model="form.password" type="password" />
            <UiAdminButton class="appAuthButton">
                <UiLoader v-if="loading" />
                Login
            </UiAdminButton>
            <NuxtLink :to="routes.app.signup" class="signup">SignUp</NuxtLink>
            <NuxtLink :to="routes.app.forgotPassword" class="link">Forgot Password</NuxtLink>
        </form>
    </section>
</template>

<script setup lang="ts">
import routes from '~/routes';

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
    middleware: 'app',
    layout: 'app-auth'
})
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
}

form .title {
    font-family: var(--font-display);
    color: var(--cream);
    font-size: 1.5rem;
    text-align: center;
    margin: 0 0 8px;
}

form .signup {
    color: var(--ochre);
    font-family: var(--font-sans);
    text-decoration: none;
}

.link {
    color: var(--ochre);
    font-family: var(--font-sans);
    text-decoration: none;
}
</style>
