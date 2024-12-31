<template>

    <label :for="String(id)" class="subscription__button">
        <h3 class="subscription__title subscription__title--enterprise">
            {{ subscription.name }}
            <i class="subscription__icon fas fa-pepper-hot" :style="`background-color:${subscription.accent}; opacity:0.5`"></i>
        </h3>
        <span class="subscription__price">${{ subscription.amount }} <span class="subscription__price-month">/ mo</span>
        </span>
        <ul class="subscription__list">
            <li class="subscription__item">
                <i class="icon-subscription fas fa-check-circle"></i>
                <spa>
                    Users: <span class="subscription__item-text">{{ subscription.users }}</span>
                </spa>
            </li>
            <li class="subscription__item">
                <i class="icon-subscription fas fa-check-circle"></i>
                <span>
                    Duration: <span class="subscription__item-text">{{ millisecondsToDays(subscription.duration)
                        }} Days</span>
                </span>

            </li>
        </ul>
    </label>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { type Subscription } from '~/types/common';
defineProps({
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
.subscription__title,
.subscription__main-feature,
.subscription__price {
    text-transform: uppercase;
    font-family: 'Open Sans', sans-serif;
    margin-top: 0;
    margin-bottom: 0;
    color: #85A9C1;
}

.subscription__title {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    margin-top: 20px;
    font-size: 20px;
    color: black;
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.subscription__icon {
    margin-top: 10px;
    font-size: 38px;
    background: black;
    padding: 30px;
    border-radius: 50%;
}

.subscription__price {
    display: block;
    width: 90%;
    text-align: center;
    text-transform: lowercase;
    font-size: 32px;
    color: black;
    padding-bottom: 10px;
    border-bottom: 2px solid #EFF1F3;
}

.subscription__price-month {
    font-size: 18px;
    color: grey;
}

.subscription__list {
    padding: 0 15px;
    margin: 10px 0;
    list-style-type: none;
}

.subscription__item {
    display: flex;
    margin: 20px 0;
    font-size: 16px;
    color: black;
}

.subscription__item-text {
    color: black;
    font-size: 14px;
}

.icon-subscription {
    color: grey;
    margin-right: 5px;
}

.subscription__button {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Roboto, sans-serif;
    width: 275px;
    margin: 5px 0;
    padding: 0;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0 4px 13px 0 rgba(0, 0, 0, 0.45);
    transition: transform .5s;
    cursor: pointer;

    &:after {
        content: "SUBSCRIBE";
        display: block;
        text-align: center;
        padding: 10px;
        color: black;
        width: 80%;
        border-radius: 5px;
        margin-bottom: 25px;
        border: solid 2px black;
        transition: .5s;
    }
}
</style>