<template>
  <div class="subs-page">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <header class="page-hdr">
      <div>
        <h1 class="page-title">Subscriptions</h1>
        <p class="page-sub">Subscription management</p>
      </div>
    </header>

    <!-- ── KPI strip ─────────────────────── always visible ─────── -->
    <div class="kpi-strip">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi-tile">
        <span class="kpi-label">{{ kpi.label }}</span>
        <span class="kpi-value">{{ kpi.value }}</span>
      </div>
    </div>

    <!-- ── Tab bar ──────────────────────────────────────────────── -->
    <div class="tab-bar" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        role="tab"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        :aria-selected="activeTab === tab.id"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- OVERVIEW TAB                                               -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'overview'" class="tab-pane">
      <div class="overview-grid">

        <!-- Plan mix donut -->
        <div class="panel donut-panel">
          <div class="panel-title">Plan mix</div>
          <svg class="donut-svg" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" fill="none" stroke="var(--hairline)" stroke-width="18" />
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
            <div v-for="item in planLegend" :key="item.label" class="leg-row">
              <span class="leg-dot" :style="{ background: item.color }" />
              <span class="leg-label">{{ item.label }}</span>
              <span class="leg-count">{{ item.count }}</span>
            </div>
            <div v-if="planLegend.length === 0" class="empty-inline">No plan data.</div>
          </div>
        </div>

        <!-- Revenue by plan (horizontal bars) -->
        <div class="panel mrr-panel">
          <div class="panel-title">Revenue by plan</div>
          <div class="mrr-list">
            <div v-for="p in stats?.byPlan ?? []" :key="p.name" class="mrr-row">
              <div class="mrr-top">
                <span class="mrr-name">{{ p.name }}</span>
                <span class="mrr-contrib">GHC {{ (p.count * p.amount).toLocaleString() }}</span>
              </div>
              <div class="mrr-track">
                <div class="mrr-bar" :style="{ width: mrrPct(p) + '%', background: accentFor(p.name) }" />
              </div>
              <div class="mrr-meta">
                <span class="mrr-count">{{ p.count }} subscriber{{ p.count !== 1 ? 's' : '' }}</span>
                <span class="mrr-unit">× GHC {{ p.amount }}</span>
              </div>
            </div>
            <div v-if="!stats?.byPlan?.length" class="empty-inline">No revenue data yet.</div>
          </div>
        </div>

        <!-- Recent subscribers -->
        <div class="panel recent-panel">
          <div class="panel-hdr">
            <span class="panel-title">Recent subscribers</span>
            <button class="link-btn" @click="activeTab = 'subscribers'">View all →</button>
          </div>
          <div v-if="recentSubs.length === 0" class="empty-inline empty-padded">No subscriptions yet.</div>
          <table v-else class="subs-table">
            <thead class="sr-only">
              <tr>
                <th scope="col">Subscriber</th>
                <th scope="col">Plan</th>
                <th scope="col">Activated</th>
                <th scope="col">Expires</th>
                <th scope="col">Status</th>
                <th scope="col">Auto-renew</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sub in recentSubs" :key="sub.id" class="sub-row">
                <td>
                  <div class="sub-cell">
                    <img v-if="sub.user.dp" :src="sub.user.dp" class="sub-avatar-img" alt="" />
                    <div v-else class="sub-avatar">{{ sub.user.username[0]?.toUpperCase() }}</div>
                    <div>
                      <div class="sub-name">{{ sub.user.username }}</div>
                      <div class="sub-email">{{ sub.user.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="plan-pill" :style="{ '--pa': accentFor(sub.plan) }">
                    <span class="plan-dot" />{{ sub.plan }}
                  </div>
                </td>
                <td class="date-cell">{{ formatDate(sub.activatedAt) }}</td>
                <td class="date-cell">{{ formatDate(sub.expiresAt) }}</td>
                <td>
                  <span
                    class="expiry-badge"
                    :class="`expiry-badge--${getExpiryBadge(sub.daysRemaining).color}`"
                  >{{ getExpiryBadge(sub.daysRemaining).label }}</span>
                </td>
                <td class="renew-cell">
                  <span class="renew-icon" :title="sub.autorenew ? 'Auto-renews' : 'Manual'">
                    {{ sub.autorenew ? '↻' : '⊘' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- PLANS TAB                                                  -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'plans'" class="tab-pane">

      <div class="plans-hdr">
        <span class="plans-meta">
          {{ loadingPlans ? '…' : `${plans.length} plan${plans.length !== 1 ? 's' : ''} · ${plans.filter(p => p.active && p.visible).length} public` }}
        </span>
        <button class="btn-primary" @click="openCreate">+ New Plan</button>
      </div>

      <div v-if="loadingPlans" class="loading-state">Loading plans…</div>

      <div v-else-if="plans.length === 0" class="empty-state">
        <p class="empty-msg">No subscription plans yet.</p>
        <button class="btn-primary" @click="openCreate">Create your first plan</button>
      </div>

      <div v-else class="plans-grid">
        <article
          v-for="plan in plans"
          :key="plan.id"
          class="plan-card"
          :style="{ '--pa': plan.accent || 'var(--ochre)' }"
        >
          <!-- Name + subscriber count -->
          <div class="pc-top">
            <span class="pc-name">{{ plan.name }}</span>
            <span class="pc-subs">{{ planSubCount(plan.name) }} sub{{ planSubCount(plan.name) !== 1 ? 's' : '' }}</span>
          </div>

          <!-- Price -->
          <div class="pc-price">
            <template v-if="plan.amount === 0">
              <span class="pc-free">Free</span>
            </template>
            <template v-else>
              <span class="pc-currency">GHC</span>
              <span class="pc-amount">{{ plan.amount.toLocaleString() }}</span>
            </template>
          </div>

          <!-- Duration + autorenew + origin -->
          <div class="pc-meta">
            <span class="pc-dur">{{ formatDuration(plan.duration) }}</span>
            <span v-if="plan.autorenew" class="pc-renew" title="Auto-renews">↻</span>
            <span class="pc-origin" v-if="plan.origin">({{ plan.origin }})</span>
          </div>

          <!-- Inline toggles: Active · Visible -->
          <div class="pc-toggles">
            <label class="pc-toggle-row" :class="{ muted: toggling.includes(plan.id) }">
              <span class="pc-tgl-label">Active</span>
              <span class="tgl-wrap" :class="{ on: plan.active }">
                <input
                  type="checkbox"
                  :aria-label="`Toggle ${plan.name} active`"
                  :checked="plan.active"
                  :disabled="toggling.includes(plan.id)"
                  @change="toggleField(plan, 'active')"
                />
                <span class="tgl-track"><span class="tgl-thumb" /></span>
              </span>
            </label>
            <label class="pc-toggle-row" :class="{ muted: toggling.includes(plan.id) }">
              <span class="pc-tgl-label">Visible</span>
              <span class="tgl-wrap" :class="{ on: plan.visible }">
                <input
                  type="checkbox"
                  :aria-label="`Toggle ${plan.name} visible`"
                  :checked="plan.visible"
                  :disabled="toggling.includes(plan.id)"
                  @change="toggleField(plan, 'visible')"
                />
                <span class="tgl-track"><span class="tgl-thumb" /></span>
              </span>
            </label>
          </div>

          <!-- Actions -->
          <div class="pc-actions">
            <button class="plan-btn plan-btn-edit" @click="openEdit(plan)">Edit</button>
            <button class="plan-btn plan-btn-del" @click="confirmDelete(plan)">Delete</button>
          </div>
        </article>
      </div>

    </div>

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- SUBSCRIBERS TAB                                            -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'subscribers'" class="tab-pane">

      <div class="subs-filters">
        <input
          v-model="subSearch"
          class="filter-input"
          type="search"
          placeholder="Search name or email…"
          @input="onSubSearch"
        />
        <select v-model="subPlanFilter" class="filter-select" @change="resetAndFetch">
          <option value="">All plans</option>
          <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
        <select v-model="subStatusFilter" class="filter-select" @change="resetAndFetch">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="free">Free</option>
        </select>
        <span v-if="subTotal > 0" class="filter-count">{{ subTotal.toLocaleString() }} total</span>
      </div>

      <div class="table-wrap">
        <div v-if="loadingSubs" class="loading-state padded">Loading subscribers…</div>

        <div v-else-if="subscribers.length === 0" class="empty-state padded">
          <p class="empty-msg">
            {{ subSearch ? `No results for "${subSearch}".` : 'No subscribers yet.' }}
          </p>
        </div>

        <table v-else class="subs-table full-table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Plan</th>
              <th>Activated</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Auto-renew</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sub in subscribers" :key="sub.id" class="sub-row">
              <td>
                <div class="sub-cell">
                  <img v-if="sub.user?.dp" :src="sub.user.dp" class="sub-avatar-img" alt="" />
                  <div v-else class="sub-avatar">{{ sub.user?.username?.[0]?.toUpperCase() }}</div>
                  <div>
                    <div class="sub-name">{{ sub.user?.username ?? '—' }}</div>
                    <div class="sub-email">{{ sub.user?.email ?? '—' }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="plan-pill" :style="{ '--pa': accentFor(sub.plan) }">
                  <span class="plan-dot" />{{ sub.plan }}
                </div>
              </td>
              <td class="date-cell">{{ formatDate(sub.activatedAt) }}</td>
              <td class="date-cell">{{ formatDate(sub.expiresAt) }}</td>
              <td>
                <span
                  v-if="sub.daysRemaining !== undefined"
                  class="expiry-badge"
                  :class="`expiry-badge--${getExpiryBadge(sub.daysRemaining).color}`"
                >{{ getExpiryBadge(sub.daysRemaining).label }}</span>
                <span v-else class="status-pill" :class="sub.active ? 'status-active' : 'status-inactive'">
                  {{ sub.active ? 'active' : 'inactive' }}
                </span>
              </td>
              <td class="renew-cell">
                <span
                  v-if="sub.autorenew !== undefined"
                  class="renew-icon"
                  :title="sub.autorenew ? 'Auto-renews' : 'Manual'"
                >{{ sub.autorenew ? '↻' : '⊘' }}</span>
                <span v-else class="date-cell">—</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="subPages > 1" class="pagination">
          <button class="page-btn" :disabled="subPage === 1" @click="goPage(subPage - 1)">← Prev</button>
          <span class="page-label">{{ subPage }} / {{ subPages }}</span>
          <button class="page-btn" :disabled="subPage === subPages" @click="goPage(subPage + 1)">Next →</button>
        </div>
      </div>

    </div>

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- SLIDE-OVER: Plan create / edit                             -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showSlideOver" class="slide-backdrop" @click.self="closeSlideOver">
        <aside class="slide-panel" role="dialog" :aria-label="editingPlan ? 'Edit plan' : 'New plan'">

          <div class="slide-hdr">
            <h2 class="slide-title">{{ editingPlan ? `Edit: ${editingPlan.name}` : 'New Plan' }}</h2>
            <button class="icon-btn" aria-label="Close" @click="closeSlideOver">✕</button>
          </div>

          <div class="slide-body">

            <!-- Form column -->
            <form class="plan-form" @submit.prevent="savePlan">

              <div class="form-row">
                <label class="form-label" for="pf-name">Plan name</label>
                <input id="pf-name" v-model="form.name" class="form-input" type="text" placeholder="e.g. Premium Monthly" required />
              </div>

              <div class="form-row-2">
                <div class="form-row">
                  <label class="form-label" for="pf-amount">Price (GHC)</label>
                  <input id="pf-amount" v-model.number="form.amount" class="form-input" type="number" min="0" step="1" placeholder="0 for free" required />
                </div>

                <div class="form-row">
                  <label class="form-label" for="pf-origin">Origin</label>
                  <input id="pf-origin" v-model="form.origin" class="form-input" type="text" placeholder="e.g. GH" />
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">Duration</label>
                <div class="dur-presets">
                    <button
                      v-for="pr in DURATION_PRESETS"
                      :key="pr.days"
                      type="button"
                      class="dur-btn"
                      :class="{ active: form.durationDays === pr.days }"
                      @click="form.durationDays = pr.days"
                    >{{ pr.label }}</button>
                  </div>
                  <input
                    v-model.number="form.durationDays"
                    class="form-input form-input-sm"
                    type="number"
                    min="1"
                    placeholder="Custom days"
                  />
                </div>

              <div class="form-row">
                <label class="form-label">Accent colour</label>
                <div class="accent-row">
                  <button
                    v-for="sw in ACCENT_SWATCHES"
                    :key="sw"
                    type="button"
                    class="swatch"
                    :class="{ selected: form.accent === sw }"
                    :style="{ background: sw }"
                    :aria-label="sw"
                    @click="form.accent = sw"
                  />
                  <input v-model="form.accent" type="color" class="color-input" title="Custom colour" />
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">Included Books</label>
                <p class="form-hint">Leave empty for full access to all books.</p>
                <UiSelectDropDown
                  :data-list="allBooks.map(b => ({ name: b.title, id: b.id }))"
                  :selected-option="form.books"
                  place-holder="Books"
                  generic="array"
                  @selected="(val: string[]) => form.books = val"
                />
              </div>

              <div class="form-toggles">
                <label class="toggle-row">
                  <input type="checkbox" aria-label="Active — plan can be purchased" v-model="form.active" />
                  <span class="tgl-label">Active</span>
                  <span class="tgl-desc">Plan can be purchased</span>
                </label>
                <label class="toggle-row">
                  <input type="checkbox" aria-label="Visible — shown on pricing page" v-model="form.visible" />
                  <span class="tgl-label">Visible</span>
                  <span class="tgl-desc">Shown on pricing page</span>
                </label>
                <label class="toggle-row">
                  <input type="checkbox" aria-label="Auto-renew — renews automatically on expiry" v-model="form.autorenew" />
                  <span class="tgl-label">Auto-renew</span>
                  <span class="tgl-desc">Renews automatically on expiry</span>
                </label>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-ghost" @click="closeSlideOver">Cancel</button>
                <button type="submit" class="btn-primary" :disabled="saving">
                  {{ saving ? 'Saving…' : editingPlan ? 'Save changes' : 'Create plan' }}
                </button>
              </div>

            </form>

            <!-- Preview column -->
            <div class="preview-col">
              <span class="preview-eyebrow">Preview</span>
              <article class="plan-card preview-card" :style="{ '--pa': form.accent || 'var(--ochre)' }">
                <div class="pc-top">
                  <span class="pc-name">{{ form.name || 'Plan name' }}</span>
                  <span class="pc-subs">— subs</span>
                </div>
                <div class="pc-price">
                  <template v-if="form.amount === 0">
                    <span class="pc-free">Free</span>
                  </template>
                  <template v-else>
                    <span class="pc-currency">GHC</span>
                    <span class="pc-amount">{{ form.amount ? form.amount.toLocaleString() : '—' }}</span>
                  </template>
                </div>
                <div class="pc-meta">
                  <span class="pc-dur">{{ formatDuration(form.durationDays * 86_400_000) }}</span>
                  <span v-if="form.autorenew" class="pc-renew">↻</span>
                </div>
                <div class="pc-preview-badges">
                  <span class="badge" :class="form.active ? 'badge-on' : 'badge-off'">{{ form.active ? 'Active' : 'Inactive' }}</span>
                  <span v-if="!form.visible" class="badge badge-hidden">Hidden</span>
                </div>
              </article>
            </div>

          </div>
        </aside>
      </div>
    </Teleport>

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- DELETE CONFIRMATION                                        -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="confirmingDelete" class="modal-backdrop" @click.self="confirmingDelete = null">
        <div class="modal-box" role="dialog" aria-label="Confirm deletion">
          <div class="modal-hdr">
            <h2 class="modal-title">Delete plan?</h2>
            <button class="icon-btn" @click="confirmingDelete = null">✕</button>
          </div>
          <p class="confirm-text">
            Delete <strong>{{ confirmingDelete.name }}</strong>? This cannot be undone and may affect active subscribers.
          </p>
          <div class="form-actions">
            <button type="button" class="btn-ghost" @click="confirmingDelete = null">Cancel</button>
            <button type="button" class="btn-danger" :disabled="deleting" @click="executePlanDelete">
              {{ deleting ? 'Deleting…' : 'Delete plan' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import {
  createPlan,
  deletePlan,
  getAdminPlans,
  getSubscriberList,
  getSubscriptionStats,
  updatePlan,
} from '@/services/admin/subscriptions'
import { getBooks } from '@/services/book'
import type { SubscriberRecord, SubscriptionPlan, SubscriptionStats } from '~/types/admin/subscriptions'
import type { BOOK } from '~/types/book'

definePageMeta({ title: 'Coins', middleware: 'admin', layout: 'admin-layout' })

// ── Constants ──────────────────────────────────────────────────────
const ACCENT_SWATCHES = [
  '#C97A3A', '#10B981', '#7C3AED', '#EF4444',
  '#F59E0B', '#3B82F6', '#EC4899', '#6B7280',
]
const DURATION_PRESETS = [
  { days: 7,   label: '7d'  },
  { days: 30,  label: '30d' },
  { days: 90,  label: '90d' },
  { days: 365, label: '1yr' },
]

// ── Core data ──────────────────────────────────────────────────────
const activeTab     = ref('overview')
const stats         = ref<SubscriptionStats | null>(null)
const plans         = ref<SubscriptionPlan[]>([])
const loadingPlans  = ref(false)
const allBooks      = ref<BOOK[]>([])

// ── Subscriber list state ──────────────────────────────────────────
const subscribers     = ref<SubscriberRecord[]>([])
const subTotal        = ref(0)
const subPage         = ref(1)
const subPages        = ref(1)
const loadingSubs     = ref(false)
const subSearch       = ref('')
const subPlanFilter   = ref('')
const subStatusFilter = ref('all')

// ── Lifecycle ──────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    getSubscriptionStats().then((res: any) => { if (res?.data) stats.value = res.data }),
    fetchPlans(),
    fetchAllBooks(),
  ])
  // Pre-load first page of subscribers in background
  fetchSubscribers()
})

// ── Fetch helpers ──────────────────────────────────────────────────
const fetchPlans = async () => {
  loadingPlans.value = true
  try {
    const res: any = await getAdminPlans()
    if (res?.data) {
      // Normalize MongoDB _id → id so downstream update/delete calls
      // always have a defined id, regardless of backend serialisation.
      plans.value = (res.data as (SubscriptionPlan & { _id?: string })[]).map(
        (p) => ({ ...p, id: p.id ?? p._id ?? '' })
      )
    }
  } finally {
    loadingPlans.value = false
  }
}

const fetchAllBooks = async () => {
  try {
    const res = await getBooks(USER_ROLES.ADMIN, { limit: 1000 })
    if (res?.data?.results) {
      allBooks.value = res.data.results
    }
  } catch (err) {
    console.error('Failed to fetch books', err)
  }
}

const fetchSubscribers = async () => {
  loadingSubs.value = true
  try {
    const res: any = await getSubscriberList({
      search:  subSearch.value || undefined,
      planId:  subPlanFilter.value || undefined,
      status:  subStatusFilter.value === 'all' ? undefined : subStatusFilter.value as 'active' | 'free',
      page:    subPage.value,
      limit:   20,
    })
    if (res?.data) {
      const d = res.data
      subscribers.value = d.results ?? (Array.isArray(d) ? d : [])
      subTotal.value     = d.total    ?? subscribers.value.length
      subPages.value     = d.pages    ?? 1
    }
  } finally {
    loadingSubs.value = false
  }
}

// Debounced search
let searchTimer: ReturnType<typeof setTimeout> | null = null
const onSubSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { subPage.value = 1; fetchSubscribers() }, 400)
}

const resetAndFetch = () => { subPage.value = 1; fetchSubscribers() }
const goPage = (page: number) => { subPage.value = page; fetchSubscribers() }

// Lazy-load subscribers when switching to that tab
watch(activeTab, (tab) => {
  if (tab === 'subscribers' && subscribers.value.length === 0 && !loadingSubs.value) {
    fetchSubscribers()
  }
})

// ── KPIs ───────────────────────────────────────────────────────────
const kpis = computed(() => [
  { label: 'Active subscribers', value: stats.value?.active ?? '—' },
  {
    label: 'MRR (GHC)',
    value: stats.value
      ? stats.value.byPlan.reduce((s, p) => s + p.count * p.amount, 0).toLocaleString()
      : '—',
  },
  {
    label: 'Public plans',
    value: loadingPlans.value ? '…' : plans.value.filter(p => p.active && p.visible).length,
  },
  {
    label: 'Free subscribers',
    value: stats.value?.byPlan.find(p => p.amount === 0)?.count ?? '—',
  },
])

// ── Tabs ───────────────────────────────────────────────────────────
const tabs = computed(() => [
  { id: 'overview',    label: 'Overview',     badge: null },
  { id: 'plans',       label: 'Plans',        badge: plans.value.length  || null },
  { id: 'subscribers', label: 'Subscribers',  badge: stats.value?.active || null },
])

// ── Donut chart ────────────────────────────────────────────────────
const planLegend = computed(() =>
  (stats.value?.byPlan ?? []).map(p => ({
    label: p.name,
    count: p.count,
    color: accentFor(p.name),
  }))
)
const totalActive   = computed(() => stats.value?.active ?? '—')
const CIRCUMFERENCE = 2 * Math.PI * 48
const donutSegments = computed(() => {
  const total = planLegend.value.reduce((s, p) => s + p.count, 0) || 1
  let offset  = 0
  return planLegend.value.map(p => {
    const pct = p.count / total
    const seg = {
      dash:   pct * CIRCUMFERENCE,
      gap:    CIRCUMFERENCE - pct * CIRCUMFERENCE,
      offset: -offset * CIRCUMFERENCE,
      color:  p.color,
    }
    offset += pct
    return seg
  })
})

// ── Recent subs ────────────────────────────────────────────────────
const recentSubs = computed(() => stats.value?.recent ?? [])

// ── Helper functions ───────────────────────────────────────────────
/** Use the plan's accent colour; fall back to design-system tokens in sequence. */
const FALLBACK_COLORS = ['var(--ochre)', 'var(--kola-2)', 'var(--calabash)']
const accentFor = (planName: string): string => {
  const plan  = plans.value.find(p => p.name === planName)
  if (plan?.accent) return plan.accent
  const idx   = plans.value.findIndex(p => p.name === planName)
  return FALLBACK_COLORS[idx % FALLBACK_COLORS.length] ?? FALLBACK_COLORS[0]
}

const planSubCount = (planName: string): number =>
  stats.value?.byPlan.find(p => p.name === planName)?.count ?? 0

const mrrPct = (p: { count: number; amount: number }): string => {
  const total = (stats.value?.byPlan ?? []).reduce((s, x) => s + x.count * x.amount, 0) || 1
  return ((p.count * p.amount / total) * 100).toFixed(1)
}

const formatDate = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

const getExpiryBadge = (daysRemaining: number | null | undefined) => {
  if (daysRemaining == null) return { label: 'Pending',      color: 'gray'  }
  if (daysRemaining <= 0)    return { label: 'Expired',       color: 'black' }
  if (daysRemaining <= 6)    return { label: 'Expires soon',  color: 'red'   }
  if (daysRemaining <= 14)   return { label: 'Expiring',      color: 'amber' }
  return                            { label: 'Active',        color: 'green' }
}

const formatDuration = (ms: number): string => {
  if (ms <= 0) return '—'
  const days = Math.round(ms / 86_400_000)
  if (days >= 365 && days % 365 === 0) return `${days / 365} yr`
  if (days >= 30  && days % 30  === 0) return `${days / 30} mo`
  return `${days} day${days !== 1 ? 's' : ''}`
}

// ── Inline toggles (optimistic) ────────────────────────────────────
const toggling = ref<string[]>([])

const toggleField = async (plan: SubscriptionPlan, field: 'active' | 'visible') => {
  if (toggling.value.includes(plan.id)) return
  toggling.value.push(plan.id)
  const prev  = plan[field] as boolean
  ;(plan[field] as boolean) = !prev          // optimistic update
  try {
    await updatePlan(plan.id, { [field]: !prev })
  } catch {
    ;(plan[field] as boolean) = prev         // revert on error
  } finally {
    const i = toggling.value.indexOf(plan.id)
    if (i > -1) toggling.value.splice(i, 1)
  }
}

// ── Plan form (slide-over) ─────────────────────────────────────────
const showSlideOver = ref(false)
const editingPlan   = ref<SubscriptionPlan | null>(null)
const saving        = ref(false)

const defaultForm = () => ({
  name:         '',
  amount:       0,
  origin:       'GH',
  durationDays: 30,
  accent:       '#C97A3A',
  active:       true,
  visible:      true,
  autorenew:    false,
  books:        [] as string[],
})
const form = ref(defaultForm())

const openCreate = () => {
  editingPlan.value  = null
  form.value         = defaultForm()
  showSlideOver.value = true
}

const openEdit = (plan: SubscriptionPlan) => {
  editingPlan.value  = plan
  form.value = {
    name:         plan.name,
    amount:       plan.amount,
    origin:       plan.origin || 'GH',
    durationDays: Math.round(plan.duration / 86_400_000),
    accent:       plan.accent,
    active:       plan.active,
    visible:      plan.visible,
    autorenew:    plan.autorenew,
    books:        plan.books || [],
  }
  showSlideOver.value = true
}

const closeSlideOver = () => {
  showSlideOver.value = false
  editingPlan.value   = null
}

const savePlan = async () => {
  saving.value = true
  try {
    const payload = {
      name:      form.value.name,
      amount:    form.value.amount,
      origin:    form.value.origin,
      duration:  form.value.durationDays * 86_400_000,
      accent:    form.value.accent,
      active:    form.value.active,
      visible:   form.value.visible,
      autorenew: form.value.autorenew,
      books:     form.value.books,
    }
    if (editingPlan.value) {
      await updatePlan(editingPlan.value.id, payload)
    } else {
      await createPlan(payload)
    }
    closeSlideOver()
    await fetchPlans()
  } finally {
    saving.value = false
  }
}

// ── Delete ─────────────────────────────────────────────────────────
const confirmingDelete = ref<SubscriptionPlan | null>(null)
const deleting         = ref(false)

const confirmDelete    = (plan: SubscriptionPlan) => { confirmingDelete.value = plan }

const executePlanDelete = async () => {
  if (!confirmingDelete.value) return
  deleting.value = true
  try {
    await deletePlan(confirmingDelete.value.id)
    confirmingDelete.value = null
    await fetchPlans()
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
/* ── Screen-reader only ────────────────────────────────────────────── */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

/* ── Page ──────────────────────────────────────────────────────────── */
.subs-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr  { display: flex; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.page-sub   { font-family: var(--font-sans);    font-size: 13px;  color: var(--muted); margin: 4px 0 0; }

/* ── KPI strip ─────────────────────────────────────────────────────── */
.kpi-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.kpi-tile  {
  background: var(--card); border: 1px solid var(--hairline); border-radius: 10px;
  padding: 16px; display: flex; flex-direction: column; gap: 6px;
}
.kpi-label { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.kpi-value { font-family: var(--font-serif); font-size: 24px; color: var(--ink); line-height: 1; }

/* ── Tab bar ───────────────────────────────────────────────────────── */
.tab-bar { display: flex; gap: 2px; border-bottom: 1px solid var(--hairline); }
.tab {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 16px; background: none; border: none;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  font-family: var(--font-sans); font-size: 13px; color: var(--muted);
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
}
.tab:hover { color: var(--ink); }
.tab.active { color: var(--ochre); border-bottom-color: var(--ochre); font-weight: 600; }
.tab-badge {
  font-family: var(--font-mono); font-size: 10px;
  background: var(--hairline); color: var(--muted);
  padding: 1px 6px; border-radius: 10px;
}
.tab.active .tab-badge { background: rgba(201,122,58,0.15); color: var(--ochre); }

/* ── Tab pane ──────────────────────────────────────────────────────── */
.tab-pane { display: flex; flex-direction: column; gap: 16px; }

/* ── Shared panel ──────────────────────────────────────────────────── */
.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; }
.panel-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); margin-bottom: 14px; }
.panel-hdr { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 14px; }
.panel-hdr .panel-title { margin-bottom: 0; }

.link-btn { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); background: none; border: none; cursor: pointer; padding: 0; }
.link-btn:hover { text-decoration: underline; }
.empty-inline { font-family: var(--font-sans); font-size: 12.5px; color: var(--muted); font-style: italic; }
.empty-padded { padding: 20px; }
.loading-state { font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.loading-state.padded { padding: 40px; text-align: center; }

/* ── Overview grid ─────────────────────────────────────────────────── */
.overview-grid { display: grid; grid-template-columns: 200px 1fr 1fr; gap: 16px; align-items: start; }

/* Donut */
.donut-panel { display: flex; flex-direction: column; align-items: center; }
.donut-panel .panel-title { align-self: flex-start; }
.donut-svg   { width: 110px; height: 110px; margin-bottom: 14px; }
.donut-legend { width: 100%; display: flex; flex-direction: column; gap: 8px; }
.leg-row  { display: flex; align-items: center; gap: 8px; }
.leg-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.leg-label { font-family: var(--font-sans);  font-size: 12px;   color: var(--ink);   flex: 1; }
.leg-count { font-family: var(--font-mono);  font-size: 11.5px; color: var(--muted); }

/* MRR bars */
.mrr-panel .panel-title { margin-bottom: 16px; }
.mrr-list { display: flex; flex-direction: column; gap: 16px; }
.mrr-row  { display: flex; flex-direction: column; gap: 5px; }
.mrr-top  { display: flex; align-items: center; justify-content: space-between; }
.mrr-name    { font-family: var(--font-sans);  font-size: 13px; font-weight: 600; color: var(--ink); }
.mrr-contrib { font-family: var(--font-mono);  font-size: 12px; color: var(--ink); }
.mrr-track   { height: 6px; background: var(--hairline); border-radius: 3px; overflow: hidden; }
.mrr-bar     { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
.mrr-meta    { display: flex; gap: 8px; }
.mrr-count   { font-family: var(--font-sans); font-size: 11px; color: var(--muted); }
.mrr-unit    { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }

/* Recent subs panel */
.recent-panel { padding: 0; overflow: hidden; }

/* ── Shared table ──────────────────────────────────────────────────── */
.subs-table { width: 100%; border-collapse: collapse; }
.sub-row td { padding: 10px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.sub-row:last-child td { border-bottom: none; }

.sub-cell { display: flex; align-items: center; gap: 9px; }
.sub-avatar {
  width: 28px; height: 28px; border-radius: 50%; background: var(--calabash);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-sans); font-size: 11px; font-weight: 700; color: var(--kola);
  flex-shrink: 0;
}
.sub-avatar-img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.sub-name  { font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; color: var(--ink); }
.sub-email { font-family: var(--font-sans); font-size: 11px; color: var(--muted); }
.date-cell { font-family: var(--font-mono); font-size: 11.5px; color: var(--muted); white-space: nowrap; }

.plan-pill { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-sans); font-size: 12px; color: var(--ink); }
.plan-dot  { width: 7px; height: 7px; border-radius: 50%; background: var(--pa, var(--ochre)); flex-shrink: 0; }

.status-pill   { display: inline-flex; padding: 2px 8px; border-radius: 20px; font-family: var(--font-sans); font-size: 10.5px; font-weight: 600; }
.status-active   { background: rgba(46,125,50,0.12); color: #2e7d32; }
.status-inactive { background: rgba(208,76,79,0.12); color: var(--hibiscus); }

/* ── Expiry badge ───────────────────────────────────────────────────── */
.expiry-badge {
  display: inline-flex; padding: 2px 8px; border-radius: 20px;
  font-family: var(--font-sans); font-size: 10.5px; font-weight: 600;
  white-space: nowrap;
}
.expiry-badge--gray  { background: #f1f2f4; color: #374151; }
.expiry-badge--black { background: #e5e7eb; color: #111827; }
.expiry-badge--red   { background: rgba(208,76,79,0.13); color: var(--hibiscus); }
.expiry-badge--amber { background: #fef3c7; color: #78350f; }
.expiry-badge--green { background: #dcfce7; color: #14532d; }

/* ── Auto-renew cell ────────────────────────────────────────────────── */
.renew-cell  { text-align: center; }
.renew-icon  { font-size: 14px; line-height: 1; }

/* ── Plans tab ─────────────────────────────────────────────────────── */
.plans-hdr  { display: flex; align-items: center; justify-content: space-between; }
.plans-meta { font-family: var(--font-sans); font-size: 12.5px; color: var(--muted); }

.empty-state { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 28px; background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; }
.empty-state.padded { padding: 40px; align-items: center; }
.empty-msg   { font-family: var(--font-sans); font-size: 13.5px; color: var(--muted); margin: 0; }

.plans-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; }

/* ── Plan card ─────────────────────────────────────────────────────── */
.plan-card {
  background: var(--card);
  border: 1px solid var(--hairline);
  border-left: 4px solid var(--pa, var(--ochre));
  border-radius: 10px;
  padding: 16px;
  display: flex; flex-direction: column; gap: 11px;
}

.pc-top  { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
.pc-name { font-family: var(--font-sans);  font-size: 14px; font-weight: 700; color: var(--ink); }
.pc-subs { font-family: var(--font-mono);  font-size: 10px; color: var(--muted); white-space: nowrap; padding-top: 2px; }

.pc-price    { display: flex; align-items: baseline; gap: 3px; }
.pc-free     { font-family: var(--font-serif); font-size: 24px; color: var(--ink); line-height: 1; }
.pc-currency { font-family: var(--font-sans);  font-size: 10px;  color: var(--muted); }
.pc-amount   { font-family: var(--font-serif); font-size: 24px;  color: var(--ink); line-height: 1; }

.pc-meta  { display: flex; align-items: center; gap: 6px; }
.pc-dur   { font-family: var(--font-sans); font-size: 12px; color: var(--muted); }
.pc-renew { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); }
.pc-origin { font-family: var(--font-sans); font-size: 11px; color: var(--muted); }

/* Inline toggle rows inside plan card */
.pc-toggles {
  display: flex; flex-direction: column; gap: 6px;
  padding: 8px 0; border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline);
}
.pc-toggle-row {
  display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; user-select: none;
}
.pc-toggle-row.muted { opacity: 0.5; pointer-events: none; }
.pc-tgl-label { font-family: var(--font-sans); font-size: 12px; color: var(--ink); }

/* Toggle switch */
.tgl-wrap { position: relative; display: inline-flex; align-items: center; flex-shrink: 0; }
.tgl-wrap input { position: absolute; inset: 0; opacity: 0; cursor: pointer; margin: 0; }
.tgl-wrap input:disabled { cursor: not-allowed; }
.tgl-track {
  width: 32px; height: 18px; background: color-mix(in srgb, var(--hairline) 100%, transparent);
  border-radius: 9px; position: relative; transition: background 0.2s;
  pointer-events: none;
}
.tgl-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 12px; height: 12px; background: #fff;
  border-radius: 50%; transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.tgl-wrap.on .tgl-track { background: var(--pa, var(--ochre)); }
.tgl-wrap.on .tgl-thumb { transform: translateX(14px); }

.pc-actions { display: flex; gap: 6px; }
.plan-btn {
  padding: 5px 11px; border-radius: 6px; border: 1px solid var(--hairline);
  font-family: var(--font-sans); font-size: 11.5px; font-weight: 600;
  background: transparent; cursor: pointer; transition: background 0.12s, border-color 0.12s;
}
.plan-btn-edit { color: var(--ink); }
.plan-btn-edit:hover { background: var(--hairline); }
.plan-btn-del { color: var(--hibiscus); }
.plan-btn-del:hover { background: rgba(208,76,79,0.08); border-color: rgba(208,76,79,0.25); }

/* Preview badges (in card + slide-over) */
.pc-preview-badges { display: flex; gap: 4px; flex-wrap: wrap; }
.badge { font-family: var(--font-sans); font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 10px; }
.badge-on     { background: rgba(46,125,50,0.12); color: #2e7d32; }
.badge-off    { background: rgba(208,76,79,0.12); color: var(--hibiscus); }
.badge-hidden { background: rgba(0,0,0,0.07);     color: var(--muted); }

/* ── Subscribers tab ───────────────────────────────────────────────── */
.subs-filters { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.filter-input {
  padding: 8px 12px; background: var(--card); border: 1px solid var(--hairline);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink);
  outline: none; min-width: 200px;
}
.filter-input:focus { border-color: var(--ochre); }
.filter-select {
  padding: 8px 10px; background: var(--card); border: 1px solid var(--hairline);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink);
  outline: none; cursor: pointer;
}
.filter-count { font-family: var(--font-mono); font-size: 12px; color: var(--muted); margin-left: auto; }

.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.full-table thead th {
  font-family: var(--font-sans); font-size: 10px; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--muted); text-align: left;
  padding: 12px 16px; border-bottom: 1px solid var(--hairline);
}
.full-table .sub-row td { padding: 12px 16px; }
.full-table .sub-row:hover td { background: rgba(201,122,58,0.03); }

.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 14px; border-top: 1px solid var(--hairline); }
.page-btn   { padding: 6px 14px; background: var(--card); border: 1px solid var(--hairline); border-radius: 6px; font-family: var(--font-sans); font-size: 12.5px; color: var(--ink); cursor: pointer; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn:not(:disabled):hover { background: var(--hairline); }
.page-label { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }

/* ── Shared buttons ────────────────────────────────────────────────── */
.btn-primary {
  padding: 8px 16px; background: var(--ochre); border: none; border-radius: 8px;
  font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; color: #fff;
  cursor: pointer; transition: opacity 0.15s;
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary:not(:disabled):hover { opacity: 0.86; }

.btn-ghost {
  padding: 8px 16px; background: transparent; border: 1px solid var(--hairline);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--muted);
  cursor: pointer; transition: background 0.12s;
}
.btn-ghost:hover { background: var(--hairline); }

.btn-danger {
  padding: 8px 16px; background: var(--hibiscus); border: none; border-radius: 8px;
  font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: #fff;
  cursor: pointer; transition: opacity 0.15s;
}
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-danger:not(:disabled):hover { opacity: 0.88; }

/* ── Slide-over ────────────────────────────────────────────────────── */
.slide-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 1000;
  backdrop-filter: blur(2px); display: flex; justify-content: flex-end;
}
.slide-panel {
  background: var(--card); border-left: 1px solid var(--hairline);
  width: 100%; max-width: 680px; height: 100%;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: -8px 0 40px rgba(0,0,0,0.15);
}
.slide-hdr {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px; border-bottom: 1px solid var(--hairline); flex-shrink: 0;
}
.slide-title { font-family: var(--font-display); font-size: 18px; color: var(--ink); margin: 0; }

.slide-body {
  display: grid; grid-template-columns: 1fr 220px;
  flex: 1; overflow: hidden;
}

/* Form column */
.plan-form {
  padding: 22px 24px; display: flex; flex-direction: column; gap: 18px;
  overflow-y: auto;
}
.form-row   { display: flex; flex-direction: column; gap: 5px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.form-label {
  font-family: var(--font-sans); font-size: 10.5px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted);
}
.form-hint {
  font-family: var(--font-sans); font-size: 11px; color: var(--muted);
  margin: -2px 0 4px;
}
.form-input {
  padding: 9px 12px; background: var(--app-bg, var(--cream));
  border: 1px solid var(--hairline); border-radius: 8px;
  font-family: var(--font-sans); font-size: 13.5px; color: var(--ink);
  outline: none; width: 100%; box-sizing: border-box;
}
.form-input:focus { border-color: var(--ochre); }
.form-input-sm { margin-top: 6px; }

.dur-presets { display: flex; gap: 4px; flex-wrap: wrap; }
.dur-btn {
  padding: 4px 9px; border-radius: 6px; border: 1px solid var(--hairline);
  background: transparent; font-family: var(--font-sans); font-size: 12px;
  color: var(--muted); cursor: pointer; transition: all 0.12s;
}
.dur-btn.active { background: var(--ochre); border-color: var(--ochre); color: #fff; }
.dur-btn:not(.active):hover { background: var(--hairline); color: var(--ink); }

.accent-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.swatch {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid transparent; cursor: pointer;
  transition: transform 0.1s, border-color 0.1s;
}
.swatch.selected { border-color: var(--ink); transform: scale(1.2); }
.swatch:not(.selected):hover { transform: scale(1.1); }
.color-input { width: 26px; height: 26px; border: 1px solid var(--hairline); border-radius: 6px; cursor: pointer; padding: 0; background: none; }

.form-toggles { display: flex; flex-direction: column; gap: 10px; }
.toggle-row { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.toggle-row input { width: 15px; height: 15px; accent-color: var(--ochre); cursor: pointer; flex-shrink: 0; }
.tgl-label { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--ink); min-width: 80px; }
.tgl-desc  { font-family: var(--font-sans); font-size: 11.5px; color: var(--muted); }

.form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }

/* Preview column */
.preview-col {
  padding: 22px 16px; border-left: 1px solid var(--hairline);
  background: rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 10px;
  overflow-y: auto;
}
.preview-eyebrow {
  font-family: var(--font-sans); font-size: 10px; text-transform: uppercase;
  letter-spacing: 0.09em; color: var(--muted);
}
.preview-card { pointer-events: none; cursor: default; }

/* ── Icon button (✕ close) ─────────────────────────────────────────── */
.icon-btn {
  width: 28px; height: 28px; border-radius: 50%; background: var(--hairline);
  border: none; cursor: pointer; font-size: 12px; color: var(--muted);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.icon-btn:hover { background: rgba(0,0,0,0.1); }

/* ── Delete modal ──────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; backdrop-filter: blur(3px);
}
.modal-box {
  background: var(--card); border: 1px solid var(--hairline); border-radius: 16px;
  width: 100%; max-width: 360px; padding: 24px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.22);
}
.modal-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.modal-title { font-family: var(--font-display); font-size: 18px; color: var(--ink); margin: 0; }
.confirm-text { font-family: var(--font-sans); font-size: 13.5px; color: var(--ink); line-height: 1.55; margin: 0 0 20px; }
</style>
