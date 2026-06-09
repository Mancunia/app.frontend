<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  color?: string // Kept for compatibility but unused by img
}>(), {
  size: 28,
  color: 'currentColor',
})
</script>

<template>
  <img
    src="/favicon.png"
    :width="size"
    :height="size"
    alt="Anansesemfie"
    class="brand-logo"
  />
</template>

<style scoped>
.brand-logo {
  object-fit: contain;
}
</style>
