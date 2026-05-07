<template>
    <div class="page">
        <NuxtLink :to="routes.app.login" class="link">Back to Login</NuxtLink>
        <div class="card">
            <h1 class="title">Reset Password</h1>
            <form class="form" @submit.prevent="sendNewPasswordRequest">
                <input type="email" placeholder="Email" v-model="form.email" />
                <UiAdminButton type="submit">Submit</UiAdminButton>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { forgotPassword } from '~/services/auth';

const form = ref({
    email: ''
})
const { addSuccess } = useToast()
const sendNewPasswordRequest = async () => {
    try {
        const res = await forgotPassword(form.value.email)
        if (res) {
            addSuccess('Password reset link sent to email')
            form.value.email = ''
        }

    } catch (error: unknown) {
        console.error({ error })
    }
}

</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20% 5%;
}

.link {
    margin-top: 10%;
    color: var(--kola);
    font-family: var(--font-display);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
    text-decoration: none;
}

.card {
    padding: 5%;
    box-shadow: 1px 1px 5px var(--calabash);
}

.title {
    font-family: var(--font-display);
    font-size: 1.5rem;
}

.email {
    margin-bottom: 10px;
    font-size: 1.2rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.5);
    padding: 20px;
    box-shadow: 1px 1px 1px 1px var(--ink);
    border-radius: 10px;
}

.form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5%;
}

.form input {
    margin-bottom: 10px;
    width: 15rem;
    padding: 10px;
    border: 1px solid var(--calabash);
    border-radius: 5px;
}

.form button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: var(--kola);
    color: var(--cream);
    cursor: pointer;
}

.form button:hover {
    background-color: var(--kola-2);
}
@media (min-width: 768px) {
    .page {
        padding: 10% 5%;
    }
}
</style>