<template>
    <div class="subscription-form">
        <form @submit.prevent="linkSub">
            <label for="ref">@</label>
            <input type="text" name="" placeholder="Enter Subscription Reference" v-model="reference.ref"/>
            <UiAdminButton type="submit">apply</UiAdminButton>
        </form>
        
    </div>
    <div v-if="loading" class="subscription-container">
        <UiAppLoadersSubscription />
    </div>
    <div v-else-if="subscription" class="subscription-container">
        <span v-for="(sub, index) in subscription" :key="index">
            <input type="radio" name="radio" :id="String(index)">
            <UiAppSubscription :subscription="sub" :id="index" />
        </span>
    </div>
    <div v-else>
        <p>There are no subscriptions available</p>
    </div>

</template>

<script setup lang="ts">
import { type Subscription } from '~/types/common';
import { getSubscriptions,linkSubscription } from '~/services/subscription';

const subscription = ref<Subscription[] | null>(null)
const reference = ref<{ref:string,loading:boolean}>({ref:'',loading:false})
const loading = ref(true);

const fetchSubscriptions = async () => {
    try {
        loading.value = true;
        const { data } = await getSubscriptions();
        if (data) {
            subscription.value = data;
        }

    } catch (error: unknown) {
        console.error(error);
    }
    finally {
        loading.value = false;
    }
}

const linkSub = async () => {
    try {
        reference.value.loading = true;
        const { data } = await linkSubscription({ref:reference.value.ref});
        if (data) {
            console.log(data);
        }

    } catch (error: unknown) {
        console.error(error);
    }
    finally {
        reference.value.loading = false;
    }
}
onMounted(() => {
    console.log('mounted');
    fetchSubscriptions()
});

definePageMeta({
    title: 'Subscription',
    description: 'Subscription page',
    middleware: 'app',
    layout: 'app-layout'
})
</script>

<style scoped>
.subscription-form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5%;
}
.subscription-form form {
    display: flex;
    justify-content: center;
    align-items: center;
    width:100%;
    gap: 10px;
}
.subscription-form label {
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
}

.subscription-form input {
    padding: 15px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.subscription-container {
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    justify-content: space-around;
    width: 100%;
    max-width: 990px;
    margin-top: 5%;
}



input[type="radio"] {
    display: none;

    &:checked+label:after {
        background-color: orange;
        color: white;
    }

    &:checked+label {
        background: white;
        transform: scale(1.09);
        transition: transform .5s;
        box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.65);
    }
}
</style>