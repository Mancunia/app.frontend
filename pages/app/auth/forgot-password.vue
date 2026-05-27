<template>
  <div class="forgot-password-page">
    <div class="forgot-intro">
      <h2 class="ase-serif">Reset Password</h2>
      <p class="ase-sans">Enter your email and we'll send you a link to reset your password.</p>
    </div>

    <form class="forgot-form" @submit.prevent="sendNewPasswordRequest">
      <div class="form-group">
        <label for="email" class="ase-eyebrow">Email Address</label>
        <div class="input-wrapper">
          <input 
            id="email"
            type="email" 
            v-model="form.email" 
            placeholder="e.g. kwame@example.com"
            required
          />
        </div>
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        <UiLoader v-if="loading" :theme="{ color: 'var(--cream)' }" />
        <span v-else>Send Reset Link</span>
      </button>

      <div class="auth-footer">
        <p>Remembered your password? <NuxtLink :to="routes.app.login" class="login-link">Back to Sign In</NuxtLink></p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { forgotPassword } from '~/services/auth';

const form = ref({
    email: ''
})
const loading = ref(false)
const { addSuccess } = useToast()

const sendNewPasswordRequest = async () => {
    loading.value = true
    try {
        const res = await forgotPassword(form.value.email)
        if (res) {
            addSuccess('Password reset link sent to email')
            form.value.email = ''
        }
    } catch (error: unknown) {
        console.error({ error })
    } finally {
        loading.value = false
    }
}

definePageMeta({ title: 'Forgot Password', middleware: 'app', layout: 'app-auth' })
</script>

<style scoped>
.forgot-password-page {
  width: 100%;
}

.forgot-intro {
  margin-bottom: 32px;
}

.forgot-intro h2 {
  font-size: 1.8rem;
  color: var(--ink);
  margin-bottom: 8px;
}

.forgot-intro p {
  color: var(--muted);
  font-size: 0.95rem;
}

.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 16px;
  background: white;
  border: 1px solid var(--hairline);
  border-radius: 12px;
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--ochre);
  box-shadow: 0 0 0 4px rgba(201, 122, 58, 0.1);
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
