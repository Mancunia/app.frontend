<template>
    <div class="page">
        <div class="card">
            <h1 class="title">New Password</h1>
            <div class="email">
                {{ email }}
            </div>
            <form class="form" @submit.prevent="sendResetPasswordRequest">
                <UiPassword @password="form.passwordOne = $event" />
                <UiPassword @password="form.passwordTwo = $event" />
                <UiAdminButton type="submit">Reset Password</UiAdminButton>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { resetPassword } from '~/services/auth';

const route = useRoute();

const verificationCode = route.query.token as string
const email = route.query.email as string

const form = ref({
    passwordOne: '',
    passwordTwo: ''

})

const { addError, addSuccess } = useToast()
const sendResetPasswordRequest = async () => {
    try {
        if (!checkPasswords()) return
        const res = await resetPassword({ token: verificationCode, newPassword: form.value.passwordOne })
        if(res){
             addSuccess('Password reset successfully')
             navigateTo(routes.app.login)
        }
       
    } catch (error: unknown) {
        console.error({ error })
        addError('An error occurred')
    }

}

const checkPasswords = () => {
    if (form.value.passwordOne !== form.value.passwordTwo) {
        addError('Passwords do not match')
        return false
    }
    return true
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

.card {
    padding: 5%;
    box-shadow: 1px 1px 5px var(--hairline);
}

.title {
    font-family: var(--font-display);
    font-size: 1.5rem;
}

.email {
    margin-bottom: 10px;
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--muted);
    padding: 20px;
    box-shadow: 0 0 0 1px var(--hairline);
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
    border: 1px solid var(--hairline);
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
</style>