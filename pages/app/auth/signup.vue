<template>
  <div class="signup-page">
    <div class="signup-intro">
      <h2 class="ase-serif">Join the Circle</h2>
      <p class="ase-sans">Create an account to save your library and contribute.</p>
    </div>

    <form class="signup-form" @submit.prevent="register">
      <div class="form-group">
        <label for="username" class="ase-eyebrow">Username</label>
        <div class="input-wrapper">
          <input 
            id="username"
            type="text" 
            v-model="form.username" 
            placeholder="e.g. ananse123"
            required
          />
        </div>
      </div>

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
        <label for="password" class="ase-eyebrow">Password</label>
        <div class="input-wrapper">
          <UiPassword 
            id="password"
            v-model="form.password" 
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label for="confirmPassword" class="ase-eyebrow">Confirm Password</label>
        <div class="input-wrapper">
          <UiPassword 
            id="confirmPassword"
            v-model="form.confirmPassword" 
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        <UiLoader v-if="loading" :theme="{ color: 'var(--cream)' }" />
        <span v-else>Create Account</span>
      </button>

      <div class="auth-footer">
        <p>Already have an account? <NuxtLink :to="routes.app.login" class="login-link">Sign In</NuxtLink></p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';

const form = ref({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
});

const { user_register, loading } = useAuth();

const register = async () => {
    if (form.value.password !== form.value.confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    await user_register(form.value);
};

definePageMeta({
    title: 'SignUp',
    middleware: 'app',
    layout: 'app-auth'
})
</script>

<style scoped>
.signup-page {
  width: 100%;
}

.signup-intro {
  margin-bottom: 32px;
}

.signup-intro h2 {
  font-size: 1.8rem;
  color: var(--ink);
  margin-bottom: 8px;
}

.signup-intro p {
  color: var(--muted);
  font-size: 0.95rem;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
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
  margin-top: 12px;
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
