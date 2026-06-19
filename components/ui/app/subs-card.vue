<template>
    <label :for="id" class="plan-card" :style="{ '--accent': subscription.accent }">
        <div v-if="subscription.books && subscription.books.length > 0" class="plan-badge">
            Limited Access
        </div>
        <p class="plan-name">
            {{ subscription.name }}
        </p>
        <div class="plan-accent"></div>
        <span class="plan-price">
            GHS{{ subscription.amount }}
        </span>
       
        <hr class="plan-divider" />
        <ul class="plan-details">
            <li class="plan-detail">Users: <strong>
                {{ subscription.users }}
            </strong></li>
            <li class="plan-detail">
                Duration: <strong>
                    {{ millisecondsToDays(subscription.duration) }} Days
                </strong>
            </li>
            <li v-if="subscription.books && subscription.books.length > 0" class="plan-detail plan-detail--limited">
                Access to <strong>{{ subscription.books.length }}</strong> selected books
            </li>
        </ul>
        <span class="plan-cta">Subscribe</span>
    </label>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
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

const { millisecondsToDays } = useUtils()
</script>

<style scoped>
.plan-card {
    --accent: #ccc;
    position: relative;
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

.plan-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--ochre);
    color: var(--cream);
    font-family: var(--font-sans);
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 8px;
    border-radius: 999px;
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

.plan-origin {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    color: var(--muted);
    text-align: center;
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
</style>
