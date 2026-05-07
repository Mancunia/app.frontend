<template>
  <div class="auth-shell" data-dark="true">
    <UiAseFireMotes :count="12" />
    <div class="auth-logo">
      <UiAseAnansiMark :size="36" color="var(--cream)" />
      <span class="auth-wordmark">anansesemfie</span>
    </div>
    <div class="auth-form-wrap">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.auth-shell {
  background: var(--ink);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 24px 16px;
}
.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  z-index: 1;
}
.auth-wordmark {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--ochre);
  letter-spacing: 0.04em;
}
.auth-form-wrap {
  width: 100%;
  max-width: 360px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--hairline);
  border-radius: var(--d-radius);
  padding: var(--d-pad);
  z-index: 1;
}
</style>
