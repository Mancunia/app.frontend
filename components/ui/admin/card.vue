<template>
    <div class="metric">
        <div class="metric-inner">

            <div  class="metric-body viz-basic-with-7-and-40-day-comparison">
                <div class="value">
                    <div class="current-value">
                        <h1 class="primary-value">{{ metric.data }}</h1>
                        <h2>{{ metric.label }}</h2>
                    </div>
                    <div v-if="false" class="comparison_wrapper">
                        <div class="left_comparison">
                            <h3 class="green">&#9660; 10%</h3>
                            <h4>7 days ago</h4>
                        </div>
                        <div class="right_comparison">
                            <h3 class="red">&#9650; 12%</h3>
                            <h4>30 days ago</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Metrics } from '~/types/common';

defineProps({
    metric: {
        type: Object as PropType<Metrics>,
        required: true
    }
})

</script>
<style scoped>
.metric {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.2);
    margin-bottom: 20px;
    padding: 20px;
}

.metric-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.metric-header {
    margin-bottom: 20px;
}

.metric-title {
    color: #2c3e50;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.metric-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px;
}

.value {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.current-value {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.primary-value {
    color: #2c3e50;
    font-size: 36px;
    font-weight: 600;
    margin: 0;
}

.comparison_wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.left_comparison,
.right_comparison {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.green {
    color: #2ecc71;
    font-size: 18px;
    margin: 0;
}

.red {
    color: #e74c3c;
    font-size: 18px;
    margin: 0;
}
</style>