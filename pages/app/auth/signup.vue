<template>
    <section>
        <form class="card align-center" @submit.prevent="signup">
            <h2 class="title">SignUp</h2>
            <UiAdminInputField :style="'appAuthInput'" placeHolder="Email" v-model="form.email" type="email" />
            <UiAdminInputField :style="'appAuthInput'" placeHolder="Enter Username" v-model="form.username" />
            <UiAdminInputField :style="'appAuthInput'" placeHolder="Password" v-model="form.password" type="password" />
            <UiAdminInputField :style="'appAuthInput'" placeHolder="Confirm Password" v-model="form.confirmPassword"
                type="password" />
            <UiAdminButton class="appAuthButton">
                <UiLoader v-if="loading" />
                Submit
            </UiAdminButton>
            <NuxtLink :to="routes.app.login" class="signup">Login</NuxtLink>
        </form>
    </section>
</template>

<script setup lang="ts">
import routes from '~/routes';

const form = ref({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    account: USER_ROLES.USER
});

const { user_register, loading } = useAuth();

const signup = async () => {
    await user_register(form.value);
};

definePageMeta({
    title: 'Login',
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
</style>
