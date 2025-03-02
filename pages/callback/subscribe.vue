<template>
    <div v-if="loading">Loading....</div>
    <div v-else-if="isSuccess">
        <SampleFireworks title="Congratulations" :call-back="routes.app.home" />
    </div>
    <div v-else>
        <h1>
            {{ errorMessage }}
        </h1>
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

<style scoped></style>