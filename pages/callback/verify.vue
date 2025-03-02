<template>
    <div v-if="loading">Loading....</div>
    <div v-else-if="isSuccess">
        <SampleFireworks title="Account successfully verified" :call-back="routes.app.home" />
    </div>
    <div v-else>
        <h1>
            {{ errorMessage }}
        </h1>
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

<style scoped></style>