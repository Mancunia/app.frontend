<template>
  <div class="quotes-page">
    <header class="page-hdr">
      <h1 class="page-title">Quotes</h1>
      <button class="add-btn" @click="openCreateModal">
        <span>+ Add Quote</span>
      </button>
    </header>
    <div class="table-wrap">
      <div v-if="loading" class="loading-state">Loading quotes…</div>
      <table v-else class="quotes-table">
        <thead>
          <tr>
            <th>Quote</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="quote in quotes" :key="quote.id || (quote as any)._id" class="quote-row">
            <td class="quote-text-cell">{{ quote.quote }}</td>
            <td class="author-cell">{{ quote.author || 'Unknown' }}</td>
            <td>
              <div class="status-wrap">
                <button
                  class="toggle"
                  :class="{ 'toggle-on': quote.active }"
                  @click="toggleActive(quote)"
                  :aria-label="quote.active ? 'Deactivate quote' : 'Activate quote'"
                >
                  <span class="toggle-thumb" />
                </button>
                <span class="status-label">{{ quote.active ? 'Active' : 'Inactive' }}</span>
              </div>
            </td>
            <td class="actions-cell">
              <button class="action-btn edit-btn" @click="openEditModal(quote)" title="Edit">
                <i class="bx bx-edit-alt"></i>
              </button>
              <button class="action-btn delete-btn" @click="confirmDelete(quote)" title="Delete">
                <i class="bx bx-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && quotes.length === 0" class="empty">No quotes found.</p>
    </div>

    <div class="pagination-container" v-if="pagination.totalPages > 1">
      <CommonPagination
        :pageIndex="pagination.page"
        :totalPages="pagination.totalPages"
        :totalRecords="pagination.totalRecords"
        @onPageChange="handlePageChange"
      />
    </div>

    <!-- Create/Edit Modal -->
    <CommonModal v-model="isModalOpen">
      <div class="modal-inner">
        <h2 class="modal-title">{{ isEditing ? 'Edit Quote' : 'Add New Quote' }}</h2>
        <form @submit.prevent="saveQuote" class="quote-form">
          <div class="field-group">
            <label class="field-label">Quote</label>
            <textarea
              v-model="form.quote"
              class="field-input textarea"
              placeholder="Enter the quote text..."
              required
              rows="4"
            ></textarea>
          </div>

          <div class="field-group">
            <label class="field-label">Author</label>
            <input
              v-model="form.author"
              type="text"
              class="field-input"
              placeholder="Author name (e.g. African Proverb)"
            />
          </div>

          <div class="field-group toggle-field">
            <label class="field-label">Active status</label>
            <div class="toggle-wrap">
              <button
                type="button"
                class="toggle"
                :class="{ 'toggle-on': form.active }"
                @click="form.active = !form.active"
              >
                <span class="toggle-thumb" />
              </button>
              <span class="setting-val">{{ form.active ? 'Visible on home page' : 'Hidden' }}</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="isModalOpen = false">Cancel</button>
            <button type="submit" class="save-btn" :disabled="saving">
              {{ saving ? 'Saving...' : (isEditing ? 'Update Quote' : 'Create Quote') }}
            </button>
          </div>
        </form>
      </div>
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import { getQuotes, createQuote, updateQuote, deleteQuote } from '~/services/admin/quote';
import type { QUOTE } from '~/types/admin/quote';

definePageMeta({ layout: 'admin-layout', middleware: 'admin', title: 'Quote Management' });

const { addSuccess, addError } = useNotification();
const { setCommon } = useCommon(USER_ROLES.ADMIN);

const quotes = ref<QUOTE[]>([]);
const loading = ref(false);
const saving = ref(false);
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentId = ref<string | null>(null);

const pagination = ref({
  page: 1,
  limit: 10,
  totalPages: 0,
  totalRecords: 0
});

const form = ref({
  quote: '',
  author: '',
  active: true
});

const fetchQuotes = async () => {
  loading.value = true;
  try {
    const res = await getQuotes({ page: pagination.value.page, limit: pagination.value.limit });
   
    if (res?.data) {
      if (Array.isArray(res.data)) {
        quotes.value = res.data;
        pagination.value.totalRecords = res.data.length;
        pagination.value.totalPages = 1;
      } else {
        quotes.value = res.data.results || [];
        pagination.value.totalRecords = res.data.records || 0;
        pagination.value.totalPages = Math.ceil((res.data.records || 0) / pagination.value.limit);
      }
    } else {
      quotes.value = [];
      pagination.value.totalRecords = 0;
      pagination.value.totalPages = 0;
    }
  } catch (e) {
    addError('Failed to fetch quotes');
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.value.page = page;
  fetchQuotes();
};

const openCreateModal = () => {
  isEditing.value = false;
  currentId.value = null;
  form.value = {
    quote: '',
    author: '',
    active: true
  };
  isModalOpen.value = true;
};

const openEditModal = (quote: QUOTE) => {
  isEditing.value = true;
  currentId.value = (quote.id || quote._id) as string;
  form.value = {
    quote: quote.quote,
    author: quote.author,
    active: quote.active
  };
  isModalOpen.value = true;
};

const saveQuote = async () => {
  saving.value = true;
  try {
    const payload = { ...form.value };
    if (!payload.author?.trim()) payload.author = 'Unknown';

    if (isEditing.value && currentId.value) {
      await updateQuote(currentId.value, payload);
      addSuccess('Quote updated successfully');
    } else {
      await createQuote(payload);
      addSuccess('Quote created successfully');
    }
    isModalOpen.value = false;
    fetchQuotes();
  } catch (e) {
    addError('Failed to save quote');
  } finally {
    saving.value = false;
  }
};

const toggleActive = async (quote: QUOTE) => {
  try {
    const nextStatus = !quote.active;
    await updateQuote((quote.id || quote._id) as string, { active: nextStatus });
    quote.active = nextStatus;
    addSuccess(`Quote ${nextStatus ? 'activated' : 'deactivated'}`);
  } catch (e) {
    addError('Failed to update status');
  }
};

const confirmDelete = async (quote: QUOTE) => {
  if (confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
    try {
      await deleteQuote((quote.id || quote._id) as string);
      addSuccess('Quote deleted successfully');
      fetchQuotes();
    } catch (e) {
      addError('Failed to delete quote');
    }
  }
};

onMounted(() => {
  setCommon();
  fetchQuotes();
});
</script>

<style scoped>
.quotes-page { display: flex; flex-direction: column; gap: 20px; }

.page-hdr { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }

.add-btn {
  padding: 10px 18px; background: var(--kola); color: var(--cream);
  border: none; border-radius: 10px; font-family: var(--font-sans);
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease; display: flex; align-items: center; gap: 8px;
}
.add-btn:hover { background: var(--ink); transform: translateY(-1px); }

.table-wrap { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; overflow: hidden; }
.loading-state { padding: 40px; text-align: center; font-family: var(--font-sans); font-size: 13px; color: var(--muted); }

.quotes-table { width: 100%; border-collapse: collapse; }
.quotes-table th {
  font-family: var(--font-sans); font-size: 10px; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--muted); text-align: left;
  padding: 12px 16px; border-bottom: 1px solid var(--hairline);
}

.quote-row td { padding: 14px 16px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
.quote-row:last-child td { border-bottom: none; }
.quote-row:hover td { background: rgba(201,122,58,0.03); }

.quote-text-cell { font-family: var(--font-serif); font-size: 13.5px; color: var(--ink); line-height: 1.5; max-width: 400px; }
.author-cell { font-family: var(--font-sans); font-size: 12px; color: var(--muted); font-style: italic; }

/* Status Toggle */
.status-wrap { display: flex; align-items: center; gap: 10px; }
.status-label { font-family: var(--font-sans); font-size: 11px; color: var(--muted); min-width: 45px; }

.toggle {
  position: relative; width: 34px; height: 18px; border-radius: 20px;
  background: var(--hairline); border: none; cursor: pointer;
  transition: background 0.2s; flex-shrink: 0; padding: 0;
}
.toggle.toggle-on { background: #2e7d32; }
.toggle-thumb {
  position: absolute; top: 2px; left: 2px;
  width: 14px; height: 14px; border-radius: 50%; background: #fff;
  transition: left 0.2s; display: block;
}
.toggle.toggle-on .toggle-thumb { left: 18px; }

/* Actions */
.actions-cell { display: flex; gap: 8px; }
.action-btn {
  width: 32px; height: 32px; border-radius: 8px; display: flex;
  align-items: center; justify-content: center; cursor: pointer;
  border: 1px solid var(--hairline); background: white;
  color: var(--muted); transition: all 0.2s;
}
.edit-btn:hover { color: var(--ochre); border-color: var(--ochre); background: rgba(201,122,58,0.05); }
.delete-btn:hover { color: var(--hibiscus); border-color: var(--hibiscus); background: rgba(208,76,79,0.05); }

.pagination-container { display: flex; justify-content: center; margin-top: 10px; }

/* Modal Styles */
.modal-inner { width: 100%; max-width: 480px; min-width: 320px; }
.modal-title { font-family: var(--font-display); font-size: 18px; color: var(--ink); margin-bottom: 24px; }

.quote-form { display: flex; flex-direction: column; gap: 20px; }
.field-group { display: flex; flex-direction: column; gap: 8px; }
.field-label {
  font-family: var(--font-sans); font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted);
}
.field-input {
  padding: 12px 14px; background: white; border: 1px solid var(--hairline);
  border-radius: 10px; font-family: var(--font-sans); font-size: 14px; color: var(--ink);
  outline: none; transition: border-color 0.2s;
}
.field-input:focus { border-color: var(--ochre); }
.textarea { resize: vertical; min-height: 100px; line-height: 1.5; font-family: var(--font-serif); }

.toggle-field { flex-direction: column; }
.toggle-wrap { display: flex; align-items: center; gap: 12px; }
.setting-val { font-family: var(--font-sans); font-size: 13px; color: var(--muted); }

.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
.cancel-btn {
  padding: 10px 20px; background: none; border: 1px solid var(--hairline);
  border-radius: 10px; font-family: var(--font-sans); font-size: 13px;
  color: var(--muted); cursor: pointer;
}
.save-btn {
  padding: 10px 24px; background: var(--kola); color: var(--cream);
  border: none; border-radius: 10px; font-family: var(--font-sans);
  font-size: 13px; font-weight: 600; cursor: pointer;
}
.save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.empty { padding: 48px; text-align: center; font-family: var(--font-sans); font-size: 14px; color: var(--muted); }
</style>
