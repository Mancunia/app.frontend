<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  color?: string
}>(), {
  size: 28,
  color: 'currentColor',
})

const angles = [0, 45, 90, 135]
const radii = [5, 9, 13]

function webX(angle: number) { return 16 + 14 * Math.cos((angle * Math.PI) / 180) }
function webY(angle: number) { return 16 + 14 * Math.sin((angle * Math.PI) / 180) }
</script>

<template>
  <svg
    :viewBox="`0 0 32 32`"
    :width="size"
    :height="size"
    fill="none"
    :stroke="color"
    stroke-width="1.4"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-label="Anansesemfie"
  >
    <!-- radial web strands -->
    <line
      v-for="a in angles"
      :key="a"
      x1="16" y1="16"
      :x2="webX(a)"
      :y2="webY(a)"
    />
    <line
      v-for="a in angles"
      :key="'m' + a"
      :x1="16 - 14 * Math.cos((a * Math.PI) / 180)"
      :y1="16 - 14 * Math.sin((a * Math.PI) / 180)"
      :x2="webX(a)"
      :y2="webY(a)"
      opacity="0"
    />
    <!-- concentric rings -->
    <circle v-for="r in radii" :key="r" cx="16" cy="16" :r="r" />
    <!-- spider body -->
    <ellipse cx="22" cy="10" rx="2.2" ry="1.6" :fill="color" />
    <circle cx="20" cy="10" r="1" :fill="color" />
  </svg>
</template>
