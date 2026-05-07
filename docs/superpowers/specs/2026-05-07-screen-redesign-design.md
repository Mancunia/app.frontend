# Screen Redesign — Akan-Themed UI Design Spec

## Goal

Apply the Anansesemfie Akan-themed design system across all consumer-facing pages: auth, home, book detail, player panel, ebook viewer, navbar, and bottom navigator — fully responsive (mobile-first, desktop ≥750px).

## Design Principles

- **Tokens only:** every colour, font, and spacing value must come from a CSS custom property defined in `assets/css/main.css`. Zero hardcoded hex, zero named colours, zero inline font strings in component files.
- **Dark-over-fire surfaces:** auth pages and the player/reader panel use `[data-dark="true"]` — ink background, cream text, fire motes.
- **Paper-warm surfaces:** content pages (home, book, library, search) use `var(--paper)` background.
- **Responsive breakpoint:** `min-width: 750px` (matches existing codebase convention). Below = mobile-full-screen. Above = two-column with 30% right panel.

---

## Architecture

The existing layout structure is kept and reskinned:

```
layouts/app-layout.vue          — responsive shell (content 70% | panel 30%)
layouts/app/auth.vue            — dark firelit full-screen wrapper
components/layout/app/navBar.vue — navbar (reskinned)
components/ui/app/navigator.vue  — bottom tab bar (reskinned)
components/ui/app/player/index.vue     — outer panel shell (already dark)
components/ui/app/player/audioPlayer.vue — audio player UI (reskin)
components/ui/app/player/ebookViewer.vue — ebook reader UI (reskin)
pages/app/auth/login.vue        — login page
pages/app/auth/signup.vue       — signup page
pages/app/auth/forgot-password.vue
pages/app/index.vue             — home page
pages/app/book/[id]/index.vue   — book detail page
```

The `details.vue` component already handles the audio/ebook branch on `store.getPlaying.type === 'ebook'`. No logic changes there — only the `audioPlayer.vue` and `ebookViewer.vue` components are restyled.

---

## Layout Shell (`layouts/app-layout.vue`)

**Mobile:** single column. Content fills viewport. Player panel is full-screen overlay (slides in from right, triggered on chapter play as today). Bottom tab bar sits at the bottom of the content column.

**Desktop (≥750px):** Two columns side-by-side. Content area = `flex: 1` (≈70%). Player/reader panel = `width: 30%`, `height: 100vh`, sticky to the right. No overlay, no slide-in — always visible.

Changes to the existing file:
- `.page` background → `var(--paper)` (already set, keep)
- `.container` on desktop: `flex-direction: row`, `align-items: stretch`, `height: 100vh`
- `.content` on desktop: `flex: 1`, `overflow-y: auto`, `height: 100vh`
- `.player` on desktop: `width: 30%`, `height: 100vh`, `position: sticky`, `top: 0`, `border-radius: 0` (remove legacy border-radius on desktop), no transform
- `.player` on mobile: keep existing slide-in behaviour but update background to `var(--ink)` with `[data-dark="true"]`
- Remove `background: unset` hack on desktop player — it should keep the dark panel background

---

## Navbar (`components/layout/app/navBar.vue`)

Replace the current logo-image + "ANANSESEM" text layout.

**All screen sizes:**
- Left: Anansi spider SVG mark (inline SVG, `color: var(--kola)`, ~24px) + `anansesemfie` wordmark in `var(--font-display)`, `var(--kola)`
- Right: avatar (circular, `border: 2px solid var(--ochre)`)

**Desktop only (≥750px):** add centre nav links between mark and avatar:
- Links: Home (`/app`), Library (`/app/library`), Search (`/app/search`)
- Font: `var(--font-sans)`, `var(--muted)` default, `var(--kola)` + `font-weight: 600` when active (use `useNavigation()` composable already in codebase)
- Active detection via `activeRoute` from `useNavigation()`

**Anansi SVG:** use the same concentric-circles + web-lines + body spider SVG from the mockups (already defined in the brainstorm HTML files).

---

## Bottom Navigator (`components/ui/app/navigator.vue`)

Replace image-based icons with SVG icons + text labels.

**Layout:** `display: flex`, `justify-content: space-around`, `align-items: center`, `background: var(--ink)`, `border-radius: 33px`, `padding: 12px 0`, width fits content on mobile, `345px` as today.

**Each tab item:**
```
[SVG icon 22px]
[label — font-sans 10px, letter-spacing 0.06em, uppercase]
```
- Inactive: icon + text at `opacity: 0.5` — wrap icon + label in a `<span class="tab-item">` and set `color: var(--cream); opacity: 0.5` on the inactive state.
- Active: icon + text `var(--ochre)`, underscore or dot indicator

**Icons (inline SVG, no external images):**
- Home: house outline
- Search: magnifying glass
- Library: open book
- Profile: person circle (fallback to user avatar image if `user.dp` is set — keep existing logic)

**Desktop (≥750px):** navigator is hidden. Desktop navigation is handled by the navbar links.

---

## Auth Layout (`layouts/app/auth.vue`)

Replace the bookshelf image approach.

**Full-screen dark:** `background: var(--ink)`, `height: 100vh`, `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`. Apply `data-dark="true"` to the layout's root element via a hardcoded HTML attribute — `<div class="auth-shell" data-dark="true">`. This propagates dark-mode token overrides to all slotted content.

**Fire motes:** absolute-positioned mote elements (CSS animation `mote-rise` — defined in `assets/css/main.css` as part of this spec's fire motes extraction; see Fire Motes section below).

**Logo area:** centred above the slot — Anansi SVG (36px, `var(--cream)`) + "anansesemfie" wordmark (`var(--font-display)`, `var(--ochre)`, 22px).

**Slot (form area):** max-width `360px`, full-width on small screens. The form floats on the dark background — no card/panel, just dark glass feel: `background: rgba(255,255,255,0.04)`, `border: 1px solid var(--hairline)`, `border-radius: var(--d-radius)`, `padding: var(--d-pad)`.

**No side image** — the bookShelve.png is removed. The fire motes are the visual texture.

---

## Login / Signup / Forgot-Password Pages

These three pages share the `app-auth` layout. Only their form content changes — the layout handles the dark wrapper.

**Login (`pages/app/auth/login.vue`):**
- `<h2>` → `var(--font-display)`, `var(--cream)`, centred
- Email + password inputs → `UiAdminInputField` with `appAuthInput` style (already used, keep)
- Submit button → `UiAdminButton` with dark variant (`variant="dark"` if dark bg needs inverted button, or use ochre: `variant="accent"`)
- "SignUp" / "Forgot Password" links → `var(--ochre)`, `var(--font-sans)`, no uppercase transform

**Signup and Forgot-Password:** same treatment — form centred, dark typography from tokens.

---

## Home Page (`pages/app/index.vue`)

**Greeting bar** (new, above the book list):
```html
<div class="greeting">
  <p class="greeting-eyebrow">Tonight's storyteller</p>
  <h1 class="greeting-headline">The fire is lit. Sit by it.</h1>
  <p class="greeting-sub">"Anansesem nti, yɛhwɛ." — Because of stories, we look.</p>
</div>
```
- Eyebrow: `var(--font-sans)`, `var(--muted)`, `font-size: 0.7rem`, `letter-spacing: 0.16em`, `text-transform: uppercase`
- Headline: `var(--font-display)`, `var(--ink)`, `font-size: clamp(1.4rem, 3vw, 2.2rem)`
- Sub: `var(--font-serif)`, `font-style: italic`, `var(--muted)`, `font-size: 0.85rem`

**Hearth card** (new, shows currently-playing book if any):
- Only renders if `store.getPlaying.book` is set
- Dark ink card (`background: var(--ink)`, `[data-dark="true"]`), `border-radius: var(--d-radius)`, fire motes animation
- Inside: book cover (56×78px, rounded), book title (Fraunces 600), chapter label, Kente weft progress, play button (ochre circle, right-aligned)
- Below weft: JetBrains Mono timestamps

**Book grid:**
- Heading: `var(--font-serif)`, "By the firelight"
- Grid: `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))`, `gap: var(--d-gap)`
- Each `UiAppBook` card: cover (3:4 ratio), title below in `var(--font-serif)`
- Keep existing `UiAppLoadersBook` skeleton loader

**Kente weft component** (reusable, referenced here and in player):
- `border-radius: 999px`, `overflow: hidden`, fixed height (`6px` in card, `9px` in player)
- Fill bar: `background: linear-gradient(90deg, var(--ochre), var(--hibiscus), var(--kola))`

---

## Book Detail Page (`pages/app/book/[id]/index.vue`)

**Cover hero:**
- Full-width cover image, `max-height: 280px`, `object-fit: cover`, `border-radius: var(--d-radius) var(--d-radius) 0 0`
- Subtle gradient overlay at bottom: `linear-gradient(to top, var(--paper), transparent)`

**Meta strip** (below cover):
- Book title: `var(--font-serif)`, `font-weight: 600`, `font-size: 1.4rem`
- Author: `var(--font-serif)`, `font-style: italic`, `var(--muted)`
- Language pill, view count pill — `var(--calabash)` background, `var(--ink)` text, `var(--font-mono)`, `font-size: 0.75rem`

**Synopsis:** `var(--font-serif)`, `line-height: 1.7`, `var(--ink-soft)`, clamped to 4 lines with "read more" toggle

**Chapter tabs:** keep existing tab UI, reskin with tokens:
- Active tab: `border-bottom: 2px solid var(--kola)`, `color: var(--kola)`, `var(--font-display)`
- Inactive: `var(--muted)`

**Chapter rows (`UiAppChapter`):** already tokenised from design system rollout. No changes needed unless there are remaining raw values.

---

## Audio Player (`components/ui/app/player/audioPlayer.vue`)

The panel is always dark (parent `.player` gets dark background). This component renders inside that dark panel.

**Structure (top to bottom):**
1. Eyebrow label: "Now playing" — `var(--font-sans)`, 0.6rem, `letter-spacing: 0.14em`, `text-transform: uppercase`, `opacity: 0.5`, `var(--cream)`
2. Mode toggle pill: `[🎤 Audio] [📖 Read]` — dark pill, display-only. The active tab reflects `store.getPlaying.type` (either `'ebook'` or not). No click handler — switching chapter type requires fetching a new chapter from the book detail page, which is out of scope for this redesign.
3. Cover art: `border-radius: 12px`, `box-shadow: 0 12px 36px rgba(0,0,0,0.5)`, centred, 120×160px
4. Glow spot: `radial-gradient(ellipse, rgba(201,122,58,0.28), transparent 70%)` below cover — use `var(--ochre)` with raw alpha since CSS gradient stops don't support `var()` inside `rgba()` cleanly; exception to token rule for gradient stops only
5. Meta pills row: rating (★), language (🌐), chapter (📖) — `var(--font-mono)`, `var(--ochre)` icon, `var(--cream)` label, `opacity: 0.7`
6. Title: `var(--font-display)`, centred, `var(--cream)`
7. Author: `var(--font-serif)`, `font-style: italic`, centred, `opacity: 0.6`, `var(--cream)`
8. Kente weft progress bar with Adinkra bookmark marker (✦ in `var(--ochre)`) at saved position
9. Time row: JetBrains Mono, elapsed / remaining, `opacity: 0.6`
10. Transport controls: bookmark (✦), skip-back (⏮), play/pause (⏸/▶), skip-forward (⏭), comment (💬) — Play button is larger, `background: var(--ochre)`, `color: var(--ink)`, `box-shadow: 0 6px 20px rgba(201,122,58,0.4)` (exception for glow). Others: `background: rgba(255,255,255,0.06)`, `border: 1px solid rgba(255,255,255,0.08)`
11. Ghost row: speed (1.0×), Chapters, Sleep — `var(--font-mono)`, `opacity: 0.5`, `var(--cream)`

**Wire to existing state:** all values (`book`, `currentPage`, player controls) come from existing `usePlayer()` composable and `useAuthStore()`. Only the template + styles change.

---

## Ebook Viewer (`components/ui/app/player/ebookViewer.vue`)

The ebook viewer replaces the audio player in the same 30%-wide dark panel. It must be readable at that width.

**Structure:**
1. Header bar (dark, `var(--ink)`):
   - Book title truncated, `var(--font-serif)`, `var(--cream)`, `font-size: 0.85rem`
   - Page indicator: `p. {currentPage} / {totalPages}` — `var(--font-mono)`, `var(--ochre)`, `font-size: 0.8rem`
2. Reader body (`flex: 1`, `overflow-y: auto`, `background: var(--paper)` — light for readability):
   - `font-family: var(--font-serif)`, `font-size: 1rem` (adjustable), `line-height: 1.75`, `color: var(--ink-soft)`, `padding: 16px`
   - Drop cap on first paragraph: `::first-letter` → `var(--font-display)`, `font-size: 3em`, `float: left`, `color: var(--kola)`
3. Footer bar (`background: var(--ink)`, `var(--cream)`):
   - Kente weft progress (page / total pages)
   - Prev / Next page buttons — `background: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 50%`, icon arrows
   - Font-size controls: A− and A+ buttons

**Font size state:** local `const fontSize = ref(1)` (rem units). Min `0.8`, max `1.4`, step `0.1`. Wired as `:style="{ fontSize: fontSize + 'rem' }"` on the reader body element.

**Remove:** `box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37)` (hardcoded blue tint, violates token rules). Replace with no box-shadow on the viewer root — the panel itself handles the container styling.

---

## Fire Motes Animation

The `mote-rise` keyframe animation is currently duplicated across files. Extract to `assets/css/main.css` (after the existing animations block):

```css
/* fire motes */
.motes { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.mote {
  position: absolute; bottom: -6px; border-radius: 50%;
  background: radial-gradient(circle, var(--ochre) 0%, rgba(201,122,58,0) 70%);
  animation: mote-rise linear infinite;
}
@keyframes mote-rise {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  15%  { opacity: 0.75; }
  100% { transform: translateY(-400px) translateX(var(--mote-dx, 0)); opacity: 0; }
}
```

Components use `.motes` wrapper + `.mote` children with inline `style="animation-duration: Xs; animation-delay: -Ys; --mote-dx: Npx"`.

---

## Kente Weft Component

Extract the progress bar into a reusable component `components/ui/app/KenteWeft.vue`:

```vue
<template>
  <div class="weft">
    <div class="fill" :style="{ width: `${percent}%` }"></div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ percent: number }>()
</script>
<style scoped>
.weft { border-radius: 999px; overflow: hidden; background: var(--hairline); }
.fill { height: 100%; background: linear-gradient(90deg, var(--ochre), var(--hibiscus), var(--kola)); }
</style>
```

Used as `<UiAppKenteWeft :percent="42" style="height: 6px" />`. The `height` is set by the parent via `style` or a class.

---

## Token Compliance Rules (enforced in spec review)

- **No** hex literals (`#...`) in component `<style>` blocks
- **No** CSS named colours (`black`, `white`, `grey`, `green`, `orange`, `red`, `blue`)
- **No** font family strings in component `<style>` (only `var(--font-*)`)
- **Exception:** gradient colour stops inside `linear-gradient()` / `radial-gradient()` may use raw `rgba()` values when the gradient stop is decorative (glow effects, fire motes) — but must use the palette's numeric values (`201,122,58` for ochre, `31,23,20` for ink, not arbitrary)
- **Exception:** `box-shadow` rgba glow values for player play button and fire mote glow — same rule

---

## Responsive Behaviour Summary

| Surface | Mobile (<750px) | Desktop (≥750px) |
|---|---|---|
| Auth pages | Full-screen dark, form centred | Same (no side-by-side) |
| Navbar | Mark + avatar only | Mark + nav links + avatar |
| Bottom navigator | Dark pill at bottom | Hidden |
| Home / Book | Full-width, vertically stacked | 70% content column |
| Player / Reader panel | Slides in from right (full-screen) | 30% sticky right column |

---

## Out of Scope

- Admin pages (already done in design system rollout)
- Subscription page logic
- Comments tab (hidden in current code)
- Any new API endpoints or state management changes
- Dark mode toggle UI (the design uses fireside dark for auth + player only; global dark mode toggle is future work)
