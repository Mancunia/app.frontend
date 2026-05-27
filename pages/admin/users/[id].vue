<template>
  <div class="user-detail">
    <NuxtLink :to="routes.admin.users" class="back-link">← Listeners</NuxtLink>

    <div v-if="loading" class="loading">Loading…</div>
    <div v-else-if="user" class="profile-card">
      <div class="avatar-wrap">
        <img v-if="user.dp" :src="user.dp" class="avatar" alt="" />
        <div v-else class="avatar-placeholder">{{ initials(user.username) }}</div>
      </div>
      <div class="profile-info">
        <h1 class="username">{{ user.username }}</h1>
        <p class="email">{{ user.email }}</p>
        <span class="role-pill" :class="rolePillClass(user.account)">{{ roleLabel(user.account) }}</span>
        <p class="joined">Joined {{ formatDate(user.createdAt) }}</p>
        <p v-if="user.bio" class="bio">{{ user.bio }}</p>
      </div>
    </div>

    <div v-if="user" class="role-section">
      <h2 class="section-title">Role</h2>
      <div class="role-row">
        <select v-model="selectedRole" class="role-select">
          <option :value="0">Listener</option>
          <option :value="1">Storyteller</option>
          <option :value="2">Admin</option>
        </select>
        <button class="btn-primary" @click="updateRole" :disabled="roleUpdating">
          {{ roleUpdating ? 'Updating…' : 'Update role' }}
        </button>
      </div>
      <p v-if="roleSuccess" class="success-msg">Role updated.</p>
      <p v-if="roleError" class="error-msg">{{ roleError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes'
import { getUser, changeRole } from '@/services/admin/users'

definePageMeta({ title: 'User Detail', middleware: 'admin', layout: 'admin-layout' })

const route = useRoute()
const id = route.params.id as string

const user = ref<any>(null)
const loading = ref(true)
const selectedRole = ref(0)
const roleUpdating = ref(false)
const roleSuccess = ref(false)
const roleError = ref('')

onMounted(async () => {
  const res = await getUser(id)
  if (res?.data) {
    user.value = res.data
    selectedRole.value = (res.data as any).account
  }
  loading.value = false
})

const updateRole = async () => {
  roleUpdating.value = true; roleSuccess.value = false; roleError.value = ''
  try {
    await changeRole({ userId: id, type: selectedRole.value as any })
    user.value.account = selectedRole.value
    roleSuccess.value = true
    setTimeout(() => { roleSuccess.value = false }, 2500)
  } catch (e) {
    roleError.value = (e as Error).message ?? 'Failed to update role.'
  } finally { roleUpdating.value = false }
}

const initials = (name: string) => name?.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase() ?? '?'
const roleLabel = (account: number) => account === 2 ? 'Admin' : account === 1 ? 'Storyteller' : 'Listener'
const rolePillClass = (account: number) => account === 2 ? 'pill-admin' : account === 1 ? 'pill-storyteller' : 'pill-listener'
const formatDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
</script>

<style scoped>
.user-detail { display: flex; flex-direction: column; gap: 24px; max-width: 600px; }
.back-link { font-family: var(--font-sans); font-size: 13px; color: var(--muted); text-decoration: none; }
.back-link:hover { color: var(--ochre); }
.loading { font-family: var(--font-sans); font-size: 13px; color: var(--muted); padding: 40px; text-align: center; }
.profile-card { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 24px; display: flex; gap: 20px; align-items: flex-start; }
.avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.avatar-placeholder { width: 64px; height: 64px; border-radius: 50%; background: var(--calabash); display: flex; align-items: center; justify-content: center; font-family: var(--font-sans); font-size: 18px; font-weight: 700; color: var(--kola); flex-shrink: 0; }
.profile-info { display: flex; flex-direction: column; gap: 6px; }
.username { font-family: var(--font-display); font-size: 20px; color: var(--ink); margin: 0; }
.email { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }
.joined { font-family: var(--font-sans); font-size: 12px; color: var(--muted); margin: 0; }
.bio { font-family: var(--font-sans); font-size: 13px; color: var(--ink); margin: 0; }
.role-pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-family: var(--font-sans); font-size: 11px; font-weight: 600; }
.pill-listener    { background: rgba(226,211,197,0.5); color: var(--kola); }
.pill-storyteller { background: rgba(201,122,58,0.15); color: var(--ochre); }
.pill-admin       { background: rgba(31,23,20,0.10); color: var(--ink); }
.role-section { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.section-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); margin: 0; }
.role-row { display: flex; gap: 12px; align-items: center; }
.role-select { padding: 9px 14px; background: var(--paper); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; }
.btn-primary { padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.success-msg { font-family: var(--font-sans); font-size: 13px; color: #2e7d32; margin: 0; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
</style>
