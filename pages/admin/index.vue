<template>
  <div class="hearth">
    <header class="hearth-header">
      <h1 class="hearth-title">Hearth</h1>
      <span class="hearth-date">{{ todayLabel }}</span>
    </header>

    <!-- KPI grid -->
    <div class="kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card">
        <span class="kpi-label">{{ kpi.label }}</span>
        <span class="kpi-value">{{ kpi.value }}</span>
        <span v-if="kpi.delta !== 0" class="kpi-delta" :class="kpi.delta > 0 ? 'pos' : 'neg'">
          {{ kpi.delta > 0 ? '↑' : '↓' }} {{ Math.abs(kpi.delta) }}%
        </span>
      </div>
    </div>

    <!-- Main two-col grid -->
    <div class="main-grid">
      <!-- Left column -->
      <div class="col-left">
        <!-- Pulse chart -->
        <div class="panel">
          <div class="panel-head">
            <span class="panel-title">Listening pulse — 14 days</span>
          </div>
          <div style="height:90px; position:relative;">
            <ClientOnly>
              <Line :data="pulseChartData" :options="pulseChartOptions" />
            </ClientOnly>
          </div>
        </div>

        <!-- Genre weft -->
        <!-- <div class="panel">
          <div class="panel-head">
            <span class="panel-title">Listening by genre</span>
          </div>
          <div class="genre-list">
            <div v-for="g in genres" :key="g.name" class="genre-row">
              <span class="genre-name">{{ g.name }}</span>
              <div class="genre-track">
                <div class="genre-bar" :style="{ width: g.pct + '%' }" />
              </div>
              <span class="genre-pct">{{ g.pct }}%</span>
            </div>
          </div>
        </div> -->
      </div>

      <!-- Right column -->
      <div class="col-right">
        <!-- Top Stories -->
        <div class="panel">
          <div class="panel-head">
            <span class="panel-title">Top stories this week</span>
          </div>
          <table class="stories-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Listens</th>
                <!-- <th>Hrs</th>
                <th>Cmpl.</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in topStories" :key="s.id ?? s.title" class="story-row">
                <td class="story-title">{{ s.title }}</td>
                <td>{{ s.meta?.played ?? '—' }}</td>
                <!-- <td>—</td> -->
                <!-- <td>
                  <div class="cmpl-track"><div class="cmpl-bar" style="width:0%" /></div>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Fire log -->
        <div class="panel">
          <div class="panel-head">
            <span class="panel-title">Fire log</span>
          </div>
          <div class="fire-log">
            <div v-for="entry in fireLog" :key="entry.time" class="log-row">
              <span class="log-time">{{ entry.time }}</span>
              <span class="log-msg">{{ entry.msg }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDashboardStats, getDashboardPulse } from '@/services/admin/dashboard'
import { getBooks } from '@/services/book'
import { Line } from 'vue-chartjs'
import type { DashboardStats, PulsePoint } from '~/types/admin/dashboard'
import type { BOOK } from '~/types/book'

definePageMeta({ title: 'Hearth', middleware: 'admin', layout: 'admin-layout' })

const todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

const stats = ref<DashboardStats | null>(null)
const pulse = ref<PulsePoint[]>([])
const topStories = ref<BOOK[]>([])

onMounted(async () => {
  const [statsRes, pulseRes, booksRes] = await Promise.all([
    getDashboardStats(),
    getDashboardPulse(14),
    getBooks(USER_ROLES.ADMIN, { page: 1, limit: 5 }),
  ])
  if (statsRes) stats.value = statsRes
  if (pulseRes) pulse.value = pulseRes
  if (booksRes) topStories.value = booksRes.results ?? []
})

const kpis = computed(() => [
  // { label: 'Listeners tonight',   value: '—',                                    delta: 0 },
  // { label: 'Hours listened (7d)', value: '—',                                    delta: 0 },
  { label: 'Stories in library',  value: stats.value?.books ?? '…',              delta: 0 },
  { label: 'Active subscribers',  value: stats.value?.activeSubscribers ?? '…',  delta: 0 },
])

const pulseChartData = computed(() => ({
  labels: pulse.value.map(p => p.date.slice(5)),
  datasets: [{
    label: 'Plays',
    data: pulse.value.map(p => p.plays),
    borderColor: '#C97A3A',
    backgroundColor: 'rgba(201,122,58,0.12)',
    tension: 0.3,
    fill: true,
    pointRadius: 2,
  }],
}))

const pulseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index' as const } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#888', font: { size: 10 } } },
    y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#888', font: { size: 10 } } },
  },
}

const genres = [
  { name: 'Folklore',    pct: 38 },
  { name: 'History',     pct: 26 },
  { name: 'Fiction',     pct: 18 },
  { name: 'Children',    pct: 11 },
  { name: 'Non-fiction', pct: 7  },
]

const fireLog = [
  { time: '—', msg: 'Activity log coming soon' },
]
</script>

<style scoped>
.hearth { display: flex; flex-direction: column; gap: 24px; }

.hearth-header { display: flex; align-items: baseline; gap: 16px; }
.hearth-title { font-family: var(--font-display); font-size: 24px; color: var(--ink); margin: 0; }
.hearth-date { font-family: var(--font-sans); font-size: 13px; color: var(--muted); }

.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.kpi-card {
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 20px;
  display: flex; flex-direction: column; gap: 6px;
}
.kpi-label { font-family: var(--font-sans); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.kpi-value { font-family: var(--font-serif); font-size: 28px; color: var(--ink); line-height: 1; }
.kpi-delta { font-family: var(--font-mono); font-size: 11px; }
.kpi-delta.pos { color: #2e7d32; }
.kpi-delta.neg { color: var(--hibiscus); }

.main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.col-left, .col-right { display: flex; flex-direction: column; gap: 16px; }

.panel {
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 20px;
}
.panel-head { margin-bottom: 16px; }
.panel-title { font-family: var(--font-sans); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }

.pulse-svg { width: 100%; height: 90px; display: block; }
.pulse-labels { display: flex; justify-content: space-between; margin-top: 6px; }
.pulse-lbl { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }

.genre-list { display: flex; flex-direction: column; gap: 10px; }
.genre-row { display: flex; align-items: center; gap: 10px; }
.genre-name { font-family: var(--font-sans); font-size: 12px; color: var(--ink); width: 90px; flex-shrink: 0; }
.genre-track { flex: 1; height: 6px; background: var(--hairline); border-radius: 3px; overflow: hidden; }
.genre-bar { height: 100%; background: var(--ochre); border-radius: 3px; transition: width 0.4s; }
.genre-pct { font-family: var(--font-mono); font-size: 11px; color: var(--muted); width: 32px; text-align: right; }

.stories-table { width: 100%; border-collapse: collapse; }
.stories-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); text-align: left; padding: 0 0 10px; border-bottom: 1px solid var(--hairline); }
.stories-table td { font-family: var(--font-sans); font-size: 12.5px; color: var(--ink); padding: 9px 0; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.stories-table tr:last-child td { border-bottom: none; }
.story-title { font-weight: 500; max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cmpl-track { height: 5px; background: var(--hairline); border-radius: 3px; width: 60px; overflow: hidden; }
.cmpl-bar { height: 100%; background: var(--ochre); border-radius: 3px; }

.fire-log { display: flex; flex-direction: column; gap: 0; }
.log-row { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--hairline); }
.log-row:last-child { border-bottom: none; }
.log-time { font-family: var(--font-mono); font-size: 11px; color: var(--muted); flex-shrink: 0; padding-top: 1px; }
.log-msg { font-family: var(--font-sans); font-size: 12.5px; color: var(--ink); }
</style>
