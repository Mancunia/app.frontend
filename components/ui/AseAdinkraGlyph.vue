<script setup lang="ts">
const GLYPHS = {
  sankofa: {
    name: 'Sankofa',
    meaning: 'Go back and learn',
    path: `M12 4 C 6 4, 4 9, 5 13 C 6 17, 10 19, 13 18 L 13 21 L 17 16 L 13 12 L 13 15 C 9 16, 7 13, 8 11 C 9 7, 12 7, 14 9`,
    extra: `<circle cx="12" cy="6.5" r="0.8" fill="currentColor"/>`,
  },
  'gye-nyame': {
    name: 'Gye Nyame',
    meaning: 'Except for God',
    paths: [
      `M5 12 C 5 7, 9 5, 12 7 C 15 9, 14 13, 11 14 C 8 15, 6 13, 7 10`,
      `M12 7 C 16 7, 19 10, 19 14 C 19 18, 15 20, 12 19`,
      `M12 14 L 12 19`,
    ],
  },
  dwennimmen: {
    name: 'Dwennimmen',
    meaning: 'Strength in humility',
    paths: [
      `M5 7 C 3 9, 3 13, 5 15 C 7 17, 11 17, 12 14`,
      `M19 7 C 21 9, 21 13, 19 15 C 17 17, 13 17, 12 14`,
      `M8 9 C 9 10, 9 12, 8 13`,
      `M16 9 C 15 10, 15 12, 16 13`,
    ],
    extra: `<circle cx="12" cy="14" r="1" fill="currentColor"/>`,
  },
  akoma: {
    name: 'Akoma',
    meaning: 'Patience of the heart',
    paths: [`M12 20 C 6 16, 4 11, 6 8 C 8 5, 11 6, 12 9 C 13 6, 16 5, 18 8 C 20 11, 18 16, 12 20 Z`],
  },
  nyansapo: {
    name: 'Nyansapo',
    meaning: "The wise one's knot",
    paths: [
      `M8 8 C 8 6, 10 5, 12 6 C 14 7, 14 10, 12 11 C 10 12, 8 11, 8 9`,
      `M16 8 C 16 6, 14 5, 12 6`,
      `M8 16 C 8 18, 10 19, 12 18 C 14 17, 14 14, 12 13 C 10 12, 8 13, 8 15`,
      `M16 16 C 16 18, 14 19, 12 18`,
    ],
  },
} as const

type GlyphId = keyof typeof GLYPHS

const props = withDefaults(defineProps<{
  id: GlyphId
  size?: number
  color?: string
}>(), {
  id: 'sankofa',
  size: 24,
  color: 'currentColor',
})

const glyph = computed(() => GLYPHS[props.id] ?? GLYPHS.sankofa)
</script>

<template>
  <svg
    :viewBox="`0 0 24 24`"
    :width="size"
    :height="size"
    fill="none"
    :stroke="color"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-label="glyph.name"
    :title="glyph.meaning"
  >
    <template v-if="'paths' in glyph">
      <path v-for="(d, i) in (glyph as any).paths" :key="i" :d="d" />
    </template>
    <path v-else :d="(glyph as any).path" />
    <!-- dwennimmen / sankofa extras rendered via slot fallback -->
    <circle v-if="id === 'sankofa'" cx="12" cy="6.5" r="0.8" :fill="color" />
    <circle v-if="id === 'dwennimmen'" cx="12" cy="14" r="1" :fill="color" />
  </svg>
</template>
