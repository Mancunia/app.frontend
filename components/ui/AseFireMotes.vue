<script setup lang="ts">
const props = withDefaults(defineProps<{
  active?: boolean
  count?: number
}>(), {
  active: true,
  count: 14,
})

const motes = computed(() =>
  Array.from({ length: props.count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * -6,
    dur: 5 + Math.random() * 5,
    size: 2 + Math.random() * 3,
    dx: (Math.random() - 0.5) * 40,
  }))
)
</script>

<template>
  <div class="fire-motes" aria-hidden="true">
    <span
      v-if="active"
      v-for="m in motes"
      :key="m.id"
      class="fire-mote"
      :style="{
        left: `${m.left}%`,
        width: `${m.size}px`,
        height: `${m.size}px`,
        animationDuration: `${m.dur}s`,
        animationDelay: `${m.delay}s`,
        '--dx': `${m.dx}px`,
      }"
    />
  </div>
</template>

<style scoped>
.fire-motes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.fire-mote {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--ochre) 0%, rgba(201,122,58,0) 70%);
  animation: ase-mote linear infinite;
}
</style>
