<template>
    <div class="container">
        <div class="filter">
            <div class="input-group">
                <label for="startDate">Start Date</label>
                <UiAdminInputField type="date" id="startDate" @update:model-value="filter.startDate = $event" :value="filter.startDate" />
            </div>
            <div class="input-group">
                <label for="endDate">End Date</label>
                <UiAdminInputField type="date" id="endDate" @update:model-value="filter.endDate = $event" :value="filter.endDate" />
            </div>
        </div>
        <div class="metric">
            <div v-if="loading">Loading...</div>
            <UiAdminCard v-else v-for="(metric, index) in metrics" :key="index" :metric="metric" />
        </div>
    </div>



</template>

<script setup lang="ts">
import type { Metrics } from '~/types/common';
import { getMetrics } from '~/services/admin/book';

const {getCurrentMonthBeginningAndEnd}=useUtils()
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
    console.log('watching')
    fetchBookMetrics();
})


</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 20vh;
    overflow-y: auto;
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
    height: 15vh;
    overflow-y: auto;
}
</style>