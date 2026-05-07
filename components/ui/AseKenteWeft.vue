<script setup lang="ts">
const props = withDefaults(defineProps<{
  progress?: number
  height?: number
  accents?: string[]
}>(), {
  progress: 0,
  height: 14,
  accents: () => ['var(--ochre)', 'var(--hibiscus)', 'var(--kola)', 'var(--ochre-deep)'],
})

const filled = computed(() => Math.max(0, Math.min(1, props.progress)))
</script>

<template>
  <div
    class="kente-track"
    :style="{ '--kente-h': `${props.height}px`, '--kente-fill': `${filled * 100}%` }"
    role="progressbar"
    :aria-valuenow="Math.round(filled * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="kente-warp" aria-hidden="true" />
    <div class="kente-fill">
      <div
        v-for="(color, i) in accents"
        :key="i"
        class="kente-weft"
        :style="{ background: color }"
      />
    </div>
    <div class="kente-thumb" />
  </div>
</template>

<style scoped>
.kente-track {
  position: relative;
  height: var(--kente-h, 14px);
  width: 100%;
  border-radius: var(--kente-h, 14px);
  overflow: hidden;
  background: var(--calabash);
  box-shadow: inset 0 0 0 0.5px var(--hairline);
}
.kente-warp {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image: repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 5px);
}
.kente-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--kente-fill, 0%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}
.kente-weft {
  flex: 1;
  background-image: repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 7px);
}
.kente-thumb {
  position: absolute;
  left: calc(var(--kente-fill, 0%) - calc(var(--kente-h, 14px) / 2));
  top: -2px;
  bottom: -2px;
  width: calc(var(--kente-h, 14px) + 4px);
  border-radius: 999px;
  background: var(--ink);
  box-shadow: 0 1px 3px rgba(0,0,0,0.35);
}
</style>
