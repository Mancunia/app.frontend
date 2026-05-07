<template>
  <div class="periods-page">
    <header class="page-hdr">
      <h1 class="page-title">Periods</h1>
    </header>

    <!-- Mode selector -->
    <div class="mode-cards">
      <button class="mode-card" :class="{ selected: mode === 'auto' }" @click="mode = 'auto'">
        <span class="mode-diamond">{{ mode === 'auto' ? '◆' : '◇' }}</span>
        <div>
          <div class="mode-name">Auto (monthly)</div>
          <div class="mode-desc">Periods roll automatically on a chosen day each month.</div>
        </div>
      </button>
      <button class="mode-card" :class="{ selected: mode === 'manual' }" @click="mode = 'manual'">
        <span class="mode-diamond">{{ mode === 'manual' ? '◆' : '◇' }}</span>
        <div>
          <div class="mode-name">Manual</div>
          <div class="mode-desc">Define exact from/to dates for each period yourself.</div>
        </div>
      </button>
    </div>

    <!-- Auto settings panel (display only) -->
    <div v-if="mode === 'auto'" class="settings-panel">
      <div class="setting-row">
        <span class="setting-lbl">Roll day</span>
        <span class="setting-val">1st of each month</span>
      </div>
      <div class="setting-row">
        <span class="setting-lbl">Timezone</span>
        <span class="setting-val">Africa/Accra (GMT+0)</span>
      </div>
      <div class="setting-row">
        <span class="setting-lbl">Close rule</span>
        <span class="setting-val">Auto-close previous period at rollover</span>
      </div>
    </div>

    <!-- Manual form -->
    <div v-if="mode === 'manual'" class="settings-panel">
      <div class="field-row">
        <div class="field-group">
          <label class="field-label">Period name (YYYY-MM)</label>
          <input type="month" v-model="form.month" class="field-input" />
        </div>
      </div>
      <div class="field-row">
        <div class="field-group flex-1">
          <label class="field-label">From</label>
          <input type="datetime-local" v-model="form.startDate" class="field-input" />
        </div>
        <div class="field-group flex-1">
          <label class="field-label">To</label>
          <input type="datetime-local" :min="form.startDate" v-model="form.endDate" class="field-input" />
        </div>
      </div>
      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <button class="create-btn" @click="submit" :disabled="sending">
        {{ sending ? 'Creating…' : 'Create period' }}
      </button>
    </div>

    <!-- Periods table -->
    <div class="table-wrap">
      <div class="table-hdr">
        <span class="panel-title">All periods</span>
      </div>
      <div v-if="loadingPeriods" class="loading-state">Loading periods…</div>
      <table v-else class="periods-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Mode</th>
            <th>Window</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in periods" :key="p.id" class="period-row">
            <td class="period-name">{{ p.year }}-{{ String(p.month).padStart(2, '0') }}</td>
            <td><span class="mode-pill">Monthly</span></td>
            <td class="window-cell">{{ formatDate(p.startDate) }} → {{ formatDate(p.endDate) }}</td>
            <td>
              <span class="status-pill" :class="p.status === 'active' ? 'status-active' : 'status-inactive'">
                {{ p.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loadingPeriods && (!periods || periods.length === 0)" class="empty">No periods yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPeriods, postPeriod } from '~/services/admin/period';
import type { periodRes, periodReq } from '~/types/admin/period';

definePageMeta({ layout: 'admin-layout', middleware: 'admin', title: 'Periods' });

const mode = ref<'auto' | 'manual'>('manual');
const periods = ref<periodRes[]>([]);
const loadingPeriods = ref(false);
const sending = ref(false);
const errorMsg = ref('');

const form = ref({ startDate: '', endDate: '', month: '' });

const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const fetchPeriods = async () => {
  loadingPeriods.value = true;
  try {
    const res = await getPeriods();
    if (res) periods.value = res.data ?? [];
  } finally {
    loadingPeriods.value = false;
  }
};

const submit = async () => {
  errorMsg.value = '';
  if (!form.value.startDate || !form.value.endDate || !form.value.month) {
    errorMsg.value = 'All fields are required.';
    return;
  }
  sending.value = true;
  try {
    const split = form.value.month.split('-');
    const req: periodReq = {
      startDate: form.value.startDate,
      endDate:   form.value.endDate,
      month:     split[1] ?? '',
      year:      split[0] ?? '',
      active:    true,
    };
    await postPeriod(req);
    form.value = { startDate: '', endDate: '', month: '' };
    await fetchPeriods();
  } catch (e) {
    errorMsg.value = (e as Error).message ?? 'Failed to create period.';
  } finally {
    sending.value = false;
  }
};

onMounted(fetchPeriods);
</script>

<style scoped>
.periods-page { display: flex; flex-direction: column; gap: 20px; }

.page-hdr { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }

.mode-cards { display: flex; gap: 12px; }
.mode-card {
  flex: 1; display: flex; align-items: flex-start; gap: 12px;
  padding: 16px 20px; background: var(--card); border: 1px solid var(--hairline);
  border-radius: 12px; text-align: left; cursor: pointer; transition: border-color 0.15s;
}
.mode-card.selected { border-color: var(--ochre); background: rgba(201,122,58,0.06); }
.mode-diamond { font-size: 12px; color: var(--ochre); margin-top: 2px; }
.mode-name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
.mode-desc { font-family: var(--font-sans); font-size: 12px; color: var(--muted); line-height: 1.5; }

.settings-panel {
  background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px;
  display: flex; flex-direction: column; gap: 14px;
}
.setting-row { display: flex; gap: 16px; align-items: center; }
.setting-lbl { font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; width: 100px; flex-shrink: 0; }
.setting-val { font-family: var(--font-sans); font-size: 13.5px; color: var(--ink); }

.field-row { display: flex; gap: 16px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.flex-1 { flex: 1; }
.field-label { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
.field-input {
  padding: 9px 14px; background: var(--paper); border: 1px solid var(--hairline);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink);
  outline: none; width: 100%; box-sizing: border-box;
}
.field-input:focus { border-color: var(--ochre); }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
.create-btn {
  align-self: flex-start; padding: 9px 20px; background: var(--ochre); border: none;
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600;
  color: var(--cream); cursor: pointer; transition: background 0.15s;
}
.create-btn:hover { background: var(--ochre-deep); }
.create-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.table-hdr { padding: 16px 20px; border-bottom: 1px solid var(--hairline); }
.panel-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.periods-table { width: 100%; border-collapse: collapse; }
.periods-table th {
  font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--muted); text-align: left; padding: 10px 16px; border-bottom: 1px solid var(--hairline);
}
.period-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.period-row:last-child td { border-bottom: none; }
.period-name { font-family: var(--font-mono); font-size: 13px; color: var(--ink); font-weight: 600; }
.mode-pill {
  display: inline-flex; padding: 2px 9px; border-radius: 20px;
  background: rgba(201,122,58,0.10); color: var(--ochre);
  font-family: var(--font-sans); font-size: 11px; font-weight: 600;
}
.window-cell { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
.status-pill {
  display: inline-flex; padding: 2px 9px; border-radius: 20px;
  font-family: var(--font-sans); font-size: 11px; font-weight: 600;
}
.status-active   { background: rgba(46,125,50,0.12); color: #2e7d32; }
.status-inactive { background: rgba(31,23,20,0.08); color: var(--muted); }
.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
</style>
