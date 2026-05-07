<template>
    <div class="page">
        <NuxtLink :to="routes.app.login" class="link">Back to Login</NuxtLink>
        <div class="card">
            <h1 class="title">Reset Password</h1>
            <form class="form" @submit.prevent="sendNewPasswordRequest">
                <UiAdminInputField placeHolder="Email" v-model="form.email" type="email" />
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

definePageMeta({ title: 'Forgot Password', middleware: 'app', layout: 'app-auth' })
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--d-pad);
}

.link {
    color: var(--ochre);
    font-family: var(--font-sans);
    text-decoration: none;
}

.card {
    padding: var(--d-pad);
}

.title {
    font-family: var(--font-display);
    color: var(--cream);
    font-size: 1.5rem;
    text-align: center;
    margin: 0 0 8px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
}

@media (min-width: 768px) {
    .page {
        padding: var(--d-pad);
    }
}
</style>
