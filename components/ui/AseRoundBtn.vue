<script setup lang="ts">
withDefaults(defineProps<{
  dark?: boolean
  size?: number
}>(), {
  dark: true,
  size: 44,
})

defineEmits<{ click: [] }>()
</script>

<template>
  <button
    :class="['ase-round-btn', dark ? 'ase-round-btn--dark' : 'ase-round-btn--light']"
    :style="{ width: `${size}px`, height: `${size}px` }"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.ase-round-btn {
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.18);
}
.ase-round-btn--dark  { background: var(--ink);   color: var(--cream); }
.ase-round-btn--light { background: var(--cream); color: var(--ink);   }
</style>
