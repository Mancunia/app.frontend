# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development commands
- Install deps: `yarn install`
- Run dev server: `yarn dev`
  - Nuxt is configured to run on `0.0.0.0:3080` in `nuxt.config.ts` (README still mentions 3000).
- Build production bundle: `yarn build`
- Preview production build: `yarn preview`
- Generate static output: `yarn generate`
- Rebuild Nuxt types/prep hooks after install changes: `yarn postinstall` (runs `nuxt prepare`)

### Linting and tests
- There is currently no lint script in `package.json`.
- There is currently no configured test script or test runner config (`vitest/jest/playwright` configs are absent).
- Before adding/assuming test commands, check available scripts with `yarn run`.

## High-level architecture
This is a Nuxt 3 SPA (SSR disabled) with two product surfaces in one frontend:
- Consumer app under `pages/app/**`
- Admin app under `pages/admin/**`

### Routing, layouts, and access control
- Root route redirects to `/app` via `nuxt.config.ts` route rules.
- Route constants are centralized in `routes.ts`; use these instead of hardcoded paths when possible.
- Access control is middleware-driven:
  - `middleware/app.ts` protects consumer pages using `useAuthStore().getUser.token`.
  - `middleware/admin.ts` protects admin pages using `useAuthStore().getAdmin.token` and role-based checks from `useNavigation()`.
- Primary layouts:
  - `layouts/app-layout.vue`: consumer shell (nav, mobile navigator, player drawer).
  - `layouts/admin-layout.vue`: admin sidebar + content area.

### State and data flow
- Global state lives in `stores/index.ts` (Pinia + `useLocalStorage`), including:
  - user/admin auth payloads
  - player state and queue
  - shared metadata caches (languages, categories, quotes)
- API access is funneled through `composables/useRequest.ts`:
  - base URL from `runtimeConfig.public.apiBase`
  - bearer token injected from store based on `USER_ROLES`
  - shared error handling via `useHandleError`
- Service modules map backend endpoints by domain:
  - consumer/general: `services/book.ts`, `services/common.ts`, `services/auth.ts`, etc.
  - admin: `services/admin/*.ts`

### Domain patterns worth knowing
- `USER_ROLES` is numeric (`USER=0`, `ASSOCIATE=1`, `ADMIN=2`) in `constants/index.ts`; many service calls branch behavior on this.
- Book/chapter objects may carry either `id` or `_id`; pages often handle both (important when editing/deleting).
- Metadata bootstrap pattern is centralized in `useCommon` (`setCommon()` loads categories/languages/quotes and hydrates store).
- Playback is centralized in `usePlayer`:
  - supports audio + PDF chapter flows
  - maintains queue/queueIndex via Pinia
  - coordinates player drawer UI in app layout
- Admin book management (`pages/admin/books/[id].vue`) combines:
  - metadata fetches (authors/narrators/genres/languages/categories/orgs/periods)
  - chapter CRUD
  - signed-upload flow for media/cover updates

## Existing project docs to consult
- `README.md` contains baseline Nuxt run/build commands.
- `docs/UNEXECUTED_PLANS.md` tracks known feature gaps/tech debt and is useful context before implementing new work.
