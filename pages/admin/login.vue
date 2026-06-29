<template>
    <div class="admin-container">
        <div class="auth-login">
            <h2>Login</h2>
            <form @submit.prevent="login" class="auth-card">

                <UiAdminInputField @update:model-value="form.email = $event" place-holder="email" type="email" />
                <UiAdminInputField @update:model-value="form.password = $event" place-holder="password"
                    type="password" />
                <UiAdminButton type="submit">
                    <UiLoader v-if="loading" :theme="{ color: 'var(--cream)' }" />
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
    middleware: 'admin',
    layout: ''
})

</script>

<style scoped>
.admin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--paper);
    background-image: url('@/assets/images/bookShelve.png');
    padding: 24px;
}

.auth-login {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    align-items: center;
    padding: 32px 24px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 1px 1px 1px 1px var(--ink);
    border-radius: 10px;
}

form {
    padding: 24px 0 0 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.link {
    margin-top: 24px;
    color: var(--kola);
    font-family: var(--font-display);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
    text-decoration: none;
}

@media (min-width: 768px) {
    .admin-container {
        padding: 40px;
    }

    .auth-login {
        padding: 40px 32px;
    }

    form {
        width: 100%;
    }
}
</style>