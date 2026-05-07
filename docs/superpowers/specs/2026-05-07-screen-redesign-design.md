# Screen Redesign — Akan-Themed UI — Full App

## Goal

Apply the Anansesemfie Akan-themed design system across every consumer-facing page and shared component. Every screen the user sees must feel like it belongs to the same fire-warm, Akan-rooted world.

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

## Responsive Behaviour Summary

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
