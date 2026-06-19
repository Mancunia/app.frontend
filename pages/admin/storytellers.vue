<template>
  <div class="storytellers-page">
    <header class="page-hdr">
      <div>
        <h1 class="page-title">Storytellers</h1>
        <p class="page-sub">{{ total }} storytellers</p>
      </div>
      <button class="btn-primary" @click="showAddForm = !showAddForm">
        {{ showAddForm ? '− Cancel' : '+ Add storyteller' }}
      </button>
    </header>

    <div v-if="showAddForm" class="add-form panel">
      <div class="field-row">
        <div class="field-group flex-1"><label class="field-label">Email</label><input v-model="newUser.email" class="field-input" /></div>
        <div class="field-group flex-1"><label class="field-label">Username</label><input v-model="newUser.username" class="field-input" /></div>
        <div class="field-group flex-1"><label class="field-label">Password</label>
          <UiPassword v-model="newUser.password" input-class="field-input" placeholder="Password" />
        </div>
      </div>
      <p v-if="addError" class="error-msg">{{ addError }}</p>
      <button class="btn-primary" @click="handleAdd" :disabled="adding">{{ adding ? 'Adding…' : 'Add storyteller' }}</button>
    </div>

    <div class="toolbar">
      <input v-model="search" type="search" class="search-input" placeholder="Search by email…" />
    </div>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading…</div>
      <table v-else class="st-table">
        <thead><tr><th>Storyteller</th><th>Joined</th><th></th></tr></thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="st-row">
            <td>
              <div class="user-cell">
                <div class="avatar-ph">{{ initials(user.username) }}</div>
                <div class="user-info">
                  <span class="user-name">{{ user.username }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </td>
            <td class="date-cell">{{ formatDate(user.createdAt) }}</td>
            <td><NuxtLink :to="routes.admin.usersDetail + user.id" class="view-link">View →</NuxtLink></td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && users.length === 0" class="empty">No storytellers found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserProfiles } from '@/services/admin/users'
import routes from '~/routes'

definePageMeta({ title: 'Storytellers', middleware: 'admin', layout: 'admin-layout' })

const { debounce } = useUtils()
const users = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const search = ref('')
const showAddForm = ref(false)
const newUser = reactive({ email: '', username: '', password: '' })
const adding = ref(false)
const addError = ref('')

const fetchStorytellers = async () => {
  loading.value = true
  const res = await getUserProfiles({ search: search.value, account: USER_ROLES.ASSOCIATE })
  if (res) { users.value = res; 
    total.value = users.value.length }
    loading.value = false
}

const debouncedFetch = debounce(fetchStorytellers, 400)
watch(search, debouncedFetch)

const handleAdd = async () => {
  adding.value = true; addError.value = ''
  try {
    await useRequest(
      { url: 'admin/user/add', method: HTTP_METHODS.POST, data: { ...newUser, account: USER_ROLES.ASSOCIATE } },
      USER_ROLES.ADMIN
    )
    Object.assign(newUser, { email: '', username: '', password: '' })
    showAddForm.value = false
    await fetchStorytellers()
  } catch (e) { addError.value = (e as Error).message ?? 'Failed to add.' }
  finally { adding.value = false }
}

const initials = (name: string) => name?.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase() ?? '?'
const formatDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

onMounted(fetchStorytellers)
</script>

<style scoped>
.storytellers-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: flex-start; justify-content: space-between; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0 0 4px; }
.page-sub { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }
.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; }
.add-form { display: flex; flex-direction: column; gap: 14px; }
.field-row { display: flex; gap: 12px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.flex-1 { flex: 1; }
.field-label { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
.field-input { padding: 9px 14px; background: var(--paper); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; width: 100%; box-sizing: border-box; }
.field-input:focus { border-color: var(--ochre); }
.btn-primary { align-self: flex-start; padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
.toolbar { display: flex; gap: 12px; }
.search-input { flex: 1; max-width: 340px; padding: 9px 14px; background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; }
.search-input:focus { border-color: var(--ochre); }
.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state, .empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.st-table { width: 100%; border-collapse: collapse; }
.st-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.st-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.st-row:last-child td { border-bottom: none; }
.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar-ph { width: 32px; height: 32px; border-radius: 50%; background: var(--calabash); display: flex; align-items: center; justify-content: center; font-family: var(--font-sans); font-size: 11px; font-weight: 700; color: var(--kola); flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; gap: 1px; }
.user-name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.user-email { font-family: var(--font-sans); font-size: 11.5px; color: var(--muted); }
.date-cell { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
.view-link { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); text-decoration: none; font-weight: 500; }
.view-link:hover { text-decoration: underline; }
</style>
