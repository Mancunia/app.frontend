<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { activateSubscriptionByPayStack } from '~/services/subscription';

const route = useRoute()
const reference = route.query.reference as string
const trxref = route.query.trxref as string

const loading = ref(true)

const activateSubscription = async () => {
    try {
        loading.value = true
        const { data } = await activateSubscriptionByPayStack({ reference, trxref })
        if (data) {
            console.log(data)
        }
    } catch (error: unknown) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    activateSubscription()
})


</script>

<style scoped></style>