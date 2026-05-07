# Screen Redesign — Akan-Themed UI — Full App

## Goal

Apply the Anansesemfie Akan-themed design system across every page and shared component — consumer and admin alike. Every screen the user or administrator sees must feel like it belongs to the same fire-warm, Akan-rooted world.

## Design Principles

- **Tokens only:** every colour, font, and spacing value in `<style>` blocks must use a CSS custom property from `assets/css/main.css`. Zero hardcoded hex, zero CSS named colours (`black`, `white`, `grey`, etc.), zero inline font strings.
- **Dark-over-fire surfaces:** auth pages, the player/reader panel, and modal overlays use `data-dark="true"` — ink background, cream text, fire motes. The `AseFireMotes` component exists for this.
- **Paper-warm surfaces:** all content pages use `var(--paper)` background.
- **Responsive breakpoint:** `min-width: 750px` (existing convention). Mobile-first.
- **Existing Ase components:** `AseKenteWeft`, `AseFireMotes`, `AseAnansiMark`, `AseAdinkraGlyph`, `AseFireCircle`, `AseRoundBtn` already exist in `components/ui/`. Use them — do not recreate.

---

## Architecture

```
layouts/
  default.vue                    — root layout (landing page wrapper)
  app-layout.vue                 — main consumer shell (content 70% | panel 30%)
  app/auth.vue                   — dark firelit auth wrapper

components/layout/app/
  navBar.vue                     — reskin: Anansi mark + wordmark + nav links + avatar

components/ui/
  app/navigator.vue              — reskin: bottom tab bar with SVG icons + text labels
  app/book.vue                   — reskin: book card with serif typography
  app/chapter.vue                — reskin: chapter row with token-compliant bg + styled button
  app/comment.vue                — reskin: comment with token colours
  app/searchItem.vue             — already tokenised in rollout; verify only
  app/category.vue               — already tokenised in rollout; verify only
  app/subscription.vue           — already tokenised in rollout; verify only
  app/loaders/book.vue           — verify token compliance
  app/player/index.vue           — reskin: mini transport widget (image icons → inline SVG/text)
  app/player/audioPlayer.vue     — full redesign (dark panel, cover art, weft, transport)
  app/player/ebookViewer.vue     — full redesign (dark header/footer, light reading body)
  tab.vue                        — reskin: active state uses kola, font tokens
  select.vue                     — fix: rgb(165,161,161) → var(--calabash)
  selectDropDown.vue             — fix: rgb(165,161,161) → var(--calabash)
  loader.vue                     — fix: default color JS prop → 'var(--cream)'
  skeletonLoader.vue             — already token-compliant; verify only
  password.vue                   — already tokenised in rollout; verify only
  uploadPicture.vue              — add font/colour tokens to label

pages/app/
  auth/login.vue                 — dark firelit login form
  auth/signup.vue                — dark firelit signup form
  auth/forgot-password.vue       — dark firelit forgot-password form
  index.vue                      — greeting + book grid (hearth card mobile-only)
  book/[id]/index.vue            — cover hero + meta + chapter list
  library.vue                    — liked-books grid with section heading
  search.vue                     — search bar + filter chips + results grid
  profile.vue                    — profile card + settings links + logout
  subscription.vue               — subscription reference form + plan cards

pages/callback/
  resetPassword.vue              — already tokenised in rollout; verify only
  verify.vue                     — success/error state with Fireworks component
  subscribe.vue                  — success/error state with Fireworks component

pages/
  index.vue                      — root landing page
```

---

## Layout Shell (`layouts/app-layout.vue`)

**Mobile:** single column, paper background. Content fills viewport. Player panel is off-screen right (`transform: translateX(96%)`), slides fully in on chapter play. Bottom navigator sits at the bottom of the content column.

**Desktop (≥750px):** Two columns. Content = `flex: 1` (~70%). Player/reader panel = `width: 30%`, `height: 100vh`, `position: sticky`, `top: 0`. No overlay, always visible.

Specific changes:
- `.page` background: `var(--paper)` (keep)
- `.container` desktop: `flex-direction: row`, `align-items: stretch`, `height: 100vh`
- `.content` desktop: `flex: 1`, `overflow-y: auto`, `height: 100vh`
- `.player` desktop: `width: 30%`, `height: 100vh`, `position: sticky`, `top: 0`, `border-radius: 0`, `transform: none`, `background: var(--ink)`, `data-dark="true"` on element
- `.player` mobile: keep slide-in, set `background: var(--ink)`, add `data-dark="true"` attribute

---

## Default Layout (`layouts/default.vue`)

Currently just a blank slot. Apply `var(--paper)` background and the same navbar so the root landing page feels consistent.

---

## Auth Layout (`layouts/app/auth.vue`)

Replace the bookshelf image approach with a dark firelit full-screen.

- Root element: `<div class="auth-shell" data-dark="true">` — `data-dark` propagates token overrides to all slotted content
- `background: var(--ink)`, `height: 100vh`, `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`, `position: relative`, `overflow: hidden`
- Fire motes: `<AseFireMotes :count="12" />` absolutely positioned inside the shell
- Logo area above slot: `<AseAnansiMark :size="36" color="var(--cream)" />` + `anansesemfie` wordmark (`var(--font-display)`, `var(--ochre)`, `1.4rem`)
- Slot (form area): `max-width: 360px`, `width: 100%`, `background: rgba(255,255,255,0.04)`, `border: 1px solid var(--hairline)`, `border-radius: var(--d-radius)`, `padding: var(--d-pad)`
- Remove `sideImage` and `bookShelve.png` entirely

---

## Navbar (`components/layout/app/navBar.vue`)

**All breakpoints:**
- Left: `<AseAnansiMark :size="24" color="var(--kola)" />` + `anansesemfie` wordmark (`var(--font-display)`, `var(--kola)`, `0.9rem`)
- Right: avatar image (circular, `border: 2px solid var(--ochre)`, `border-radius: 50%`)
- Navbar background: `var(--paper)`, `border-bottom: 1px solid var(--hairline)`

**Desktop only (≥750px):** Centre nav links between mark and avatar:
- Links: Home (`/app`), Library (`/app/library`), Search (`/app/search`)
- Font: `var(--font-sans)`, `var(--muted)` default, `var(--kola)` + `font-weight: 600` when active
- Active detection: `useNavigation()` composable → `activeRoute`
- Hidden on mobile: `display: none` below 750px

---

## Bottom Navigator (`components/ui/app/navigator.vue`)

Replace image-based icons with inline SVG + text labels.

**Layout:** `display: flex`, `justify-content: space-around`, `align-items: center`, `background: var(--ink)`, `border-radius: 33px`, `padding: 10px 0`, `width: 345px`

**Each tab item** (wrapper `<div class="tab-item">`):
- Icon: inline SVG, 22px
- Label: `var(--font-sans)`, `font-size: 0.625rem`, `letter-spacing: 0.06em`, `text-transform: uppercase`
- Inactive: `color: var(--cream)`, `opacity: 0.5`
- Active: `color: var(--ochre)`, `opacity: 1`

**Icons (inline SVG, no image files):**
- Home: house outline
- Search: magnifying glass circle
- Library: open book
- Profile: person silhouette — if `user.dp` set, show avatar image at 24px with `border-radius: 50%`

**Desktop (≥750px):** `display: none` — nav is handled by the navbar links.

---

## Book Card (`components/ui/app/book.vue`)

**Visual redesign:**
- `.story-item`: no fixed width, fill grid cell
- `.story-thumbnail`: `width: 100%`, `aspect-ratio: 3/4`, `height: auto`, `border-radius: var(--d-radius)`, `overflow: hidden`, `box-shadow: 0 4px 14px var(--hairline)`
- `.story-thumbnail img`: `width: 100%`, `height: 100%`, `object-fit: cover`, hover `transform: scale(1.04)` with `transition: 0.3s`
- `.story-title`: `font-family: var(--font-serif)`, `font-weight: 600`, `font-size: 0.85rem`, `color: var(--ink)`, `margin-top: 6px`, text truncate one line
- `.writer`: `font-family: var(--font-serif)`, `font-style: italic`, `font-size: 0.75rem`, `color: var(--muted)`

---

## Chapter Row (`components/ui/app/chapter.vue`)

**Fix violations:**
- `.chapter`: `background-color: rgba(210,209,209,0.14)` → `background: var(--hairline)` — or better `background: var(--card)`, `border: 1px solid var(--hairline)`

**Reskin:**
- `.cover img`: `border-radius: 8px`
- `.description h3`: `font-family: var(--font-serif)`, `font-weight: 600`, `color: var(--ink)`
- `.description button`: keep `background: var(--ink)`, `color: var(--cream)`, add `font-family: var(--font-display)`, `font-size: 0.85rem`, `border-radius: 20px`, `padding: 4px 14px`
- Type label chip: for `chapter.type === 'ebook'`, add a small `📖 Ebook` pill (`background: var(--calabash)`, `font-family: var(--font-mono)`, `font-size: 0.65rem`) — and for audio, a `🎤 Audio` pill

---

## Select & SelectDropDown (`components/ui/select.vue`, `components/ui/selectDropDown.vue`)

**Fix violations:**
- `.item { background-color: rgb(165,161,161) }` → `background: var(--calabash)`, `color: var(--ink)`

**Reskin:**
- `.select-btn`: `border: 1px solid var(--hairline)`, `border-radius: var(--d-radius)`, `font-family: var(--font-sans)`
- `.options`: `border: 1px solid var(--hairline)`, remove `box-shadow: 0 0 10px rgba(0,0,0,0.1)` → `box-shadow: 0 4px 16px var(--hairline)`
- `.option:hover`: `background: var(--calabash)`
- `.option-text`: `font-family: var(--font-sans)`, `color: var(--ink)`

---

## Tab (`components/ui/tab.vue`)

**Reskin:**
- `.tab`: `font-family: var(--font-display)`, `font-size: 0.85rem`, `color: var(--muted)`, `background: transparent`, `border-bottom: 2px solid transparent`, `padding: 6px 14px`
- `.tab.active`: `color: var(--kola)`, `border-bottom-color: var(--kola)`, `background: transparent`
- `.tab-content`: `border: none`, `border-top: 1px solid var(--hairline)`

---

## Loader (`components/ui/loader.vue`)

**Fix:** the JS prop default `default:{color:'white'}` passes a hardcoded string to the SVG `stroke` attribute. Change to `default: { color: 'var(--cream)' }`.

---

## Upload Picture (`components/ui/uploadPicture.vue`)

No `<style>` block currently. Add:
```css
.file label {
  font-family: var(--font-sans);
  color: var(--kola);
  cursor: pointer;
  border: 1px dashed var(--hairline);
  border-radius: var(--d-radius);
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.file label:hover { background: var(--calabash); }
.file input { display: none; }
```

---

## Player Mini Widget (`components/ui/app/player/index.vue`)

This component renders inside `audioPlayer.vue`. It shows a mini horizontal transport strip on mobile and a compact widget embedded in the audio player on desktop.

**Fix violations:**
- `.book-art { background: lightgray … }` → `background: var(--calabash)`
- `.rectangleParent { background: var(--kola) }` — keep (intentional brand colour)

**Reskin image buttons → token-styled buttons:**
- Replace `<img src="@/assets/images/player/previous.png" />` etc. with Unicode or inline SVG glyphs inside styled `<button>` elements
- Button style: `background: none`, `border: none`, `color: var(--cream)`, `font-size: 1.2rem`, `cursor: pointer`
- Play button: `background: var(--ochre)`, `color: var(--ink)`, `border-radius: 50%`, `width: 40px`, `height: 40px`
- `.rectangleParent`: `background: var(--ink)` (change from `var(--kola)` — dark is more consistent with the panel), `border-radius: 20px`

---

## Audio Player (`components/ui/app/player/audioPlayer.vue`)

Full redesign. The panel is dark ink, `data-dark="true"` inherited from parent.

**Structure (top to bottom):**
1. `<div class="eyebrow">Now playing</div>` — `var(--font-sans)`, 0.55rem, `letter-spacing: 0.14em`, `text-transform: uppercase`, `opacity: 0.5`, `color: var(--cream)`
2. Mode toggle pill: `[🎤 Audio] [📖 Read]` — display-only, active tab reflects `store.getPlaying.type`. No click handler needed.
3. Cover art: `border-radius: 12px`, `box-shadow: 0 12px 36px rgba(0,0,0,0.5)`, centred, `width: 120px`, `height: 160px`
4. `<AseFireMotes :count="6" />` at low opacity (0.15) for ambience
5. Meta pills row: rating (★), language (🌐), chapter (📖) — `var(--font-mono)`, `var(--ochre)` icon, `var(--cream)` value, `opacity: 0.7`
6. Title: `var(--font-display)`, centred, `var(--cream)`, `line-height: 1.05`
7. Author: `var(--font-serif)`, `font-style: italic`, centred, `opacity: 0.6`, `var(--cream)`
8. `<AseKenteWeft :progress="currentTime / duration" :height="9" />` with Adinkra bookmark marker (✦ in `var(--ochre)`) at saved position
9. Time row: `var(--font-mono)`, elapsed / remaining, `opacity: 0.6`, `color: var(--cream)`
10. Transport controls: bookmark (✦), skip-back (⏮), play/pause, skip-forward (⏭), comment (💬)
    - Regular buttons: `background: rgba(255,255,255,0.06)`, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 50%`, `color: var(--cream)`
    - Play/pause: `background: var(--ochre)`, `color: var(--ink)`, `width: 48px`, `height: 48px`, `border-radius: 50%`
11. Ghost row: speed (1.0×), Chapters, Sleep — `var(--font-mono)`, `opacity: 0.5`, `color: var(--cream)`

Wire all values to existing `usePlayer()` composable — no logic changes.

---

## Ebook Viewer (`components/ui/app/player/ebookViewer.vue`)

Replaces the audio player in the same 30%-wide dark panel when `store.getPlaying.type === 'ebook'`.

**Remove:** `box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37)` (hardcoded blue tint). No replacement — the panel handles container styling.

**Remove:** `font-family: Arial, sans-serif` — replace with `var(--font-serif)`.

**Structure:**
1. Header bar (`background: rgba(255,255,255,0.06)`, `border-bottom: 1px solid rgba(255,255,255,0.08)`, `padding: 8px 12px`):
   - Book title truncated: `var(--font-serif)`, `var(--cream)`, `0.85rem`, `font-weight: 600`
   - Chapter name: `var(--font-sans)`, `opacity: 0.5`, `0.75rem`
   - Page indicator: `p. {currentPage} / {totalPages}` — `var(--font-mono)`, `var(--ochre)`, `0.8rem`
2. Reader body (`flex: 1`, `overflow-y: auto`, `background: var(--paper)`, `padding: 14px`):
   - `font-family: var(--font-serif)`, `:style="{ fontSize: fontSize + 'rem' }"` (default `1`), `line-height: 1.75`, `color: var(--ink-soft)`
   - Drop cap: `p:first-of-type::first-letter` → `var(--font-display)`, `font-size: 3em`, `float: left`, `color: var(--kola)`
3. Footer bar (`background: rgba(255,255,255,0.04)`, `border-top: 1px solid rgba(255,255,255,0.08)`, `padding: 8px 12px`):
   - `<AseKenteWeft :progress="currentPage / totalPages" :height="5" />`
   - Prev / Next page buttons: `background: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 50%`, `color: var(--cream)`
   - Font size controls: A− / A+ buttons, `const fontSize = ref(1)`, min `0.8`, max `1.4`, step `0.1`
   - Bookmark (✦) + comment (💬) action buttons

**Total pages:** `pdfFile.value?.pages?.length ?? 0` — expose as computed `totalPages`.

---

## Auth Pages (Login, Signup, Forgot Password)

All three use layout `app-auth` which wraps them in the dark firelit layout.

**Login (`pages/app/auth/login.vue`):**
- `<h2>` heading: `var(--font-display)`, `var(--cream)`, centred
- Inputs (`UiAdminInputField`): keep existing component, add `appAuthInput` class
- Submit button (`UiAdminButton`): accent variant or default kola — readable on dark bg
- "SignUp" / "Forgot Password" links: `color: var(--ochre)`, `var(--font-sans)`, `text-decoration: none`, remove `text-transform: uppercase`
- Remove hardcoded `padding: 40% 20%` on form — replace with `gap: 16px`, centred

**Signup and Forgot Password:** same treatment.

---

## Home Page (`pages/app/index.vue`)

**Greeting bar:**
```html
<div class="greeting">
  <p class="greeting-eyebrow">Tonight's storyteller</p>
  <h1 class="greeting-headline">The fire is lit. Sit by it.</h1>
  <p class="greeting-sub">"Anansesem nti, yɛhwɛ." — Because of stories, we look.</p>
</div>
```
- Eyebrow: `var(--font-sans)`, `var(--muted)`, `0.7rem`, `letter-spacing: 0.16em`, `text-transform: uppercase`
- Headline: `var(--font-display)`, `var(--ink)`, `clamp(1.4rem, 3vw, 2.2rem)`
- Sub: `var(--font-serif)`, `font-style: italic`, `var(--muted)`, `0.85rem`

**Hearth card (mobile only, `display: none` at ≥750px):**
- Only renders when `store.getPlaying.book` is set
- `background: var(--ink)`, `data-dark="true"`, `border-radius: var(--d-radius)`, `position: relative`, `overflow: hidden`
- `<AseFireMotes :count="8" />`
- Content: cover thumbnail (56×78px, `border-radius: 6px`) + title (Fraunces 600) + chapter label + `<AseKenteWeft />` + JetBrains Mono timestamps + ochre play button
- Tapping triggers the player slide-in (dispatch `mouseenter` on `#player` element, same as existing `details.vue`)

**Book section heading:** `var(--font-serif)`, `font-weight: 600`, `"By the firelight"`

**Book grid:** `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))`, `gap: var(--d-gap)`. Uses `UiAppBook` cards.

---

## Book Detail Page (`pages/app/book/[id]/index.vue`)

**Cover hero:**
- Full-width `<img>` with `max-height: 280px`, `object-fit: cover`, `border-radius: var(--d-radius) var(--d-radius) 0 0`
- Gradient overlay: `::after` pseudo or wrapper `background: linear-gradient(to top, var(--paper), transparent)` — cannot use pseudo on `<img>`, use a sibling `<div>` overlay

**Meta strip:**
- Title: `var(--font-serif)`, `font-weight: 600`, `1.4rem`, `color: var(--ink)`
- Author: `var(--font-serif)`, `font-style: italic`, `var(--muted)`
- Pill chips (language, view count): `background: var(--calabash)`, `color: var(--ink)`, `var(--font-mono)`, `0.7rem`, `border-radius: 999px`, `padding: 2px 8px`

**Synopsis:** `var(--font-serif)`, `line-height: 1.7`, `var(--ink-soft)`, clamp to 4 lines with a "Read more" toggle (`v-if` on a boolean ref)

**Tabs:** reskin using `.tab` classes — active state `border-bottom: 2px solid var(--kola)`, `color: var(--kola)`, `var(--font-display)`

**Chapter list:** uses `UiAppChapter` — already described above

**Reaction button:** like button → `background: var(--calabash)`, `border: 1px solid var(--hairline)`, `border-radius: 999px`, `font-family: var(--font-sans)`, `color: var(--muted)`. Active/liked state: `background: var(--ochre)`, `color: var(--ink)`.

---

## Library Page (`pages/app/library.vue`)

**Section heading:** "Your library" — `var(--font-serif)`, `font-weight: 600`, `1.1rem`, `var(--ink)`

**Grid:** same `auto-fill, minmax(120px, 1fr)` grid as home page. Uses `UiAppBook` cards.

**Empty state** (when `books` is null or empty): centred `<AseAdinkraGlyph />` + "No books yet" in `var(--font-serif)`, `var(--muted)`

---

## Search Page (`pages/app/search.vue`)

**Search bar:**
- Container: `border: 1px solid var(--hairline)`, `border-radius: var(--d-radius)`, `background: var(--card)`, `display: flex`, `align-items: center`, `padding: 8px 14px`, `max-width: 480px`
- Input: `font-family: var(--font-sans)`, `background: none`, `border: none`, `color: var(--ink)`, `flex: 1`, `font-size: 1rem`
- Search icon: replace `<img src="search.png">` with inline SVG or `🔍` in `var(--muted)` — or keep image but wrap in a `<span>` with `color: var(--kola)`
- Remove `border: 2px solid var(--kola-2)` on `.search-box` — replace with `box-shadow: 0 0 0 1px var(--hairline)`

**Filter chips (`UiSelectDropDown`):** `display: flex`, `gap: 8px`, `flex-wrap: wrap`

**Results grid:** same `auto-fill` grid as home, using `UiAppBook` cards

---

## Profile Page (`pages/app/profile.vue`)

**Layout:** centred column, `max-width: 400px`, `padding: var(--d-pad)`

**AppProfile component:** already token-compliant from rollout

**Settings links:**
- `links a`: `font-family: var(--font-display)`, `color: var(--ink)`, `font-size: 1rem`, `border: 1px solid var(--hairline)`, `border-radius: 999px`, `padding: 8px 20px`, `text-decoration: none` — pill-style
- On hover: `background: var(--calabash)`

**Logout button:** `font-family: var(--font-display)`, `background: var(--ink)`, `color: var(--cream)`, `border-radius: 22px`, `font-size: 1.2rem`, `padding: 8px 24px`

**Logout modal (`CommonModal`):** ensure modal uses `var(--card)` background, `var(--ink)` text, `var(--font-display)` for heading. Confirm and cancel buttons use existing `UiAdminButton`.

---

## Subscription Page (`pages/app/subscription.vue`)

**Reference form:**
- Label `@`: `var(--font-mono)`, `var(--muted)`
- Input: `border: 1px solid var(--hairline)`, `border-radius: var(--d-radius)`, `background: var(--card)`, `font-family: var(--font-sans)`, `color: var(--ink)`, `padding: 8px 12px`
- Submit button: `UiAdminButton` default variant

**"No subscriptions" state:** centred `var(--font-serif)`, `var(--muted)` text

**`UiAppSubscription` cards:** already tokenised in rollout — verify only

---

## Callback Pages

**Reset Password (`pages/callback/resetPassword.vue`):** Already tokenised in rollout — verify no regressions.

**Verify (`pages/callback/verify.vue`):**
- Loading state: replace `<div>Loading....</div>` with `<UiLoader :theme="{ color: 'var(--kola)' }" />` centred in a full-viewport flex container
- Error state: `<h1>` using `var(--font-display)`, `color: var(--hibiscus)`, centred
- Success: `<SampleFireworks />` component — no style changes, it's decorative

**Subscribe (`pages/callback/subscribe.vue`):** same treatment as verify.vue

---

## Root Landing Page (`pages/index.vue`)

Currently just `<h1>Web</h1>`. Apply a minimal branded landing:
- `layout: "default"` — keep existing page meta
- Dark full-screen: `background: var(--ink)`, `data-dark="true"`, `height: 100vh`, `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`
- `<AseFireMotes :count="18" />`
- `<AseAnansiMark :size="48" color="var(--cream)" />`
- Headline: `anansesemfie` in `var(--font-display)`, `var(--ochre)`, `2rem`
- Sub: `var(--font-serif)`, `font-style: italic`, `var(--cream)`, `opacity: 0.7`
- CTA button → NuxtLink to `/app` or `/app/auth/login`

---

## Token Compliance Rules (enforced in review)

- **No** hex literals (`#...`) in `<style>` blocks
- **No** CSS named colours (`black`, `white`, `grey`, `green`, `orange`, `lightgray`, etc.)
- **No** font family strings in `<style>` (only `var(--font-*)`)
- **No** `rgba(R,G,B,A)` in `<style>` using arbitrary colour values — only palette-derived values (`201,122,58` for ochre, `31,23,20` for ink) are permitted in gradient stops and glow box-shadows
- **Exception:** gradient stops in `linear-gradient()` / `radial-gradient()` for decorative effects (glows, fire motes) may use raw `rgba()` with palette numeric values only

---

## Responsive Behaviour Summary — Consumer

| Surface | Mobile (<750px) | Desktop (≥750px) |
|---|---|---|
| Root landing | Full-screen dark | Same |
| Auth pages | Full-screen dark, form centred | Same |
| Navbar | Mark + avatar only | Mark + nav links + avatar |
| Bottom navigator | Dark pill at bottom | Hidden |
| Home page | Greeting + hearth card + book grid | Greeting + book grid (no hearth card) |
| Library / Search | Full-width grid | 70% content column |
| Book detail | Full-width stacked | 70% content column |
| Player/Reader panel | Slides in full-screen from right | 30% sticky right column (always visible) |
| Callback pages | Full-width centred | Same |

---

---

# Admin Section

The admin section targets desktop-first (dashboard tool). The same design tokens and Akan aesthetic apply — warm paper backgrounds, kola/ochre accents, Fraunces/Pontano Sans typography — but with a more structured, data-focused layout. No fire motes in data areas; fire motes only on the login page.

---

## Admin Architecture

```
layouts/admin-layout.vue              — sidebar (17%) + body (83%)

components/layout/admin/
  sidebar.vue                         — reskin: Anansi mark header, token nav, already mostly OK
  navbar.vue                          — reskin: replace logo images with Anansi mark + wordmark

pages/admin/
  login.vue                           — reskin: dark firelit, match consumer auth aesthetic
  index.vue                           — books dashboard (30% list | 70% view) — fix violations
  users.vue                           — user management page — fix violations
  period.vue                          — period management — fix violations

components/admin/
  login.vue                           — currently empty shell; flesh out or remove
  books/book.vue                      — fix: two rgba violations; reskin label/value display
  books/bookItem.vue                  — fix: 'brown' named colour → var(--kola)
  books/bookView.vue                  — reskin tabs, action buttons
  books/form.vue                      — reskin form layout
  books/metrics.vue                   — reskin metric cards, chart wrapper
  chapters/index.vue                  — fix: float button token styling
  chapters/chapter.vue                — reskin chapter row
  chapters/form.vue                   — reskin chapter form
  period/index.vue                    — reskin period cards
  period/form.vue                     — reskin period form
  player.vue                          — reskin: replace image buttons with SVG/text glyphs
  users.vue                           — already uses tokenised buttons; verify layout

components/ui/admin/
  card.vue                            — fix: arbitrary rgba box-shadow → var(--hairline)
  inputField.vue                      — fix: arbitrary rgba focus shadow → var(--hairline)
  button.vue                          — already tokenised from rollout ✓
  bookView.vue                        — already tokenised from rollout ✓
  profile.vue                         — already tokenised from rollout ✓
  profileItem.vue                     — already tokenised from rollout ✓
```

---

## Admin Layout (`layouts/admin-layout.vue`)

**Structure:** `display: flex`, `flex-direction: row`, `height: 100vh`, `background: var(--paper)`.

- Sidebar: `width: 17%`, `flex-shrink: 0` — dark ink, fixed
- Body: `flex: 1`, `overflow-y: auto`, `padding: var(--d-pad)`

No changes to the overall structure — just confirm token compliance and ensure `height: 100vh` on the page root.

---

## Admin Sidebar (`components/layout/admin/sidebar.vue`)

Already uses tokens correctly. Minor additions:

**Header area** (top of sidebar, above nav links): add `<AseAnansiMark :size="28" color="var(--cream)" />` + `anansesemfie` wordmark (`var(--font-display)`, `var(--ochre)`, `0.8rem`) as a branded header. Currently shows nothing at the top.

**Nav links:** already styled correctly (`var(--ink)` bg, `var(--cream)` text, `var(--kola)` + `var(--paper)` on active/hover).

**Font:** add `font-family: var(--font-sans)` to `nav a span` — currently inherits from `system-ui`.

---

## Admin Navbar (`components/layout/admin/navbar.vue`)

Currently renders two logo images and isn't mounted in `admin-layout.vue` (the sidebar replaces it). Keep it but update for completeness — it may be used on mobile or in future:

- Replace `<img class="logo" src="~/assets/images/app_logo.png">` with `<AseAnansiMark :size="28" />` + wordmark
- `background: var(--ink)`, `color: var(--cream)` (keep)

---

## Admin Login Page (`pages/admin/login.vue`)

Apply the same dark firelit treatment as consumer auth — they're the same brand.

**Full page:**
- `background: var(--ink)` + `data-dark="true"` on root `.admin-container`
- Remove `background-image: url('@/assets/images/bookShelve.png')` — replace with `<AseFireMotes :count="14" />`
- Remove hardcoded padding percentages

**Auth card:**
- `background: rgba(255,255,255,0.04)` (replace `rgba(255,255,255,1)`)
- `border: 1px solid var(--hairline)` (replace `box-shadow: 1px 1px 1px 1px var(--ink)`)
- `border-radius: var(--d-radius)`
- Add `<AseAnansiMark :size="36" color="var(--cream)" />` + "Admin" label above form

**Form elements:** `UiAdminInputField` and `UiAdminButton` already token-compliant.

**"Forgot Password" link:** `color: var(--ochre)`, `var(--font-sans)`, no uppercase.

---

## Admin Login Component (`components/admin/login.vue`)

This is a stub component separate from the login page. It currently renders an empty `<div class="background">` with `background-color: var(--paper)` — this is incorrect for the admin dark theme.

**Fix:**
- `.background`: `background: var(--ink)` instead of `var(--paper)`, `height: 100vh`, `display: flex`, `justify-content: center`, `align-items: center`
- If this component is unused (not mounted by any page), leave the fix in place for future use but no other action needed.

---

## Admin Dashboard Page (`pages/admin/index.vue`)

**Layout stays the same:** book list (30%) | book view (70%).

**Book list column:**
- `border-right: 1px solid var(--hairline)` (keep, already token)
- Heading: add "Books" section label in `var(--font-display)`, `var(--ink)`, `1rem`
- Search field: already `UiAdminInputField`
- "Add New Book" button: already `UiAdminButton`

**Book view column:** contains `AdminBooksBookView` + `AdminPlayer` — both described below.

No structural changes to this page — token compliance only.

---

## Book List Item (`components/admin/books/bookItem.vue`)

**Fix violation:**
- `.active { border: 2px solid brown }` → `border: 2px solid var(--kola)`

**Reskin:**
- `.book-card`: `background: var(--card)`, `border: 1px solid var(--hairline)` (remove raw `box-shadow: 0 2px 5px rgba(0,0,0,0.1)` → `box-shadow: 0 2px 8px var(--hairline)`)
- `header` (title): `font-family: var(--font-serif)`, `font-weight: 600`, `font-size: 0.9rem`, `color: var(--ink)`
- `p` (authors): `font-family: var(--font-serif)`, `font-style: italic`, `font-size: 0.8rem`, `color: var(--muted)`

---

## Book View (`components/admin/books/bookView.vue`)

**Tabs:**
- Tab buttons: `font-family: var(--font-display)`, `font-size: 0.85rem`, `background: none`, `border: none`, `border-bottom: 2px solid transparent`, `color: var(--muted)`, `padding: 6px 14px`, `cursor: pointer`
- Active tab: `color: var(--kola)`, `border-bottom-color: var(--kola)`

**Action buttons (Edit, Delete):**
- Edit: `background: var(--calabash)`, `color: var(--ink)`, `border: 1px solid var(--hairline)`, `border-radius: var(--d-radius)`, `font-family: var(--font-sans)`
- Delete: `background: var(--hibiscus)`, `color: var(--cream)`, `border: none`, `border-radius: var(--d-radius)`, `font-family: var(--font-sans)`

**Book detail rows:**
- `.title` label: `var(--font-sans)`, `font-weight: 600`, `var(--muted)`, `font-size: 0.8rem`
- Values: `var(--font-serif)`, `var(--ink)`

---

## Book Detail (`components/admin/books/book.vue`)

This component handles VIEW, EDIT, and NEW states for a single book. It was missing from the initial spec — add it.

**Fix violations:**
- `.details .info p .title`: `background-color: rgba(0, 0, 0, 0.55)` → `background: var(--kola)`, `color: var(--cream)`, `border-right: 3px solid var(--ochre)`
- `.details .info p .titleText`: `background-color: rgba(255, 255, 255, 0.55)` → `background: var(--card)`, `color: var(--ink)`, `border: 1px solid var(--hairline)`

**Reskin:**
- `.bookWrapper`: `padding: var(--d-pad)`, `gap: var(--d-gap)`
- `.details .info p .title` (label): `font-family: var(--font-sans)`, `font-size: 0.8rem`, `font-weight: 600`, `padding: 4px 8px`, `border-radius: 4px 0 0 4px`
- `.details .info p .titleText` (value): `font-family: var(--font-serif)`, `font-size: 1rem`, `padding: 4px 8px`, `border-radius: 0 4px 4px 0`
- `.cover img`: keep `object-fit: cover`, `border-radius: 10px` — no violations
- `.details .btn`: `UiAdminButton` already token-compliant
- Edit state select wrappers: `UiSelectDropDown` — fix `.item` violation as described in consumer section

---

## Book Form (`components/admin/books/form.vue`)

**Wrapper:** `background: var(--card)`, `border-radius: var(--d-radius)`, `padding: var(--d-pad)`

**Cover area:** dashed border upload zone — already handled by `UiUploadPicture` (described in consumer section)

**Form fields:** `UiAdminInputField` already token-compliant.

**Select dropdowns:** `UiSelectDropDown` — fix `.item` violation as described in consumer section.

**Save button:** `UiAdminButton` already token-compliant.

---

## Metrics Component (`components/admin/books/metrics.vue`)

**Chart wrapper:** `background: var(--card)`, `border: 1px solid var(--hairline)`, `border-radius: var(--d-radius)`, `padding: var(--d-pad)`

**Summary cards:** `background: var(--card)`, `border: 1px solid var(--hairline)`, `border-radius: var(--d-radius)`, `padding: 12px 16px`
- `.title`: `var(--font-sans)`, `var(--muted)`, `0.75rem`, `text-transform: uppercase`, `letter-spacing: 0.1em`
- `.data`: `var(--font-display)`, `var(--ink)`, `1.8rem`

---

## Metric Card (`components/ui/admin/card.vue`)

**Fix violation:**
- `box-shadow: 0 0 10px 0 rgba(183,192,206,0.2)` → `box-shadow: 0 2px 8px var(--hairline)`

**Reskin:**
- `.primary-value`: `font-family: var(--font-display)` (add)
- `h2` label: `font-family: var(--font-sans)`, `color: var(--muted)`, `font-size: 0.8rem`

---

## Admin Input Field (`components/ui/admin/inputField.vue`)

**Fix violations:**
- `:focus` `box-shadow: 0 0 5px rgba(0,0,0,0.1)` → `box-shadow: 0 0 0 2px var(--ochre)` (focus ring using brand colour)
- `border: 1px solid var(--calabash)` on `.input-group` → keep (already token), just confirm

**Reskin:**
- `.input-label`: `font-family: var(--font-sans)` (add)
- `input`, `textarea`: `font-family: var(--font-sans)`, `color: var(--ink)`, `background: transparent`

---

## Chapters Component (`components/admin/chapters/index.vue`)

**Float button (+ Add Chapter):**
- Currently unstyled `.float` button. Apply: `background: var(--ochre)`, `color: var(--ink)`, `border: none`, `border-radius: 50%`, `width: 48px`, `height: 48px`, `font-size: 1.5rem`, `position: fixed`, `bottom: 24px`, `right: 24px`, `box-shadow: 0 4px 16px var(--hairline)`, `cursor: pointer`

---

## Chapter Row (`components/admin/chapters/chapter.vue`)

Read the actual file and apply token-compliant styling. Expected pattern:
- Row: `background: var(--card)`, `border: 1px solid var(--hairline)`, `border-radius: var(--d-radius)`, `padding: 10px 14px`
- Title: `var(--font-serif)`, `var(--ink)`, `font-weight: 600`
- Edit/Delete buttons: same approach as bookView action buttons

---

## Chapter Form (`components/admin/chapters/form.vue`)

Apply same token treatment as book form: `UiAdminInputField`, `UiAdminButton`, `UiSelectDropDown`, `UiUploadPicture` — all already token-compliant or described above.

---

## Period Page (`pages/admin/period.vue`) and Component (`components/admin/period/index.vue`)

**Period cards:**
- Base card: `background: var(--card)`, `border: 1px solid var(--hairline)`, `border-radius: var(--d-radius)`, `padding: 14px`
- Active period: `background: var(--kola)`, `color: var(--cream)`, `border-color: transparent`
- Icon: `color: var(--ochre)` (inactive), `color: var(--cream)` (active)
- Label: `var(--font-sans)`, `var(--ink)` (inactive), `var(--cream)` (active)

**"Add New Period" card:** `border: 2px dashed var(--hairline)`, `color: var(--muted)`, icon `color: var(--ochre)`

---

## Admin Player (`components/admin/player.vue`)

The admin player is a horizontal mini-strip at the bottom of the book view. Same token treatment as the consumer mini player.

**Fix:** replace all `<img src="@/assets/images/player/*.png">` buttons with Unicode glyphs or inline SVG:
- Skip prev: `⏮`, skip next: `⏭`, rewind: `⏪`, forward: `⏩`, play: `▶`, pause: `⏸`
- Button style: `background: none`, `border: none`, `color: var(--cream)`, `font-size: 1.2rem`, `cursor: pointer`
- Play button: `background: var(--ochre)`, `color: var(--ink)`, `border-radius: 50%`, `width: 36px`, `height: 36px`

**Player strip:**
- `background: var(--ink)`, `data-dark="true"`, `border-radius: var(--d-radius)`, `padding: 8px 14px`
- Book cover thumbnail: `border-radius: 6px`, `width: 40px`, `height: 40px`, `object-fit: cover`
- Title/book label: `var(--font-serif)`, `var(--cream)`
- Volume slider: `accent-color: var(--ochre)`

---

## Admin Users Page (`components/admin/users.vue`)

Already uses tokenised `UiAdminButton` variants (default, `variant="dark"`, `variant="accent"`). No token violations expected from rollout.

**Layout reskin:**
- `.list` column: `border-right: 1px solid var(--hairline)`, `background: var(--paper)`
- `.profile` column: `background: var(--paper)`
- Placeholder image + "select a user" text: `color: var(--muted)`, `font-family: var(--font-serif)`
- Search input: `UiAdminInputField` already token-compliant

---

## Responsive Behaviour Summary — Admin

Admin is desktop-targeted. No mobile breakpoint required for this release.

| Surface | Behaviour |
|---|---|
| Admin login | Full-screen dark, centred form, fire motes |
| Admin sidebar | Fixed 17% wide, dark ink, Anansi mark header |
| Admin dashboard | 30% book list \| 70% book view |
| Admin users | 40% user list \| 60% profile view |
| Admin period | Grid of period cards |
| Modals | Dark glass overlay, token-compliant form content |
