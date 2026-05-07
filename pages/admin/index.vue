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
          <svg class="pulse-svg" viewBox="0 0 420 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--ochre)" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="var(--ochre)" stop-opacity="0.02"/>
              </linearGradient>
            </defs>
            <path :d="pulseArea" fill="url(#pulseGrad)" />
            <path :d="pulseLine" fill="none" stroke="var(--ochre)" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          <div class="pulse-labels">
            <span v-for="lbl in pulseLabels" :key="lbl" class="pulse-lbl">{{ lbl }}</span>
          </div>
        </div>

        <!-- Genre weft -->
        <div class="panel">
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
        </div>
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
                <th>Hrs</th>
                <th>Cmpl.</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in topStories" :key="s.title">
                <td class="story-title">{{ s.title }}</td>
                <td>{{ s.listens }}</td>
                <td>{{ s.hrs }}</td>
                <td>
                  <div class="cmpl-track">
                    <div class="cmpl-bar" :style="{ width: s.completion + '%' }" />
                  </div>
                </td>
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
import { getBooks } from '@/services/book';

definePageMeta({ title: 'Hearth', middleware: 'admin', layout: 'admin-layout' });

const todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

const bookCount = ref('…');
onMounted(async () => {
  const { data } = await getBooks(USER_ROLES.ADMIN, { page: 1, limit: 1 });
  if (data) bookCount.value = String(data.records ?? '—');
});

const kpis = computed(() => [
  { label: 'Listeners tonight', value: '—', delta: 0 },
  { label: 'Hours listened (7d)', value: '—', delta: 0 },
  { label: 'Stories in library', value: bookCount.value, delta: 0 },
  { label: 'MRR (GHC)', value: '—', delta: 0 },
]);

const pulseData = [42, 58, 51, 70, 63, 88, 74, 91, 85, 72, 95, 80, 110, 104];
const W = 420; const H = 90; const PAD = 6;
const max = Math.max(...pulseData);
const pts = pulseData.map((v, i) => ({
  x: PAD + (i / (pulseData.length - 1)) * (W - PAD * 2),
  y: H - PAD - (v / max) * (H - PAD * 2),
}));
const pulseLine = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
const pulseArea = `${pulseLine} L${pts[pts.length-1].x.toFixed(1)},${H} L${pts[0].x.toFixed(1)},${H} Z`;
const pulseLabels = (() => {
  const out: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    out.push(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }));
  }
  return out.filter((_, i) => i % 4 === 0);
})();

const genres = [
  { name: 'Folklore',    pct: 38 },
  { name: 'History',     pct: 26 },
  { name: 'Fiction',     pct: 18 },
  { name: 'Children',    pct: 11 },
  { name: 'Non-fiction', pct: 7  },
];

const topStories = [
  { title: 'Ananse and the Sky God', listens: 1240, hrs: 312, completion: 78 },
  { title: 'The Drum of the Forest', listens: 890,  hrs: 201, completion: 65 },
  { title: 'Yaa Asantewaa',          listens: 760,  hrs: 198, completion: 82 },
  { title: 'Kofi and the River',     listens: 610,  hrs: 134, completion: 55 },
  { title: 'Tales of Kweku',         listens: 490,  hrs: 98,  completion: 48 },
];

const fireLog = [
  { time: '09:41', msg: 'New listener joined — Accra' },
  { time: '09:38', msg: '"Ananse and the Sky God" completed' },
  { time: '09:22', msg: 'New story published: Kofi and the River' },
  { time: '08:55', msg: 'Subscription renewed — Kumasi' },
  { time: '08:31', msg: '3 new listeners this morning' },
];
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
