<template>
    <component :is="chartComponent" :data="chartData" :options="chartOptions" ref="chartRef" />
</template>

<script setup>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    ArcElement,
} from 'chart.js';

import { Bar, Line, Pie, Doughnut } from 'vue-chartjs';
import { ref, watch } from 'vue';

// Register chart.js components
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    ArcElement
);

// Props
const props = defineProps({
    type: {
        type: String,
        default: 'bar',
        validator: (val) => ['bar', 'line', 'pie', 'doughnut'].includes(val),
    },
    data: {
        type: Object,
        required: true,
    },
    options: {
        type: Object,
        default: () => ({}),
    },
});

// Dynamic chart component
const chartMap = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
};

const chartComponent = chartMap[props.type];
const chartData = ref(props.data);
const chartOptions = ref(props.options);
const chartRef = ref(null);

// Watch data changes and update chart
watch(
    () => props.data,
    (newData) => {
        chartData.value = newData;
        updateChart();
    },
    { deep: true }
);

watch(
    () => props.options,
    (newOptions) => {
        chartOptions.value = newOptions;
        updateChart();
    },
    { deep: true }
);

// Update chart instance
function updateChart() {
    if (chartRef.value?.chart) {
        chartRef.value.chart.update();
    }
}
</script>
