<template>
    <div class="container">
        <div class="filter">
            <div class="input-group">
                <label for="startDate">Start Date</label>
                <input type="date" id="startDate" v-model="filter.startDate" />
            </div>
            <div class="input-group">
                <label for="endDate">End Date</label>
                <input type="date" id="endDate" v-model="filter.endDate" />
            </div>
        </div>
        <div class="metric">
            <UiAdminCard v-for="(metric, index) in metrics" :key="index" :metric="metric" />
        </div>
    </div>



</template>

<script setup lang="ts">
import type { Metrics } from '~/types/common';
import { getMetrics } from '~/services/admin/book';

const bookId = useRoute().query.bookId as string;

const metrics = ref<Metrics[] | null>(null);
const filter = ref<{
    startDate: string;
    endDate: string;
}>({
    startDate: '2024-11-03',
    endDate: '2024-11-04'
});
const loading = ref<boolean>(true);

const fetchBookMetrics = async () => {
    try {
        loading.value = true
        const response = await getMetrics(bookId, filter.value);
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
.container{
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0px 5%;
}
.filter {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: flex-end;
}
.input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
input[type="date"] {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
}
.metric {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 25px;
    height: min-content;
    padding: 0px 5%;
}
</style>