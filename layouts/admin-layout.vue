<template>
  <div class="page">
    <LayoutAdminSidebar />
    <main class="body">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.page {
  display: grid;
  grid-template-columns: 232px 1fr;
  height: 100%;
  min-height: 100vh;
  width: 100%;
  background: var(--paper);
}
.body {
  padding: 28px 32px;
  overflow-y: auto;
  min-height: 100vh;
}
</style>
