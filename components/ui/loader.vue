<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24" class="svg-spinner"
    >
    <circle cx="12" cy="12" r="10" :stroke="theme.color" stroke-width="2" fill="none" stroke-dasharray="70 30"
      stroke-dashoffset="10" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  inverted: {
    type: Boolean,
    default: false
  },
  theme:{
    type:Object as PropType<{color:string}>,
    default:{color:'white'}
  }
})
</script>

<style>
.svg-spinner {
  animation: spin 1s linear infinite;
  margin-right: 2px;
  margin-bottom: 2px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>