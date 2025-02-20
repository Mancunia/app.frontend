<template>
    <div class="content">
        <AdminBooksBook />
        <div class="chapter-card-container">
            <div v-if="action.toLowerCase() === 'view'" class="tabs">
                <button class="btn" :class="{ black: tab === Tabs.CHAPTERS }"
                    @click="setTab(Tabs.CHAPTERS)">CHAPTERS</button>
                <button class="btn" :class="{ black: tab === Tabs.METRICS }"
                    @click="setTab(Tabs.METRICS)">METRICS</button>
            </div>
            <div class="page">
                <AdminChapters :key="bookId" v-if="tab === Tabs.CHAPTERS" />
                <AdminBooksMetrics :key="otherId" v-else-if="tab === Tabs.METRICS" />
            </div>

        </div>
    </div>

</template>

<script setup lang="ts">
import { rand } from '@vueuse/core'

enum Tabs {
    CHAPTERS,
    METRICS
}
const route = useRoute()
const bookId = route.query.bookId as string
const otherId = ref(bookId + rand(1, 1000))
const action = computed(() => route.query.action as string || 'view')

const tab = ref<Tabs>(Tabs.CHAPTERS)
const setTab = (currentTab: Tabs) => tab.value = currentTab
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.chapter-card-container {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
}

.tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.btn {
    background: #dc8b20;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    margin-right: 10px;
    padding: 10px 20px;
}

.page {
    width: 100%;
    height: auto;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: scroll;
    gap: 40px;
    background: unset;
}
</style>
