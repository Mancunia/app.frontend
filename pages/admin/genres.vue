<template>
  <div class="genres-page">
    <header class="page-hdr">
      <h1 class="page-title">Genres</h1>
      <button class="btn-primary" @click="openPanel(null)">+ New genre</button>
    </header>

    <div class="toolbar">
      <input v-model="search" class="search-input" placeholder="Search genres…" aria-label="Search genres" />
    </div>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading…</div>
      <table v-else class="data-table">
        <thead>
          <tr><th>Name</th><th>Status</th><th>Created</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="g in genres" :key="g.id" class="data-row">
            <td class="cell-name">{{ g.name }}</td>
            <td>
              <button class="status-toggle" :class="g.active ? 'status-active' : 'status-inactive'"
                @click="toggleStatus(g)" :title="g.active ? 'Deactivate' : 'Activate'">
                {{ g.active ? 'active' : 'inactive' }}
              </button>
            </td>
            <td class="cell-date">{{ g.createdAt ? new Date(g.createdAt).toLocaleDateString() : '—' }}</td>
            <td class="cell-actions">
              <button class="action-btn" @click="openPanel(g)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && genres.length === 0" class="empty">No genres yet.</p>
    </div>

    <div class="pagination-bar" v-if="totalPages > 1">
      <button :disabled="page <= 1" @click="goTo(page - 1)" class="page-btn">←</button>
      <span class="page-info">{{ page }} / {{ totalPages }}</span>
      <button :disabled="page >= totalPages" @click="goTo(page + 1)" class="page-btn">→</button>
    </div>

    <div v-if="panelOpen" class="panel-overlay" @click.self="panelOpen = false">
      <div class="panel">
        <div class="panel-hdr">
          <span class="panel-title">{{ editingGenre ? 'Edit genre' : 'New genre' }}</span>
          <button class="close-btn" @click="panelOpen = false">×</button>
        </div>
        <div class="form-fields">
          <div class="field-group">
            <label class="field-label">Name *</label>
            <input v-model="form.name" class="field-input" placeholder="Genre name" @keyup.enter="submitForm" />
          </div>
        </div>
        <p v-if="formError" class="error-msg">{{ formError }}</p>
        <button class="btn-primary" @click="submitForm" :disabled="formSaving || !form.name.trim()">
          {{ formSaving ? 'Saving…' : editingGenre ? 'Save changes' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getGenres, createGenre, updateGenre, toggleGenreActive } from '@/services/admin/genre'
import type { GenreType } from '~/types/admin/genre'

definePageMeta({ title: 'Genres', middleware: 'admin', layout: 'admin-layout' })

const genres = ref<GenreType[]>([])
const loading = ref(false)
const search = ref('')
const page = ref(1)
const totalPages = ref(1)
const limit = 10

const panelOpen = ref(false)
const editingGenre = ref<GenreType | null>(null)
const form = reactive({ name: '' })
const formSaving = ref(false)
const formError = ref('')

const fetchGenres = async (p = page.value, q = search.value) => {
  loading.value = true
  try {
    const res = await getGenres({ page: p, limit, search: q })
    if (res?.data) {
      const result = res.data as any
      genres.value = Array.isArray(result) ? result : (result.data ?? [])
      if (result.total && result.page) {
        page.value = result.page
        totalPages.value = Math.ceil((result.total ?? 0) / limit)
      }
    }
  } finally {
    loading.value = false
  }
}

const { debounce } = useUtils()
const debouncedSearch = debounce((q: string) => {
  page.value = 1
  fetchGenres(1, q)
}, 300)

watch(search, (val) => debouncedSearch(val))

const openPanel = (genre: GenreType | null) => {
  editingGenre.value = genre
  form.name = genre?.name ?? ''
  formError.value = ''
  panelOpen.value = true
}

const submitForm = async () => {
  formSaving.value = true
  formError.value = ''
  try {
    if (editingGenre.value) {
      await updateGenre(editingGenre.value.id, { title: form.name.trim() })
    } else {
      await createGenre({ title: form.name.trim() })
    }
    panelOpen.value = false
    await fetchGenres()
  } catch (e) {
    formError.value = (e as Error).message ?? 'Failed to save.'
  } finally {
    formSaving.value = false
  }
}

const toggleStatus = async (genre: GenreType) => {
  try {
    await toggleGenreActive(genre.id)
    genre.active = !genre.active
  } catch {
    // silently fail — backend will surface errors if needed
  }
}

const goTo = (p: number) => {
  page.value = p
  fetchGenres(p)
}

onMounted(() => fetchGenres())
</script>

<style scoped>
.genres-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.btn-primary { padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; white-space: nowrap; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.toolbar input { width: 100%; max-width: 320px; padding: 9px 14px; background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; box-sizing: border-box; }
.toolbar input:focus { border-color: var(--ochre); }
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.data-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.data-row:last-child td { border-bottom: none; }
.cell-name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.cell-date { font-family: var(--font-mono); font-size: 11.5px; color: var(--muted); white-space: nowrap; }
.cell-actions { display: flex; gap: 8px; }
.action-btn { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); background: none; border: none; cursor: pointer; padding: 0; }
.action-btn:hover { text-decoration: underline; }
.status-toggle { font-family: var(--font-sans); font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 20px; border: none; cursor: pointer; }
.status-active { background: rgba(46,125,50,0.12); color: #2e7d32; }
.status-inactive { background: rgba(31,23,20,0.08); color: var(--muted); }
.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.pagination-bar { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 8px 0; }
.page-btn { background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; padding: 6px 14px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); cursor: pointer; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-family: var(--font-sans); font-size: 12px; color: var(--muted); }
.panel-overlay { position: fixed; inset: 0; background: rgba(31,23,20,0.4); z-index: 100; display: flex; justify-content: flex-end; }
.panel { width: 400px; height: 100vh; background: var(--paper); padding: 28px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
.panel-hdr { display: flex; align-items: center; justify-content: space-between; }
.panel-title { font-family: var(--font-display); font-size: 18px; color: var(--ink); }
.close-btn { background: none; border: none; font-size: 20px; color: var(--muted); cursor: pointer; line-height: 1; }
.form-fields { display: flex; flex-direction: column; gap: 14px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
.field-input { padding: 9px 14px; background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; width: 100%; box-sizing: border-box; }
.field-input:focus { border-color: var(--ochre); }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
</style>
