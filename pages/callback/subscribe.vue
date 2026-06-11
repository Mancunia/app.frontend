<template>
  <div class="callback-page">
    <div v-if="loading" class="callback-loading">
      <UiLoader :theme="{ color: 'var(--kola)' }" />
    </div>
    <div v-else-if="isSuccess">
      <SampleFireworks title="Congratulations" :call-back="routes.app.home" />
    </div>
    <div v-else class="callback-error">
      <h1 class="error-title">{{ errorMessage }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { activateSubscriptionByPayStack } from '~/services/subscription';

const route = useRoute()
const reference = route.query.reference as string
const trxref = route.query.trxref as string

const loading = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

const activateSubscription = async () => {
    try {
      console.log({ reference, trxref })
        loading.value = true
        const { data } = await activateSubscriptionByPayStack({ reference, trxref })
        if (data) {
            isSuccess.value = data.active && data.status?.toLowerCase() === 'active'
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