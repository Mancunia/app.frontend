<template>
  <div class="listeners">
    <header class="listeners-header">
      <h1 class="page-title">Listeners</h1>
    </header>

    <div class="search-bar">
      <input v-model="search" type="search" class="search-input" placeholder="Search by email…" aria-label="Search users" />
    </div>

    <!-- Filter tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >{{ tab.label }}</button>
    </div>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading listeners…</div>
      <table v-else class="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Last seen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="user-row">
            <td>
              <NuxtLink :to="routes.admin.usersDetail + user.id" class="user-cell-link">
                <div class="user-cell">
                  <img v-if="user.dp" :src="user.dp" class="avatar" alt="" />
                  <div v-else class="avatar-placeholder">{{ initials(user.username) }}</div>
                  <div class="user-info">
                    <span class="user-name">{{ user.username }}</span>
                    <span class="user-email">{{ user.email }}</span>
                  </div>
                </div>
              </NuxtLink>
            </td>
            <td>
              <select
                class="role-select"
                :value="user.account"
                @change="handleRoleChange(user, Number(($event.target as HTMLSelectElement).value))"
              >
                <option :value="0">Listener</option>
                <option :value="1">Storyteller</option>
                <option :value="2">Admin</option>
              </select>
            </td>
            <td class="date-cell">{{ formatDate(user.createdAt) }}</td>
            <td class="date-cell">{{ user.lastSeen ? formatDate(user.lastSeen) : '—' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && users.length === 0" class="empty">No users found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserProfiles, changeRole } from '@/services/admin/users'
import routes from '~/routes'

definePageMeta({ title: 'Listeners', middleware: 'admin', layout: 'admin-layout' })

const { setCommon } = useCommon(USER_ROLES.ADMIN)
const { debounce } = useUtils()

const tabs = [
  { id: 'all',          label: 'Everyone'     },
  { id: 'listeners',    label: 'Listeners'    },
  { id: 'storytellers', label: 'Storytellers' },
  { id: 'admins',       label: 'Admins'       },
]
const activeTab = ref('all')
const search = ref('')
const loading = ref(false)
const users = ref<any[]>([])

const accountFilter = computed(() => {
  if (activeTab.value === 'listeners')    return USER_ROLES.USER
  if (activeTab.value === 'storytellers') return USER_ROLES.ASSOCIATE
  if (activeTab.value === 'admins')       return USER_ROLES.ADMIN
  return undefined
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await getUserProfiles({
      search: search.value,
      account: accountFilter.value as any,
    })
    if (res?.data) users.value = res.data as any
  } finally { loading.value = false }
}

const debouncedFetch = debounce(fetchUsers, 400)
watch([search, activeTab], debouncedFetch)

const handleRoleChange = async (user: any, newRole: number) => {
  await changeRole({ userId: user.id, type: newRole as any })
  user.account = newRole
}

const initials = (name: string) => name?.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase() ?? '?'
const formatDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

onMounted(() => { fetchUsers(); setCommon() })
</script>

<style scoped>
.listeners { display: flex; flex-direction: column; gap: 20px; }

.listeners-header { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }

.search-bar { margin-bottom: 4px; }
.search-input { width: 100%; max-width: 340px; padding: 9px 14px; background: var(--card); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; }
.search-input:focus { border-color: var(--ochre); }

.tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--hairline); }
.tab {
  padding: 8px 16px; font-family: var(--font-sans); font-size: 13px;
  color: var(--muted); background: none; border: none;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
}
.tab:hover { color: var(--ink); }
.tab.active { color: var(--ochre); border-bottom-color: var(--ochre); font-weight: 600; }

.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.users-table { width: 100%; border-collapse: collapse; }
.users-table th {
  font-family: var(--font-sans); font-size: 10px; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--muted); text-align: left;
  padding: 12px 16px; border-bottom: 1px solid var(--hairline);
}
.user-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.user-row:last-child td { border-bottom: none; }
.user-row:hover td { background: rgba(201,122,58,0.04); }

.user-cell-link { text-decoration: none; display: block; }
.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.avatar-placeholder {
  width: 32px; height: 32px; border-radius: 50%; background: var(--calabash);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-sans); font-size: 11px; font-weight: 700; color: var(--kola);
  flex-shrink: 0;
}
.user-info { display: flex; flex-direction: column; gap: 1px; }
.user-name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.user-email { font-family: var(--font-sans); font-size: 11.5px; color: var(--muted); }

.role-select { padding: 4px 8px; background: var(--card); border: 1px solid var(--hairline); border-radius: 6px; font-family: var(--font-sans); font-size: 12px; color: var(--ink); outline: none; cursor: pointer; }

.date-cell { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
</style>
