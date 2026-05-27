<template>
    <div class="progress-container">
        <div class="progress-bar" :class="{'error':error}" :style="{ width: `${progress}%` }"></div>
        <span class="progress-text">{{ progress }}%</span>

    </div>
    <div class="int-container">
        <span class="progress-message" v-if="message">{{ message }}</span>
        <button v-if="progress === 100" @click="emit('done')">
            Done
        </button>
    </div>

</template>

<script setup>
const { progress, autoComplete } = defineProps({
    progress: {
        type: Number,
        required: true,
        validator: value => value >= 0 && value <= 100
    },
    message: {
        type: String
    },
    autoComplete: {
        type: Boolean,
        default: false
    },
    error:{
        type:Boolean,
        default:false
    }
});
const emit = defineEmits(['done'])
watch(() => progress, () => {
    if (progress === 100 && autoComplete) {
        setTimeout(() => {
            emit('done')
        }, 3000)
    }
})
</script>

<style scoped>
.progress-container {
    width: 300px;
    background-color: var(--calabash);
    border-radius: 8px;
    position: relative;
}

.progress-bar {
    height: 24px;
    background-color: var(--ochre);
    border-radius: 8px;
    transition: width 0.3s ease;
    background: linear-gradient(90deg, var(--ochre) 25%, var(--ochre-deep) 50%, var(--ochre) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.error{
    background-color: var(--hibiscus);
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
    color: var(--cream);
    line-height: 24px;
}

.progress-message {
    display: block;
    margin-top: 8px;
    font-size: 14px;
    color: var(--ink);
    text-align: center;
}

.int-container {
    display: flex;
    flex-direction: column;
    justify-items: center;
}

.int-container button {
    align-self: center;
    background-color: var(--ochre);
    color: var(--cream);
    padding: 5px;
    width: 100px;
    border: unset;
    border-radius: 20px;
    margin-top: 5%;
}
</style>
