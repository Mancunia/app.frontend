<template>
    <div class="subscription-page">
        <div class="page-header">
            <p class="page-eyebrow">Your listening plan</p>
            <h1 class="page-headline">Unlock the stories.</h1>
        </div>

        <div v-if="loading" class="plan-grid">
            <UiAppLoadersSubscription />
            <UiAppLoadersSubscription />
            <UiAppLoadersSubscription />
        </div>
        <div v-else-if="subscription" class="plan-grid">
            <span v-for="(sub, index) in subscription" :key="index">
                <input type="radio" name="radio" :id="String(index)" />
                <UiAppSubscription :subscription="sub" :id="index" :origins="origins" />
            </span>
        </div>
        <div v-else class="empty-state">
            <p class="no-subs">No plans available right now.</p>
        </div>

        <div class="ref-section">
            <p class="ref-label">Have a reference code?</p>
            <form class="ref-form" @submit.prevent="linkSub">
                <span class="ref-at">@</span>
                <input
                    class="ref-input"
                    type="text"
                    placeholder="Enter subscription reference…"
                    v-model="reference.ref"
                />
                <button class="ref-submit" type="submit">Apply</button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type Subscription } from '~/types/common';
import type { OriginType } from '~/types/admin/origin';
import { getSubscriptions, linkSubscription } from '~/services/subscription';

const subscription = ref<Subscription[] | null>(null)
const reference = ref<{ ref: string, loading: boolean }>({ ref: '', loading: false })
const loading = ref(true);
const origins = ref<OriginType[]>([])

const fetchSubscriptions = async () => {
    try {
        loading.value = true;
        const subRes = await getSubscriptions()
        const subData = subRes as any
        if (subData) {
            subscription.value = Array.isArray(subData) ? subData : subData.data ?? subData
        }
    } catch (error: unknown) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}

const linkSub = async () => {
    try {
        reference.value.loading = true;
        const { data } = await linkSubscription({ ref: reference.value.ref });
        if (data) {
            console.log(data);
        }
    } catch (error: unknown) {
        console.error(error);
    } finally {
        reference.value.loading = false;
    }
}

onMounted(() => {
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
.subscription-page {
    padding: var(--d-pad);
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.page-eyebrow {
    font-family: var(--font-sans);
    color: var(--muted);
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin: 0;
}

.page-headline {
    font-family: var(--font-display);
    color: var(--ink);
    font-size: clamp(1.4rem, 3vw, 2.2rem);
    margin: 4px 0 0;
}

.plan-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--d-gap);
    justify-content: center;
}

.plan-grid span {
    display: contents;
}

input[type="radio"] {
    display: none;
}

input[type="radio"]:checked + label {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(31, 23, 20, 0.16);
    border-color: var(--ochre);
}

.empty-state {
    padding: 48px 0;
    text-align: center;
}

.no-subs {
    font-family: var(--font-serif);
    font-style: italic;
    color: var(--muted);
    font-size: 0.95rem;
}

.ref-section {
    border-top: 1px solid var(--hairline);
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

.ref-label {
    font-family: var(--font-sans);
    color: var(--muted);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0;
}

.ref-form {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--card);
    border: 1px solid var(--hairline);
    border-radius: 999px;
    padding: 6px 6px 6px 16px;
    width: 100%;
    max-width: 400px;
}

.ref-at {
    font-family: var(--font-mono);
    color: var(--muted);
    font-size: 0.85rem;
    flex-shrink: 0;
}

.ref-input {
    flex: 1;
    min-width: 0;
    background: none;
    border: none;
    outline: none;
    font-family: var(--font-sans);
    font-size: 0.85rem;
    color: var(--ink);
}

.ref-input::placeholder {
    color: var(--muted);
}

.ref-submit {
    font-family: var(--font-display);
    font-size: 0.85rem;
    color: var(--cream);
    background: var(--ink);
    border: none;
    border-radius: 999px;
    padding: 6px 18px;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s;
}

.ref-submit:hover {
    background: var(--kola-2);
}
</style>
