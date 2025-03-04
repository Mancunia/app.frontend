<template>
    <div class="admin-container">
        <div class="auth-login">
            <h2>Login</h2>
            <form @submit.prevent="login" class="auth-card">

                <UiAdminInputField @update:model-value="form.email = $event" place-holder="email" type="email" />
                <UiAdminInputField @update:model-value="form.password = $event" place-holder="password"
                    type="password" />
                <UiAdminButton type="submit">
                    <UiLoader v-if="loading" :theme="{ color: '#fff' }" />
                    Login
                </UiAdminButton>
            </form>

            <NuxtLink :to="routes.app.forgotPassword" class="link">Forgot Password</NuxtLink>
        </div>
    </div>

</template>

<script setup lang="ts">
import routes from '~/routes';

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
.admin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
    background-image: url('@/assets/images/bookShelve.png');
    padding: 15% 5%;
}

.auth-login {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    align-items: center;
    padding: 5%;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 1px 1px 1px 1px #000;
    border-radius: 10px;
}

form {
    padding: 10% 5%;
    width: 80%;
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
    .admin-container {
        padding: 5%;
    }

    .auth-login {
        padding: 5% 5%;
    }

    form {
        width: 100%;
    }
}
</style>