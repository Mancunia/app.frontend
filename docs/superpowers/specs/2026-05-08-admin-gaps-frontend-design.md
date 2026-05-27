# Admin Dashboard — Frontend Gap Fill Design

**Date:** 2026-05-08
**Repo:** `app.frontend` (Nuxt 3 / Vue 3 / TypeScript)
**Scope:** Wire all hollow admin pages to real API data, add Chart.js charting, and build all missing admin pages.

---

## Goal

The previous admin dashboard plan (`2026-05-07-admin-dashboard.md`) delivered the visual shell with mock/hardcoded data. This spec fills every remaining gap:

- Replace all mock data with real API calls
- Add `chart.js` + `vue-chartjs` to replace hand-drawn inline SVG charts
- Build six missing pages (languages, organizations, email, user detail, storytellers, revenue, conversation)
- Fix broken data wiring on existing pages

---

## Constraints

- All styles use design-token CSS vars (`--ochre`, `--ink`, `--card`, `--hairline`, `--muted`, `--hibiscus`, `--calabash`, `--cream`, `--paper`, `--kola`, `--kola-2`) — zero hardcoded hex or CSS named colours
- All API calls go through the existing `useRequest` composable
- Every admin page: `definePageMeta({ middleware: 'admin', layout: 'admin-layout' })`
- No new npm packages beyond `chart.js` and `vue-chartjs`
- Chart components imported as client-only (`<ClientOnly>` wrapper or `.client.ts` plugin)

---

## Architecture: Three layers

```
Layer 1: Infrastructure
  - chart.js + vue-chartjs setup
  - New TypeScript types
  - New admin service files
  - routes.ts additions
  - Sidebar nav additions

Layer 2: Wire existing hollow pages
  - /admin (Hearth)
  - /admin/books (list)
  - /admin/books/new (wizard)
  - /admin/books/[id] (detail + analytics)
  - /admin/users (list)
  - /admin/subscriptions
  - /admin/period

Layer 3: New pages
  - /admin/users/:id
  - /admin/languages
  - /admin/organizations
  - /admin/email
  - /admin/storytellers
  - /admin/revenue
  - /admin/conversation
```

---

## Layer 1 — Infrastructure

### Chart.js setup

**`package.json`:** add `"chart.js": "^4"` and `"vue-chartjs": "^5"` to `dependencies`.

**`plugins/chartjs.client.ts`** (new file):
```ts
import {
  Chart, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js'
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler)
```

**`nuxt.config.ts`:** add `plugins: ['~/plugins/chartjs.client.ts']`

**Usage in pages:** import chart components directly in each `.vue` file:
```ts
import { Line, Bar, Doughnut } from 'vue-chartjs'
```
Wrap in `<ClientOnly>` to avoid SSR hydration errors.

**Shared chart defaults** (inline per page — no shared config file needed):
- Font: `var(--font-sans)` via Chart.js `defaults.font.family`
- Grid lines: `color: 'rgba(0,0,0,0.06)'`
- Tick colour: `#888`
- Line chart: `tension: 0.3`, `fill: true`, `borderColor: '#C97A3A'` (ochre), `backgroundColor: 'rgba(201,122,58,0.12)'`
- Bar chart: `backgroundColor: '#C97A3A'`, `borderRadius: 4`
- Doughnut: colours from `['#C97A3A', '#8B5E3C', '#E2D3C5']`

---

### New TypeScript types

**`types/admin/organization.ts`**
```ts
export type OrganizationType = {
  id: string
  name: string
  description?: string
  type: string
  logo?: string
}
export type OrganizationRequest = Omit<OrganizationType, 'id'>
```

**`types/admin/language.ts`**
```ts
export type LanguageType = {
  id: string
  name: string
  active: boolean
}
```

**`types/admin/dashboard.ts`**
```ts
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

**`types/admin/subscriptions.ts`**
```ts
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

**`types/admin/conversation.ts`**
```ts
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

**`types/admin/revenue.ts`**
```ts
export type RevenueSummary = {
  mrr: number
  totalActiveSubscribers: number
  byPlan: { name: string; amount: number; count: number; contribution: number }[]
}
```

---

### New service files

**`services/admin/language.ts`**
```ts
export const getLanguages = () =>
  useRequest({ url: 'admin/language/all', method: HTTP_METHODS.GET }, USER_ROLES.ADMIN)

export const addLanguage = (body: { title: string; active: boolean }) =>
  useRequest({ url: 'admin/language/add', method: HTTP_METHODS.POST, data: body }, USER_ROLES.ADMIN)
```

**`services/admin/organization.ts`**
```ts
export const getOrgs = () =>
  useRequest({ url: 'admin/organization/', method: HTTP_METHODS.GET }, USER_ROLES.ADMIN)

export const getOrg = (id: string) =>
  useRequest({ url: `admin/organization/${id}`, method: HTTP_METHODS.GET }, USER_ROLES.ADMIN)

export const createOrg = (body: OrganizationRequest) =>
  useRequest({ url: 'admin/organization/create', method: HTTP_METHODS.POST, data: body }, USER_ROLES.ADMIN)

export const updateOrg = (id: string, body: Partial<OrganizationRequest>) =>
  useRequest({ url: `admin/organization/${id}`, method: HTTP_METHODS.PUT, data: body }, USER_ROLES.ADMIN)
```

**`services/admin/email.ts`**
```ts
export const sendEmail = (payload: {
  email: { to: string; subject: string; html?: string }
  body: object
}) =>
  useRequest({ url: 'admin/user/sendEmail', method: HTTP_METHODS.POST, data: payload }, USER_ROLES.ADMIN)
```

**`services/admin/dashboard.ts`**
```ts
export const getDashboardStats = () =>
  useRequest({ url: 'admin/dashboard/stats', method: HTTP_METHODS.GET }, USER_ROLES.ADMIN)

export const getDashboardPulse = (days = 14) =>
  useRequest({ url: 'admin/dashboard/pulse', method: HTTP_METHODS.GET, params: { days } }, USER_ROLES.ADMIN)
```

**`services/admin/subscriptions.ts`**
```ts
export const getSubscriptionStats = () =>
  useRequest({ url: 'admin/subscriptions/stats', method: HTTP_METHODS.GET }, USER_ROLES.ADMIN)
```

**`services/admin/conversation.ts`**
```ts
export const getComments = (params: { page?: number; limit?: number; bookId?: string }) =>
  useRequest({ url: 'admin/conversation/comments', method: HTTP_METHODS.GET, params }, USER_ROLES.ADMIN)

export const deleteComment = (id: string) =>
  useRequest({ url: `admin/conversation/comments/${id}`, method: HTTP_METHODS.DELETE }, USER_ROLES.ADMIN)
```

**`services/admin/revenue.ts`**
```ts
export const getRevenueSummary = () =>
  useRequest({ url: 'admin/revenue/summary', method: HTTP_METHODS.GET }, USER_ROLES.ADMIN)
```

**`services/admin/users.ts`** — add single-user fetch:
```ts
export const getUser = (id: string) =>
  useRequest({ url: `admin/user/${id}`, method: HTTP_METHODS.GET }, USER_ROLES.ADMIN)
```

---

### `routes.ts` additions

Add to the `admin` key in the `ROUTES` type and the `routes` const:
```ts
languages:      '/admin/languages',
organizations:  '/admin/organizations',
email:          '/admin/email',
usersDetail:    '/admin/users/',   // usage: routes.admin.usersDetail + id
```

---

### `constants/index.ts` — sidebar nav

Add two entries to `adminNavigationItems` after the Listeners entry:
```ts
{ title: 'Languages',      url: routes.admin.languages },
{ title: 'Organisations',  url: routes.admin.organizations },
```

---

## Layer 2 — Wire existing pages

### `/admin` — Hearth dashboard (`pages/admin/index.vue`)

**KPI cards:**
- Replace hardcoded values with `getDashboardStats()` on `onMounted`
- "Stories in library" ← `stats.books`
- "Active subscribers" ← `stats.activeSubscribers`
- "Listeners tonight" and "Hours listened (7d)" stay `—` (no tracking data available)
- "MRR (GHC)" stays `—` (needs revenue endpoint — can upgrade later)

**Listening pulse chart:**
- Remove the hand-drawn `<svg>` polyline
- Add `<ClientOnly><Line :data="pulseChartData" :options="pulseChartOptions" /></ClientOnly>`
- `getDashboardPulse(14)` on mount → map to Chart.js `labels` (dates) and `datasets[0].data` (plays)

**Top stories table:**
- Replace static `topStories` array with `getBooks(USER_ROLES.ADMIN, { page: 1, limit: 5 })` results
- Keep the same table columns (Title, Listens, Hrs, Completion) — map `meta.played` to Listens; Hrs and Completion stay `—` (not available)

**Genre weft and Fire log:** remain static — no backend data source for these.

---

### `/admin/books` — Stories list (`pages/admin/books/index.vue`)

**Add per-row actions column:**
- Edit link: `<NuxtLink :to="\`/admin/books/${book.id}\`">Edit</NuxtLink>`
- Delete button: on click, `window.confirm('Delete "${book.title}" and all its chapters?')` → `deleteBook(book.id)` → remove from local `books` array

No other changes to data fetching (already correct).

---

### `/admin/books/new` — Add story wizard (`pages/admin/books/new.vue`)

**Step 0 (Identify) — add new fields:**
- `snippet` textarea (optional, max 300 chars)
- `organization` select — `getOrgs()` on mount, options mapped to `{ label: org.name, value: org.id }`
- `associates` multi-select — `getUserProfiles({ search: '', account: USER_ROLES.ASSOCIATE })` on mount

**Step 1 (Cover) — replace placeholder with S3 upload:**
1. `<input type="file" accept="image/*">` — bind to `coverFile` ref
2. On file change: call `getSignedUrl({ file: coverFile.name, fileType: coverFile.type })`
3. PUT `coverFile` binary to the returned `signedURL` (`fetch(signedURL, { method: 'PUT', body: coverFile, headers: { 'Content-Type': coverFile.type } })`)
4. Store the `file` key (filename sent in step 1) in `form.cover`
5. Show `<img>` thumbnail preview using `URL.createObjectURL(coverFile)`
6. Show upload progress state (`uploading = true/false`)

**Steps 2–3 (Voice, Chapters):** remain as skippable stubs with the note "manage chapters from the book detail page after creating."

**Step 4 (Publish):** show cover thumbnail in summary if uploaded.

---

### `/admin/books/[id]` — Book detail (`pages/admin/books/[id].vue`)

**Restructure as two tabs using the existing `<UiTab>` pattern:**

**Tab: Edit**
- Editable fields: title, description, snippet, categories (comma-separated input), languages (comma-separated), authors (comma-separated), organization (select from `getOrgs()`), associates (multi-select), cover (re-upload via same S3 flow as wizard)
- "Save changes" button → `updateBook(id, changedFields)` → success toast
- **Chapter list section below the form:**
  - Fetch via `GET /chapter/all/:bookId` (consumer route, requires admin token)
  - Each row: chapter title, type pill (audio / ebook), "Delete" button → `deleteChapter(id)` → confirm first → remove from list
  - "Add chapter" button → expand an inline form:
    - Title, description inputs
    - File picker (accept `audio/*,application/pdf`)
    - On file pick: detect mimetype → choose correct S3 bucket context → `getChapterSignedUrl()` → upload → store key in `chapterForm.file`
    - Mimetype field auto-set from picked file
    - Submit → `createChapter(chapterForm)` → append to chapter list

**Tab: Analytics**
- Period selector: `getPeriods()` on mount → `<select>` with "Latest" as default
- On period change: re-call `getMetrics(id, { period: selectedPeriodId })`
- KPI strip: map `[{label, data}]` from the API response to the 5 tiles
- Chart.js `<Bar>` chart: labels = `['Seen', 'Played', 'Comments', 'Likes', 'Dislikes']`, data = corresponding values
- Remove the chapter completion funnel and regions panels (backend does not expose this data)

---

### `/admin/users` — Listeners (`pages/admin/users.vue`)

**Fix broken endpoint:**
Replace `useRequest({ url: '/admin/user', method: HTTP_METHODS.GET })` with `getUserProfiles({ search: searchValue, account: tabAccountFilter })`.

**Add search input:**
```html
<input v-model="search" type="search" placeholder="Search listeners…" class="search-input" />
```
Debounced (400ms) → re-calls `getUserProfiles` with updated `search` value.

**Add role-change inline:**
Replace the static role pill with a `<select>` showing the current role. On change → `changeRole({ userId: user.id, type: newRole })` → update local user in array.

**Add row navigation:**
Wrap the name cell in `<NuxtLink :to="routes.admin.usersDetail + user.id">` so clicking a user opens their detail page.

**Tab filter to account param mapping:**
```ts
const accountFilter = computed(() => {
  if (activeTab.value === 'listeners')    return USER_ROLES.USER
  if (activeTab.value === 'storytellers') return USER_ROLES.ASSOCIATE
  if (activeTab.value === 'admins')       return USER_ROLES.ADMIN
  return undefined  // 'all' tab — omit account filter
})
```

---

### `/admin/subscriptions` — Coins (`pages/admin/subscriptions.vue`)

Replace all mock data with `getSubscriptionStats()` on mount:

- `stats.active` → "Active subscribers" KPI
- `MRR` computed as `stats.byPlan.reduce((s, p) => s + p.count * p.amount, 0)`
- `stats.byPlan` → donut segments (map `count` to `pct` of total, use ochre colour palette)
- `stats.recent` → recent subscriptions table rows
- "Churn rate" and "Avg tenure" KPIs stay `—`

---

### `/admin/period` — Periods (`pages/admin/period.vue`)

**Add deactivate button per active period row:**

```html
<button
  v-if="p.status === 'active'"
  class="deactivate-btn"
  @click="deactivate(p.id)"
>
  Deactivate
</button>
```

`deactivate(id)`: calls `PUT /admin/period/:id` with `{ active: false }` via existing `services/admin/period.ts` → refresh list.

Auto mode selector remains UI-only (no backend support for automatic period rolling).

---

## Layer 3 — New pages

### `/admin/users/:id` (`pages/admin/users/[id].vue`)

```
Layout: admin-layout | Middleware: admin
```

**Sections:**
1. **Back link** → `/admin/users`
2. **Profile card:** avatar (`dp` image or initials fallback), username, email, role pill, joined date, bio
3. **Role-change section:** `<select>` with Listener / Storyteller / Admin options, pre-selected to current role. "Update role" button → `changeRole({ userId: id, type: selectedRole })` → success toast → update displayed pill

**Data:** `getUser(id)` (new backend endpoint) on mount. Show skeleton loader while loading.

---

### `/admin/languages` (`pages/admin/languages.vue`)

```
Layout: admin-layout | Middleware: admin
```

**Sections:**
1. **Page header:** "Languages"
2. **Add form** (always visible at top): title input + active checkbox + "Add" button → `addLanguage()` → prepend to list → clear form
3. **Table:** Name column, Active status pill (green "active" / muted "inactive"), no edit/delete (API doesn't expose those endpoints yet)

**Data:** `getLanguages()` on mount.

---

### `/admin/organizations` (`pages/admin/organizations.vue`)

```
Layout: admin-layout | Middleware: admin
```

**Sections:**
1. **Page header + "New organisation" button**
2. **Table:** Name, Type, Description (truncated to 80 chars)
3. **Slide-in panel** (right-side, CSS `position: fixed`, toggled by `panelOpen` ref):
   - Title: "New organisation" or "Edit organisation"
   - Fields: name (required), description (textarea), type (text input), logo (file picker → S3 presigned upload to images bucket, same flow as book cover)
   - Submit → `createOrg()` or `updateOrg(id)` → close panel → refresh list
   - Close button (×) and click-outside handler

**Interactions:**
- "New organisation" → opens blank panel
- Row click → opens panel pre-filled with that org's data

**Data:** `getOrgs()` on mount.

---

### `/admin/email` (`pages/admin/email.vue`)

```
Layout: admin-layout | Middleware: admin
```

**Sections:**
1. **Compose panel:**
   - "To" text input (email address, or type `all` to broadcast to all users)
   - Subject text input
   - HTML body `<textarea>` (raw HTML — admin-only, no XSS risk)
   - "Send" button → `sendEmail(payload)` → success/error toast

2. **Preview panel** (side-by-side on desktop ≥750px, below on mobile):
   - Renders `body` textarea content via `v-html` (admin-only context, no sanitisation needed)
   - Updates live as the user types

**Payload mapping:**
```ts
const payload = {
  email: { to: form.to, subject: form.subject },
  body: { header: form.subject, body: form.htmlBody },
}
```

No draft saving. Reset form on successful send.

---

### `/admin/storytellers` (`pages/admin/storytellers.vue`)

Replace stub content entirely.

```
Layout: admin-layout | Middleware: admin
```

**Sections:**
1. **Header + "Add storyteller" button**
2. **Search input** (debounced)
3. **Table:** avatar, username, email, joined date; row click → `/admin/users/:id`
4. **Add storyteller inline form** (appears below header when button clicked):
   - Email, username, password inputs
   - Submit → `POST /admin/user/add` with `{ email, username, password, account: 1 }` → prepend to list

**Data:** `getUserProfiles({ search, account: USER_ROLES.ASSOCIATE })` on mount and on search change.

---

### `/admin/revenue` (`pages/admin/revenue.vue`)

Replace stub content entirely.

```
Layout: admin-layout | Middleware: admin
```

**Sections:**
1. **KPI cards:** MRR (GHC) from `summary.mrr`, Total active subscribers from `summary.totalActiveSubscribers`
2. **Chart.js `<Bar>` chart:** labels = plan names, data = contribution values. `<ClientOnly>` wrapper.
3. **Breakdown table:** Plan name | Unit price (GHC) | Subscribers | Contribution (GHC)
4. **Disclaimer row:** "Figures reflect active subscriptions only. Actual payment receipts are in Paystack."

**Data:** `getRevenueSummary()` on mount.

---

### `/admin/conversation` (`pages/admin/conversation.vue`)

Replace stub content entirely.

```
Layout: admin-layout | Middleware: admin
```

**Sections:**
1. **Filter bar:**
   - Book filter: `<select>` populated from `getBooks(USER_ROLES.ADMIN, { page: 1, limit: 100 })` with "All books" as default option
2. **Comments table:**
   - Columns: Book title | User (avatar + name) | Comment (truncated to 120 chars) | Date | Delete button
   - Delete → `window.confirm` → `deleteComment(id)` → remove row optimistically
3. **Pagination:** previous/next buttons, shows "Page X of Y" label. Increment/decrement `page` ref → re-fetch.

**Data:** `getComments({ page, limit: 20, bookId: selectedBookId || undefined })` on mount and on filter/page change.

**Empty state:** "No comments found." centred in the table area.

---

## Data flow summary

```
/admin (Hearth)        ← GET /admin/dashboard/stats
                       ← GET /admin/dashboard/pulse?days=14
                       ← consumer GET /book (top stories)
/admin/books           ← consumer GET /book (existing)
/admin/books/new       ← S3 presigned (cover upload)
                       ← GET /admin/organization/
                       ← POST /admin/user/fetchUsers { account: 1 }
/admin/books/[id]      ← consumer GET /book/:id
                       ← GET /admin/book/metrics/:id
                       ← consumer GET /chapter/all/:bookId
                       ← S3 presigned (cover + chapter upload)
/admin/users           ← POST /admin/user/fetchUsers (fixed)
/admin/users/:id       ← GET /admin/user/:id (new backend endpoint)
/admin/subscriptions   ← GET /admin/subscriptions/stats (new)
/admin/period          ← GET /admin/period/all (existing)
/admin/languages       ← GET /admin/language/all (existing)
/admin/organizations   ← GET /admin/organization/ (existing)
/admin/email           ← POST /admin/user/sendEmail (existing)
/admin/storytellers    ← POST /admin/user/fetchUsers { account: 1 }
/admin/revenue         ← GET /admin/revenue/summary (new)
/admin/conversation    ← GET /admin/conversation/comments (new)
```

---

## Key business rules

- Only `account === 2` users are admins. The API enforces this — a 403 on a mutating call means role is wrong, not that the token is invalid.
- S3 uploads are always client-direct via presigned URL — never proxy file data through the API.
- Book deletion cascades to all chapters — always confirm before calling `deleteBook`.
- MRR on the revenue page is an estimate — show the disclaimer.
- Comment deletion is soft-delete on the backend (`deletedAt` set). The frontend removes the row optimistically.
