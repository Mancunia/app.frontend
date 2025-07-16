<template>
    <div class="container">
        <div class="chart">
            <UiChart type="bar" :data="chartDetails.data" :options="chartDetails.options" />
        </div>
        <div class="summary">
            <div v-for="(met, index) in metrics" class="card">
                <div class="title">
                    {{ met.label }}
                </div>
                <div class="data">
                    {{ met.data }}
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { Metrics } from '~/types/common';
import { getMetrics } from '~/services/admin/book';

const { getCurrentMonthBeginningAndEnd } = useUtils()
const currentMonth = getCurrentMonthBeginningAndEnd();
const metrics = ref<Metrics[] | null>(null);
const filter = ref<{
    startDate: string;
    endDate: string;
}>({
    startDate: currentMonth.firstDay,
    endDate: currentMonth.lastDay
});
const loading = ref<boolean>(true);

const bookId = computed(() => useRoute().query.bookId as string);

const chartDetails = computed(() => {
    const data = {
        labels: metrics.value?.map((met) => met.label),
        datasets: [
            {
                label: 'Metrics',
                data: metrics.value?.map((met) => met.data),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)'
                ],
                fill: false,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return { data, options }
})


const fetchBookMetrics = async () => {
    try {
        loading.value = true
        const response = await getMetrics(bookId.value, filter.value);
        metrics.value = response.data;
    }
    finally {
        loading.value = false;
    }
}

watchEffect(() => {
    fetchBookMetrics();
})


</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: inherit
}

.chart {
    width: 80%;
    height: 400px;
    align-items: center;

}

.summary {
    width: 20%;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.summary .card {
    width: 200px;
    height: 300px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

}

.summary .card .title {
    font-size: xx-small;
    color: rgb(46, 45, 45);
}

.summary .card .data {
    font-size: xx-large;
    color: rgb(0, 0, 0);
}
</style>