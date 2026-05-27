# Admin Gaps — Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire all hollow admin pages to real API data, add Chart.js charting, and build all missing admin pages.

**Architecture:** Three layers — (1) infrastructure: chart plugin, types, services, routes; (2) wire existing pages to real data; (3) build missing pages. All pages use `definePageMeta({ middleware: 'admin', layout: 'admin-layout' })` and design-token CSS vars only.

**Tech Stack:** Nuxt 3 (SPA, port 3080), Vue 3 Composition API, TypeScript, chart.js ^4 + vue-chartjs ^5, existing `useRequest` composable, pnpm.

---

## File Map

```
Created:
  plugins/chartjs.client.ts
  types/admin/dashboard.ts
  types/admin/organization.ts
  types/admin/language.ts
  types/admin/subscriptions.ts
  types/admin/conversation.ts
  types/admin/revenue.ts
  services/admin/dashboard.ts
  services/admin/language.ts
  services/admin/organization.ts
  services/admin/email.ts
  services/admin/subscriptions.ts
  services/admin/conversation.ts
  services/admin/revenue.ts
  pages/admin/users/[id].vue
  pages/admin/languages.vue
  pages/admin/organizations.vue
  pages/admin/email.vue

Modified:
  package.json                          ← add chart.js, vue-chartjs
  nuxt.config.ts                        ← register plugin
  routes.ts                             ← add 4 route constants
  constants/index.ts                    ← add Languages + Organisations nav items
  services/admin/users.ts               ← add getUser(id)
  pages/admin/index.vue                 ← real KPIs + Chart.js pulse
  pages/admin/books/index.vue           ← edit/delete actions
  pages/admin/books/new.vue             ← cover upload + new fields
  pages/admin/books/[id].vue            ← tabs, real metrics, chapter management
  pages/admin/users.vue                 ← fix endpoint, search, role-change
  pages/admin/subscriptions.vue         ← real data
  pages/admin/period.vue                ← deactivate button
  pages/admin/storytellers.vue          ← replace stub
  pages/admin/revenue.vue               ← replace stub
  pages/admin/conversation.vue          ← replace stub
```

---

## Task 1: Install chart.js and register plugin

**Files:**
- Modify: `package.json`
- Create: `plugins/chartjs.client.ts`
- Modify: `nuxt.config.ts`

- [ ] **Step 1: Install packages**

```bash
pnpm add chart.js@^4 vue-chartjs@^5
```

- [ ] **Step 2: Create `plugins/chartjs.client.ts`**

```typescript
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)
```

- [ ] **Step 3: Register plugin in `nuxt.config.ts`**

Add `plugins` key before `modules`:

```typescript
plugins: ['~/plugins/chartjs.client.ts'],
```

- [ ] **Step 4: Verify build**

```bash
pnpm run build
```

Expected: no errors mentioning chart.js. If you see "cannot find module 'chart.js'", rerun `pnpm install`.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml plugins/chartjs.client.ts nuxt.config.ts
git commit -m "feat: add chart.js + vue-chartjs plugin"
```

---

## Task 2: Types and service files

**Files:**
- Create all 6 type files
- Create all 7 service files
- Modify: `services/admin/users.ts`

- [ ] **Step 1: Create `types/admin/dashboard.ts`**

```typescript
export type DashboardStats = {
  users: number
  books: number
  activeSubscribers: number
}

export type PulsePoint = {
  date: string
  plays: number
}
```

- [ ] **Step 2: Create `types/admin/organization.ts`**

```typescript
export type OrganizationType = {
  id: string
  name: string
  description?: string
  type: string
  logo?: string
}

export type OrganizationRequest = Omit<OrganizationType, 'id'>
```

- [ ] **Step 3: Create `types/admin/language.ts`**

```typescript
export type LanguageType = {
  id: string
  name: string
  active: boolean
}
```

- [ ] **Step 4: Create `types/admin/subscriptions.ts`**

```typescript
export type SubscriptionStats = {
  active: number
  byPlan: { name: string; count: number; amount: number }[]
  recent: {
    id: string
    user: { username: string; email: string; dp: string }
    plan: string
    activatedAt: string
  }[]
}
```

- [ ] **Step 5: Create `types/admin/conversation.ts`**

```typescript
export type AdminComment = {
  id: string
  comment: string
  createdAt: string
  book: { id: string; title: string }
  user: { id: string; username: string; dp: string }
}

export type CommentsResponse = {
  results: AdminComment[]
  total: number
  page: number
}
```

- [ ] **Step 6: Create `types/admin/revenue.ts`**

```typescript
export type RevenueSummary = {
  mrr: number
  totalActiveSubscribers: number
  byPlan: { name: string; amount: number; count: number; contribution: number }[]
}
```

- [ ] **Step 7: Create `services/admin/dashboard.ts`**

```typescript
import type { DashboardStats, PulsePoint } from '~/types/admin/dashboard'

export const getDashboardStats = () =>
  useRequest<DashboardStats>(
    { url: 'admin/dashboard/stats', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const getDashboardPulse = (days = 14) =>
  useRequest<PulsePoint[]>(
    { url: 'admin/dashboard/pulse', method: HTTP_METHODS.GET, params: { days } },
    USER_ROLES.ADMIN
  )
```

- [ ] **Step 8: Create `services/admin/language.ts`**

```typescript
import type { LanguageType } from '~/types/admin/language'

export const getLanguages = () =>
  useRequest<LanguageType[]>(
    { url: 'admin/language/all', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const addLanguage = (body: { title: string; active: boolean }) =>
  useRequest<LanguageType>(
    { url: 'admin/language/add', method: HTTP_METHODS.POST, data: body },
    USER_ROLES.ADMIN
  )
```

- [ ] **Step 9: Create `services/admin/organization.ts`**

```typescript
import type { OrganizationType, OrganizationRequest } from '~/types/admin/organization'

export const getOrgs = () =>
  useRequest<OrganizationType[]>(
    { url: 'admin/organization/', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const getOrg = (id: string) =>
  useRequest<OrganizationType>(
    { url: `admin/organization/${id}`, method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const createOrg = (body: OrganizationRequest) =>
  useRequest<OrganizationType>(
    { url: 'admin/organization/create', method: HTTP_METHODS.POST, data: body },
    USER_ROLES.ADMIN
  )

export const updateOrg = (id: string, body: Partial<OrganizationRequest>) =>
  useRequest<OrganizationType>(
    { url: `admin/organization/${id}`, method: HTTP_METHODS.PUT, data: body },
    USER_ROLES.ADMIN
  )
```

- [ ] **Step 10: Create `services/admin/email.ts`**

```typescript
export const sendEmail = (payload: {
  email: { to: string; subject: string; html?: string }
  body: { header: string; body: string }
}) =>
  useRequest<string>(
    { url: 'admin/user/sendEmail', method: HTTP_METHODS.POST, data: payload },
    USER_ROLES.ADMIN
  )
```

- [ ] **Step 11: Create `services/admin/subscriptions.ts`**

```typescript
import type { SubscriptionStats } from '~/types/admin/subscriptions'

export const getSubscriptionStats = () =>
  useRequest<SubscriptionStats>(
    { url: 'admin/subscriptions/stats', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )
```

- [ ] **Step 12: Create `services/admin/conversation.ts`**

```typescript
import type { CommentsResponse } from '~/types/admin/conversation'

export const getComments = (params: { page?: number; limit?: number; bookId?: string }) =>
  useRequest<CommentsResponse>(
    { url: 'admin/conversation/comments', method: HTTP_METHODS.GET, params },
    USER_ROLES.ADMIN
  )

export const deleteComment = (id: string) =>
  useRequest<string>(
    { url: `admin/conversation/comments/${id}`, method: HTTP_METHODS.DELETE },
    USER_ROLES.ADMIN
  )
```

- [ ] **Step 13: Create `services/admin/revenue.ts`**

```typescript
import type { RevenueSummary } from '~/types/admin/revenue'

export const getRevenueSummary = () =>
  useRequest<RevenueSummary>(
    { url: 'admin/revenue/summary', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )
```

- [ ] **Step 14: Add `getUser` to `services/admin/users.ts`**

Append to the existing file:

```typescript
export const getUser = (id: string) =>
  useRequest<USER_PROFILE>(
    { url: `admin/user/${id}`, method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )
```

- [ ] **Step 15: Commit**

```bash
git add types/admin/ services/admin/
git commit -m "feat(admin): add types and service files for all admin domains"
```

---

## Task 3: Routes and nav constants

**Files:**
- Modify: `routes.ts`
- Modify: `constants/index.ts`

- [ ] **Step 1: Update `routes.ts`**

Replace the `admin` type definition and object with:

```typescript
type ROUTES = {
  admin: {
    home: string
    login: string
    users: string
    usersDetail: string
    period: string
    books: string
    booksNew: string
    subscriptions: string
    storytellers: string
    revenue: string
    conversation: string
    languages: string
    organizations: string
    email: string
  }
  app: {
    home: string
    login: string
    signup: string
    forgotPassword: string
    book: string
    library: string
    search: string
    profile: string
  }
  web?: {
    home: string
    about: string
    contact: string
  }
}

const routes: ROUTES = {
  admin: {
    home:          '/admin',
    login:         '/admin/login',
    users:         '/admin/users',
    usersDetail:   '/admin/users/',
    period:        '/admin/period',
    books:         '/admin/books',
    booksNew:      '/admin/books/new',
    subscriptions: '/admin/subscriptions',
    storytellers:  '/admin/storytellers',
    revenue:       '/admin/revenue',
    conversation:  '/admin/conversation',
    languages:     '/admin/languages',
    organizations: '/admin/organizations',
    email:         '/admin/email',
  },
  app: {
    home:           '/app',
    login:          '/app/auth/login',
    signup:         '/app/auth/signup',
    forgotPassword: '/app/auth/forgot-password',
    book:           '/app/book/',
    library:        '/app/library',
    search:         '/app/search',
    profile:        '/app/profile',
  },
  web: {
    home:    '/',
    about:   '/about',
    contact: '/contact',
  },
} as const

export default routes
```

- [ ] **Step 2: Update `constants/index.ts` — add nav items**

Add two entries to `adminNavigationItems` after the `Listeners` entry:

```typescript
{ title: 'Languages',      url: routes.admin.languages,      hasAccess: [USER_ROLES.ADMIN] },
{ title: 'Organisations',  url: routes.admin.organizations,  hasAccess: [USER_ROLES.ADMIN] },
```

- [ ] **Step 3: Commit**

```bash
git add routes.ts constants/index.ts
git commit -m "feat(admin): add route constants and nav items for new pages"
```

---

## Task 4: Wire Hearth dashboard (`pages/admin/index.vue`)

- [ ] **Step 1: Replace the `<script setup>` section entirely**

```typescript
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
  if (statsRes?.data) stats.value = statsRes.data
  if (pulseRes?.data) pulse.value = pulseRes.data
  if (booksRes?.data) topStories.value = (booksRes.data as any).results ?? []
})

const kpis = computed(() => [
  { label: 'Listeners tonight',   value: '—',                                    delta: 0 },
  { label: 'Hours listened (7d)', value: '—',                                    delta: 0 },
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
```

- [ ] **Step 2: Replace the pulse SVG in the template**

Find the `<svg class="pulse-svg"...>` block (lines 28–36 in the original) and replace with:

```html
<div style="height:90px; position:relative;">
  <ClientOnly>
    <Line :data="pulseChartData" :options="pulseChartOptions" />
  </ClientOnly>
</div>
```

- [ ] **Step 3: Replace the top stories static array with real data**

Find `v-for="s in topStories"` — the `topStories` ref now holds real `BOOK[]`. Update the row template to:

```html
<tr v-for="s in topStories" :key="s.id ?? s.title" class="story-row">
  <td class="story-title">{{ s.title }}</td>
  <td>{{ s.meta?.played ?? '—' }}</td>
  <td>—</td>
  <td>
    <div class="cmpl-track"><div class="cmpl-bar" style="width:0%" /></div>
  </td>
</tr>
```

- [ ] **Step 4: Commit**

```bash
git add pages/admin/index.vue
git commit -m "feat(admin): wire Hearth dashboard to real API data + Chart.js pulse"
```

---

## Task 5: Wire Books list — edit/delete actions (`pages/admin/books/index.vue`)

- [ ] **Step 1: Add `deleteBook` import and handler in `<script setup>`**

Add to imports:
```typescript
import { deleteBook } from '@/services/admin/book'
```

Add after `const debouncedFetch = ...`:
```typescript
const handleDelete = async (book: BOOK) => {
  if (!window.confirm(`Delete "${book.title}" and all its chapters? This cannot be undone.`)) return
  await deleteBook(book.id as string)
  books.value = books.value.filter(b => b.id !== book.id)
  totalBooks.value = Math.max(0, totalBooks.value - 1)
}
```

- [ ] **Step 2: Add actions column to the table template**

In `<thead>`, change the last `<th></th>` to:
```html
<th>Actions</th>
```

In `<tbody>`, replace the last `<td>` (the one with `open-btn`) with:
```html
<td>
  <div class="row-actions">
    <NuxtLink :to="`/admin/books/${book.id}`" class="action-link">Edit →</NuxtLink>
    <button class="action-del" @click="handleDelete(book)">Delete</button>
  </div>
</td>
```

- [ ] **Step 3: Add styles for `row-actions`, `action-link`, `action-del`**

Add to `<style scoped>`:
```css
.row-actions { display: flex; gap: 12px; align-items: center; }
.action-link { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); text-decoration: none; font-weight: 500; }
.action-link:hover { text-decoration: underline; }
.action-del { font-family: var(--font-sans); font-size: 12px; color: var(--hibiscus); background: none; border: none; cursor: pointer; padding: 0; }
.action-del:hover { text-decoration: underline; }
```

- [ ] **Step 4: Commit**

```bash
git add pages/admin/books/index.vue
git commit -m "feat(admin): add edit/delete actions to books list"
```

---

## Task 6: Wire Books new wizard — cover upload + extra fields (`pages/admin/books/new.vue`)

- [ ] **Step 1: Update imports and add new reactive state in `<script setup>`**

Add imports:
```typescript
import { getSignedUrl } from '@/services/admin/book'
import { getOrgs } from '@/services/admin/organization'
import { getUserProfiles } from '@/services/admin/users'
import type { OrganizationType } from '~/types/admin/organization'
```

Add refs after existing ones:
```typescript
const orgs = ref<OrganizationType[]>([])
const associates = ref<any[]>([])
const coverFile = ref<File | null>(null)
const coverPreview = ref('')
const uploading = ref(false)
const snippetInput = ref('')
const selectedOrg = ref('')
const selectedAssociates = ref<string[]>([])

watch(snippetInput, v => { form.snippet = v })
watch(selectedOrg, v => { (form as any).organization = v })
watch(selectedAssociates, v => { form.associates = v })
```

Load orgs and associates on mount — add to `onMounted` or add a new one:
```typescript
onMounted(async () => {
  const [orgsRes, assocRes] = await Promise.all([
    getOrgs(),
    getUserProfiles({ search: '', account: USER_ROLES.ASSOCIATE }),
  ])
  if (orgsRes?.data) orgs.value = orgsRes.data as any
  if (assocRes?.data) associates.value = assocRes.data as any
})
```

- [ ] **Step 2: Add cover upload handler**

```typescript
const onCoverPick = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
  uploading.value = true
  try {
    const res = await getSignedUrl({ file: file.name, fileType: file.type })
    const { signedURL } = (res as any)?.data ?? {}
    if (!signedURL) throw new Error('No signed URL returned')
    await fetch(signedURL, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })
    form.cover = file.name
  } catch {
    errorMsg.value = 'Cover upload failed. Try again.'
    coverPreview.value = ''
    form.cover = ''
  } finally {
    uploading.value = false
  }
}
```

- [ ] **Step 3: Replace Step 0 template fields**

In the Step 0 panel, after the `authors` field group, add:

```html
<div class="field-group">
  <label class="field-label">Snippet (optional)</label>
  <textarea v-model="snippetInput" class="field-textarea" rows="2" placeholder="Short teaser text…" maxlength="300" />
</div>
<div class="field-row">
  <div class="field-group flex-1">
    <label class="field-label">Organisation</label>
    <select v-model="selectedOrg" class="field-input">
      <option value="">None</option>
      <option v-for="org in orgs" :key="org.id" :value="org.id">{{ org.name }}</option>
    </select>
  </div>
</div>
```

- [ ] **Step 4: Replace Step 1 (Compose) placeholder with cover upload**

Replace the entire Step 1 panel div:

```html
<div v-if="currentStep === 1" class="step-panel">
  <h2 class="step-heading">Cover image</h2>
  <div class="field-group">
    <label class="field-label">Cover image *</label>
    <input type="file" accept="image/*" class="file-input" @change="onCoverPick" :disabled="uploading" />
  </div>
  <div v-if="uploading" class="upload-status">Uploading…</div>
  <img v-if="coverPreview" :src="coverPreview" class="cover-preview" alt="Cover preview" />
  <p v-if="!coverPreview" class="ph-sub">Upload a cover image. You can skip and add one later.</p>
</div>
```

Add styles:
```css
.file-input { font-family: var(--font-sans); font-size: 13px; color: var(--ink); }
.upload-status { font-family: var(--font-sans); font-size: 12px; color: var(--muted); }
.cover-preview { width: 120px; height: 160px; object-fit: cover; border-radius: 6px; margin-top: 12px; }
```

- [ ] **Step 5: Commit**

```bash
git add pages/admin/books/new.vue
git commit -m "feat(admin): add cover upload and extra fields to new book wizard"
```

---

## Task 7: Wire Book detail — tabs, real metrics, chapter management (`pages/admin/books/[id].vue`)

This is the largest change. Replace the entire file.

- [ ] **Step 1: Write `pages/admin/books/[id].vue`**

```vue
<template>
  <div class="book-detail" v-if="book">
    <header class="detail-header">
      <NuxtLink :to="routes.admin.books" class="back-link">← Stories</NuxtLink>
      <div class="book-meta">
        <img v-if="book.cover" :src="book.cover" class="cover-img" alt="" />
        <div v-else class="cover-placeholder">◆</div>
        <div>
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-authors">{{ book.authors?.join(', ') }}</p>
        </div>
      </div>
    </header>

    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'edit' }" @click="tab = 'edit'">Edit</button>
      <button class="tab" :class="{ active: tab === 'analytics' }" @click="tab = 'analytics'">Analytics</button>
    </div>

    <!-- Edit tab -->
    <div v-if="tab === 'edit'" class="tab-panel">
      <div class="fields-grid">
        <div class="field-group span-2">
          <label class="field-label">Title</label>
          <input v-model="editForm.title" class="field-input" />
        </div>
        <div class="field-group span-2">
          <label class="field-label">Description</label>
          <textarea v-model="editForm.description" class="field-textarea" rows="4" />
        </div>
        <div class="field-group">
          <label class="field-label">Categories (comma-separated)</label>
          <input v-model="categoryInput" class="field-input" />
        </div>
        <div class="field-group">
          <label class="field-label">Languages (comma-separated)</label>
          <input v-model="languageInput" class="field-input" />
        </div>
        <div class="field-group span-2">
          <label class="field-label">Authors (comma-separated)</label>
          <input v-model="authorInput" class="field-input" />
        </div>
      </div>
      <p v-if="saveError" class="error-msg">{{ saveError }}</p>
      <p v-if="saveSuccess" class="success-msg">Saved.</p>
      <button class="btn-primary" @click="saveBook" :disabled="saving">{{ saving ? 'Saving…' : 'Save changes' }}</button>

      <!-- Chapter management -->
      <div class="section-hdr"><span class="section-title">Chapters</span></div>
      <div v-if="loadingChapters" class="loading">Loading chapters…</div>
      <div v-else class="chapters-list">
        <div v-for="ch in chapters" :key="ch.id" class="chapter-row">
          <span class="ch-title">{{ ch.title }}</span>
          <span class="ch-type-pill" :class="ch.type === 'audio' ? 'pill-audio' : 'pill-ebook'">{{ ch.type }}</span>
          <button class="ch-del" @click="handleDeleteChapter(ch.id)">Delete</button>
        </div>
        <p v-if="chapters.length === 0" class="empty">No chapters yet.</p>
      </div>

      <button class="btn-ghost add-ch-btn" @click="showChapterForm = !showChapterForm">
        {{ showChapterForm ? '− Cancel' : '+ Add chapter' }}
      </button>
      <div v-if="showChapterForm" class="chapter-form">
        <div class="field-group">
          <label class="field-label">Title</label>
          <input v-model="chForm.title" class="field-input" />
        </div>
        <div class="field-group">
          <label class="field-label">Description</label>
          <textarea v-model="chForm.description" class="field-textarea" rows="2" />
        </div>
        <div class="field-group">
          <label class="field-label">File (audio or PDF)</label>
          <input type="file" accept="audio/*,application/pdf" @change="onChapterFilePick" :disabled="chUploading" class="file-input" />
        </div>
        <div v-if="chUploading" class="upload-status">Uploading…</div>
        <p v-if="chError" class="error-msg">{{ chError }}</p>
        <button class="btn-primary" @click="submitChapter" :disabled="chSaving || chUploading">
          {{ chSaving ? 'Adding…' : 'Add chapter' }}
        </button>
      </div>
    </div>

    <!-- Analytics tab -->
    <div v-if="tab === 'analytics'" class="tab-panel">
      <div class="period-row">
        <label class="field-label">Period</label>
        <select v-model="selectedPeriod" class="period-select" @change="loadMetrics">
          <option value="">Latest</option>
          <option v-for="p in periods" :key="p.id" :value="p.id">
            {{ p.year }}-{{ String(p.month).padStart(2, '0') }}
          </option>
        </select>
      </div>

      <div class="kpi-strip">
        <div v-for="kpi in metricKpis" :key="kpi.label" class="kpi-tile">
          <span class="kpi-label">{{ kpi.label }}</span>
          <span class="kpi-value">{{ kpi.value }}</span>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">Metrics breakdown</div>
        <div style="height:200px; position:relative;">
          <ClientOnly>
            <Bar v-if="metricsChartData" :data="metricsChartData" :options="metricsChartOptions" />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Loading…</div>
</template>

<script setup lang="ts">
import routes from '~/routes'
import { getBook } from '@/services/book'
import { updateBook, getMetrics, getSignedUrl } from '@/services/admin/book'
import { createChapter, deleteChapter, getChapterSignedUrl } from '@/services/admin/chapter'
import { getPeriods } from '@/services/admin/period'
import { Bar } from 'vue-chartjs'
import type { BOOK, CHAPTER } from '~/types/book'

definePageMeta({ title: 'Book Detail', middleware: 'admin', layout: 'admin-layout' })

const route = useRoute()
const id = route.params.id as string

const book = ref<BOOK | null>(null)
const tab = ref<'edit' | 'analytics'>('edit')

// Edit form
const editForm = reactive({ title: '', description: '', category: [] as string[], languages: [] as string[], authors: [] as string[] })
const categoryInput = ref('')
const languageInput = ref('')
const authorInput = ref('')
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

watch(categoryInput, v => { editForm.category = v.split(',').map(s => s.trim()).filter(Boolean) })
watch(languageInput, v => { editForm.languages = v.split(',').map(s => s.trim()).filter(Boolean) })
watch(authorInput,   v => { editForm.authors   = v.split(',').map(s => s.trim()).filter(Boolean) })

const saveBook = async () => {
  saving.value = true; saveError.value = ''; saveSuccess.value = false
  try {
    await updateBook(id, editForm as any)
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 2500)
  } catch (e) {
    saveError.value = (e as Error).message ?? 'Save failed'
  } finally { saving.value = false }
}

// Chapters
const chapters = ref<any[]>([])
const loadingChapters = ref(false)
const showChapterForm = ref(false)
const chForm = reactive({ title: '', description: '', file: '', mimetype: '', book: id, password: '' })
const chSaving = ref(false)
const chUploading = ref(false)
const chError = ref('')

const loadChapters = async () => {
  loadingChapters.value = true
  const res = await useRequest({ url: `chapter/all/${id}`, method: HTTP_METHODS.GET }, USER_ROLES.ADMIN)
  if (res?.data) chapters.value = (res.data as any) ?? []
  loadingChapters.value = false
}

const handleDeleteChapter = async (chapterId: string) => {
  if (!window.confirm('Delete this chapter?')) return
  await deleteChapter(chapterId)
  chapters.value = chapters.value.filter(c => c.id !== chapterId)
}

const onChapterFilePick = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  chForm.mimetype = file.type
  chUploading.value = true; chError.value = ''
  try {
    const res = await getChapterSignedUrl({ file: file.name, fileType: file.type })
    const { signedURL } = (res as any)?.data ?? {}
    if (!signedURL) throw new Error('No signed URL')
    await fetch(signedURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
    chForm.file = file.name
  } catch { chError.value = 'File upload failed.' } finally { chUploading.value = false }
}

const submitChapter = async () => {
  if (!chForm.title || !chForm.file) { chError.value = 'Title and file are required.'; return }
  chSaving.value = true; chError.value = ''
  try {
    const res = await createChapter(chForm as any)
    if (res?.data) chapters.value.push(res.data)
    Object.assign(chForm, { title: '', description: '', file: '', mimetype: '', password: '' })
    showChapterForm.value = false
  } catch (e) { chError.value = (e as Error).message ?? 'Failed to add chapter.' }
  finally { chSaving.value = false }
}

// Analytics
const periods = ref<any[]>([])
const selectedPeriod = ref('')
const metrics = ref<{ label: string; data: number }[]>([])

const metricKpis = computed(() => metrics.value.map(m => ({ label: m.label, value: m.data })))

const metricsChartData = computed(() => metrics.value.length ? {
  labels: metrics.value.map(m => m.label),
  datasets: [{ label: 'Count', data: metrics.value.map(m => m.data), backgroundColor: '#C97A3A', borderRadius: 4 }],
} : null)

const metricsChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#888' } },
    y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#888' } },
  },
}

const loadMetrics = async () => {
  const res = await getMetrics(id, selectedPeriod.value ? { period: selectedPeriod.value } : {})
  if (res?.data) metrics.value = res.data as any
}

onMounted(async () => {
  const [bookRes, periodsRes] = await Promise.all([
    getBook(id, USER_ROLES.ADMIN),
    getPeriods(),
    loadChapters(),
    loadMetrics(),
  ])
  if (bookRes?.data) {
    book.value = bookRes.data as any
    editForm.title = book.value!.title
    editForm.description = book.value!.description
    categoryInput.value = book.value!.category?.join(', ') ?? ''
    languageInput.value = book.value!.languages?.join(', ') ?? ''
    authorInput.value = book.value!.authors?.join(', ') ?? ''
  }
  if (periodsRes?.data) periods.value = periodsRes.data as any
})
</script>

<style scoped>
.book-detail { display: flex; flex-direction: column; gap: 20px; }
.detail-header { display: flex; flex-direction: column; gap: 12px; }
.back-link { font-family: var(--font-sans); font-size: 13px; color: var(--muted); text-decoration: none; }
.back-link:hover { color: var(--ochre); }
.book-meta { display: flex; align-items: center; gap: 16px; }
.cover-img { width: 48px; height: 64px; object-fit: cover; border-radius: 4px; }
.cover-placeholder { width: 48px; height: 64px; border-radius: 4px; background: var(--calabash); display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--ochre); }
.book-title { font-family: var(--font-display); font-size: 20px; color: var(--ink); margin: 0 0 4px; }
.book-authors { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }
.tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--hairline); }
.tab { padding: 8px 16px; font-family: var(--font-sans); font-size: 13px; color: var(--muted); background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -1px; cursor: pointer; }
.tab.active { color: var(--ochre); border-bottom-color: var(--ochre); font-weight: 600; }
.tab-panel { display: flex; flex-direction: column; gap: 16px; }
.fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.span-2 { grid-column: span 2; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
.field-input, .field-textarea { padding: 9px 14px; background: var(--paper); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; width: 100%; box-sizing: border-box; }
.field-input:focus, .field-textarea:focus { border-color: var(--ochre); }
.field-textarea { resize: vertical; }
.btn-primary { align-self: flex-start; padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-ghost { align-self: flex-start; padding: 8px 16px; background: none; border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--muted); cursor: pointer; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
.success-msg { font-family: var(--font-sans); font-size: 13px; color: #2e7d32; margin: 0; }
.section-hdr { border-top: 1px solid var(--hairline); padding-top: 16px; margin-top: 8px; }
.section-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); }
.chapters-list { display: flex; flex-direction: column; gap: 2px; }
.chapter-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--hairline); }
.ch-title { font-family: var(--font-sans); font-size: 13px; color: var(--ink); flex: 1; }
.ch-type-pill { padding: 2px 8px; border-radius: 20px; font-family: var(--font-sans); font-size: 11px; font-weight: 600; }
.pill-audio { background: rgba(201,122,58,0.12); color: var(--ochre); }
.pill-ebook { background: rgba(31,23,20,0.08); color: var(--ink); }
.ch-del { font-family: var(--font-sans); font-size: 12px; color: var(--hibiscus); background: none; border: none; cursor: pointer; padding: 0; }
.add-ch-btn { margin-top: 8px; }
.chapter-form { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.file-input { font-family: var(--font-sans); font-size: 13px; color: var(--ink); }
.upload-status { font-family: var(--font-sans); font-size: 12px; color: var(--muted); }
.empty { font-family: var(--font-sans); font-size: 13px; color: var(--muted); padding: 12px 0; }
.loading { font-family: var(--font-sans); font-size: 13px; color: var(--muted); padding: 40px; text-align: center; }
.period-row { display: flex; align-items: center; gap: 12px; }
.period-select { padding: 8px 12px; background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; }
.kpi-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.kpi-tile { background: var(--card); border: 1px solid var(--hairline); border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.kpi-label { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.kpi-value { font-family: var(--font-serif); font-size: 24px; color: var(--ink); line-height: 1; }
.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; }
.panel-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); margin-bottom: 16px; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/admin/books/[id].vue
git commit -m "feat(admin): book detail with edit tab, chapter management, and real analytics"
```

---

## Task 8: Fix Users page (`pages/admin/users.vue`)

- [ ] **Step 1: Replace `<script setup>` entirely**

```typescript
import { getUserProfiles, changeRole } from '@/services/admin/users'
import routes from '~/routes'

definePageMeta({ title: 'Listeners', middleware: 'admin', layout: 'admin-layout' })

const { setCommon } = useCommon(USER_ROLES.ADMIN)
const { debounce } = useUtils()

const tabs = [
  { id: 'all',          label: 'Everyone'     },
  { id: 'listeners',    label: 'Listeners'    },
  { id: 'storytellers', label: 'Storytellers' },
  { id: 'admins',       label: 'Admins'       },
]
const activeTab = ref('all')
const search = ref('')
const loading = ref(false)
const users = ref<any[]>([])

const accountFilter = computed(() => {
  if (activeTab.value === 'listeners')    return USER_ROLES.USER
  if (activeTab.value === 'storytellers') return USER_ROLES.ASSOCIATE
  if (activeTab.value === 'admins')       return USER_ROLES.ADMIN
  return undefined
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await getUserProfiles({
      search: search.value,
      account: accountFilter.value as any,
    })
    if (res?.data) users.value = res.data as any
  } finally { loading.value = false }
}

const debouncedFetch = debounce(fetchUsers, 400)
watch([search, activeTab], debouncedFetch)

const handleRoleChange = async (user: any, newRole: number) => {
  await changeRole({ userId: user.id, type: newRole as any })
  user.account = newRole
}

const initials = (name: string) => name?.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase() ?? '?'
const roleLabel = (account: number) => account === 2 ? 'Admin' : account === 1 ? 'Storyteller' : 'Listener'
const rolePillClass = (account: number) => account === 2 ? 'pill-admin' : account === 1 ? 'pill-storyteller' : 'pill-listener'
const formatDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

onMounted(() => { fetchUsers(); setCommon() })
```

- [ ] **Step 2: Add search input above the tabs in the template**

Add before `<div class="tabs">`:
```html
<div class="search-bar">
  <input v-model="search" type="search" class="search-input" placeholder="Search by email…" aria-label="Search users" />
</div>
```

- [ ] **Step 3: Replace the Role column in the table**

Replace the `<td>` that renders the role pill:
```html
<td>
  <select
    class="role-select"
    :value="user.account"
    @change="handleRoleChange(user, Number(($event.target as HTMLSelectElement).value))"
  >
    <option :value="0">Listener</option>
    <option :value="1">Storyteller</option>
    <option :value="2">Admin</option>
  </select>
</td>
```

- [ ] **Step 4: Add row click navigation to name cell**

Wrap the `.user-cell` div:
```html
<td>
  <NuxtLink :to="routes.admin.usersDetail + user.id" class="user-cell-link">
    <div class="user-cell">
      <!-- existing avatar + user-info content unchanged -->
    </div>
  </NuxtLink>
</td>
```

Add style:
```css
.user-cell-link { text-decoration: none; display: block; }
.search-bar { margin-bottom: 4px; }
.search-input { width: 100%; max-width: 340px; padding: 9px 14px; background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; }
.search-input:focus { border-color: var(--ochre); }
.role-select { padding: 4px 8px; background: var(--card); border: 1px solid var(--hairline); border-radius: 6px; font-family: var(--font-sans); font-size: 12px; color: var(--ink); outline: none; cursor: pointer; }
```

- [ ] **Step 5: Commit**

```bash
git add pages/admin/users.vue
git commit -m "feat(admin): fix users endpoint, add search, role-change, row navigation"
```

---

## Task 9: Wire Subscriptions, Period pages

- [ ] **Step 1: Wire `pages/admin/subscriptions.vue`**

Replace `<script setup>`:
```typescript
import { getSubscriptionStats } from '@/services/admin/subscriptions'
import type { SubscriptionStats } from '~/types/admin/subscriptions'

definePageMeta({ title: 'Coins', middleware: 'admin', layout: 'admin-layout' })

const stats = ref<SubscriptionStats | null>(null)

onMounted(async () => {
  const res = await getSubscriptionStats()
  if (res?.data) stats.value = res.data
})

const kpis = computed(() => [
  { label: 'Active subscribers', value: stats.value?.active ?? '—' },
  { label: 'MRR (GHC)',          value: stats.value ? stats.value.byPlan.reduce((s, p) => s + p.count * p.amount, 0) : '—' },
  { label: 'Churn rate',         value: '—' },
  { label: 'Avg tenure (mo.)',   value: '—' },
])

const plans = computed(() => stats.value?.byPlan.map((p, i) => ({
  label: p.name,
  count: p.count,
  color: ['var(--ochre)', 'var(--kola-2)', 'var(--calabash)'][i % 3],
})) ?? [])

const totalActive = computed(() => stats.value?.active ?? '—')

const CIRCUMFERENCE = 2 * Math.PI * 48
const donutSegments = computed(() => {
  const total = plans.value.reduce((s, p) => s + p.count, 0) || 1
  let offset = 0
  return plans.value.map(p => {
    const pct = p.count / total
    const seg = { dash: pct * CIRCUMFERENCE, gap: CIRCUMFERENCE - pct * CIRCUMFERENCE, offset: -offset * CIRCUMFERENCE, color: p.color }
    offset += pct
    return seg
  })
})

const recentSubs = computed(() => stats.value?.recent ?? [])
```

In the template, replace `mockSubs` with `recentSubs` in the `v-for`. Update the cells to use `sub.user.username`, `sub.user.email`, `sub.plan`, `sub.activatedAt`.

- [ ] **Step 2: Add deactivate button to `pages/admin/period.vue`**

Add import:
```typescript
import { getPeriods } from '~/services/admin/period'
```
(Already imported — just verify.)

Add deactivate handler after `fetchPeriods`:
```typescript
const deactivating = ref<string | null>(null)

const deactivate = async (id: string) => {
  deactivating.value = id
  try {
    await useRequest(
      { url: `admin/period/${id}`, method: HTTP_METHODS.PUT, data: { active: false } },
      USER_ROLES.ADMIN
    )
    await fetchPeriods()
  } finally { deactivating.value = null }
}
```

In the periods table row, add a new `<td>` after the status pill cell:
```html
<td>
  <button
    v-if="p.status === 'active'"
    class="deactivate-btn"
    :disabled="deactivating === p.id"
    @click="deactivate(p.id)"
  >{{ deactivating === p.id ? '…' : 'Deactivate' }}</button>
</td>
```

Add `<th>Action</th>` to the thead.

Add style:
```css
.deactivate-btn { padding: 4px 12px; background: none; border: 1px solid var(--hibiscus); color: var(--hibiscus); border-radius: 6px; font-family: var(--font-sans); font-size: 12px; cursor: pointer; }
.deactivate-btn:hover { background: rgba(208,76,79,0.08); }
```

- [ ] **Step 3: Commit**

```bash
git add pages/admin/subscriptions.vue pages/admin/period.vue
git commit -m "feat(admin): wire subscriptions to real data; add period deactivate"
```

---

## Task 10: New page — User detail (`pages/admin/users/[id].vue`)

- [ ] **Step 1: Create `pages/admin/users/[id].vue`**

```vue
<template>
  <div class="user-detail">
    <NuxtLink :to="routes.admin.users" class="back-link">← Listeners</NuxtLink>

    <div v-if="loading" class="loading">Loading…</div>
    <div v-else-if="user" class="profile-card">
      <div class="avatar-wrap">
        <img v-if="user.dp" :src="user.dp" class="avatar" alt="" />
        <div v-else class="avatar-placeholder">{{ initials(user.username) }}</div>
      </div>
      <div class="profile-info">
        <h1 class="username">{{ user.username }}</h1>
        <p class="email">{{ user.email }}</p>
        <span class="role-pill" :class="rolePillClass(user.account)">{{ roleLabel(user.account) }}</span>
        <p class="joined">Joined {{ formatDate(user.createdAt) }}</p>
        <p v-if="user.bio" class="bio">{{ user.bio }}</p>
      </div>
    </div>

    <div v-if="user" class="role-section">
      <h2 class="section-title">Role</h2>
      <div class="role-row">
        <select v-model="selectedRole" class="role-select">
          <option :value="0">Listener</option>
          <option :value="1">Storyteller</option>
          <option :value="2">Admin</option>
        </select>
        <button class="btn-primary" @click="updateRole" :disabled="roleUpdating">
          {{ roleUpdating ? 'Updating…' : 'Update role' }}
        </button>
      </div>
      <p v-if="roleSuccess" class="success-msg">Role updated.</p>
      <p v-if="roleError" class="error-msg">{{ roleError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes'
import { getUser, changeRole } from '@/services/admin/users'

definePageMeta({ title: 'User Detail', middleware: 'admin', layout: 'admin-layout' })

const route = useRoute()
const id = route.params.id as string

const user = ref<any>(null)
const loading = ref(true)
const selectedRole = ref(0)
const roleUpdating = ref(false)
const roleSuccess = ref(false)
const roleError = ref('')

onMounted(async () => {
  const res = await getUser(id)
  if (res?.data) {
    user.value = res.data
    selectedRole.value = (res.data as any).account
  }
  loading.value = false
})

const updateRole = async () => {
  roleUpdating.value = true; roleSuccess.value = false; roleError.value = ''
  try {
    await changeRole({ userId: id, type: selectedRole.value as any })
    user.value.account = selectedRole.value
    roleSuccess.value = true
    setTimeout(() => { roleSuccess.value = false }, 2500)
  } catch (e) {
    roleError.value = (e as Error).message ?? 'Failed to update role.'
  } finally { roleUpdating.value = false }
}

const initials = (name: string) => name?.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase() ?? '?'
const roleLabel = (account: number) => account === 2 ? 'Admin' : account === 1 ? 'Storyteller' : 'Listener'
const rolePillClass = (account: number) => account === 2 ? 'pill-admin' : account === 1 ? 'pill-storyteller' : 'pill-listener'
const formatDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
</script>

<style scoped>
.user-detail { display: flex; flex-direction: column; gap: 24px; max-width: 600px; }
.back-link { font-family: var(--font-sans); font-size: 13px; color: var(--muted); text-decoration: none; }
.back-link:hover { color: var(--ochre); }
.loading { font-family: var(--font-sans); font-size: 13px; color: var(--muted); padding: 40px; text-align: center; }
.profile-card { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 24px; display: flex; gap: 20px; align-items: flex-start; }
.avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.avatar-placeholder { width: 64px; height: 64px; border-radius: 50%; background: var(--calabash); display: flex; align-items: center; justify-content: center; font-family: var(--font-sans); font-size: 18px; font-weight: 700; color: var(--kola); flex-shrink: 0; }
.profile-info { display: flex; flex-direction: column; gap: 6px; }
.username { font-family: var(--font-display); font-size: 20px; color: var(--ink); margin: 0; }
.email { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }
.joined { font-family: var(--font-sans); font-size: 12px; color: var(--muted); margin: 0; }
.bio { font-family: var(--font-sans); font-size: 13px; color: var(--ink); margin: 0; }
.role-pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-family: var(--font-sans); font-size: 11px; font-weight: 600; }
.pill-listener    { background: rgba(226,211,197,0.5); color: var(--kola); }
.pill-storyteller { background: rgba(201,122,58,0.15); color: var(--ochre); }
.pill-admin       { background: rgba(31,23,20,0.10); color: var(--ink); }
.role-section { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.section-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); margin: 0; }
.role-row { display: flex; gap: 12px; align-items: center; }
.role-select { padding: 9px 14px; background: var(--paper); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; }
.btn-primary { padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.success-msg { font-family: var(--font-sans); font-size: 13px; color: #2e7d32; margin: 0; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/admin/users/[id].vue
git commit -m "feat(admin): add user detail page with role management"
```

---

## Task 11: New page — Languages (`pages/admin/languages.vue`)

- [ ] **Step 1: Create `pages/admin/languages.vue`**

```vue
<template>
  <div class="languages-page">
    <header class="page-hdr">
      <h1 class="page-title">Languages</h1>
    </header>

    <div class="add-form panel">
      <h2 class="form-title">Add language</h2>
      <div class="form-row">
        <input v-model="newTitle" class="field-input" placeholder="Language name" />
        <label class="toggle-label">
          <input type="checkbox" v-model="newActive" /> Active
        </label>
        <button class="btn-primary" @click="handleAdd" :disabled="adding || !newTitle.trim()">
          {{ adding ? 'Adding…' : 'Add' }}
        </button>
      </div>
      <p v-if="addError" class="error-msg">{{ addError }}</p>
    </div>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading…</div>
      <table v-else class="lang-table">
        <thead>
          <tr><th>Name</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr v-for="lang in languages" :key="lang.id" class="lang-row">
            <td class="lang-name">{{ lang.name }}</td>
            <td>
              <span class="status-pill" :class="lang.active ? 'status-active' : 'status-inactive'">
                {{ lang.active ? 'active' : 'inactive' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && languages.length === 0" class="empty">No languages yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLanguages, addLanguage } from '@/services/admin/language'
import type { LanguageType } from '~/types/admin/language'

definePageMeta({ title: 'Languages', middleware: 'admin', layout: 'admin-layout' })

const languages = ref<LanguageType[]>([])
const loading = ref(false)
const newTitle = ref('')
const newActive = ref(true)
const adding = ref(false)
const addError = ref('')

const fetchLanguages = async () => {
  loading.value = true
  const res = await getLanguages()
  if (res?.data) languages.value = res.data as any
  loading.value = false
}

const handleAdd = async () => {
  addError.value = ''
  adding.value = true
  try {
    const res = await addLanguage({ title: newTitle.value.trim(), active: newActive.value })
    if (res?.data) languages.value.unshift(res.data as any)
    newTitle.value = ''
    newActive.value = true
  } catch (e) {
    addError.value = (e as Error).message ?? 'Failed to add language.'
  } finally { adding.value = false }
}

onMounted(fetchLanguages)
</script>

<style scoped>
.languages-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; }
.form-title { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--muted); margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.06em; }
.form-row { display: flex; align-items: center; gap: 12px; }
.field-input { flex: 1; padding: 9px 14px; background: var(--paper); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; }
.field-input:focus { border-color: var(--ochre); }
.toggle-label { font-family: var(--font-sans); font-size: 13px; color: var(--ink); display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap; }
.btn-primary { padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; white-space: nowrap; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 4px 0 0; }
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.lang-table { width: 100%; border-collapse: collapse; }
.lang-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.lang-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.lang-row:last-child td { border-bottom: none; }
.lang-name { font-family: var(--font-sans); font-size: 13.5px; color: var(--ink); }
.status-pill { display: inline-flex; padding: 2px 9px; border-radius: 20px; font-family: var(--font-sans); font-size: 11px; font-weight: 600; }
.status-active   { background: rgba(46,125,50,0.12); color: #2e7d32; }
.status-inactive { background: rgba(31,23,20,0.08); color: var(--muted); }
.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/admin/languages.vue
git commit -m "feat(admin): add languages page"
```

---

## Task 12: New page — Organizations (`pages/admin/organizations.vue`)

- [ ] **Step 1: Create `pages/admin/organizations.vue`**

```vue
<template>
  <div class="orgs-page">
    <header class="page-hdr">
      <h1 class="page-title">Organisations</h1>
      <button class="btn-primary" @click="openPanel(null)">+ New organisation</button>
    </header>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading…</div>
      <table v-else class="orgs-table">
        <thead>
          <tr><th>Name</th><th>Type</th><th>Description</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="org in orgs" :key="org.id" class="org-row">
            <td class="org-name">{{ org.name }}</td>
            <td class="org-type">{{ org.type }}</td>
            <td class="org-desc">{{ org.description?.slice(0, 80) }}{{ (org.description?.length ?? 0) > 80 ? '…' : '' }}</td>
            <td><button class="edit-btn" @click="openPanel(org)">Edit</button></td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && orgs.length === 0" class="empty">No organisations yet.</p>
    </div>

    <!-- Slide-in panel -->
    <div v-if="panelOpen" class="panel-overlay" @click.self="panelOpen = false">
      <div class="panel">
        <div class="panel-hdr">
          <span class="panel-title">{{ editingOrg ? 'Edit organisation' : 'New organisation' }}</span>
          <button class="close-btn" @click="panelOpen = false">×</button>
        </div>
        <div class="form-fields">
          <div class="field-group">
            <label class="field-label">Name *</label>
            <input v-model="form.name" class="field-input" placeholder="Organisation name" />
          </div>
          <div class="field-group">
            <label class="field-label">Type</label>
            <input v-model="form.type" class="field-input" placeholder="e.g. Publisher, School" />
          </div>
          <div class="field-group">
            <label class="field-label">Description</label>
            <textarea v-model="form.description" class="field-textarea" rows="3" />
          </div>
        </div>
        <p v-if="formError" class="error-msg">{{ formError }}</p>
        <button class="btn-primary" @click="submitForm" :disabled="formSaving || !form.name.trim()">
          {{ formSaving ? 'Saving…' : editingOrg ? 'Save changes' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getOrgs, createOrg, updateOrg } from '@/services/admin/organization'
import type { OrganizationType, OrganizationRequest } from '~/types/admin/organization'

definePageMeta({ title: 'Organisations', middleware: 'admin', layout: 'admin-layout' })

const orgs = ref<OrganizationType[]>([])
const loading = ref(false)
const panelOpen = ref(false)
const editingOrg = ref<OrganizationType | null>(null)
const form = reactive<OrganizationRequest>({ name: '', type: '', description: '' })
const formSaving = ref(false)
const formError = ref('')

const fetchOrgs = async () => {
  loading.value = true
  const res = await getOrgs()
  if (res?.data) orgs.value = res.data as any
  loading.value = false
}

const openPanel = (org: OrganizationType | null) => {
  editingOrg.value = org
  if (org) {
    form.name = org.name
    form.type = org.type
    form.description = org.description ?? ''
  } else {
    form.name = ''; form.type = ''; form.description = ''
  }
  formError.value = ''
  panelOpen.value = true
}

const submitForm = async () => {
  formSaving.value = true; formError.value = ''
  try {
    if (editingOrg.value) {
      const res = await updateOrg(editingOrg.value.id, { ...form })
      if (res?.data) {
        const idx = orgs.value.findIndex(o => o.id === editingOrg.value!.id)
        if (idx !== -1) orgs.value[idx] = res.data as any
      }
    } else {
      const res = await createOrg({ ...form })
      if (res?.data) orgs.value.unshift(res.data as any)
    }
    panelOpen.value = false
  } catch (e) {
    formError.value = (e as Error).message ?? 'Failed to save.'
  } finally { formSaving.value = false }
}

onMounted(fetchOrgs)
</script>

<style scoped>
.orgs-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.btn-primary { padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.orgs-table { width: 100%; border-collapse: collapse; }
.orgs-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.org-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.org-row:last-child td { border-bottom: none; }
.org-name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.org-type { font-family: var(--font-sans); font-size: 12.5px; color: var(--ochre); }
.org-desc { font-family: var(--font-sans); font-size: 12.5px; color: var(--muted); max-width: 280px; }
.edit-btn { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); background: none; border: none; cursor: pointer; padding: 0; }
.edit-btn:hover { text-decoration: underline; }
.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.panel-overlay { position: fixed; inset: 0; background: rgba(31,23,20,0.4); z-index: 100; display: flex; justify-content: flex-end; }
.panel { width: 400px; height: 100vh; background: var(--paper); padding: 28px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
.panel-hdr { display: flex; align-items: center; justify-content: space-between; }
.panel-title { font-family: var(--font-display); font-size: 18px; color: var(--ink); }
.close-btn { background: none; border: none; font-size: 20px; color: var(--muted); cursor: pointer; line-height: 1; }
.form-fields { display: flex; flex-direction: column; gap: 14px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
.field-input, .field-textarea { padding: 9px 14px; background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; width: 100%; box-sizing: border-box; }
.field-input:focus, .field-textarea:focus { border-color: var(--ochre); }
.field-textarea { resize: vertical; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/admin/organizations.vue
git commit -m "feat(admin): add organisations page with create/edit panel"
```

---

## Task 13: New pages — Email, Storytellers, Revenue, Conversation

- [ ] **Step 1: Create `pages/admin/email.vue`**

```vue
<template>
  <div class="email-page">
    <header class="page-hdr">
      <h1 class="page-title">Email</h1>
    </header>

    <div class="email-grid">
      <div class="compose panel">
        <div class="panel-title">Compose</div>
        <div class="field-group">
          <label class="field-label">To</label>
          <input v-model="form.to" class="field-input" placeholder="email@example.com or 'all'" />
        </div>
        <div class="field-group">
          <label class="field-label">Subject</label>
          <input v-model="form.subject" class="field-input" placeholder="Email subject" />
        </div>
        <div class="field-group">
          <label class="field-label">Body (HTML)</label>
          <textarea v-model="form.body" class="field-textarea" rows="12" placeholder="<p>Your message here</p>" />
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
        <button class="btn-primary" @click="handleSend" :disabled="sending || !form.to.trim() || !form.subject.trim()">
          {{ sending ? 'Sending…' : 'Send email' }}
        </button>
      </div>

      <div class="preview panel">
        <div class="panel-title">Preview</div>
        <div class="preview-body" v-html="form.body || '<p style=\'color:#888\'>Preview will appear here…</p>'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendEmail } from '@/services/admin/email'

definePageMeta({ title: 'Email', middleware: 'admin', layout: 'admin-layout' })

const form = reactive({ to: '', subject: '', body: '' })
const sending = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleSend = async () => {
  sending.value = true; errorMsg.value = ''; successMsg.value = ''
  try {
    await sendEmail({
      email: { to: form.to.trim(), subject: form.subject.trim() },
      body: { header: form.subject.trim(), body: form.body },
    })
    successMsg.value = 'Email sent successfully.'
    form.to = ''; form.subject = ''; form.body = ''
  } catch (e) {
    errorMsg.value = (e as Error).message ?? 'Failed to send email.'
  } finally { sending.value = false }
}
</script>

<style scoped>
.email-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.email-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.panel-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
.field-input, .field-textarea { padding: 9px 14px; background: var(--paper); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; width: 100%; box-sizing: border-box; }
.field-input:focus, .field-textarea:focus { border-color: var(--ochre); }
.field-textarea { resize: vertical; }
.btn-primary { align-self: flex-start; padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
.success-msg { font-family: var(--font-sans); font-size: 13px; color: #2e7d32; margin: 0; }
.preview-body { font-family: var(--font-sans); font-size: 13.5px; color: var(--ink); line-height: 1.7; min-height: 200px; }
</style>
```

- [ ] **Step 2: Replace `pages/admin/storytellers.vue`**

```vue
<template>
  <div class="storytellers-page">
    <header class="page-hdr">
      <div>
        <h1 class="page-title">Storytellers</h1>
        <p class="page-sub">{{ total }} storytellers</p>
      </div>
      <button class="btn-primary" @click="showAddForm = !showAddForm">
        {{ showAddForm ? '− Cancel' : '+ Add storyteller' }}
      </button>
    </header>

    <div v-if="showAddForm" class="add-form panel">
      <div class="field-row">
        <div class="field-group flex-1"><label class="field-label">Email</label><input v-model="newUser.email" class="field-input" /></div>
        <div class="field-group flex-1"><label class="field-label">Username</label><input v-model="newUser.username" class="field-input" /></div>
        <div class="field-group flex-1"><label class="field-label">Password</label><input type="password" v-model="newUser.password" class="field-input" /></div>
      </div>
      <p v-if="addError" class="error-msg">{{ addError }}</p>
      <button class="btn-primary" @click="handleAdd" :disabled="adding">{{ adding ? 'Adding…' : 'Add storyteller' }}</button>
    </div>

    <div class="toolbar">
      <input v-model="search" type="search" class="search-input" placeholder="Search by email…" />
    </div>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading…</div>
      <table v-else class="st-table">
        <thead><tr><th>Storyteller</th><th>Joined</th><th></th></tr></thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="st-row">
            <td>
              <div class="user-cell">
                <div class="avatar-ph">{{ initials(user.username) }}</div>
                <div class="user-info">
                  <span class="user-name">{{ user.username }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </td>
            <td class="date-cell">{{ formatDate(user.createdAt) }}</td>
            <td><NuxtLink :to="routes.admin.usersDetail + user.id" class="view-link">View →</NuxtLink></td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && users.length === 0" class="empty">No storytellers found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserProfiles } from '@/services/admin/users'
import routes from '~/routes'

definePageMeta({ title: 'Storytellers', middleware: 'admin', layout: 'admin-layout' })

const { debounce } = useUtils()
const users = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const search = ref('')
const showAddForm = ref(false)
const newUser = reactive({ email: '', username: '', password: '' })
const adding = ref(false)
const addError = ref('')

const fetchStorytellers = async () => {
  loading.value = true
  const res = await getUserProfiles({ search: search.value, account: USER_ROLES.ASSOCIATE })
  if (res?.data) { users.value = res.data as any; total.value = users.value.length }
  loading.value = false
}

const debouncedFetch = debounce(fetchStorytellers, 400)
watch(search, debouncedFetch)

const handleAdd = async () => {
  adding.value = true; addError.value = ''
  try {
    await useRequest(
      { url: 'admin/user/add', method: HTTP_METHODS.POST, data: { ...newUser, account: USER_ROLES.ASSOCIATE } },
      USER_ROLES.ADMIN
    )
    Object.assign(newUser, { email: '', username: '', password: '' })
    showAddForm.value = false
    await fetchStorytellers()
  } catch (e) { addError.value = (e as Error).message ?? 'Failed to add.' }
  finally { adding.value = false }
}

const initials = (name: string) => name?.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase() ?? '?'
const formatDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

onMounted(fetchStorytellers)
</script>

<style scoped>
.storytellers-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: flex-start; justify-content: space-between; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0 0 4px; }
.page-sub { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }
.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; }
.add-form { display: flex; flex-direction: column; gap: 14px; }
.field-row { display: flex; gap: 12px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.flex-1 { flex: 1; }
.field-label { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
.field-input { padding: 9px 14px; background: var(--paper); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; width: 100%; box-sizing: border-box; }
.field-input:focus { border-color: var(--ochre); }
.btn-primary { align-self: flex-start; padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
.toolbar { display: flex; gap: 12px; }
.search-input { flex: 1; max-width: 340px; padding: 9px 14px; background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; }
.search-input:focus { border-color: var(--ochre); }
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state, .empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.st-table { width: 100%; border-collapse: collapse; }
.st-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.st-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.st-row:last-child td { border-bottom: none; }
.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar-ph { width: 32px; height: 32px; border-radius: 50%; background: var(--calabash); display: flex; align-items: center; justify-content: center; font-family: var(--font-sans); font-size: 11px; font-weight: 700; color: var(--kola); flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; gap: 1px; }
.user-name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.user-email { font-family: var(--font-sans); font-size: 11.5px; color: var(--muted); }
.date-cell { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
.view-link { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); text-decoration: none; font-weight: 500; }
.view-link:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 3: Replace `pages/admin/revenue.vue`**

```vue
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
  if (res?.data) summary.value = res.data
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
```

- [ ] **Step 4: Replace `pages/admin/conversation.vue`**

```vue
<template>
  <div class="conversation-page">
    <header class="page-hdr">
      <h1 class="page-title">Conversation</h1>
    </header>

    <div class="toolbar">
      <select v-model="selectedBook" class="book-filter" @change="page = 1; fetchComments()">
        <option value="">All stories</option>
        <option v-for="b in books" :key="b.id" :value="b.id">{{ b.title }}</option>
      </select>
    </div>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading comments…</div>
      <table v-else class="comments-table">
        <thead><tr><th>Story</th><th>User</th><th>Comment</th><th>Date</th><th></th></tr></thead>
        <tbody>
          <tr v-for="c in comments" :key="c.id" class="comment-row">
            <td class="story-cell">{{ c.book.title }}</td>
            <td>
              <div class="user-cell">
                <img v-if="c.user.dp" :src="c.user.dp" class="avatar" alt="" />
                <div v-else class="avatar-ph">{{ (c.user.username ?? '?')[0].toUpperCase() }}</div>
                <span class="username">{{ c.user.username }}</span>
              </div>
            </td>
            <td class="comment-text">{{ c.comment.slice(0, 120) }}{{ c.comment.length > 120 ? '…' : '' }}</td>
            <td class="date-cell">{{ formatDate(c.createdAt) }}</td>
            <td>
              <button class="del-btn" @click="handleDelete(c.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && comments.length === 0" class="empty">No comments found.</p>
    </div>

    <div class="pagination">
      <button class="page-btn" :disabled="page <= 1" @click="page--; fetchComments()">← Prev</button>
      <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
      <button class="page-btn" :disabled="page >= totalPages" @click="page++; fetchComments()">Next →</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getComments, deleteComment } from '@/services/admin/conversation'
import { getBooks } from '@/services/book'
import type { AdminComment } from '~/types/admin/conversation'

definePageMeta({ title: 'Conversation', middleware: 'admin', layout: 'admin-layout' })

const comments = ref<AdminComment[]>([])
const books = ref<any[]>([])
const selectedBook = ref('')
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const limit = 20

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

const fetchComments = async () => {
  loading.value = true
  const res = await getComments({ page: page.value, limit, bookId: selectedBook.value || undefined })
  if (res?.data) {
    comments.value = (res.data as any).results ?? []
    total.value = (res.data as any).total ?? 0
  }
  loading.value = false
}

const handleDelete = async (id: string) => {
  if (!window.confirm('Delete this comment?')) return
  await deleteComment(id)
  comments.value = comments.value.filter(c => c.id !== id)
  total.value = Math.max(0, total.value - 1)
}

const formatDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

onMounted(async () => {
  const booksRes = await getBooks(USER_ROLES.ADMIN, { page: 1, limit: 100 })
  if (booksRes?.data) books.value = (booksRes.data as any).results ?? []
  await fetchComments()
})
</script>

<style scoped>
.conversation-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.toolbar { display: flex; gap: 12px; }
.book-filter { padding: 9px 14px; background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; min-width: 200px; }
.book-filter:focus { border-color: var(--ochre); }
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state, .empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.comments-table { width: 100%; border-collapse: collapse; }
.comments-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.comment-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.comment-row:last-child td { border-bottom: none; }
.story-cell { font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; color: var(--ink); max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-cell { display: flex; align-items: center; gap: 8px; }
.avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.avatar-ph { width: 28px; height: 28px; border-radius: 50%; background: var(--calabash); display: flex; align-items: center; justify-content: center; font-family: var(--font-sans); font-size: 11px; font-weight: 700; color: var(--kola); flex-shrink: 0; }
.username { font-family: var(--font-sans); font-size: 12.5px; color: var(--ink); }
.comment-text { font-family: var(--font-sans); font-size: 12.5px; color: var(--ink); max-width: 280px; }
.date-cell { font-family: var(--font-mono); font-size: 11.5px; color: var(--muted); white-space: nowrap; }
.del-btn { font-family: var(--font-sans); font-size: 12px; color: var(--hibiscus); background: none; border: none; cursor: pointer; padding: 0; }
.del-btn:hover { text-decoration: underline; }
.pagination { display: flex; align-items: center; gap: 16px; justify-content: center; }
.page-btn { padding: 7px 16px; background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--muted); cursor: pointer; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn:not(:disabled):hover { border-color: var(--ochre); color: var(--ochre); }
.page-info { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
</style>
```

- [ ] **Step 5: Commit all four new/replaced pages**

```bash
git add pages/admin/email.vue \
        pages/admin/storytellers.vue \
        pages/admin/revenue.vue \
        pages/admin/conversation.vue
git commit -m "feat(admin): add email, storytellers, revenue, conversation pages"
```

---

## Task 14: Final verification

- [ ] **Step 1: Run dev server**

```bash
pnpm run dev
```

Expected: server starts on port 3080, no compile errors in terminal.

- [ ] **Step 2: Browser smoke test — navigate to each admin page**

Log in as an admin user at `/admin/login`, then visit each route and verify no blank screens or console errors:

```
/admin               → KPI cards load, pulse chart renders
/admin/books         → table renders with Edit/Delete buttons
/admin/books/new     → wizard shows cover upload in step 1
/admin/books/<id>    → Edit and Analytics tabs work
/admin/users         → search and role dropdowns work
/admin/users/<id>    → profile card + role section render
/admin/subscriptions → plan donut and recent table render
/admin/period        → Deactivate button appears on active periods
/admin/languages     → add form + table render
/admin/organizations → table + slide-in panel work
/admin/email         → compose + preview panes render
/admin/storytellers  → table renders, add form toggles
/admin/revenue       → KPIs + bar chart + table render
/admin/conversation  → comment table + pagination render
```

- [ ] **Step 3: Verify sidebar shows Languages and Organisations links**

Open the sidebar — "Languages" and "Organisations" should appear after "Listeners".

- [ ] **Step 4: Final commit if any stray changes**

```bash
git status
# stage and commit anything unstaged
```
