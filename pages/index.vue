<template>
  <div class="landing" data-dark="true">
    <UiAseFireMotes :count="18" />
    <div class="landing-content">
      <UiAseAnansiMark :size="48" color="var(--cream)" />
      <h1 class="landing-title">anansesemfie</h1>
      <p class="landing-sub">Stories by the fire, carried by the wind.</p>
      <NuxtLink :to="routes.app.login" class="landing-cta">Enter</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';

definePageMeta({ layout: 'landing', title: 'Anansesemfie' })
</script>

<style scoped>
.landing {
  background: var(--ink);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.landing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 1;
  text-align: center;
  padding: var(--d-pad);
}
.landing-title {
  font-family: var(--font-display);
  color: var(--ochre);
  font-size: 2rem;
  margin: 0;
}
.landing-sub {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--cream);
  opacity: 0.7;
  margin: 0;
}
.landing-cta {
  font-family: var(--font-display);
  background: var(--ochre);
  color: var(--ink);
  border-radius: 999px;
  padding: 10px 32px;
  text-decoration: none;
  font-size: 1rem;
  margin-top: 8px;
}
.landing-cta:hover { opacity: 0.9; }
</style>
