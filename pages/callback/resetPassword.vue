<template>
  <div class="reset-password-page">
    <div class="reset-intro">
      <h2 class="ase-serif">Create New Password</h2>
      <p class="ase-sans" v-if="email">Resetting password for: <strong>{{ email }}</strong></p>
      <p class="ase-sans" v-else>Enter your new password below.</p>
    </div>

    <form class="reset-form" @submit.prevent="sendResetPasswordRequest">
      <div class="form-group">
        <label class="ase-eyebrow">New Password</label>
        <UiPassword 
          v-model="form.passwordOne"
          placeholder="Enter new password" 
        />
      </div>

      <div class="form-group">
        <label class="ase-eyebrow">Confirm New Password</label>
        <UiPassword 
          v-model="form.passwordTwo"
          placeholder="Repeat new password" 
        />
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        <UiLoader v-if="loading" :theme="{ color: 'var(--cream)' }" />
        <span v-else>Update Password</span>
      </button>

      <div class="auth-footer">
        <p>Back to <NuxtLink :to="routes.app.login" class="login-link">Sign In</NuxtLink></p>
      </div>
    </form>
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
const loading = ref(false)

const { addError, addSuccess } = useToast()

const sendResetPasswordRequest = async () => {
    if (!checkPasswords()) return
    
    loading.value = true
    try {
        const res = await resetPassword({ 
            token: verificationCode, 
            newPassword: form.value.passwordOne 
        })
        
        // Following the pattern from useAuth where res.data is expected on success
        if (res) {
             addSuccess('Password reset successfully')
             navigateTo(routes.app.login)
        }
    } catch (error: unknown) {
        console.error({ error })
        // useHandleError (called in useRequest) will already show a toast if it's an API error
    } finally {
        loading.value = false
    }
}

const checkPasswords = () => {
    if (!form.value.passwordOne || !form.value.passwordTwo) {
        addError('Please fill in both password fields')
        return false
    }
    if (form.value.passwordOne !== form.value.passwordTwo) {
        addError('Passwords do not match')
        return false
    }
    if (form.value.passwordOne.length < 6) {
        addError('Password must be at least 6 characters long')
        return false
    }
    return true
}

definePageMeta({ 
    title: 'Reset Password', 
    middleware: 'app', 
    layout: 'app-auth' 
})
</script>

<style scoped>
.reset-password-page {
  width: 100%;
}

.reset-intro {
  margin-bottom: 32px;
}

.reset-intro h2 {
  font-size: 1.8rem;
  color: var(--ink);
  margin-bottom: 8px;
}

.reset-intro p {
  color: var(--muted);
  font-size: 0.95rem;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 
 * We need to override the default padding in UiPassword to fit the 
 * app-auth layout aesthetic 
 */
:deep(.form-group div) {
  padding: 0 !important;
  width: 100%;
}

:deep(.form-group input:not(.password-input)) {
  width: 100% !important;
  padding: 14px 16px !important;
  background: white !important;
  border: 1px solid var(--hairline) !important;
  border-radius: 12px !important;
  font-family: var(--font-sans) !important;
  font-size: 1rem !important;
  transition: all 0.2s ease !important;
  box-sizing: border-box !important;
}

:deep(.form-group .password-input) {
  width: 100% !important;
  padding: 14px 16px !important;
  padding-right: 44px !important; /* Restore space for peek icon */
  background: white !important;
  border: 1px solid var(--hairline) !important;
  border-radius: 12px !important;
  font-family: var(--font-sans) !important;
  font-size: 1rem !important;
  transition: all 0.2s ease !important;
  box-sizing: border-box !important;
}

:deep(.form-group input:focus) {
  outline: none !important;
  border-color: var(--ochre) !important;
  box-shadow: 0 0 0 4px rgba(201, 122, 58, 0.1) !important;
}

.submit-btn {
  background: var(--kola);
  color: var(--cream);
  padding: 16px;
  border-radius: 12px;
  font-family: var(--font-display);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: var(--ink);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 16px;
  text-align: center;
}

.auth-footer p {
  font-size: 0.9rem;
  color: var(--muted);
}

.login-link {
  color: var(--ochre);
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}
</style>