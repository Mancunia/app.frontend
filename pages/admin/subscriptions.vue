<template>
  <div class="subs-page">
    <header class="page-hdr">
      <h1 class="page-title">Coins</h1>
      <p class="page-sub">Subscription overview</p>
    </header>

    <!-- KPI strip -->
    <div class="kpi-strip">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi-tile">
        <span class="kpi-label">{{ kpi.label }}</span>
        <span class="kpi-value">{{ kpi.value }}</span>
      </div>
    </div>

    <!-- Two-col: donut + table -->
    <div class="main-grid">
      <!-- Plan mix donut -->
      <div class="panel donut-panel">
        <div class="panel-title">Plan mix</div>
        <svg class="donut-svg" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="48" fill="none" stroke="var(--hairline)" stroke-width="18"/>
          <circle
            v-for="(seg, i) in donutSegments"
            :key="i"
            cx="60" cy="60" r="48"
            fill="none"
            :stroke="seg.color"
            stroke-width="18"
            :stroke-dasharray="`${seg.dash} ${seg.gap}`"
            :stroke-dashoffset="seg.offset"
            transform="rotate(-90 60 60)"
          />
          <text x="60" y="57" text-anchor="middle" font-family="var(--font-serif)" font-size="14" fill="var(--ink)">{{ totalActive }}</text>
          <text x="60" y="70" text-anchor="middle" font-family="var(--font-sans)" font-size="7" fill="var(--muted)">active</text>
        </svg>
        <div class="donut-legend">
          <div v-for="plan in plans" :key="plan.label" class="leg-row">
            <span class="leg-dot" :style="{ background: plan.color }" />
            <span class="leg-label">{{ plan.label }}</span>
            <span class="leg-count">{{ plan.count }}</span>
          </div>
        </div>
      </div>

      <!-- Subscriptions table -->
      <div class="panel table-panel">
        <div class="panel-title">Recent subscriptions</div>
        <table class="subs-table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Plan</th>
              <th>Since</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sub in mockSubs" :key="sub.email" class="sub-row">
              <td>
                <div class="sub-cell">
                  <div class="sub-avatar">{{ sub.name[0] }}</div>
                  <div>
                    <div class="sub-name">{{ sub.name }}</div>
                    <div class="sub-email">{{ sub.email }}</div>
                  </div>
                </div>
              </td>
              <td class="plan-cell">{{ sub.plan }}</td>
              <td class="date-cell">{{ sub.since }}</td>
              <td>
                <span class="status-pill" :class="`status-${sub.status}`">{{ sub.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ title: 'Coins', middleware: 'admin', layout: 'admin-layout' });

const kpis = [
  { label: 'Active subscribers', value: '—' },
  { label: 'MRR (GHC)',          value: '—' },
  { label: 'Churn rate',         value: '—' },
  { label: 'Avg tenure (mo.)',   value: '—' },
];

const plans = [
  { label: 'Monthly',  count: 0, color: 'var(--ochre)' },
  { label: 'Annual',   count: 0, color: 'var(--kola-2)' },
  { label: 'Trialing', count: 0, color: 'var(--calabash)' },
];

const totalActive = computed(() => plans.reduce((s, p) => s + p.count, 0) || '—');

const CIRCUMFERENCE = 2 * Math.PI * 48;
const donutSegments = computed(() => {
  const total = plans.reduce((s, p) => s + p.count, 0) || 1;
  let offset = 0;
  return plans.map(p => {
    const pct = p.count / total;
    const seg = { dash: pct * CIRCUMFERENCE, gap: CIRCUMFERENCE - pct * CIRCUMFERENCE, offset: -offset * CIRCUMFERENCE, color: p.color };
    offset += pct;
    return seg;
  });
});

const mockSubs = [
  { name: 'Ama Owusu',    email: 'ama@example.com',    plan: 'Monthly', since: '1 May 2026',  status: 'active'   },
  { name: 'Kofi Mensah',  email: 'kofi@example.com',   plan: 'Annual',  since: '12 Apr 2026', status: 'active'   },
  { name: 'Akosua Darko', email: 'akos@example.com',   plan: 'Monthly', since: '3 Apr 2026',  status: 'trialing' },
  { name: 'Yaw Asante',   email: 'yaw@example.com',    plan: 'Annual',  since: '22 Mar 2026', status: 'paused'   },
  { name: 'Abena Boateng',email: 'abena@example.com',  plan: 'Monthly', since: '15 Feb 2026', status: 'churned'  },
];
</script>

<style scoped>
.subs-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; flex-direction: column; gap: 4px; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.page-sub { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }

.kpi-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.kpi-tile {
  background: var(--card); border: 1px solid var(--hairline); border-radius: 10px;
  padding: 16px; display: flex; flex-direction: column; gap: 6px;
}
.kpi-label { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.kpi-value { font-family: var(--font-serif); font-size: 24px; color: var(--ink); line-height: 1; }

.main-grid { display: grid; grid-template-columns: 260px 1fr; gap: 16px; align-items: start; }
.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; }
.panel-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); margin-bottom: 16px; }
.donut-panel { display: flex; flex-direction: column; align-items: center; }
.donut-svg { width: 120px; height: 120px; margin-bottom: 16px; }
.donut-legend { width: 100%; display: flex; flex-direction: column; gap: 8px; }
.leg-row { display: flex; align-items: center; gap: 8px; }
.leg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.leg-label { font-family: var(--font-sans); font-size: 12.5px; color: var(--ink); flex: 1; }
.leg-count { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }

.table-panel { padding: 20px 0; }
.table-panel .panel-title { padding: 0 20px 16px; margin: 0; }
.subs-table { width: 100%; border-collapse: collapse; }
.subs-table th {
  font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--muted); text-align: left; padding: 0 16px 10px; border-bottom: 1px solid var(--hairline);
}
.sub-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.sub-row:last-child td { border-bottom: none; }

.sub-cell { display: flex; align-items: center; gap: 10px; }
.sub-avatar {
  width: 30px; height: 30px; border-radius: 50%; background: var(--calabash);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-sans); font-size: 12px; font-weight: 700; color: var(--kola);
  flex-shrink: 0;
}
.sub-name  { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--ink); }
.sub-email { font-family: var(--font-sans); font-size: 11px; color: var(--muted); }
.plan-cell { font-family: var(--font-sans); font-size: 12.5px; color: var(--ink); }
.date-cell { font-family: var(--font-mono); font-size: 11.5px; color: var(--muted); }

.status-pill {
  display: inline-flex; padding: 2px 9px; border-radius: 20px;
  font-family: var(--font-sans); font-size: 11px; font-weight: 600;
}
.status-active   { background: rgba(46,125,50,0.12);  color: #2e7d32; }
.status-trialing { background: rgba(201,122,58,0.14); color: var(--ochre); }
.status-paused   { background: rgba(226,211,197,0.5); color: var(--kola-2); }
.status-churned  { background: rgba(208,76,79,0.12);  color: var(--hibiscus); }
</style>
