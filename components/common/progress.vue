<template>
    <div class="progress-container">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
        <span class="progress-text">{{ progress }}%</span>

    </div>
    <span class="progress-message" v-if="message">{{ message }}</span>
</template>

<script setup>
defineProps({
    progress: {
        type: Number,
        required: true,
        validator: value => value >= 0 && value <= 100
    },
    message: {
        type: String
    }
});
</script>

<style scoped>
.progress-container {
    width: 300px;
    background-color: #e0e0e0;
    border-radius: 8px;
    position: relative;
}

.progress-bar {
    height: 24px;
    background-color: #4caf50;
    border-radius: 8px;
    transition: width 0.3s ease;
    background: linear-gradient(90deg, #4caf50 25%, #66bb6a 50%, #4caf50 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.progress-text {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: #fff;
    line-height: 24px;
}

.progress-message {
    display: block;
    margin-top: 8px;
    font-size: 14px;
    color: #333;
    text-align: center;
}
</style>
