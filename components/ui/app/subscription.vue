<template>
    <label :for="String(id)" class="plan-card" :style="{ '--accent': subscription.accent }" @click="initSub">
        <p class="plan-name">{{ subscription.name }}</p>
        <div class="plan-accent"></div>
        <span class="plan-price">GHS{{ subscription.amount }}</span>
        <hr class="plan-divider" />
        <ul class="plan-details">
            <li class="plan-detail">Users: <strong>{{ subscription.users }}</strong></li>
            <li class="plan-detail">
                Duration: <strong>{{ millisecondsToDays(subscription.duration) }} Days</strong>
            </li>
        </ul>
        <span class="plan-cta">Subscribe</span>
    </label>

    <CommonModal v-model="modal">
        <div class="confirm-form">
            <h2 class="confirm-title">Confirm subscription</h2>
            <p class="confirm-plan">{{ subscription.name }} — GHS{{ subscription.amount }}</p>
            <div class="confirm-buttons">
                <button class="confirm-btn confirm-btn--ghost" @click="modal = false">Cancel</button>
                <button class="confirm-btn" @click="initSubscription">Confirm</button>
            </div>
        </div>
    </CommonModal>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { postSubscripition } from '~/services/user';
import type { Subscription } from '~/types/common';

const props = defineProps({
    subscription: {
        type: Object as PropType<Subscription>,
        required: true
    },
    id: {
        type: Number,
        required: true
    }
})

const loading = ref(false)
const modal = ref(false);

const { millisecondsToDays } = useUtils()

const initSub = () => {
    modal.value = true;
}

const openLink = (url: string) => {
    if (window.open(url, '_blank', 'noopener,noreferrer')) {
        return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
}

const initSubscription = async () => {
    try {
        loading.value = true;
        const { data } = await postSubscripition({ subscription: props.subscription.id });
        if (data) {
            openLink(data.data.authorization_url);
            modal.value = false;
        }
    } catch (error: unknown) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.plan-card {
    --accent: #ccc;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    width: 260px;
    padding: 28px 24px 24px;
    border-radius: var(--d-radius);
    background: linear-gradient(
        160deg,
        color-mix(in srgb, var(--accent) 14%, var(--card)) 0%,
        var(--card) 50%
    );
    border: 1px solid color-mix(in srgb, var(--accent) 20%, var(--hairline));
    box-shadow: 0 2px 12px var(--hairline);
    cursor: pointer;
    transition: transform 0.25s, box-shadow 0.25s;
}

.plan-card:hover {
    transform: translateY(-3px);
    box-shadow:
        0 8px 24px rgba(31, 23, 20, 0.1),
        0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent);
}

.plan-name {
    font-family: var(--font-display);
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--accent) 30%, var(--ink));
    margin: 0;
}

.plan-accent {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow:
        0 0 0 8px color-mix(in srgb, var(--accent) 18%, transparent),
        0 6px 28px 0 color-mix(in srgb, var(--accent) 50%, transparent);
    flex-shrink: 0;
}

.plan-price {
    font-family: var(--font-serif);
    font-size: 2rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.01em;
}

.plan-divider {
    width: 80%;
    border: none;
    border-top: 1px solid var(--hairline);
    margin: 0;
    align-self: center;
}

.plan-details {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.plan-detail {
    font-family: var(--font-sans);
    font-size: 0.82rem;
    color: var(--muted);
}

.plan-detail strong {
    color: var(--ink);
    font-weight: 600;
}

.plan-cta {
    display: block;
    width: 100%;
    text-align: center;
    font-family: var(--font-display);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink);
    border: 2px solid color-mix(in srgb, var(--accent) 30%, var(--ink));
    border-radius: 999px;
    padding: 10px 0;
    margin-top: 4px;
    transition: background 0.25s, color 0.25s, border-color 0.25s;
}

.plan-card:hover .plan-cta {
    background: color-mix(in srgb, var(--accent) 18%, var(--ink));
    border-color: color-mix(in srgb, var(--accent) 18%, var(--ink));
    color: var(--cream);
}

.confirm-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--d-pad);
    gap: 12px;
}

.confirm-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--ink);
    margin: 0;
    text-align: center;
}

.confirm-plan {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 0.9rem;
    color: var(--muted);
    margin: 0;
}

.confirm-buttons {
    display: flex;
    gap: 12px;
    margin-top: 8px;
}

.confirm-btn {
    font-family: var(--font-display);
    font-size: 0.9rem;
    color: var(--cream);
    background: var(--ink);
    border: none;
    padding: 8px 22px;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.2s;
}

.confirm-btn:hover {
    background: var(--kola-2);
}

.confirm-btn--ghost {
    background: none;
    color: var(--muted);
    border: 1px solid var(--hairline);
}

.confirm-btn--ghost:hover {
    background: var(--calabash);
    color: var(--ink);
}
</style>
