<template>
  <div class="callback-page">
    <div v-if="loading" class="callback-loading">
      <UiLoader :theme="{ color: 'var(--kola)' }" />
    </div>
    <div v-else-if="isSuccess">
      <SampleFireworks title="Account successfully verified" :call-back="routes.app.home" />
    </div>
    <div v-else class="callback-error">
      <h1 class="error-title">{{ errorMessage }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { verify } from '~/services/auth';

const route = useRoute()
const token = route.query.verificationCode as string

const loading = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

const activateSubscription = async () => {
    try {
        loading.value = true
        const { data } = await verify(token)
        if (data) {
            isSuccess.value = true
        }
    } catch (error: unknown) {
        console.error({ error })
        errorMessage.value = 'An error occurred'
    } finally {
        loading.value = false
    }
}

onBeforeMount(() => {
    activateSubscription()
})


</script>

<style scoped>
.callback-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; }
.callback-loading { display: flex; align-items: center; justify-content: center; }
.callback-error { text-align: center; padding: var(--d-pad); }
.error-title { font-family: var(--font-display); color: var(--hibiscus); font-size: 1.5rem; }
</style>