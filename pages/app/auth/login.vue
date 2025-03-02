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
    justify-content: center;
    align-items: center;
    padding: 30% 20%;
}

form .title {
    font-family: "Rammetto One";
    font-size: 1.5rem;
}

form .signup {
    margin-top: 10%;
    color: #4D2316;
    font-family: "Rammetto One";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
    text-decoration: none;
}

.link {
    margin-top: 10%;
    color: #4D2316;
    font-family: "Rammetto One";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
    text-decoration: none;
}

@media (min-width: 768px) {
    form {
        padding: 40% 20%;
    }
}

@media (min-width: 1024px) {
    form {
        padding: 40% 20%;
    }
}
</style>
