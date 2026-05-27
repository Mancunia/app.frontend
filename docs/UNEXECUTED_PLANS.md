# Unexecuted Plans & Tech Debt

This document tracks features and refinements planned in the design specs but not yet fully implemented in the codebase.

## Consumer Application

### 1. Hearth Card (Home Page Widget)
- **Spec:** A mobile-only widget at the bottom of the home screen (`pages/app/index.vue`) that appears when a book is playing.
- **Status:** Missing. The home page currently only shows the greeting and book grid.
- **Requirement:** Integrate with `usePlayer` and `useAuthStore` to show thumbnail, progress, and play/pause.

### 2. Chapter Type Chips
- **Spec:** Chapter list items should clearly indicate format (Audio vs. Ebook).
- **Status:** `components/ui/app/chapter.vue` shows "Read" or "Play" buttons, but lacks visual format pills/icons in the list view.
- **Requirement:** Add `📖 Ebook` and `🎤 Audio` pills.

### 3. Layout Consistency
- **Spec:** All pages must follow the Akan-themed header/nav system.
- **Status:** `layouts/default.vue` is a blank shell.
- **Requirement:** Add the branded Navbar and Navigator (for mobile) to `default.vue` or ensure all routes use `app-layout`.

## Admin Dashboard

### 1. Period Automation
- **Spec:** Ability to set periods to "Auto (monthly)".
- **Status:** UI exists in `pages/admin/period.vue`, but the backend logic for automatic rolling is not yet implemented.
- **Requirement:** Backend cron/trigger support.

### 2. Advanced Metrics
- **Spec:** KPIs like "Hours listened", "Avg tenure", and "Churn rate".
- **Status:** Currently show as `—` (placeholders).
- **Requirement:** Analytics engine to aggregate listening duration and subscription lifecycle data.

### 3. Add Book Wizard (Automation)
- **Spec:** Step-by-step wizard for book creation including AI Voice and Chapter composing.
- **Status:** Steps 2 (Voice) and 3 (Chapters) in `pages/admin/books/new.vue` are stubs.
- **Requirement:** Real integration with the AI voice service and an inline chapter editor.

### 4. Search & Filters
- **Spec:** Debounced search across all list views (Books, Users, etc.).
- **Status:** Partially implemented. Needs consistent rollout to all admin tables.

---
**Date Updated:** 2026-05-10
