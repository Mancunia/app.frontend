<template>
  <div class="auth-layout">
    <div class="auth-form-container ase-paper">
      <div class="auth-content">
        <div class="auth-header">
          <UiAseAnansiMark :size="48" color="var(--kola)" />
          <h1 class="auth-brand ase-display">anansesemfie</h1>
        </div>
        <slot />
      </div>
    </div>
    <div class="auth-image-container">
      <div class="image-overlay"></div>
      <img src="@/assets/images/bookShelve.png" alt="Library" class="auth-bg-image">
      <div class="image-content">
        <UiAseFireMotes :count="12" />
        <p class="image-tagline ase-display">Voices of the Ancestors,<br>Stories for the Soul.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.auth-form-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background-color: var(--paper);
  z-index: 2;
}

.auth-content {
  width: 100%;
  max-width: 400px;
}

.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  text-align: center;
}

.auth-brand {
  font-size: 1.8rem;
  color: var(--kola);
  margin-top: 12px;
  letter-spacing: -0.02em;
}

.auth-image-container {
  display: none;
  flex: 1.2;
  position: relative;
  overflow: hidden;
}

.auth-bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(77, 35, 22, 0.4) 0%, rgba(31, 23, 20, 0.8) 100%);
  z-index: 1;
}

.image-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 60px;
  color: var(--cream);
}

.image-tagline {
  font-size: 2.4rem;
  line-height: 1.2;
  margin-top: 20px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

@media (min-width: 1024px) {
  .auth-image-container {
    display: block;
  }
}

@media (max-width: 1023px) {
  .auth-layout {
    flex-direction: column;
  }
  
  .auth-form-container {
    min-height: 100vh;
  }
}
</style>