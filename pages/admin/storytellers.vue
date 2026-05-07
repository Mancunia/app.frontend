<template>
  <div class="stub-page">
    <h1 class="stub-title">Storytellers</h1>
    <div class="stub-card">
      <span class="stub-icon">◇</span>
      <p>Storyteller management — coming soon.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ title: 'Storytellers', middleware: 'admin', layout: 'admin-layout' });
</script>
<style scoped>
.stub-page { display: flex; flex-direction: column; gap: 20px; }
.stub-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.stub-card {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 60px 20px; background: var(--card); border: 1px solid var(--hairline);
  border-radius: 12px; color: var(--muted); font-family: var(--font-sans); font-size: 14px;
}
.stub-icon { font-size: 28px; color: var(--ochre); opacity: 0.35; }
</style>
