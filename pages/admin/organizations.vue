<template>
  <div class="orgs-page">
    <header class="page-hdr">
      <h1 class="page-title">Organisations</h1>
      <button class="btn-primary" @click="openPanel(null)">+ New organisation</button>
    </header>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading…</div>
      <table v-else class="orgs-table">
        <thead>
          <tr><th>Name</th><th>Type</th><th>Description</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="org in orgs" :key="org.id" class="org-row">
            <td class="org-name">{{ org.name }}</td>
            <td class="org-type">{{ org.type }}</td>
            <td class="org-desc">{{ org.description?.slice(0, 80) }}{{ (org.description?.length ?? 0) > 80 ? '…' : '' }}</td>
            <td><button class="edit-btn" @click="openPanel(org)">Edit</button></td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && orgs.length === 0" class="empty">No organisations yet.</p>
    </div>

    <!-- Slide-in panel -->
    <div v-if="panelOpen" class="panel-overlay" @click.self="panelOpen = false">
      <div class="panel">
        <div class="panel-hdr">
          <span class="panel-title">{{ editingOrg ? 'Edit organisation' : 'New organisation' }}</span>
          <button class="close-btn" @click="panelOpen = false">×</button>
        </div>
        <div class="form-fields">
          <div class="field-group">
            <label class="field-label">Name *</label>
            <input v-model="form.name" class="field-input" placeholder="Organisation name" />
          </div>
          <div class="field-group">
            <label class="field-label">Type</label>
            <input v-model="form.type" class="field-input" placeholder="e.g. Publisher, School" />
          </div>
          <div class="field-group">
            <label class="field-label">Description</label>
            <textarea v-model="form.description" class="field-textarea" rows="3" />
          </div>
        </div>
        <p v-if="formError" class="error-msg">{{ formError }}</p>
        <button class="btn-primary" @click="submitForm" :disabled="formSaving || !form.name.trim()">
          {{ formSaving ? 'Saving…' : editingOrg ? 'Save changes' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getOrgs, createOrg, updateOrg } from '@/services/admin/organization'
import type { OrganizationType, OrganizationRequest } from '~/types/admin/organization'

definePageMeta({ title: 'Organisations', middleware: 'admin', layout: 'admin-layout' })

const orgs = ref<OrganizationType[]>([])
const loading = ref(false)
const panelOpen = ref(false)
const editingOrg = ref<OrganizationType | null>(null)
const form = reactive<OrganizationRequest>({ name: '', type: '', description: '' })
const formSaving = ref(false)
const formError = ref('')

const fetchOrgs = async () => {
  loading.value = true
  const res = await getOrgs()
  if (res) orgs.value = res
  loading.value = false
}

const openPanel = (org: OrganizationType | null) => {
  editingOrg.value = org
  if (org) {
    form.name = org.name
    form.type = org.type
    form.description = org.description ?? ''
  } else {
    form.name = ''; form.type = ''; form.description = ''
  }
  formError.value = ''
  panelOpen.value = true
}

const submitForm = async () => {
  formSaving.value = true; formError.value = ''
  try {
    if (editingOrg.value) {
      const res = await updateOrg(editingOrg.value.id, { ...form })
      if (res) {
        const idx = orgs.value.findIndex(o => o.id === editingOrg.value!.id)
        if (idx !== -1) orgs.value[idx] = res
      }
    } else {
      const res = await createOrg({ ...form })
      if (res) orgs.value.unshift(res)
    }
    panelOpen.value = false
  } catch (e) {
    formError.value = (e as Error).message ?? 'Failed to save.'
  } finally { formSaving.value = false }
}

onMounted(fetchOrgs)
</script>

<style scoped>
.orgs-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.btn-primary { padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.orgs-table { width: 100%; border-collapse: collapse; }
.orgs-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.org-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.org-row:last-child td { border-bottom: none; }
.org-name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.org-type { font-family: var(--font-sans); font-size: 12.5px; color: var(--ochre); }
.org-desc { font-family: var(--font-sans); font-size: 12.5px; color: var(--muted); max-width: 280px; }
.edit-btn { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); background: none; border: none; cursor: pointer; padding: 0; }
.edit-btn:hover { text-decoration: underline; }
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
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
</style>
