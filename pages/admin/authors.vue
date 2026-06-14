<template>
  <div class="authors-page">
    <header class="page-hdr">
      <h1 class="page-title">Authors</h1>
      <button class="btn-primary" @click="openPanel(null)">+ New author</button>
    </header>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading…</div>
      <table v-else class="data-table">
        <thead>
          <tr><th>Name</th><th>Bio</th><th>Status</th><th>Created</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="a in authors" :key="a.id" class="data-row">
            <td class="cell-name">{{ a.name }}</td>
            <td class="cell-desc">{{ a.bio?.slice(0, 80) }}{{ (a.bio?.length ?? 0) > 80 ? '…' : '' }}</td>
            <td>
              <span class="status-pill" :class="a.active ? 'status-active' : 'status-inactive'">
                {{ a.active ? 'active' : 'inactive' }}
              </span>
            </td>
            <td class="cell-date">{{ a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—' }}</td>
            <td class="cell-actions">
              <button class="action-btn" @click="openPanel(a)">Edit</button>
              <button class="action-btn action-btn--danger" @click="confirmDelete(a)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && authors.length === 0" class="empty">No authors yet.</p>
    </div>

    <div v-if="panelOpen" class="panel-overlay" @click.self="panelOpen = false">
      <div class="panel">
        <div class="panel-hdr">
          <span class="panel-title">{{ editingAuthor ? 'Edit author' : 'New author' }}</span>
          <button class="close-btn" @click="panelOpen = false">×</button>
        </div>
        <div class="form-fields">
          <div class="field-group">
            <label class="field-label">Name *</label>
            <input v-model="form.name" class="field-input" placeholder="Author name" />
          </div>
          <div class="field-group">
            <label class="field-label">Bio</label>
            <textarea v-model="form.bio" class="field-textarea" rows="3" placeholder="Short biography" />
          </div>
          <div class="field-group">
            <label class="toggle-label">
              <input type="checkbox" v-model="form.active" /> Active
            </label>
          </div>
        </div>
        <p v-if="formError" class="error-msg">{{ formError }}</p>
        <button class="btn-primary" @click="submitForm" :disabled="formSaving || !form.name.trim()">
          {{ formSaving ? 'Saving…' : editingAuthor ? 'Save changes' : 'Create' }}
        </button>
      </div>
    </div>

    <CommonModal v-model="deleteModal">
      <div class="delete-confirm">
        <h3 class="delete-title">Delete author?</h3>
        <p class="delete-msg">This will fail if the author has books associated.</p>
        <div class="delete-buttons">
          <button class="btn-ghost" @click="deleteModal = false">Cancel</button>
          <button class="btn-danger" @click="handleDelete" :disabled="deleting">
            {{ deleting ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
        <p v-if="deleteError" class="error-msg">{{ deleteError }}</p>
      </div>
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '@/services/admin/author'
import type { AuthorType, AuthorRequest } from '~/types/admin/author'

definePageMeta({ title: 'Authors', middleware: 'admin', layout: 'admin-layout' })

const authors = ref<AuthorType[]>([])
const loading = ref(false)
const panelOpen = ref(false)
const editingAuthor = ref<AuthorType | null>(null)
const form = reactive<AuthorRequest>({ name: '', bio: '', active: true })
const formSaving = ref(false)
const formError = ref('')
const deleteModal = ref(false)
const deleting = ref(false)
const deleteError = ref('')
const deleteTarget = ref<AuthorType | null>(null)

const fetchAuthors = async () => {
  loading.value = true
  const res = await getAuthors()
  if (res?.data) {
    authors.value = res.data
  }
  loading.value = false
}

const openPanel = (author: AuthorType | null) => {
  editingAuthor.value = author
  if (author) {
    form.name = author.name
    form.bio = author.bio ?? ''
    form.active = author.active
  } else {
    form.name = ''
    form.bio = ''
    form.active = true
  }
  formError.value = ''
  panelOpen.value = true
}

const submitForm = async () => {
  formSaving.value = true; formError.value = ''
  try {
    if (editingAuthor.value) {
      const res = await updateAuthor(editingAuthor.value.id, { ...form }) as any
      if (res) {
        const idx = authors.value.findIndex(a => a.id === editingAuthor.value!.id)
        if (idx !== -1) authors.value[idx] = res
      }
    } else {
      const res = await createAuthor({ ...form }) as any
      if (res) {
        authors.value.unshift(res)
      }

    }
    panelOpen.value = false
  } catch (e) {
    formError.value = (e as Error).message ?? 'Failed to save.'
  } finally { formSaving.value = false }
}

const confirmDelete = (author: AuthorType) => {
  deleteTarget.value = author
  deleteError.value = ''
  deleteModal.value = true
}

const handleDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true; deleteError.value = ''
  try {
    await deleteAuthor(deleteTarget.value.id)
    authors.value = authors.value.filter(a => a.id !== deleteTarget.value!.id)
    deleteModal.value = false
  } catch (e) {
    deleteError.value = (e as Error).message ?? 'Cannot delete: author may have books.'
  } finally { deleting.value = false }
}

onMounted(fetchAuthors)
</script>

<style scoped>
.authors-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.btn-primary { padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.data-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.data-row:last-child td { border-bottom: none; }
.cell-name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.cell-desc { font-family: var(--font-sans); font-size: 12.5px; color: var(--muted); max-width: 280px; }
.cell-date { font-family: var(--font-mono); font-size: 11.5px; color: var(--muted); white-space: nowrap; }
.cell-actions { display: flex; gap: 8px; }
.action-btn { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); background: none; border: none; cursor: pointer; padding: 0; }
.action-btn:hover { text-decoration: underline; }
.action-btn--danger { color: var(--hibiscus); }
.status-pill { display: inline-flex; padding: 2px 9px; border-radius: 20px; font-family: var(--font-sans); font-size: 11px; font-weight: 600; }
.status-active { background: rgba(46,125,50,0.12); color: #2e7d32; }
.status-inactive { background: rgba(31,23,20,0.08); color: var(--muted); }
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
.toggle-label { font-family: var(--font-sans); font-size: 13px; color: var(--ink); display: flex; align-items: center; gap: 6px; cursor: pointer; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
.delete-confirm { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px; text-align: center; }
.delete-title { font-family: var(--font-display); font-size: 18px; color: var(--ink); margin: 0; }
.delete-msg { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }
.delete-buttons { display: flex; gap: 12px; margin-top: 8px; }
.btn-ghost { font-family: var(--font-sans); font-size: 13px; color: var(--muted); background: none; border: 1px solid var(--hairline); padding: 8px 20px; border-radius: 8px; cursor: pointer; }
.btn-danger { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: white; background: var(--hibiscus); border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
