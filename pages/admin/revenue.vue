<template>
  <div class="revenue-page">
    <header class="page-hdr">
      <h1 class="page-title">Revenue</h1>
    </header>

    <div class="kpi-strip">
      <div class="kpi-tile">
        <span class="kpi-label">MRR (GHC)</span>
        <span class="kpi-value">{{ summary?.mrr ?? '…' }}</span>
      </div>
      <div class="kpi-tile">
        <span class="kpi-label">Active subscribers</span>
        <span class="kpi-value">{{ summary?.totalActiveSubscribers ?? '…' }}</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">Revenue by plan</div>
      <div style="height:200px; position:relative;">
        <ClientOnly>
          <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
        </ClientOnly>
      </div>
    </div>

    <div class="table-wrap">
      <table class="rev-table">
        <thead><tr><th>Plan</th><th>Unit price (GHC)</th><th>Subscribers</th><th>Contribution (GHC)</th></tr></thead>
        <tbody>
          <tr v-for="p in summary?.byPlan ?? []" :key="p.name" class="rev-row">
            <td class="plan-name">{{ p.name }}</td>
            <td class="num">{{ p.amount }}</td>
            <td class="num">{{ p.count }}</td>
            <td class="num">{{ p.contribution }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="disclaimer">Figures reflect active subscriptions only. Actual payment receipts are in Paystack.</p>
  </div>
</template>

<script setup lang="ts">
import { getRevenueSummary } from '@/services/admin/revenue'
import { Bar } from 'vue-chartjs'
import type { RevenueSummary } from '~/types/admin/revenue'

definePageMeta({ title: 'Revenue', middleware: 'admin', layout: 'admin-layout' })

const summary = ref<RevenueSummary | null>(null)

const chartData = computed(() => summary.value ? {
  labels: summary.value.byPlan.map(p => p.name),
  datasets: [{ label: 'Contribution (GHC)', data: summary.value.byPlan.map(p => p.contribution), backgroundColor: '#C97A3A', borderRadius: 4 }],
} : null)

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#888' } },
    y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#888' } },
  },
}

onMounted(async () => {
  const res = await getRevenueSummary()
  if (res) summary.value = res
})
</script>

<style scoped>
.revenue-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.kpi-strip { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; max-width: 400px; }
.kpi-tile { background: var(--card); border: 1px solid var(--hairline); border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.kpi-label { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.kpi-value { font-family: var(--font-serif); font-size: 28px; color: var(--ink); line-height: 1; }
.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; }
.panel-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); margin-bottom: 16px; }
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.rev-table { width: 100%; border-collapse: collapse; }
.rev-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.rev-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.rev-row:last-child td { border-bottom: none; }
.plan-name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.num { font-family: var(--font-mono); font-size: 13px; color: var(--ink); }
.disclaimer { font-family: var(--font-sans); font-size: 11.5px; color: var(--muted); font-style: italic; }
</style>
