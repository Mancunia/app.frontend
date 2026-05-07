<template>
  <div class="default-shell">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.default-shell {
  background: var(--paper);
  min-height: 100vh;
}
</style>
