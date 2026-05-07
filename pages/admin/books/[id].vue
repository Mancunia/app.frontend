<template>
  <div class="analytics" v-if="book">
    <header class="an-header">
      <NuxtLink :to="routes.admin.books" class="back-link">← Stories</NuxtLink>
      <div class="an-book-meta">
        <img v-if="book.cover" :src="book.cover" class="an-cover" alt="" />
        <div v-else class="an-cover-placeholder">◆</div>
        <div>
          <h1 class="an-title">{{ book.title }}</h1>
          <p class="an-authors">{{ book.authors?.join(', ') }}</p>
        </div>
      </div>
    </header>

    <!-- KPI strip -->
    <div class="kpi-strip">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi-tile">
        <span class="kpi-label">{{ kpi.label }}</span>
        <span class="kpi-value">{{ kpi.value }}</span>
      </div>
    </div>

    <!-- Dual series chart -->
    <div class="panel">
      <div class="panel-head">
        <span class="panel-title">Listens &amp; reads over time</span>
        <div class="legend">
          <span class="leg-dot" style="background:var(--ochre)"></span><span class="leg-lbl">Listens</span>
          <span class="leg-dot" style="background:var(--kola-2)"></span><span class="leg-lbl">Reads</span>
        </div>
      </div>
      <svg class="chart-svg" viewBox="0 0 500 100" preserveAspectRatio="none">
        <polyline :points="listensPolyline" fill="none" stroke="var(--ochre)" stroke-width="2" stroke-linejoin="round"/>
        <polyline :points="readsPolyline"   fill="none" stroke="var(--kola-2)" stroke-width="2" stroke-linejoin="round" stroke-dasharray="4 3"/>
      </svg>
    </div>

    <div class="two-col">
      <!-- Chapter funnel -->
      <div class="panel">
        <div class="panel-head"><span class="panel-title">Chapter completion</span></div>
        <div class="funnel-list">
          <div v-for="ch in chapters" :key="ch.num" class="funnel-row">
            <span class="ch-num">Ch. {{ ch.num }}</span>
            <span class="ch-title">{{ ch.title }}</span>
            <div class="funnel-track">
              <div class="funnel-bar" :style="{ width: ch.completion + '%', background: ch.completion > 60 ? 'var(--ochre)' : ch.completion > 30 ? 'var(--kola-2)' : 'var(--calabash)' }" />
            </div>
            <span class="ch-pct">{{ ch.completion }}%</span>
          </div>
        </div>
      </div>

      <!-- Region bars -->
      <div class="panel">
        <div class="panel-head"><span class="panel-title">Top regions</span></div>
        <div class="region-list">
          <div v-for="r in regions" :key="r.city" class="region-row">
            <span class="region-city">{{ r.city }}</span>
            <div class="region-track">
              <div class="region-bar" :style="{ width: r.pct + '%' }" />
            </div>
            <span class="region-pct">{{ r.pct }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-state">Loading…</div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { getBook } from '@/services/book';
import type { BOOK } from '~/types/book';

definePageMeta({ title: 'Book Analytics', middleware: 'admin', layout: 'admin-layout' });

const route = useRoute();
const id = route.params.id as string;
const book = ref<BOOK | null>(null);

onMounted(async () => {
  const { data } = await getBook(id, USER_ROLES.ADMIN);
  if (data) book.value = data;
});

const kpis = computed(() => [
  { label: 'Listens',    value: book.value?.meta?.played   ?? '—' },
  { label: 'Reads',      value: book.value?.meta?.views    ?? '—' },
  { label: 'Likes',      value: book.value?.meta?.likes    ?? '—' },
  { label: 'Comments',   value: book.value?.meta?.comments ?? '—' },
  { label: 'Avg rating', value: '—' },
]);

const listensData = [20, 35, 28, 50, 44, 62, 55, 80, 71, 90, 85, 110, 102, 120];
const readsData   = [10, 18, 14, 26, 22, 34, 30, 44, 38, 50, 46,  60,  55,  68];
const W = 500; const H = 100; const P = 6;
const maxVal = Math.max(...listensData, ...readsData);
const toPolyline = (data: number[]) =>
  data.map((v, i) => `${P + (i / (data.length - 1)) * (W - P * 2)},${H - P - (v / maxVal) * (H - P * 2)}`).join(' ');
const listensPolyline = toPolyline(listensData);
const readsPolyline   = toPolyline(readsData);

const chapters = [
  { num: 1, title: 'The Beginning',   completion: 92 },
  { num: 2, title: 'Into the Forest', completion: 78 },
  { num: 3, title: 'The Trial',       completion: 64 },
  { num: 4, title: 'Lost Ways',       completion: 48 },
  { num: 5, title: 'Return',          completion: 35 },
];

const regions = [
  { city: 'Accra',    pct: 42 },
  { city: 'Kumasi',   pct: 24 },
  { city: 'Tamale',   pct: 14 },
  { city: 'Takoradi', pct: 10 },
  { city: 'Sunyani',  pct: 6  },
  { city: 'Other',    pct: 4  },
];
</script>

<style scoped>
.analytics { display: flex; flex-direction: column; gap: 20px; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); color: var(--muted); }

.an-header { display: flex; flex-direction: column; gap: 12px; }
.back-link { font-family: var(--font-sans); font-size: 13px; color: var(--muted); text-decoration: none; }
.back-link:hover { color: var(--ochre); }
.an-book-meta { display: flex; align-items: center; gap: 16px; }
.an-cover { width: 48px; height: 64px; object-fit: cover; border-radius: 4px; }
.an-cover-placeholder {
  width: 48px; height: 64px; border-radius: 4px; background: var(--calabash);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: var(--ochre); flex-shrink: 0;
}
.an-title { font-family: var(--font-display); font-size: 20px; color: var(--ink); margin: 0 0 4px; }
.an-authors { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }

.kpi-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.kpi-tile {
  background: var(--card); border: 1px solid var(--hairline); border-radius: 10px;
  padding: 16px; display: flex; flex-direction: column; gap: 6px;
}
.kpi-label { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.kpi-value { font-family: var(--font-serif); font-size: 24px; color: var(--ink); line-height: 1; }

.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; }
.panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.panel-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); }
.legend { display: flex; align-items: center; gap: 12px; }
.leg-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.leg-lbl { font-family: var(--font-sans); font-size: 11px; color: var(--muted); }

.chart-svg { width: 100%; height: 100px; display: block; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.funnel-list { display: flex; flex-direction: column; gap: 10px; }
.funnel-row { display: flex; align-items: center; gap: 10px; }
.ch-num { font-family: var(--font-mono); font-size: 11px; color: var(--muted); width: 36px; flex-shrink: 0; }
.ch-title { font-family: var(--font-sans); font-size: 12.5px; color: var(--ink); width: 140px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.funnel-track { flex: 1; height: 8px; background: var(--hairline); border-radius: 4px; overflow: hidden; }
.funnel-bar { height: 100%; border-radius: 4px; transition: width 0.4s; }
.ch-pct { font-family: var(--font-mono); font-size: 11px; color: var(--muted); width: 36px; text-align: right; }

.region-list { display: flex; flex-direction: column; gap: 10px; }
.region-row { display: flex; align-items: center; gap: 10px; }
.region-city { font-family: var(--font-sans); font-size: 12.5px; color: var(--ink); width: 90px; flex-shrink: 0; }
.region-track { flex: 1; height: 8px; background: var(--hairline); border-radius: 4px; overflow: hidden; }
.region-bar { height: 100%; background: var(--kola-2); border-radius: 4px; transition: width 0.4s; }
.region-pct { font-family: var(--font-mono); font-size: 11px; color: var(--muted); width: 36px; text-align: right; }
</style>
