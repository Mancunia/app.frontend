<script setup lang="ts">
export interface FirePerson {
  name: string
  initial: string
  color?: string
}

const props = withDefaults(defineProps<{
  people?: FirePerson[]
  activeIndex?: number
  size?: number
}>(), {
  people: () => [],
  activeIndex: 0,
  size: 320,
})

const emit = defineEmits<{ select: [index: number] }>()

const radius = computed(() => props.size / 2 - 28)

function personPos(i: number) {
  const a = (i / props.people.length) * Math.PI * 2 - Math.PI / 2
  return {
    left: `${props.size / 2 + radius.value * Math.cos(a) - 18}px`,
    top:  `${props.size / 2 + radius.value * Math.sin(a) - 18}px`,
    background: props.people[i]?.color ?? 'var(--calabash)',
  }
}
</script>

<template>
  <div
    class="fire-circle"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
  >
    <div class="fire-circle__glow" />
    <AseFireMotes :active="true" :count="10" />
    <button
      v-for="(person, i) in props.people"
      :key="i"
      class="fire-circle__person"
      :class="{ 'fire-circle__person--active': i === props.activeIndex }"
      :style="personPos(i)"
      :title="person.name"
      @click="emit('select', i)"
    >
      {{ person.initial }}
    </button>
  </div>
</template>

<style scoped>
.fire-circle {
  position: relative;
  margin: 0 auto;
}
.fire-circle__glow {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--hibiscus) 0%, var(--ochre) 50%, rgba(201,122,58,0) 75%);
  animation: ase-pulse 2.4s ease-in-out infinite;
}
.fire-circle__person {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid transparent;
  color: var(--ink);
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  font-family: var(--font-display);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fire-circle__person--active {
  border-color: var(--ochre);
  box-shadow: 0 0 0 4px rgba(201,122,58,0.25);
}
</style>
