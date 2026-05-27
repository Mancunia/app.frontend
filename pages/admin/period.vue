<template>
  <div class="periods-page">

    <!-- ── Active period banner ─────────────────────────────────── -->
    <div v-if="!loadingActive" class="active-banner" :class="activePeriod ? 'banner-ok' : 'banner-warn'">
      <span class="banner-dot" />
      <div class="banner-body">
        <span v-if="activePeriod" class="banner-label">
          Active period:
          <strong>{{ activePeriod.year }}-{{ String(activePeriod.month).padStart(2, '0') }}</strong>
          &nbsp;·&nbsp;
          {{ formatDate(activePeriod.startDate) }} → {{ formatDate(activePeriod.endDate) }}
        </span>
        <span v-else class="banner-label">
          No active period — engagement tracking is paused
        </span>
      </div>
      <button
        v-if="!activePeriod"
        class="banner-action"
        :disabled="quickCreating"
        @click="quickCreate"
      >{{ quickCreating ? 'Creating…' : 'Create for current month' }}</button>
    </div>

    <!-- ── Page header ───────────────────────────────────────────── -->
    <header class="page-hdr">
      <h1 class="page-title">Periods</h1>
    </header>

    <!-- ── Mode selector ────────────────────────────────────────── -->
    <div class="mode-cards">
      <button class="mode-card" :class="{ selected: mode === 'auto' }" @click="mode = 'auto'">
        <span class="mode-diamond">{{ mode === 'auto' ? '◆' : '◇' }}</span>
        <div>
          <div class="mode-name">Auto (monthly)</div>
          <div class="mode-desc">Periods roll automatically on the 1st of each month.</div>
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

    <!-- ── Auto settings panel ──────────────────────────────────── -->
    <div v-if="mode === 'auto'" class="settings-panel">
      <div class="setting-row">
        <span class="setting-lbl">Auto-creation</span>
        <div class="toggle-wrap">
          <button
            class="toggle"
            :class="{ 'toggle-on': autoPeriodCreation }"
            :disabled="togglingAuto || loadingConfig"
            @click="toggleAuto"
            :aria-label="autoPeriodCreation ? 'Disable auto-creation' : 'Enable auto-creation'"
          >
            <span class="toggle-thumb" />
          </button>
          <span class="setting-val">{{ loadingConfig ? '…' : autoPeriodCreation ? 'Enabled' : 'Disabled' }}</span>
        </div>
      </div>
      <div class="setting-row">
        <span class="setting-lbl">Roll day</span>
        <span class="setting-val">1st of each month at 00:00</span>
      </div>
      <div class="setting-row">
        <span class="setting-lbl">Timezone</span>
        <span class="setting-val">Africa/Accra (GMT+0)</span>
      </div>
      <div class="setting-row">
        <span class="setting-lbl">Close rule</span>
        <span class="setting-val">Previous period auto-closes at rollover</span>
      </div>

      <!-- Disabled warning -->
      <div v-if="!autoPeriodCreation && !loadingConfig" class="info-note note-warn">
        Auto-creation is off. You must manually create a period at the start of each month, or use the button below.
      </div>

      <!-- No active period quick-create (emergency trigger) -->
      <div v-if="!activePeriod && !loadingActive" class="quick-create-row">
        <div class="info-note">No active period. Create one for the current month now:</div>
        <button class="create-btn" :disabled="quickCreating" @click="quickCreate">
          {{ quickCreating ? 'Creating…' : 'Create current-month period' }}
        </button>
      </div>

      <p v-if="autoError" class="error-msg">{{ autoError }}</p>
    </div>

    <!-- ── Manual form ───────────────────────────────────────────── -->
    <div v-if="mode === 'manual'" class="settings-panel">
      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="period-month">Period (YYYY-MM)</label>
          <input id="period-month" type="month" v-model="form.month" class="field-input" />
        </div>
      </div>
      <div class="field-row">
        <div class="field-group flex-1">
          <label class="field-label" for="period-from">From</label>
          <input id="period-from" type="datetime-local" v-model="form.startDate" class="field-input" />
        </div>
        <div class="field-group flex-1">
          <label class="field-label" for="period-to">To</label>
          <input id="period-to" type="datetime-local" :min="form.startDate" v-model="form.endDate" class="field-input" />
        </div>
      </div>
      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <button class="create-btn" :disabled="sending" @click="submit">
        {{ sending ? 'Creating…' : 'Create period' }}
      </button>
    </div>

    <!-- ── Periods table ─────────────────────────────────────────── -->
    <div class="table-wrap">
      <div class="table-hdr">
        <span class="panel-title">All periods</span>
      </div>
      <div v-if="loadingPeriods" class="loading-state">Loading periods…</div>
      <table v-else class="periods-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Window</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in periods" :key="p.id" class="period-row">
            <td class="period-name">{{ p.year }}-{{ String(p.month).padStart(2, '0') }}</td>
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
import {
  getActivePeriod,
  getAppConfig,
  getPeriods,
  postPeriod,
  updateAppConfig,
} from '~/services/admin/period';
import type { periodReq, periodRes } from '~/types/admin/period';

definePageMeta({ layout: 'admin-layout', middleware: 'admin', title: 'Periods' });

// ── State ────────────────────────────────────────────────────────
const mode             = ref<'auto' | 'manual'>('auto');
const periods          = ref<periodRes[]>([]);
const activePeriod     = ref<periodRes | null>(null);
const autoPeriodCreation = ref(true);

const loadingPeriods   = ref(false);
const loadingActive    = ref(false);
const loadingConfig    = ref(false);
const togglingAuto     = ref(false);
const sending          = ref(false);
const quickCreating    = ref(false);

const errorMsg  = ref('');
const autoError = ref('');
const form      = ref({ startDate: '', endDate: '', month: '' });

// ── Helpers ──────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

// ── Data fetching ────────────────────────────────────────────────
const fetchPeriods = async () => {
  loadingPeriods.value = true;
  try {
    const res = await getPeriods();
    if (res) periods.value = res.data ?? [];
  } finally {
    loadingPeriods.value = false;
  }
};

const fetchActive = async () => {
  loadingActive.value = true;
  try {
    const res = await getActivePeriod();
    activePeriod.value = res?.data ?? null;
  } finally {
    loadingActive.value = false;
  }
};

const fetchConfig = async () => {
  loadingConfig.value = true;
  try {
    const res = await getAppConfig();
    if (res?.data) autoPeriodCreation.value = res.data.autoPeriodCreation;
  } finally {
    loadingConfig.value = false;
  }
};

// ── Actions ──────────────────────────────────────────────────────

/** Toggle the backend autoPeriodCreation cron flag */
const toggleAuto = async () => {
  autoError.value = '';
  togglingAuto.value = true;
  try {
    const next = !autoPeriodCreation.value;
    await updateAppConfig({ autoPeriodCreation: next });
    autoPeriodCreation.value = next;
  } catch (e) {
    autoError.value = (e as Error).message ?? 'Failed to update setting.';
  } finally {
    togglingAuto.value = false;
  }
};

/** POST with empty body — backend auto-generates for current month */
const quickCreate = async () => {
  autoError.value = '';
  quickCreating.value = true;
  try {
    await postPeriod();
    await Promise.all([fetchActive(), fetchPeriods()]);
  } catch (e) {
    autoError.value = (e as Error).message ?? 'Failed to create period.';
  } finally {
    quickCreating.value = false;
  }
};

/** POST with explicit dates from the manual form */
const submit = async () => {
  errorMsg.value = '';
  if (!form.value.startDate || !form.value.endDate || !form.value.month) {
    errorMsg.value = 'All fields are required.';
    return;
  }
  sending.value = true;
  try {
    const [yearStr, monthStr] = form.value.month.split('-');
    const req: periodReq = {
      startDate: form.value.startDate,
      endDate:   form.value.endDate,
      year:      Number(yearStr),
      month:     Number(monthStr),
      active:    true,
    };
    await postPeriod(req);
    form.value = { startDate: '', endDate: '', month: '' };
    await Promise.all([fetchActive(), fetchPeriods()]);
  } catch (e) {
    errorMsg.value = (e as Error).message ?? 'Failed to create period.';
  } finally {
    sending.value = false;
  }
};

// ── Bootstrap ────────────────────────────────────────────────────
onMounted(() => Promise.all([fetchActive(), fetchPeriods(), fetchConfig()]));
</script>

<style scoped>
.periods-page { display: flex; flex-direction: column; gap: 20px; }

/* ── Banner ──────────────────────────────────────────────────── */
.active-banner {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 18px; border-radius: 10px; border: 1px solid;
}
.banner-ok   { background: rgba(46,125,50,0.07); border-color: rgba(46,125,50,0.25); }
.banner-warn { background: rgba(201,122,58,0.08); border-color: rgba(201,122,58,0.30); }

.banner-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.banner-ok   .banner-dot { background: #2e7d32; }
.banner-warn .banner-dot { background: var(--ochre); }

.banner-body { flex: 1; }
.banner-label { font-family: var(--font-sans); font-size: 13px; color: var(--ink); }
.banner-label strong { font-weight: 700; }

.banner-action {
  padding: 6px 14px; background: var(--ochre); border: none; border-radius: 7px;
  font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: var(--cream);
  cursor: pointer; white-space: nowrap; transition: background 0.15s;
}
.banner-action:hover    { background: var(--ochre-deep); }
.banner-action:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Header ──────────────────────────────────────────────────── */
.page-hdr   { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }

/* ── Mode cards ──────────────────────────────────────────────── */
.mode-cards { display: flex; gap: 12px; }
.mode-card {
  flex: 1; display: flex; align-items: flex-start; gap: 12px;
  padding: 16px 20px; background: var(--card); border: 1px solid var(--hairline);
  border-radius: 12px; text-align: left; cursor: pointer; transition: border-color 0.15s;
}
.mode-card.selected { border-color: var(--ochre); background: rgba(201,122,58,0.06); }
.mode-diamond { font-size: 12px; color: var(--ochre); margin-top: 2px; }
.mode-name  { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
.mode-desc  { font-family: var(--font-sans); font-size: 12px; color: var(--muted); line-height: 1.5; }

/* ── Settings panel ──────────────────────────────────────────── */
.settings-panel {
  background: var(--card); border: 1px solid var(--hairline); border-radius: 12px;
  padding: 20px; display: flex; flex-direction: column; gap: 14px;
}

.setting-row   { display: flex; gap: 16px; align-items: center; }
.setting-lbl {
  font-family: var(--font-sans); font-size: 12px; font-weight: 600;
  color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em;
  width: 120px; flex-shrink: 0;
}
.setting-val { font-family: var(--font-sans); font-size: 13.5px; color: var(--ink); }

/* Toggle */
.toggle-wrap { display: flex; align-items: center; gap: 10px; }
.toggle {
  position: relative; width: 36px; height: 20px; border-radius: 20px;
  background: var(--hairline); border: none; cursor: pointer;
  transition: background 0.2s; flex-shrink: 0; padding: 0;
}
.toggle.toggle-on    { background: #2e7d32; }
.toggle:disabled     { opacity: 0.5; cursor: not-allowed; }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 14px; height: 14px; border-radius: 50%; background: #fff;
  transition: left 0.2s; display: block;
}
.toggle.toggle-on .toggle-thumb { left: 19px; }

/* Notes */
.info-note {
  font-family: var(--font-sans); font-size: 12.5px; color: var(--muted);
  background: rgba(31,23,20,0.04); border: 1px solid var(--hairline);
  border-radius: 8px; padding: 10px 14px; line-height: 1.5;
}
.note-warn { border-color: rgba(201,122,58,0.30); background: rgba(201,122,58,0.05); color: var(--ink); }

.quick-create-row { display: flex; flex-direction: column; gap: 10px; }

/* ── Form fields ─────────────────────────────────────────────── */
.field-row   { display: flex; gap: 16px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.flex-1      { flex: 1; }
.field-label {
  font-family: var(--font-sans); font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted);
}
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
.create-btn:hover    { background: var(--ochre-deep); }
.create-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Table ───────────────────────────────────────────────────── */
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.table-hdr  { padding: 16px 20px; border-bottom: 1px solid var(--hairline); }
.panel-title {
  font-family: var(--font-sans); font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted);
}
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.periods-table { width: 100%; border-collapse: collapse; }
.periods-table th {
  font-family: var(--font-sans); font-size: 10px; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--muted); text-align: left;
  padding: 10px 16px; border-bottom: 1px solid var(--hairline);
}
.period-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.period-row:last-child td { border-bottom: none; }
.period-name { font-family: var(--font-mono); font-size: 13px; color: var(--ink); font-weight: 600; }
.window-cell { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }

.status-pill {
  display: inline-flex; padding: 2px 9px; border-radius: 20px;
  font-family: var(--font-sans); font-size: 11px; font-weight: 600;
}
.status-active   { background: rgba(46,125,50,0.12); color: #155724; }
.status-inactive { background: rgba(31,23,20,0.08); color: var(--muted); }


.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
</style>
