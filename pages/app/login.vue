<template>
    <section>
        <form class="card align-center" @submit.prevent="login">
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
    padding: 40% 20%;
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
