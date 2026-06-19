<template>
  <div class="reports-page">
    <header class="page-hdr">
      <h1 class="page-title">Comment Reports</h1>
    </header>

    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading…</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Comment Text</th>
            <th>Reason</th>
            <th>Reporter</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reports" :key="r.id" class="data-row">
            <td class="cell-comment">
              <div class="comment-text-wrap" :class="{ expanded: expandedComments.includes(r.id) }">
                {{ r.comment?.comment || '—' }}
              </div>
              <button v-if="r.comment?.comment?.length > 100" class="read-more" @click="toggleExpand(r.id)">
                {{ expandedComments.includes(r.id) ? 'Read less' : 'Read more' }}
              </button>
            </td>
            <td class="cell-reason">{{ r.reason || '—' }}</td>
            <td class="cell-reporter">{{ r.reporter?.name || '—' }}</td>
            <td>
              <select :value="r.status" @change="updateStatus(r.id, ($event.target as HTMLSelectElement).value as any)" class="status-select" :class="'status-' + r.status">
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
            </td>
            <td class="cell-date">{{ formatDate(r.createdAt, 'MMM D, YYYY') }}</td>
            <td class="cell-actions">
              <button class="action-btn action-btn--danger" @click="confirmDelete(r)">Delete Comment</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && reports.length === 0" class="empty">No reports found.</p>
    </div>

    <CommonModal v-model="deleteModal">
      <div class="delete-confirm">
        <h3 class="delete-title">Delete this comment?</h3>
        <p class="delete-msg">This action is permanent and will remove the comment from the book.</p>
        <div class="delete-buttons">
          <button class="btn-ghost" @click="deleteModal = false">Cancel</button>
          <button class="btn-danger" @click="handleDelete" :disabled="deleting">
            {{ deleting ? 'Deleting…' : 'Delete Permanent' }}
          </button>
        </div>
        <p v-if="deleteError" class="error-msg">{{ deleteError }}</p>
      </div>
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import { getReports, updateReportStatus, deleteComment } from '~/services/admin/reports'

definePageMeta({ title: 'Comment Reports', middleware: 'admin', layout: 'admin-layout' })

const { formatDate } = useUtils()
const { notify } = useNotification()

const reports = ref<any[]>([])
const loading = ref(false)
const expandedComments = ref<string[]>([])

const deleteModal = ref(false)
const deleting = ref(false)
const deleteError = ref('')
const deleteTarget = ref<any>(null)

const fetchReports = async () => {
  loading.value = true
  try {
    const res = await getReports() as any
    if (res) {
      reports.value = res.results || res || []
    }
  } catch (error) {
    console.error('Failed to fetch reports', error)
  } finally {
    loading.value = false
  }
}

const toggleExpand = (id: string) => {
  if (expandedComments.value.includes(id)) {
    expandedComments.value = expandedComments.value.filter(i => i !== id)
  } else {
    expandedComments.value.push(id)
  }
}

const updateStatus = async (id: string, status: 'reviewed' | 'resolved' | 'pending') => {
  try {
    await updateReportStatus(id, status)
    const report = reports.value.find(r => r.id === id)
    if (report) report.status = status
    notify({ title: 'Updated', message: 'Report status updated', type: 'success' })
  } catch (error) {
    notify({ title: 'Error', message: 'Failed to update status', type: 'error' })
  }
}

const confirmDelete = (report: any) => {
  deleteTarget.value = report
  deleteError.value = ''
  deleteModal.value = true
}

const handleDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true; deleteError.value = ''
  try {
    await deleteComment(deleteTarget.value.comment.id)
    // After deleting comment, we might want to mark the report as resolved
    await updateReportStatus(deleteTarget.value.id, 'resolved')
    reports.value = reports.value.filter(r => r.id !== deleteTarget.value.id)
    deleteModal.value = false
    notify({ title: 'Deleted', message: 'Comment deleted successfully', type: 'success' })
  } catch (e) {
    deleteError.value = (e as Error).message ?? 'Failed to delete comment.'
  } finally { deleting.value = false }
}

onMounted(fetchReports)
</script>

<style scoped>
.reports-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }

.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--hairline); }
.data-row td { padding: 12px 16px; border-bottom: 1px solid var(--hairline); vertical-align: top; }
.data-row:last-child td { border-bottom: none; }

.cell-comment { max-width: 300px; }
.comment-text-wrap { 
  font-family: var(--font-sans); 
  font-size: 13px; 
  color: var(--ink); 
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
.comment-text-wrap.expanded {
  display: block;
  overflow: visible;
}
.read-more {
  background: none;
  border: none;
  color: var(--ochre);
  font-size: 11px;
  cursor: pointer;
  padding: 4px 0 0;
  font-weight: 600;
}

.cell-reason { font-family: var(--font-sans); font-size: 13px; color: var(--muted); max-width: 200px; }
.cell-reporter { font-family: var(--font-sans); font-size: 13px; color: var(--ink); }
.cell-date { font-family: var(--font-mono); font-size: 11.5px; color: var(--muted); white-space: nowrap; }

.status-select {
  padding: 4px 8px;
  border-radius: 6px;
  font-family: var(--font-sans);
  font-size: 12px;
  border: 1px solid var(--hairline);
  outline: none;
  background: var(--paper);
}

.status-pending { border-left: 4px solid #f59e0b; }
.status-reviewed { border-left: 4px solid #3b82f6; }
.status-resolved { border-left: 4px solid #10b981; }

.cell-actions { display: flex; gap: 8px; }
.action-btn { font-family: var(--font-sans); font-size: 12px; color: var(--ochre); background: none; border: none; cursor: pointer; padding: 0; text-align: left; }
.action-btn:hover { text-decoration: underline; }
.action-btn--danger { color: var(--hibiscus); }

.empty { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }

.delete-confirm { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px; text-align: center; }
.delete-title { font-family: var(--font-display); font-size: 18px; color: var(--ink); margin: 0; }
.delete-msg { font-family: var(--font-sans); font-size: 13px; color: var(--muted); margin: 0; }
.delete-buttons { display: flex; gap: 12px; margin-top: 8px; }
.btn-ghost { font-family: var(--font-sans); font-size: 13px; color: var(--muted); background: none; border: 1px solid var(--hairline); padding: 8px 20px; border-radius: 8px; cursor: pointer; }
.btn-danger { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: white; background: var(--hibiscus); border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
</style>