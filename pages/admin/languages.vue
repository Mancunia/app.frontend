<template>
  <div class="languages-page">
    <header class="page-hdr">
      <h1 class="page-title">Languages</h1>
    </header>

    <div class="add-form panel">
      <h2 class="form-title">Add language</h2>
      <div class="form-row">
        <input v-model="newTitle" class="field-input" placeholder="Language name" />
        <label class="toggle-label">
          <input type="checkbox" v-model="newActive" /> Active
        </label>
        <button class="btn-primary" @click="handleAdd" :disabled="adding || !newTitle.trim()">
          {{ adding ? 'Adding…' : 'Add' }}
        </button>
      </div>
      <p v-if="addError" class="error-msg">{{ addError }}</p>
    </div>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading…</div>
      <table v-else class="lang-table">
        <thead>
          <tr><th>Name</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr v-for="lang in languages" :key="lang.id" class="lang-row">
            <td class="lang-name">{{ lang.name }}</td>
            <td>
              <span class="status-pill" :class="lang.active ? 'status-active' : 'status-inactive'">
                {{ lang.active ? 'active' : 'inactive' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && languages.length === 0" class="empty">No languages yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLanguages, addLanguage } from '@/services/admin/language'
import type { LanguageType } from '~/types/admin/language'

definePageMeta({ title: 'Languages', middleware: 'admin', layout: 'admin-layout' })

const languages = ref<LanguageType[]>([])
const loading = ref(false)
const newTitle = ref('')
const newActive = ref(true)
const adding = ref(false)
const addError = ref('')

const fetchLanguages = async () => {
  loading.value = true
  const res = await getLanguages()
  if (res?.data) languages.value = res.data as any
  loading.value = false
}

const handleAdd = async () => {
  addError.value = ''
  adding.value = true
  try {
    const res = await addLanguage({ title: newTitle.value.trim(), active: newActive.value })
    if (res?.data) languages.value.unshift(res.data as any)
    newTitle.value = ''
    newActive.value = true
  } catch (e) {
    addError.value = (e as Error).message ?? 'Failed to add language.'
  } finally { adding.value = false }
}

onMounted(fetchLanguages)
</script>

<style scoped>
.languages-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; }
.form-title { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--muted); margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.06em; }
.form-row { display: flex; align-items: center; gap: 12px; }
.field-input { flex: 1; padding: 9px 14px; background: var(--paper); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; }
.field-input:focus { border-color: var(--ochre); }
.toggle-label { font-family: var(--font-sans); font-size: 13px; color: var(--ink); display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap; }
.btn-primary { padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; white-space: nowrap; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 4px 0 0; }
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.lang-table { width: 100%; border-collapse: collapse; }
.lang-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.lang-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.lang-row:last-child td { border-bottom: none; }
.lang-name { font-family: var(--font-sans); font-size: 13.5px; color: var(--ink); }
.status-pill { display: inline-flex; padding: 2px 9px; border-radius: 20px; font-family: var(--font-sans); font-size: 11px; font-weight: 600; }
.status-active   { background: rgba(46,125,50,0.12); color: #2e7d32; }
.status-inactive { background: rgba(31,23,20,0.08); color: var(--muted); }
.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
</style>
