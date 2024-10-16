<template>
    <div class="content">
        <AdminBooksBook />
        <div class="chapter-card-container">
            <div v-if="action.toLowerCase() === 'view'" class="header">
                <button class="btn" :class="{ black: tab === Tabs.CHAPTERS }"
                    @click="setTab(Tabs.CHAPTERS)">CHAPTERS</button>
                <button class="btn" :class="{ black: tab === Tabs.METRICS }"
                    @click="setTab(Tabs.METRICS)">METRICS</button>
            </div>
            <AdminChapters v-if="tab === Tabs.CHAPTERS" />
        </div>
    </div>

</template>

<script setup lang="ts">
enum Tabs {
    CHAPTERS,
    METRICS
}
const route = useRoute()
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
</style>
