<template>
  <div class="listeners">
    <header class="listeners-header">
      <h1 class="page-title">Listeners</h1>
    </header>

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
          <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
            <td>
              <div class="user-cell">
                <img v-if="user.picture" :src="user.picture" class="avatar" alt="" />
                <div v-else class="avatar-placeholder">{{ initials(user.name) }}</div>
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="role-pill" :class="rolePillClass(user.account)">
                {{ roleLabel(user.account) }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(user.createdAt) }}</td>
            <td class="date-cell">{{ user.lastSeen ? formatDate(user.lastSeen) : '—' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && filteredUsers.length === 0" class="empty">No users in this group.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ title: 'Listeners', middleware: 'admin', layout: 'admin-layout' });

const { setCommon } = useCommon(USER_ROLES.ADMIN);

const tabs = [
  { id: 'all',           label: 'Everyone'      },
  { id: 'listeners',     label: 'Listeners'     },
  { id: 'storytellers',  label: 'Storytellers'  },
  { id: 'admins',        label: 'Admins'        },
];
const activeTab = ref('all');

const loading = ref(false);
const users = ref<any[]>([]);

const filteredUsers = computed(() => {
  if (activeTab.value === 'all') return users.value;
  if (activeTab.value === 'listeners')    return users.value.filter(u => u.account === 0);
  if (activeTab.value === 'storytellers') return users.value.filter(u => u.account === 1);
  if (activeTab.value === 'admins')       return users.value.filter(u => u.account === 2);
  return users.value;
});

const initials = (name: string) =>
  name?.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() ?? '?';

const roleLabel = (account: number) =>
  account === 2 ? 'Admin' : account === 1 ? 'Storyteller' : 'Listener';

const rolePillClass = (account: number) =>
  account === 2 ? 'pill-admin' : account === 1 ? 'pill-storyteller' : 'pill-listener';

const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await useRequest<any[]>({ url: '/admin/user', method: HTTP_METHODS.GET }, USER_ROLES.ADMIN);
    if (res.data) users.value = res.data;
  } finally {
    loading.value = false;
  }
};

onMounted(() => { fetchUsers(); setCommon(); });
</script>

<style scoped>
.listeners { display: flex; flex-direction: column; gap: 20px; }

.listeners-header { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }

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

.role-pill {
  display: inline-flex; align-items: center; padding: 3px 10px;
  border-radius: 20px; font-family: var(--font-sans); font-size: 11px; font-weight: 600;
}
.pill-listener    { background: rgba(226,211,197,0.5); color: var(--kola); }
.pill-storyteller { background: rgba(201,122,58,0.15); color: var(--ochre); }
.pill-admin       { background: rgba(31,23,20,0.10); color: var(--ink); }

.date-cell { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
</style>
