# Design System Rollout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Roll out the Anansesemfie design system (tokens, typography, components) across every file in the project, replacing all hardcoded hex colors and direct font names with CSS custom properties.

**Architecture:** A single source of truth lives in `assets/css/main.css` — all design tokens (colors, typography, density, dark mode) and shared utility classes. Components own their layout in `<style scoped>` blocks using those tokens. No hardcoded hex values or font strings anywhere in the codebase except `main.css`.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, CSS custom properties, scoped CSS.

---

## The Rule

Every file touched by this plan must end with:
- **Zero hardcoded hex colors** (`#4D2316`, `#F1EEE3`, `#f5f5f5`, etc.) — use `var(--token)`
- **Zero direct font name strings** (`"Rammetto One"`, `"Roboto"`, etc.) — use `var(--font-*)` 
- **Zero inline `:style` bindings for static values** — static CSS belongs in `<style scoped>`; only computed/dynamic values (widths from props, JS-calculated positions) stay as `:style`

---

## File Map

**Modified (existing):**
- `assets/css/main.css` — add shared component-class rules for Ase components; remove dead Roboto import
- `components/ui/AseKenteWeft.vue` — replace all inline `:style` with scoped CSS + CSS variables for dynamic values
- `components/ui/AseRoundBtn.vue` — replace all inline `:style` with scoped CSS
- `components/ui/AseFireMotes.vue` — move container styles to scoped CSS
- `components/ui/AseFireCircle.vue` — move static styles to scoped CSS, keep computed positions as `:style`
- `layouts/app-layout.vue` — swap `#f5f5f5` / `"Rammetto One"` for tokens
- `layouts/admin-layout.vue` — swap `#f5f5f5` for `var(--paper)`
- `components/layout/admin/sidebar.vue` — replace gradient + hardcoded colors with tokens
- `components/layout/admin/navbar.vue` — token pass
- `components/layout/app/navBar.vue` — token pass
- `components/ui/app/player/index.vue` — replace `#4D2316`, `#F1EEE3` with tokens; remove hardcoded px transform
- `components/ui/app/player/details.vue` — token pass
- `components/ui/app/player/audioPlayer.vue` — token pass
- `components/ui/app/player/ebookViewer.vue` — token pass
- `components/ui/app/book.vue` — token pass
- `components/ui/app/chapter.vue` — token pass
- `components/ui/app/comment.vue` — token pass
- `components/ui/app/subscription.vue` — token pass
- `components/ui/app/navigator.vue` — token pass
- `components/ui/admin/inputField.vue` — token pass + remove hardcoded border colors
- `components/ui/admin/button.vue` — token pass
- `components/ui/admin/card.vue` — token pass
- `components/ui/admin/player.vue` — token pass
- `components/ui/loader.vue` — token pass
- `components/ui/skeletonLoader.vue` — token pass
- `components/ui/tab.vue` — token pass
- `components/ui/select.vue` — token pass
- `components/ui/selectDropDown.vue` — token pass
- `components/common/modal.vue` — token pass
- `components/common/pagination.vue` — token pass
- `components/common/progress.vue` — token pass
- `components/admin/books/book.vue` — token pass
- `components/admin/books/bookView.vue` — token pass
- `components/admin/books/form.vue` — token pass
- `components/admin/books/metrics.vue` — token pass
- `components/admin/chapters/index.vue` — token pass
- `components/admin/chapters/form.vue` — token pass
- `components/admin/chapters/chapter.vue` — token pass
- `components/admin/users.vue` — token pass
- `components/admin/player.vue` — token pass
- `pages/app/auth/login.vue` — token pass (uses `color: #4D2316`)
- `pages/app/auth/signup.vue` — token pass
- `pages/app/auth/forgot-password.vue` — token pass
- `pages/app/index.vue` — token pass (has `font-family: Pontano Sans` literal)
- `pages/app/book/[id]/index.vue` — token pass
- `pages/app/library.vue` — token pass
- `pages/app/search.vue` — token pass
- `pages/app/subscription.vue` — token pass
- `pages/app/profile.vue` — token pass
- `pages/admin/index.vue` — token pass
- `pages/admin/login.vue` — token pass
- `pages/admin/period.vue` — token pass
- `pages/admin/users.vue` — token pass
- `pages/callback/resetPassword.vue` — token pass

---

## Task 1: Consolidate main.css — remove dead imports, add Ase component CSS classes

**Files:**
- Modify: `assets/css/main.css`

This task adds scoped-safe global class rules for the Ase components (used across many components), and removes the leftover Roboto import that is now superseded by the Nuxt head config.

- [ ] **Step 1: Remove the dead Roboto import**

In `assets/css/main.css`, delete these two lines entirely (they're already loaded via `nuxt.config.ts`):

```css
/* DELETE these two lines — fonts are loaded in nuxt.config.ts */
/* @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap"); */
/* @import url("https://fonts.googleapis.com/css2?family=Rammetto+One&display=swap"); */
```

- [ ] **Step 2: Add base button reset**

Below the `button { font: inherit; color: inherit; }` rule, add:

```css
button { font: inherit; color: inherit; background: none; border: none; }
```

(The Ase components all do this inline — putting it globally prevents repetition.)

- [ ] **Step 3: Commit**

```bash
git add assets/css/main.css
git commit -m "style: remove redundant font imports, add global button reset"
```

---

## Task 2: Refactor AseKenteWeft — inline styles → scoped CSS

**Files:**
- Modify: `components/ui/AseKenteWeft.vue`

The height and fill-width are the only values that must remain dynamic. Everything else moves to `<style scoped>`.

- [ ] **Step 1: Rewrite the component**

Replace the entire file content with:

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  progress?: number
  height?: number
  accents?: string[]
}>(), {
  progress: 0,
  height: 14,
  accents: () => ['var(--ochre)', 'var(--hibiscus)', 'var(--kola)', 'var(--ochre-deep)'],
})

const filled = computed(() => Math.max(0, Math.min(1, props.progress)))
</script>

<template>
  <div
    class="kente-track"
    :style="{ '--kente-h': `${height}px`, '--kente-fill': `${filled * 100}%` }"
    role="progressbar"
    :aria-valuenow="Math.round(filled * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="kente-warp" aria-hidden="true" />
    <div class="kente-fill">
      <div
        v-for="(color, i) in accents"
        :key="i"
        class="kente-weft"
        :style="{ background: color }"
      />
    </div>
    <div class="kente-thumb" />
  </div>
</template>

<style scoped>
.kente-track {
  position: relative;
  height: var(--kente-h, 14px);
  width: 100%;
  border-radius: var(--kente-h, 14px);
  overflow: hidden;
  background: var(--calabash);
  box-shadow: inset 0 0 0 0.5px var(--hairline);
}
.kente-warp {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image: repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 5px);
}
.kente-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--kente-fill, 0%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}
.kente-weft {
  flex: 1;
  background-image: repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 7px);
}
.kente-thumb {
  position: absolute;
  left: calc(var(--kente-fill, 0%) - calc(var(--kente-h, 14px) / 2));
  top: -2px;
  bottom: -2px;
  width: calc(var(--kente-h, 14px) + 4px);
  border-radius: 999px;
  background: var(--ink);
  box-shadow: 0 1px 3px rgba(0,0,0,0.35);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/AseKenteWeft.vue
git commit -m "style: move AseKenteWeft inline styles to scoped CSS"
```

---

## Task 3: Refactor AseRoundBtn — inline styles → scoped CSS

**Files:**
- Modify: `components/ui/AseRoundBtn.vue`

Only `size` is dynamic; dark/light are boolean variants handled with a CSS class.

- [ ] **Step 1: Rewrite the component**

```vue
<script setup lang="ts">
withDefaults(defineProps<{
  dark?: boolean
  size?: number
}>(), {
  dark: true,
  size: 44,
})

defineEmits<{ click: [] }>()
</script>

<template>
  <button
    :class="['ase-round-btn', dark ? 'ase-round-btn--dark' : 'ase-round-btn--light']"
    :style="{ width: `${size}px`, height: `${size}px` }"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.ase-round-btn {
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.18);
}
.ase-round-btn--dark  { background: var(--ink);   color: var(--cream); }
.ase-round-btn--light { background: var(--cream); color: var(--ink);   }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/AseRoundBtn.vue
git commit -m "style: move AseRoundBtn inline styles to scoped CSS"
```

---

## Task 4: Refactor AseFireMotes and AseFireCircle — inline styles → scoped CSS

**Files:**
- Modify: `components/ui/AseFireMotes.vue`
- Modify: `components/ui/AseFireCircle.vue`

Mote positions are JS-randomised (must stay `:style`). Container and fire-glow are static.

- [ ] **Step 1: Rewrite AseFireMotes.vue**

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  active?: boolean
  count?: number
}>(), {
  active: true,
  count: 14,
})

const motes = computed(() =>
  Array.from({ length: props.count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * -6,
    dur: 5 + Math.random() * 5,
    size: 2 + Math.random() * 3,
    dx: (Math.random() - 0.5) * 40,
  }))
)
</script>

<template>
  <div class="fire-motes" aria-hidden="true">
    <span
      v-if="active"
      v-for="m in motes"
      :key="m.id"
      class="fire-mote"
      :style="{
        left: `${m.left}%`,
        width: `${m.size}px`,
        height: `${m.size}px`,
        animationDuration: `${m.dur}s`,
        animationDelay: `${m.delay}s`,
        '--dx': `${m.dx}px`,
      }"
    />
  </div>
</template>

<style scoped>
.fire-motes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.fire-mote {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--ochre) 0%, rgba(201,122,58,0) 70%);
  animation: ase-mote linear infinite;
}
</style>
```

- [ ] **Step 2: Rewrite AseFireCircle.vue**

Person positions are computed in JS (must stay `:style`). Container, fire glow, and button base styles move to scoped CSS.

```vue
<script setup lang="ts">
export interface FirePerson {
  name: string
  initial: string
  color?: string
}

const props = withDefaults(defineProps<{
  people?: FirePerson[]
  activeIndex?: number
  size?: number
}>(), {
  people: () => [],
  activeIndex: 0,
  size: 320,
})

const emit = defineEmits<{ select: [index: number] }>()

const radius = computed(() => props.size / 2 - 28)

function personPos(i: number) {
  const a = (i / props.people.length) * Math.PI * 2 - Math.PI / 2
  return {
    left: `${props.size / 2 + radius.value * Math.cos(a) - 18}px`,
    top:  `${props.size / 2 + radius.value * Math.sin(a) - 18}px`,
    background: props.people[i]?.color ?? 'var(--calabash)',
  }
}
</script>

<template>
  <div
    class="fire-circle"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <div class="fire-circle__glow" />
    <AseFireMotes :active="true" :count="10" />
    <button
      v-for="(person, i) in people"
      :key="i"
      class="fire-circle__person"
      :class="{ 'fire-circle__person--active': i === activeIndex }"
      :style="personPos(i)"
      :title="person.name"
      @click="emit('select', i)"
    >
      {{ person.initial }}
    </button>
  </div>
</template>

<style scoped>
.fire-circle {
  position: relative;
  margin: 0 auto;
}
.fire-circle__glow {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--hibiscus) 0%, var(--ochre) 50%, rgba(201,122,58,0) 75%);
  animation: ase-pulse 2.4s ease-in-out infinite;
}
.fire-circle__person {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid transparent;
  color: var(--ink);
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  font-family: var(--font-display);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fire-circle__person--active {
  border-color: var(--ochre);
  box-shadow: 0 0 0 4px rgba(201,122,58,0.25);
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/AseFireMotes.vue components/ui/AseFireCircle.vue
git commit -m "style: move AseFireMotes and AseFireCircle inline styles to scoped CSS"
```

---

## Task 5: Update layouts — replace hardcoded values with tokens

**Files:**
- Modify: `layouts/app-layout.vue`
- Modify: `layouts/admin-layout.vue`

Both use `#f5f5f5` as background and `"Rammetto One"` directly in `app-layout.vue`.

- [ ] **Step 1: Update app-layout.vue `<style scoped>`**

Replace every hardcoded value:

```css
/* BEFORE → AFTER */
background-color: #f5f5f5  →  background: var(--paper)
font-family: "Rammetto One"  →  font-family: var(--font-display)
```

The full updated style block for `layouts/app-layout.vue`:

```css
<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.page  { background: var(--paper); }
.body  { width: 100%; height: 100%; }

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.container.content {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 20px;
  margin-bottom: 5%;
  overflow: scroll;
}
.items-container {
  position: relative;
  width: 100%;
  height: 80vh;
  margin-bottom: 5%;
  overflow-y: auto;
}
.container .content .navigator { padding: 0 10px; }
.container .player {
  position: fixed;
  align-self: center;
  width: 90%;
  padding: 20px;
  border-radius: 12px;
  transition: 0.5s ease-in-out;
  transform: translateX(96%);
}
.container .player:hover { transform: translateX(0%); }

@media only screen and (min-width: 750px) {
  .container { flex-direction: row; justify-content: space-around; }
  .container .content { width: 68%; height: 100vh; }
  .items-container { padding: 10px; border-radius: 10px; margin: 10px; }
  .container .content .navigator { padding: 0 35%; }
  .container .player {
    position: relative;
    width: 30%;
    height: 80vh;
    margin: 10px;
    border-radius: 30px;
    align-self: unset;
    padding: 10px;
    background: unset;
    transform: unset;
  }
}
</style>
```

- [ ] **Step 2: Update admin-layout.vue `<style>` block**

```css
<style>
.page {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background: var(--paper);   /* was #f5f5f5 */
}
.sidebar { width: 10%; }
.body {
  padding: 20px;
  width: 90%;
  min-height: 100vh;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add layouts/app-layout.vue layouts/admin-layout.vue
git commit -m "style: replace hardcoded layout colors with design tokens"
```

---

## Task 6: Update admin sidebar and navbar — replace hardcoded colors

**Files:**
- Modify: `components/layout/admin/sidebar.vue`
- Modify: `components/layout/admin/navbar.vue`
- Modify: `components/layout/app/navBar.vue`

The admin sidebar uses a `linear-gradient(#464748, #1f1e1f, #030303)` and `color: #333`. Replace with token-based equivalents.

- [ ] **Step 1: Update sidebar.vue colors**

Find and replace in `components/layout/admin/sidebar.vue`:

| Find | Replace |
|------|---------|
| `background-image: linear-gradient(#464748, #1f1e1f, #030303)` | `background: var(--ink)` |
| `color: #333` | `color: var(--ink)` |
| `background-color: #fff` | `background: var(--paper)` |
| `color: #000000` (active state) | `color: var(--kola)` |
| `color: #fff` | `color: var(--cream)` |

- [ ] **Step 2: Run the dev server and visually verify sidebar still renders**

```bash
yarn dev
# open http://localhost:3080/admin
```

Expected: sidebar visible with dark ink background, white links, ochre active state.

- [ ] **Step 3: Commit**

```bash
git add components/layout/admin/sidebar.vue components/layout/admin/navbar.vue components/layout/app/navBar.vue
git commit -m "style: replace hardcoded colors in layout navigation components"
```

---

## Task 7: Update the audio player component

**Files:**
- Modify: `components/ui/app/player/index.vue`
- Modify: `components/ui/app/player/details.vue`
- Modify: `components/ui/app/player/audioPlayer.vue`
- Modify: `components/ui/app/player/ebookViewer.vue`

The player is the most visually prominent component. It currently hardcodes `#4D2316` (kola) and `#F1EEE3` (cream).

- [ ] **Step 1: Update player/index.vue**

In the `<style scoped>` block replace all hardcoded values:

| Find | Replace |
|------|---------|
| `background: #4D2316` | `background: var(--kola)` |
| `background-color: #F1EEE3` | `background: var(--cream)` |
| `transform: translateX(45%)` | leave as-is (layout, not color) |

The `.rectangleParent` rule becomes:

```css
.rectangleParent {
  display: flex;
  flex-direction: row;
  gap: 0;
  align-items: center;
  margin-left: 15px;
  width: 300px;
  height: 59px;
  border-radius: 19px;
  background: var(--kola);   /* was #4D2316 */
  padding: 0 10px;
  transform: translateX(45%);
}
.rectangleParent .play-button {
  flex-shrink: 0;
  background: var(--cream);  /* was #F1EEE3 */
  border-radius: 50%;
  align-content: center;
  padding: 5%;
}
```

- [ ] **Step 2: Update details.vue, audioPlayer.vue, ebookViewer.vue** — same find-replace pass

```bash
grep -n '#[0-9a-fA-F]\{3,6\}' components/ui/app/player/details.vue components/ui/app/player/audioPlayer.vue components/ui/app/player/ebookViewer.vue
```

For every hit, apply the token map at the end of this document. The most likely hits:

In `details.vue`:
```css
/* replace */
background: #4D2316  →  background: var(--kola)
color: #F1EEE3       →  color: var(--cream)
border: 1px solid #4D2316  →  border: 1px solid var(--kola)
```

In `audioPlayer.vue` / `ebookViewer.vue`:
```css
background: #4D2316  →  background: var(--kola)
background: #F1EEE3  →  background: var(--cream)
color: #333          →  color: var(--ink)
```

- [ ] **Step 3: Also swap KenteWeft into the seek bar**

In `player/index.vue`, replace the `<input type="range" class="seek">` with `<AseKenteWeft>` for visual consistency:

```vue
<!-- BEFORE -->
<input class="seek" type="range" min="0" :max="duration" :value="currentTime"
    @input="seekAudio(Number(($event.target as HTMLInputElement).value))" />

<!-- AFTER: keep the input for accessibility, layer KenteWeft visually on top -->
<div class="seek-wrap">
  <AseKenteWeft :progress="duration > 0 ? currentTime / duration : 0" :height="6" />
  <input class="seek-input" type="range" min="0" :max="duration" :value="currentTime"
      @input="seekAudio(Number(($event.target as HTMLInputElement).value))" />
</div>
```

Add to `<style scoped>`:

```css
.seek-wrap { position: relative; width: 90%; }
.seek-input {
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/app/player/
git commit -m "style: replace hardcoded player colors with tokens; use AseKenteWeft for seek bar"
```

---

## Task 8: Token pass — auth pages

**Files:**
- Modify: `pages/app/auth/login.vue`
- Modify: `pages/app/auth/signup.vue`
- Modify: `pages/app/auth/forgot-password.vue`

These pages use `color: #4D2316` and `font-family: "Rammetto One"` in scoped CSS.

- [ ] **Step 1: Update login.vue `<style scoped>`**

```css
form .title  { font-family: var(--font-display); font-size: 1.5rem; }
form .signup { color: var(--kola); font-family: var(--font-display); font-size: 16px; text-transform: uppercase; text-decoration: none; margin-top: 10%; }
.link        { color: var(--kola); font-family: var(--font-display); font-size: 16px; text-transform: uppercase; text-decoration: none; margin-top: 10%; }
```

- [ ] **Step 2: Verify same pattern in signup.vue and forgot-password.vue, apply same replacements**

```bash
grep -n '"Rammetto One"\|#[0-9a-fA-F]\{3,6\}' pages/app/auth/*.vue
```

- [ ] **Step 3: Commit**

```bash
git add pages/app/auth/
git commit -m "style: replace hardcoded colors and font names in auth pages"
```

---

## Task 9: Token pass — consumer pages

**Files:**
- Modify: `pages/app/index.vue`
- Modify: `pages/app/book/[id]/index.vue`
- Modify: `pages/app/library.vue`
- Modify: `pages/app/search.vue`
- Modify: `pages/app/subscription.vue`
- Modify: `pages/app/profile.vue`

- [ ] **Step 1: Grep all consumer pages for hardcoded values**

```bash
grep -rn '"Rammetto One"\|"Roboto"\|"Pontano Sans"\|#[0-9a-fA-F]\{3,6\}' pages/app/
```

This will list every line that needs updating. Work through each file applying the token map (see end of plan).

Specific known hit in `pages/app/index.vue`:
```css
/* BEFORE */
font-family: Pontano Sans;
/* AFTER */
font-family: var(--font-sans);
```

- [ ] **Step 2: Commit**

```bash
git add pages/app/
git commit -m "style: replace hardcoded colors and font names in consumer pages"
```

---

## Task 10: Token pass — admin pages and components

**Files:**
- Modify: `pages/admin/index.vue`, `pages/admin/login.vue`, `pages/admin/period.vue`, `pages/admin/users.vue`
- Modify: `components/admin/books/book.vue`, `bookView.vue`, `form.vue`, `metrics.vue`
- Modify: `components/admin/chapters/index.vue`, `form.vue`, `chapter.vue`
- Modify: `components/admin/users.vue`, `components/admin/player.vue`

- [ ] **Step 1: Grep all admin files for hardcoded values**

```bash
grep -rn '"Rammetto One"\|"Roboto"\|#[0-9a-fA-F]\{3,6\}' pages/admin/ components/admin/
```

- [ ] **Step 2: Apply token replacements file by file using the token map below**

Work through each result. The most common hits will be:
- `#4D2316` → `var(--kola)`
- `#F1EEE3` → `var(--cream)`
- `#f5f5f5` → `var(--paper)`
- `#333` → `var(--ink)`
- `#fff` → `var(--cream)` (or `var(--paper)` for backgrounds)
- `"Rammetto One"` → `var(--font-display)`

- [ ] **Step 3: Token pass — shared UI components**

```bash
grep -rn '#[0-9a-fA-F]\{3,6\}\|"Rammetto One"\|"Roboto"' \
  components/ui/admin/ \
  components/ui/app/ \
  components/ui/loader.vue \
  components/ui/tab.vue \
  components/ui/select.vue \
  components/ui/selectDropDown.vue \
  components/common/
```

Apply the same token replacements.

- [ ] **Step 4: Commit**

```bash
git add pages/admin/ components/admin/ components/ui/ components/common/
git commit -m "style: replace hardcoded colors and font names in admin pages and shared UI"
```

---

## Task 11: Token pass — callback pages

**Files:**
- Modify: `pages/callback/resetPassword.vue`
- Modify: `pages/callback/verify.vue`
- Modify: `pages/callback/subscribe.vue`

- [ ] **Step 1: Grep and replace**

```bash
grep -rn '#[0-9a-fA-F]\{3,6\}\|"Rammetto One"' pages/callback/
```

- [ ] **Step 2: Commit**

```bash
git add pages/callback/
git commit -m "style: replace hardcoded values in callback pages"
```

---

## Task 12: Final verification — zero hardcoded values remain

- [ ] **Step 1: Run the full grep**

```bash
grep -rn '#[0-9a-fA-F]\{3,6\}\|"Rammetto One"\|"Roboto"\|"Pontano Sans"\|font-family: Pontano' \
  pages/ components/ layouts/ assets/css/main.css \
  --include="*.vue" --include="*.css"
```

Expected output: zero lines (or only hits that are intentional — e.g. SVG `fill="#000"` shorthand that is not a design color).

- [ ] **Step 2: Start dev server and walk through every route manually**

```bash
yarn dev
```

Routes to check:
- `http://localhost:3080/app` — home / book grid
- `http://localhost:3080/app/auth/login` — login form
- `http://localhost:3080/app/auth/signup` — signup form
- `http://localhost:3080/app/book/<any-id>` — book detail
- `http://localhost:3080/app/library` — library
- `http://localhost:3080/app/subscription` — subscription page
- `http://localhost:3080/admin` — admin dashboard
- `http://localhost:3080/admin/login` — admin login

For each: confirm colors render from tokens (warm ochre/kola palette, not grey defaults).

- [ ] **Step 3: Verify dark mode toggle works**

In browser console run:
```js
document.documentElement.dataset.dark = 'true'
```

Expected: entire app flips to fireside dark palette — backgrounds go near-black, text goes cream.

Run again to toggle off:
```js
document.documentElement.dataset.dark = 'false'
```

- [ ] **Step 4: Commit**

```bash
git add -p   # review any remaining files
git commit -m "style: design system rollout complete — all hardcoded values replaced with tokens"
```

---

## Token Reference

Use this when deciding which variable to apply:

| Hex / name | Token | Usage |
|---|---|---|
| `#1F1714` | `var(--ink)` | Primary text, dark backgrounds |
| `#2A201B` | `var(--ink-soft)` | Secondary text, muted UI |
| `#4D2316` | `var(--kola)` | Primary brand color, CTAs, links |
| `#6E4C29` | `var(--kola-2)` | Secondary brand, hover states |
| `#C97A3A` | `var(--ochre)` | Accent, active state, highlights |
| `#A65A22` | `var(--ochre-deep)` | Deep accent, borders on accent |
| `#D04C4F` | `var(--hibiscus)` | Danger, error, dislike |
| `#E2D3C5` | `var(--calabash)` | Secondary surfaces, input backgrounds |
| `#F1EEE3` | `var(--cream)` | Light text on dark, button fill |
| `#F8F4EA` | `var(--paper)` | Page background |
| `#FBF7EE` | `var(--card)` | Card/panel backgrounds |
| `rgba(31,23,20,0.55)` | `var(--muted)` | Placeholder, secondary text |
| `rgba(31,23,20,0.12)` | `var(--hairline)` | Dividers, subtle borders |
| `#f5f5f5` | `var(--paper)` | Generic light background |
| `#fff`, `#ffffff` | `var(--paper)` or `var(--cream)` | White backgrounds / white text |
| `#333`, `#000` | `var(--ink)` | Generic dark text |
| `"Rammetto One"` | `var(--font-display)` | Display / title type |
| `"Pontano Sans"`, `Pontano Sans` | `var(--font-sans)` | UI / label type |
| `"Roboto"` | `var(--font-sans)` | (Legacy — replace with sans) |
| `"Fraunces"` | `var(--font-serif)` | Editorial / prose type |
| `"JetBrains Mono"` | `var(--font-mono)` | Numbers, timestamps, code |
