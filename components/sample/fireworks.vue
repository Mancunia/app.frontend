<template>
    <div class="BackGround">
        <Fireworks ref="fw" v-if="mounted" :autostart="false" :options="options" :style="{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
            background: '#000'
        }" />
    </div>
    <div class="overlay">
        <h1>
            {{ title }}
        </h1>
        <UiAdminButton v-if="callBack" @click="gotoCallBack">continue</UiAdminButton>
    </div>
</template>

<script lang="ts" setup>
import { Fireworks } from '@fireworks-js/vue'
import type { FireworksOptions } from '@fireworks-js/vue'

const props = defineProps({
    title: {
        type: String,
        default: 'Congratulations!'
    },
    callBack: {
        type: String,
        default: ''
    }
})

const gotoCallBack = () => navigateTo(props.callBack)

const fw = ref<InstanceType<typeof Fireworks>>()
const options = ref<FireworksOptions>({
    autoresize: true,
    opacity: 0.5,
    acceleration: 1.05,
    friction: 0.97,
    gravity: 1.5,
    particles: 50,
    traceLength: 3,
    traceSpeed: 10,
    explosion: 5,
    intensity: 30,
    flickering: 50,
    lineStyle: 'round',
    hue: {
        min: 0,
        max: 360
    },
    delay: {
        min: 30,
        max: 60
    },
    rocketsPoint: {
        min: 50,
        max: 50
    },
    lineWidth: {
        explosion: {
            min: 1,
            max: 3
        },
        trace: {
            min: 1,
            max: 2
        }
    },
    brightness: {
        min: 50,
        max: 80
    },
    decay: {
        min: 0.015,
        max: 0.03
    },
    mouse: {
        click: true,
        move: false,
        max: 1
    }
})
const mounted = ref(true)

async function startFireworks() {
    if (!fw.value) return
    fw.value.start()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // await fw.value.waitStop()
}

watch(fw, () => startFireworks())
</script>

<style scoped>
body {
    background: black;
    overflow: hidden;
    margin: 0;
}

canvas {
    background: #000;
}

.BackGround {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
}

.overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    align-items: center;
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}
</style>