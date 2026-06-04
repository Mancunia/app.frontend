<template>
  <div class="login-page">
    <div class="login-intro">
      <h2 class="ase-serif">Welcome Back</h2>
      <p class="ase-sans">Enter your details to continue your journey.</p>
    </div>

    <form class="login-form" @submit.prevent="login">
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

      <div class="form-group">
        <div class="label-row">
          <label for="password" class="ase-eyebrow">Password</label>
          <NuxtLink :to="routes.app.forgotPassword" class="forgot-link">Forgot?</NuxtLink>
        </div>
        <div class="input-wrapper">
          <UiPassword 
            id="password"
            v-model="form.password" 
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        <UiLoader v-if="loading" :theme="{ color: 'var(--cream)' }" />
        <span v-else>Sign In</span>
      </button>

      <div class="auth-footer">
        <p>Don't have an account? <NuxtLink :to="routes.app.signup" class="signup-link">Create one</NuxtLink></p>
      </div>
    </form>
  </div>
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
.login-page {
  width: 100%;
}

.login-intro {
  margin-bottom: 32px;
}

.login-intro h2 {
  font-size: 1.8rem;
  color: var(--ink);
  margin-bottom: 8px;
}

.login-intro p {
  color: var(--muted);
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-wrapper {
  position: relative;
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

.forgot-link {
  font-size: 0.85rem;
  color: var(--ochre);
  text-decoration: none;
  font-weight: 500;
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

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
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

.signup-link {
  color: var(--ochre);
  text-decoration: none;
  font-weight: 600;
}

.signup-link:hover {
  text-decoration: underline;
}
</style>
