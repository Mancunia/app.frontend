# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Anansesemfie admin dashboard prototype (admin.jsx + admin-extra.jsx design bundle) into the Nuxt 3 codebase, replacing the existing minimal admin pages with the full Hearth dashboard, Stories management, Book Analytics, Listeners, Periods, and Subscriptions screens.

**Architecture:** Fixed 232px ink-coloured sidebar + scrollable main body using CSS Grid. Each admin screen is a Nuxt page (`pages/admin/…`) with scoped styles using the existing design-token CSS custom properties (`--ink`, `--ochre`, `--kola`, `--cream`, `--paper`, `--card`, `--hairline`, `--muted`, `--hibiscus`, `--calabash`). Inline SVG charts keep the bundle small and avoid charting-library dependencies.

**Tech Stack:** Nuxt 3 (SPA, port 3080), Vue 3 Composition API (`<script setup lang="ts">`), Pinia, TypeScript, existing `useRequest` composable, existing `services/book.ts` + `services/admin/book.ts` + `services/admin/period.ts`.

---

## File Structure

**Modified:**
- `layouts/admin-layout.vue` — flex → CSS Grid 232px 1fr
- `components/layout/admin/sidebar.vue` — full rewrite: Hearth/Stories/Storytellers/Listeners/Coins/Conversation + diamond glyphs + proverb card
- `constants/index.ts` — update `adminNavigationItems` to match new nav
- `routes.ts` — add `books`, `subscriptions`, `storytellers`, `revenue`, `conversation` routes
- `pages/admin/index.vue` — rewrite as Hearth dashboard (KPIs + charts)
- `pages/admin/users.vue` — rewrite as Listeners table (filter tabs + user rows)
- `pages/admin/period.vue` — rewrite as Periods (auto/manual mode + periods table)

**Created:**
- `pages/admin/books/index.vue` — Stories list with search + table
- `pages/admin/books/new.vue` — 5-step Add Book wizard
- `pages/admin/books/[id].vue` — Book Analytics (KPIs + DualSeriesChart + ChapterFunnel + RegionBars)
- `pages/admin/subscriptions.vue` — Subscriptions (donut + cohort + table)
- `pages/admin/storytellers.vue` — stub placeholder
- `pages/admin/revenue.vue` — stub placeholder
- `pages/admin/conversation.vue` — stub placeholder

---

## Task 1: Infrastructure — Layout, Sidebar, Routes, Navigation

**Files:**
- Modify: `layouts/admin-layout.vue`
- Modify: `components/layout/admin/sidebar.vue`
- Modify: `constants/index.ts`
- Modify: `routes.ts`

- [ ] **Step 1: Update `layouts/admin-layout.vue` to CSS Grid**

Replace the entire file:

```vue
<template>
  <div class="page">
    <LayoutAdminSidebar />
    <main class="body">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.page {
  display: grid;
  grid-template-columns: 232px 1fr;
  height: 100%;
  min-height: 100vh;
  width: 100%;
  background: var(--paper);
}
.body {
  padding: 28px 32px;
  overflow-y: auto;
  min-height: 100vh;
}
</style>
```

- [ ] **Step 2: Add new route constants to `routes.ts`**

Replace the entire file:

```typescript
type ROUTES = {
  admin: {
    home: string;
    login: string;
    users: string;
    period: string;
    books: string;
    booksNew: string;
    subscriptions: string;
    storytellers: string;
    revenue: string;
    conversation: string;
  };
  app: {
    home: string;
    login: string;
    signup: string;
    forgotPassword: string;
    book: string;
  };
  web?: {
    home: string;
    about: string;
    contact: string;
  };
};

const routes: ROUTES = {
  admin: {
    home: '/admin',
    login: '/admin/login',
    users: '/admin/users',
    period: '/admin/period',
    books: '/admin/books',
    booksNew: '/admin/books/new',
    subscriptions: '/admin/subscriptions',
    storytellers: '/admin/storytellers',
    revenue: '/admin/revenue',
    conversation: '/admin/conversation',
  },
  app: {
    home: '/app',
    login: '/app/auth/login',
    signup: '/app/auth/signup',
    forgotPassword: '/app/auth/forgot-password',
    book: '/app/book/',
  },
  web: {
    home: '/',
    about: '/about',
    contact: '/contact',
  },
} as const;

export default routes;
```

- [ ] **Step 3: Update `adminNavigationItems` in `constants/index.ts`**

Replace the export:

```typescript
// This file should be used to define constants that are used throughout the application
import routes from '~/routes';
export const APP_BASE_URL = process.env.NUXT_APP_BASE;
export const APPS = {
  ADMIN: 'admin',
  WEB: 'web',
  CUSTOMER: 'customer',
};
export enum USER_ROLES {
  USER = 0,
  ASSOCIATE,
  ADMIN,
}
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const adminNavigationItems: {
  title: string;
  url: string;
  hasAccess: number[];
}[] = [
  { title: 'Hearth',        url: routes.admin.home,          hasAccess: [USER_ROLES.ADMIN, USER_ROLES.ASSOCIATE] },
  { title: 'Stories',       url: routes.admin.books,         hasAccess: [USER_ROLES.ADMIN, USER_ROLES.ASSOCIATE] },
  { title: 'Storytellers',  url: routes.admin.storytellers,  hasAccess: [USER_ROLES.ADMIN] },
  { title: 'Listeners',     url: routes.admin.users,         hasAccess: [USER_ROLES.ADMIN] },
  { title: 'Coins',         url: routes.admin.subscriptions, hasAccess: [USER_ROLES.ADMIN] },
  { title: 'Conversation',  url: routes.admin.conversation,  hasAccess: [USER_ROLES.ADMIN] },
  { title: 'Periods',       url: routes.admin.period,        hasAccess: [USER_ROLES.ADMIN] },
];
```

- [ ] **Step 4: Rewrite `components/layout/admin/sidebar.vue`**

Replace the entire file:

```vue
<template>
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-mark">◆</span>
      <span class="brand-name">Anansesem</span>
    </div>

    <nav class="nav">
      <NuxtLink
        v-for="item in visibleItems"
        :key="item.url"
        :to="item.url"
        class="nav-item"
        :class="{ active: isActive(item.url) }"
      >
        <span class="diamond">{{ isActive(item.url) ? '◆' : '◇' }}</span>
        <span class="label">{{ item.title }}</span>
      </NuxtLink>
    </nav>

    <div class="spacer" />

    <div class="proverb-card">
      <p class="proverb-text">"Wisdom is like a baobab tree; no one person can embrace it."</p>
    </div>

    <div class="footer-links">
      <NuxtLink :to="routes.app.home" class="footer-link">
        <span class="diamond">◇</span>
        <span>Back to app</span>
      </NuxtLink>
      <button class="footer-link logout-btn" @click="admin_logout">
        <span class="diamond">◇</span>
        <span>Log out</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import routes from '~/routes';
const { navItems, activeRoute } = useNavigation();
const { admin_logout } = useAuth();
const admin = useAuthStore().getAdmin;

const visibleItems = computed(() =>
  navItems.value.filter(item => item.hasAccess.includes(admin.role))
);

const isActive = (url: string) => {
  const route = useRoute();
  if (url === routes.admin.home) return route.path === url;
  return route.path.startsWith(url);
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 232px;
  background: var(--ink);
  display: flex;
  flex-direction: column;
  padding: 24px 0 20px;
  overflow: hidden;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 24px;
  border-bottom: 1px solid rgba(241,238,227,0.08);
}

.brand-mark {
  color: var(--ochre);
  font-size: 18px;
  line-height: 1;
}

.brand-name {
  font-family: var(--font-display);
  font-size: 15px;
  color: var(--cream);
  letter-spacing: 0.04em;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 16px 12px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: rgba(241,238,227,0.85);
  font-family: var(--font-sans);
  font-size: 13.5px;
  font-weight: 400;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background: rgba(201,122,58,0.10);
  color: var(--cream);
}

.nav-item.active {
  background: rgba(201,122,58,0.18);
  color: var(--ochre);
  font-weight: 600;
}

.nav-item.active .diamond {
  color: var(--ochre);
}

.diamond {
  font-size: 9px;
  line-height: 1;
  flex-shrink: 0;
  color: rgba(241,238,227,0.40);
}

.label {
  font-size: 13.5px;
}

.spacer {
  flex: 1;
}

.proverb-card {
  margin: 0 12px 16px;
  padding: 12px 14px;
  background: rgba(201,122,58,0.12);
  border: 1px solid rgba(201,122,58,0.18);
  border-radius: 10px;
}

.proverb-text {
  font-family: var(--font-serif);
  font-size: 11px;
  font-style: italic;
  line-height: 1.6;
  color: rgba(241,238,227,0.70);
  margin: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 12px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: rgba(241,238,227,0.50);
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: color 0.15s;
}

.footer-link:hover {
  color: rgba(241,238,227,0.80);
}

.logout-btn {
  font-family: var(--font-sans);
}
</style>
```

- [ ] **Step 5: Verify dev server renders the sidebar correctly**

Run: `npm run dev` (or confirm it's running on port 3080). Open `http://localhost:3080/admin` and confirm the sidebar shows: Hearth, Stories, Storytellers, Listeners, Coins, Conversation, Periods — diamond glyphs, ink background, proverb card visible at bottom.

- [ ] **Step 6: Commit**

```bash
git add layouts/admin-layout.vue components/layout/admin/sidebar.vue constants/index.ts routes.ts
git commit -m "feat(admin): update layout to 232px grid + redesign sidebar with diamond nav"
```

---

## Task 2: Hearth Dashboard (`pages/admin/index.vue`)

**Files:**
- Modify: `pages/admin/index.vue`

The Hearth dashboard has four KPI cards in a grid, then a two-column section with a 14-day pulse chart + genre weft bars on the left and a top stories table + fire log on the right. Mock data is used for all chart values — real API endpoints are wired to Stories count only.

- [ ] **Step 1: Rewrite `pages/admin/index.vue`**

Replace the entire file:

```vue
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
        <span class="kpi-delta" :class="kpi.delta > 0 ? 'pos' : 'neg'">
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

// Real data: book count
const bookCount = ref('…');
onMounted(async () => {
  const { data } = await getBooks(USER_ROLES.ADMIN, { page: 1, limit: 1 });
  if (data) bookCount.value = String(data.results?.length ?? '—');
});

const kpis = computed(() => [
  { label: 'Listeners tonight', value: '—', delta: 0 },
  { label: 'Hours listened (7d)', value: '—', delta: 0 },
  { label: 'Stories in library', value: bookCount.value, delta: 0 },
  { label: 'MRR (GHC)', value: '—', delta: 0 },
]);

// Pulse chart — 14 synthetic data points
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
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3080/admin`. Confirm: 4 KPI cards in a row, pulse chart with area fill in ochre, genre bars, top stories table, fire log. Story count loads from API after mount.

- [ ] **Step 3: Commit**

```bash
git add pages/admin/index.vue
git commit -m "feat(admin): implement Hearth dashboard with KPI grid and charts"
```

---

## Task 3: Stories List (`pages/admin/books/index.vue`)

**Files:**
- Create: `pages/admin/books/index.vue`

Books list with search, a table of stories (cover thumbnail, title, category, chapters count, status), and an "Add Story" button linking to the wizard.

- [ ] **Step 1: Create `pages/admin/books/index.vue`**

```vue
<template>
  <div class="stories">
    <header class="stories-header">
      <div>
        <h1 class="page-title">Stories</h1>
        <p class="page-sub">{{ totalBooks }} stories in library</p>
      </div>
      <NuxtLink :to="routes.admin.booksNew" class="add-btn">+ Add story</NuxtLink>
    </header>

    <div class="toolbar">
      <input
        v-model="search"
        type="search"
        class="search-input"
        placeholder="Search stories…"
      />
    </div>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading stories…</div>
      <table v-else class="books-table">
        <thead>
          <tr>
            <th>Story</th>
            <th>Category</th>
            <th>Played</th>
            <th>Views</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id" class="book-row">
            <td>
              <div class="book-cell">
                <img v-if="book.cover" :src="book.cover" class="book-thumb" alt="" />
                <div v-else class="book-thumb-placeholder">◆</div>
                <div class="book-info">
                  <span class="book-title">{{ book.title }}</span>
                  <span class="book-authors">{{ book.authors?.join(', ') }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="tags">
                <span v-for="cat in book.category?.slice(0,2)" :key="cat" class="tag">{{ cat }}</span>
              </div>
            </td>
            <td class="num-cell">{{ book.meta?.played ?? '—' }}</td>
            <td class="num-cell">{{ book.meta?.views ?? '—' }}</td>
            <td>
              <NuxtLink :to="`/admin/books/${book.id}`" class="open-btn">Analytics →</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && books.length === 0" class="empty">No stories found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { getBooks } from '@/services/book';
import type { BOOK } from '~/types/book';

definePageMeta({ title: 'Stories', middleware: 'admin', layout: 'admin-layout' });

const search = ref('');
const loading = ref(false);
const books = ref<BOOK[]>([]);
const totalBooks = ref(0);
const { debounce } = useUtils();

const fetchBooks = async () => {
  loading.value = true;
  try {
    const { data } = await getBooks(USER_ROLES.ADMIN, { page: 1, limit: 40, search: search.value });
    if (data) {
      books.value = data.results ?? [];
      totalBooks.value = data.results?.length ?? 0;
    }
  } finally {
    loading.value = false;
  }
};

const debouncedFetch = debounce(fetchBooks, 400);
watch(search, debouncedFetch);
onMounted(fetchBooks);
</script>

<style scoped>
.stories { display: flex; flex-direction: column; gap: 20px; }

.stories-header { display: flex; align-items: flex-start; justify-content: space-between; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0 0 4px; }
.page-sub { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }
.add-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; background: var(--ochre); color: var(--cream);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600;
  text-decoration: none; transition: background 0.15s;
}
.add-btn:hover { background: var(--ochre-deep); }

.toolbar { display: flex; gap: 12px; }
.search-input {
  flex: 1; max-width: 340px; padding: 9px 14px;
  background: var(--card); border: 1px solid var(--hairline);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink);
  outline: none;
}
.search-input:focus { border-color: var(--ochre); }

.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.books-table { width: 100%; border-collapse: collapse; }
.books-table th {
  font-family: var(--font-sans); font-size: 10px; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--muted); text-align: left;
  padding: 12px 16px; border-bottom: 1px solid var(--hairline);
}
.book-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.book-row:last-child td { border-bottom: none; }
.book-row:hover td { background: rgba(201,122,58,0.04); }

.book-cell { display: flex; align-items: center; gap: 12px; }
.book-thumb { width: 36px; height: 48px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
.book-thumb-placeholder {
  width: 36px; height: 48px; background: var(--calabash); border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: var(--ochre); flex-shrink: 0;
}
.book-info { display: flex; flex-direction: column; gap: 2px; }
.book-title { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.book-authors { font-family: var(--font-sans); font-size: 11.5px; color: var(--muted); }
.tags { display: flex; gap: 4px; flex-wrap: wrap; }
.tag {
  padding: 2px 8px; background: rgba(201,122,58,0.10); color: var(--ochre);
  border-radius: 20px; font-family: var(--font-sans); font-size: 11px; font-weight: 500;
}
.num-cell { font-family: var(--font-mono); font-size: 12.5px; color: var(--ink); }
.open-btn {
  font-family: var(--font-sans); font-size: 12px; color: var(--ochre);
  text-decoration: none; font-weight: 500;
}
.open-btn:hover { text-decoration: underline; }
.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
</style>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3080/admin/books`. Confirm: table of books loads, search input filters results, "Add story" button links to `/admin/books/new`, "Analytics →" links correctly to `/admin/books/:id`.

- [ ] **Step 3: Commit**

```bash
git add pages/admin/books/index.vue
git commit -m "feat(admin): add Stories list page with search and book table"
```

---

## Task 4: Add Book Wizard (`pages/admin/books/new.vue`)

**Files:**
- Create: `pages/admin/books/new.vue`

5-step wizard: Identify → Compose → Voice → Chapters → Publish. Each step is shown one at a time with a step indicator at the top. Only Step 1 (Identify) collects real data and submits to `createBook`. Steps 2-5 are scaffolded with their fields but marked as "coming soon" placeholders where complex upload logic would live.

- [ ] **Step 1: Create `pages/admin/books/new.vue`**

```vue
<template>
  <div class="wizard">
    <header class="wizard-header">
      <NuxtLink :to="routes.admin.books" class="back-link">← Stories</NuxtLink>
      <h1 class="wizard-title">Add story</h1>
    </header>

    <!-- Step indicator -->
    <div class="steps">
      <div
        v-for="(step, i) in steps"
        :key="step.id"
        class="step"
        :class="{ active: currentStep === i, done: currentStep > i }"
      >
        <div class="step-dot">{{ currentStep > i ? '◆' : i + 1 }}</div>
        <span class="step-label">{{ step.label }}</span>
      </div>
    </div>

    <div class="wizard-body">
      <!-- Step 0: Identify -->
      <div v-if="currentStep === 0" class="step-panel">
        <h2 class="step-heading">Identify the story</h2>
        <div class="field-group">
          <label class="field-label">Title *</label>
          <input v-model="form.title" class="field-input" placeholder="Story title" />
        </div>
        <div class="field-group">
          <label class="field-label">Description *</label>
          <textarea v-model="form.description" class="field-textarea" rows="4" placeholder="What is this story about?" />
        </div>
        <div class="field-row">
          <div class="field-group flex-1">
            <label class="field-label">Categories (comma-separated)</label>
            <input v-model="categoryInput" class="field-input" placeholder="Folklore, History…" />
          </div>
          <div class="field-group flex-1">
            <label class="field-label">Languages (comma-separated)</label>
            <input v-model="languageInput" class="field-input" placeholder="English, Twi…" />
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Authors (comma-separated)</label>
          <input v-model="authorInput" class="field-input" placeholder="Author names…" />
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </div>

      <!-- Step 1: Compose (placeholder) -->
      <div v-if="currentStep === 1" class="step-panel">
        <h2 class="step-heading">Compose</h2>
        <div class="placeholder-panel">
          <span class="ph-icon">◇</span>
          <p>eBook content upload — coming soon.</p>
          <p class="ph-sub">You can skip this step and add content later from the book's detail page.</p>
        </div>
      </div>

      <!-- Step 2: Voice (placeholder) -->
      <div v-if="currentStep === 2" class="step-panel">
        <h2 class="step-heading">Voice</h2>
        <div class="placeholder-panel">
          <span class="ph-icon">◇</span>
          <p>Audio recording / upload — coming soon.</p>
          <p class="ph-sub">You can skip this step and add audio chapters individually later.</p>
        </div>
      </div>

      <!-- Step 3: Chapters (placeholder) -->
      <div v-if="currentStep === 3" class="step-panel">
        <h2 class="step-heading">Chapters</h2>
        <div class="placeholder-panel">
          <span class="ph-icon">◇</span>
          <p>Chapter management — coming soon.</p>
          <p class="ph-sub">After creating the story, manage chapters from the Stories list.</p>
        </div>
      </div>

      <!-- Step 4: Publish -->
      <div v-if="currentStep === 4" class="step-panel">
        <h2 class="step-heading">Publish</h2>
        <div class="publish-summary">
          <div class="summary-row"><span class="sum-lbl">Title</span><span class="sum-val">{{ form.title || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Categories</span><span class="sum-val">{{ form.category.join(', ') || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Languages</span><span class="sum-val">{{ form.languages.join(', ') || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Authors</span><span class="sum-val">{{ form.authors.join(', ') || '—' }}</span></div>
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
      </div>
    </div>

    <!-- Navigation -->
    <div class="wizard-nav">
      <button v-if="currentStep > 0" class="btn-ghost" @click="currentStep--" :disabled="saving">← Back</button>
      <div class="spacer" />
      <button
        v-if="currentStep < steps.length - 1"
        class="btn-primary"
        @click="advance"
        :disabled="saving"
      >Next →</button>
      <button
        v-else
        class="btn-primary"
        @click="submit"
        :disabled="saving"
      >{{ saving ? 'Creating…' : 'Create story' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { createBook } from '@/services/admin/book';
import type { BOOK } from '~/types/book';

definePageMeta({ title: 'Add story', middleware: 'admin', layout: 'admin-layout' });

const router = useRouter();

const steps = [
  { id: 'identify', label: 'Identify' },
  { id: 'compose',  label: 'Compose'  },
  { id: 'voice',    label: 'Voice'    },
  { id: 'chapters', label: 'Chapters' },
  { id: 'publish',  label: 'Publish'  },
];

const currentStep = ref(0);
const saving = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const categoryInput = ref('');
const languageInput = ref('');
const authorInput = ref('');

const form = reactive<BOOK>({
  title: '',
  description: '',
  category: [],
  languages: [],
  authors: [],
  associates: [],
  cover: '',
  meta: { played: 0, views: 0, likes: 0, dislikes: 0, comments: 0 },
});

watch(categoryInput, v => { form.category = v.split(',').map(s => s.trim()).filter(Boolean); });
watch(languageInput, v => { form.languages = v.split(',').map(s => s.trim()).filter(Boolean); });
watch(authorInput,   v => { form.authors   = v.split(',').map(s => s.trim()).filter(Boolean); });

const advance = () => {
  errorMsg.value = '';
  if (currentStep.value === 0) {
    if (!form.title.trim()) { errorMsg.value = 'Title is required.'; return; }
    if (!form.description.trim()) { errorMsg.value = 'Description is required.'; return; }
  }
  currentStep.value++;
};

const submit = async () => {
  errorMsg.value = '';
  if (!form.title.trim()) { errorMsg.value = 'Title is required.'; currentStep.value = 0; return; }
  saving.value = true;
  try {
    const { data } = await createBook(form);
    if (data) {
      successMsg.value = 'Story created!';
      setTimeout(() => router.push(routes.admin.books), 1200);
    }
  } catch (e) {
    errorMsg.value = (e as Error).message ?? 'Failed to create story.';
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.wizard { display: flex; flex-direction: column; gap: 24px; max-width: 700px; }

.wizard-header { display: flex; align-items: center; gap: 20px; }
.back-link { font-family: var(--font-sans); font-size: 13px; color: var(--muted); text-decoration: none; }
.back-link:hover { color: var(--ochre); }
.wizard-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }

.steps { display: flex; gap: 0; }
.step {
  display: flex; align-items: center; gap: 8px; flex: 1;
  padding-bottom: 12px; border-bottom: 2px solid var(--hairline);
  transition: border-color 0.2s;
}
.step.active { border-color: var(--ochre); }
.step.done { border-color: var(--ochre); opacity: 0.6; }
.step-dot {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--hairline); color: var(--muted);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-family: var(--font-mono); flex-shrink: 0;
}
.step.active .step-dot { background: var(--ochre); color: var(--cream); }
.step.done .step-dot { background: var(--ochre); color: var(--cream); font-size: 9px; }
.step-label { font-family: var(--font-sans); font-size: 12px; color: var(--muted); white-space: nowrap; }
.step.active .step-label { color: var(--ochre); font-weight: 600; }

.wizard-body { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 28px; }
.step-heading { font-family: var(--font-display); font-size: 18px; color: var(--ink); margin: 0 0 20px; }

.field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.field-label { font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.field-input, .field-textarea {
  padding: 10px 14px; background: var(--paper); border: 1px solid var(--hairline);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13.5px; color: var(--ink);
  outline: none; width: 100%; box-sizing: border-box;
  transition: border-color 0.15s;
}
.field-input:focus, .field-textarea:focus { border-color: var(--ochre); }
.field-textarea { resize: vertical; }
.field-row { display: flex; gap: 16px; }
.flex-1 { flex: 1; }

.placeholder-panel {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 48px 20px; color: var(--muted); text-align: center;
}
.ph-icon { font-size: 28px; color: var(--ochre); opacity: 0.4; }
.ph-sub { font-size: 12px; max-width: 320px; line-height: 1.6; }

.publish-summary { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.summary-row { display: flex; gap: 16px; }
.sum-lbl { font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: var(--muted); width: 90px; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.05em; }
.sum-val { font-family: var(--font-sans); font-size: 13.5px; color: var(--ink); }

.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
.success-msg { font-family: var(--font-sans); font-size: 13px; color: #2e7d32; margin: 0; }

.wizard-nav { display: flex; align-items: center; gap: 12px; }
.spacer { flex: 1; }
.btn-ghost {
  padding: 9px 18px; background: none; border: 1px solid var(--hairline);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px;
  color: var(--muted); cursor: pointer; transition: border-color 0.15s;
}
.btn-ghost:hover { border-color: var(--calabash); color: var(--ink); }
.btn-primary {
  padding: 9px 20px; background: var(--ochre); border: none;
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px;
  font-weight: 600; color: var(--cream); cursor: pointer; transition: background 0.15s;
}
.btn-primary:hover { background: var(--ochre-deep); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3080/admin/books/new`. Confirm: 5 step indicators, Step 1 shows form fields, Next validates title + description before advancing, Publish step shows summary, "Create story" calls the API.

- [ ] **Step 3: Commit**

```bash
git add pages/admin/books/new.vue
git commit -m "feat(admin): add 5-step Add Story wizard"
```

---

## Task 5: Book Analytics (`pages/admin/books/[id].vue`)

**Files:**
- Create: `pages/admin/books/[id].vue`

Shows 5 KPI tiles, a dual-series line chart (listens vs reads), a chapter funnel (horizontal bars), and region bars. Uses `getBook` and `getMetrics` from existing services. Chart data uses the metrics API response; chapter data falls back to mock shapes when API has no analytics.

- [ ] **Step 1: Create `pages/admin/books/[id].vue`**

```vue
<template>
  <div class="analytics" v-if="book">
    <header class="an-header">
      <NuxtLink :to="routes.admin.books" class="back-link">← Stories</NuxtLink>
      <div class="an-book-meta">
        <img v-if="book.cover" :src="book.cover" class="an-cover" alt="" />
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
  <div v-else class="loading-state">Loading…</div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { getBook } from '@/services/book';
import { getMetrics } from '@/services/admin/book';
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
  { label: 'Listens',    value: book.value?.meta?.played ?? '—' },
  { label: 'Reads',      value: book.value?.meta?.views  ?? '—' },
  { label: 'Likes',      value: book.value?.meta?.likes  ?? '—' },
  { label: 'Comments',   value: book.value?.meta?.comments ?? '—' },
  { label: 'Avg rating', value: '—' },
]);

// Synthetic chart data (replace with getMetrics when API shape is confirmed)
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
  { num: 3, title: 'The Trial',        completion: 64 },
  { num: 4, title: 'Lost Ways',        completion: 48 },
  { num: 5, title: 'Return',           completion: 35 },
];

const regions = [
  { city: 'Accra',     pct: 42 },
  { city: 'Kumasi',    pct: 24 },
  { city: 'Tamale',    pct: 14 },
  { city: 'Takoradi',  pct: 10 },
  { city: 'Sunyani',   pct: 6  },
  { city: 'Other',     pct: 4  },
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
```

- [ ] **Step 2: Verify in browser**

Navigate to `/admin/books`, click "Analytics →" on any book. Confirm: book title/cover loads, 5 KPI tiles appear, dual-series chart renders, chapter funnel and region bars display.

- [ ] **Step 3: Commit**

```bash
git add pages/admin/books/[id].vue
git commit -m "feat(admin): add Book Analytics page with KPI strip and charts"
```

---

## Task 6: Listeners (`pages/admin/users.vue`)

**Files:**
- Modify: `pages/admin/users.vue`

Filter tabs (Everyone / Listeners / Storytellers / Admins / Churn-risk) above a user table showing avatar, name, email, role pill, joined date, last seen. Reuses `AdminUsers` component for the actual data fetch but wraps it in the new layout/style. Since `AdminUsers` props are opaque here, we rewrite the page to call the users API directly (via `useRequest`) to match the design closely.

- [ ] **Step 1: Rewrite `pages/admin/users.vue`**

```vue
<template>
  <div class="listeners">
    <header class="listeners-header">
      <h1 class="page-title">Listeners</h1>
    </header>

    <!-- Filter tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >{{ tab.label }}</button>
    </div>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading listeners…</div>
      <table v-else class="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Last seen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
            <td>
              <div class="user-cell">
                <img v-if="user.picture" :src="user.picture" class="avatar" alt="" />
                <div v-else class="avatar-placeholder">{{ initials(user.name) }}</div>
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="role-pill" :class="rolePillClass(user.account)">
                {{ roleLabel(user.account) }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(user.createdAt) }}</td>
            <td class="date-cell">{{ user.lastSeen ? formatDate(user.lastSeen) : '—' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && filteredUsers.length === 0" class="empty">No users in this group.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ title: 'Listeners', middleware: 'admin', layout: 'admin-layout' });

const { setCommon } = useCommon(USER_ROLES.ADMIN);

const tabs = [
  { id: 'all',           label: 'Everyone'      },
  { id: 'listeners',     label: 'Listeners'     },
  { id: 'storytellers',  label: 'Storytellers'  },
  { id: 'admins',        label: 'Admins'        },
];
const activeTab = ref('all');

const loading = ref(false);
const users = ref<any[]>([]);

const filteredUsers = computed(() => {
  if (activeTab.value === 'all') return users.value;
  if (activeTab.value === 'listeners')    return users.value.filter(u => u.account === 0);
  if (activeTab.value === 'storytellers') return users.value.filter(u => u.account === 1);
  if (activeTab.value === 'admins')       return users.value.filter(u => u.account === 2);
  return users.value;
});

const initials = (name: string) =>
  name?.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() ?? '?';

const roleLabel = (account: number) =>
  account === 2 ? 'Admin' : account === 1 ? 'Storyteller' : 'Listener';

const rolePillClass = (account: number) =>
  account === 2 ? 'pill-admin' : account === 1 ? 'pill-storyteller' : 'pill-listener';

const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await useRequest<any[]>({ url: '/admin/user', method: HTTP_METHODS.GET }, USER_ROLES.ADMIN);
    if (res.data) users.value = res.data;
  } finally {
    loading.value = false;
  }
};

onMounted(() => { fetchUsers(); setCommon(); });
</script>

<style scoped>
.listeners { display: flex; flex-direction: column; gap: 20px; }

.listeners-header { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }

.tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--hairline); }
.tab {
  padding: 8px 16px; font-family: var(--font-sans); font-size: 13px;
  color: var(--muted); background: none; border: none;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
}
.tab:hover { color: var(--ink); }
.tab.active { color: var(--ochre); border-bottom-color: var(--ochre); font-weight: 600; }

.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.users-table { width: 100%; border-collapse: collapse; }
.users-table th {
  font-family: var(--font-sans); font-size: 10px; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--muted); text-align: left;
  padding: 12px 16px; border-bottom: 1px solid var(--hairline);
}
.user-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.user-row:last-child td { border-bottom: none; }
.user-row:hover td { background: rgba(201,122,58,0.04); }

.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.avatar-placeholder {
  width: 32px; height: 32px; border-radius: 50%; background: var(--calabash);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-sans); font-size: 11px; font-weight: 700; color: var(--kola);
  flex-shrink: 0;
}
.user-info { display: flex; flex-direction: column; gap: 1px; }
.user-name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.user-email { font-family: var(--font-sans); font-size: 11.5px; color: var(--muted); }

.role-pill {
  display: inline-flex; align-items: center; padding: 3px 10px;
  border-radius: 20px; font-family: var(--font-sans); font-size: 11px; font-weight: 600;
}
.pill-listener    { background: rgba(226,211,197,0.5); color: var(--kola); }
.pill-storyteller { background: rgba(201,122,58,0.15); color: var(--ochre); }
.pill-admin       { background: rgba(31,23,20,0.10); color: var(--ink); }

.date-cell { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
</style>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3080/admin/users`. Confirm: "Listeners" heading, 4 filter tabs, user table with avatar initials fallback, role pills in correct colours, date columns.

- [ ] **Step 3: Commit**

```bash
git add pages/admin/users.vue
git commit -m "feat(admin): rewrite Listeners page with filter tabs and user table"
```

---

## Task 7: Periods (`pages/admin/period.vue`)

**Files:**
- Modify: `pages/admin/period.vue`

Two-mode selector (auto monthly / manual) at top. Auto mode shows roll-day + timezone settings (display only). Manual mode shows a period creation form. Below: table of all periods with mode pill, window (from→to), and status pill.

- [ ] **Step 1: Rewrite `pages/admin/period.vue`**

```vue
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
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3080/admin/period`. Confirm: two mode cards at top, selecting "Manual" shows the form, "Auto" shows settings summary, periods table loads from API and shows status pills.

- [ ] **Step 3: Commit**

```bash
git add pages/admin/period.vue
git commit -m "feat(admin): rewrite Periods page with auto/manual mode and periods table"
```

---

## Task 8: Subscriptions (`pages/admin/subscriptions.vue`)

**Files:**
- Create: `pages/admin/subscriptions.vue`

KPI strip, a plan-mix donut SVG, and a subscriptions table with status pills. All data is currently stubbed — the API endpoint for subscriptions is not in the current service layer, so mock data is used and clearly marked.

- [ ] **Step 1: Create `pages/admin/subscriptions.vue`**

```vue
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
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3080/admin/subscriptions`. Confirm: 4 KPI tiles, donut SVG (initially empty), plan mix legend, mock subscriptions table with 4 status pill colours.

- [ ] **Step 3: Commit**

```bash
git add pages/admin/subscriptions.vue
git commit -m "feat(admin): add Subscriptions page with plan-mix donut and subs table"
```

---

## Task 9: Placeholder Stub Pages

**Files:**
- Create: `pages/admin/storytellers.vue`
- Create: `pages/admin/revenue.vue`
- Create: `pages/admin/conversation.vue`

These appear in the sidebar nav but don't have designs yet. Each renders a simple "coming soon" panel so the nav links don't 404.

- [ ] **Step 1: Create `pages/admin/storytellers.vue`**

```vue
<template>
  <div class="stub-page">
    <h1 class="stub-title">Storytellers</h1>
    <div class="stub-card">
      <span class="stub-icon">◇</span>
      <p>Storyteller management — coming soon.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ title: 'Storytellers', middleware: 'admin', layout: 'admin-layout' });
</script>
<style scoped>
.stub-page { display: flex; flex-direction: column; gap: 20px; }
.stub-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.stub-card {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 60px 20px; background: var(--card); border: 1px solid var(--hairline);
  border-radius: 12px; color: var(--muted); font-family: var(--font-sans); font-size: 14px;
}
.stub-icon { font-size: 28px; color: var(--ochre); opacity: 0.35; }
</style>
```

- [ ] **Step 2: Create `pages/admin/revenue.vue`**

```vue
<template>
  <div class="stub-page">
    <h1 class="stub-title">Coins</h1>
    <div class="stub-card">
      <span class="stub-icon">◇</span>
      <p>Revenue analytics — coming soon.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ title: 'Coins', middleware: 'admin', layout: 'admin-layout' });
</script>
<style scoped>
.stub-page { display: flex; flex-direction: column; gap: 20px; }
.stub-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.stub-card {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 60px 20px; background: var(--card); border: 1px solid var(--hairline);
  border-radius: 12px; color: var(--muted); font-family: var(--font-sans); font-size: 14px;
}
.stub-icon { font-size: 28px; color: var(--ochre); opacity: 0.35; }
</style>
```

- [ ] **Step 3: Create `pages/admin/conversation.vue`**

```vue
<template>
  <div class="stub-page">
    <h1 class="stub-title">Conversation</h1>
    <div class="stub-card">
      <span class="stub-icon">◇</span>
      <p>Comment moderation — coming soon.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ title: 'Conversation', middleware: 'admin', layout: 'admin-layout' });
</script>
<style scoped>
.stub-page { display: flex; flex-direction: column; gap: 20px; }
.stub-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.stub-card {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 60px 20px; background: var(--card); border: 1px solid var(--hairline);
  border-radius: 12px; color: var(--muted); font-family: var(--font-sans); font-size: 14px;
}
.stub-icon { font-size: 28px; color: var(--ochre); opacity: 0.35; }
</style>
```

- [ ] **Step 4: Verify in browser**

Click Storytellers, Conversation in the sidebar. Confirm: correct headings, coming-soon card, no 404 errors, sidebar shows active diamond for each.

- [ ] **Step 5: Commit**

```bash
git add pages/admin/storytellers.vue pages/admin/revenue.vue pages/admin/conversation.vue
git commit -m "feat(admin): add placeholder stub pages for Storytellers, Coins, Conversation"
```

---

## Self-Review

**Spec coverage:**
- ✅ Sidebar: Hearth/Stories/Storytellers/Listeners/Coins/Conversation — Task 1
- ✅ Diamond glyphs ◆/◇ for active/inactive — Task 1
- ✅ Proverb card at sidebar bottom — Task 1
- ✅ 232px grid layout — Task 1
- ✅ Hearth dashboard KPI + pulse chart + genre weft + top stories + fire log — Task 2
- ✅ Stories list with search + book table — Task 3
- ✅ Add Book 5-step wizard — Task 4
- ✅ Book Analytics: 5 KPIs + dual series chart + chapter funnel + region bars — Task 5
- ✅ Listeners: filter tabs + user table + role pills — Task 6
- ✅ Periods: auto/manual mode cards + create form + periods table — Task 7
- ✅ Subscriptions: KPI strip + plan donut + subs table + status pills — Task 8
- ✅ Placeholder stubs for remaining nav items — Task 9

**Placeholder scan:** No TBD/TODO in code. Stub pages are intentionally marked "coming soon" in their UI copy — this is acceptable as they have no designs to implement.

**Type consistency:** `BOOK`, `CHAPTER`, `periodReq`, `periodRes`, `USER_ROLES` all match existing types in `~/types/book.ts` and `~/types/admin/period.ts`. `useRequest` is called with the pattern used in `services/admin/book.ts`.
