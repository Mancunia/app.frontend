<template>
  {{ form.cover }}
  <div class="wizard">
    <header class="wizard-header">
      <NuxtLink :to="routes.admin.books" class="back-link">← Stories</NuxtLink>
      <h1 class="wizard-title">Add story</h1>
    </header>

    <!-- Step indicator -->
    <div class="steps">
      <div v-for="(step, i) in steps" :key="step.id" class="step"
        :class="{ active: currentStep === i, done: currentStep > i }">
        <div class="step-dot">{{ currentStep > i ? '◆' : i + 1 }}</div>
        <span class="step-label">{{ step.label }}</span>
      </div>
    </div>

    <div class="wizard-body">
      <!-- Step 0: Identify -->
      <div v-if="currentStep === 0" class="step-panel">
        <h2 class="step-heading">Identify the story</h2>
        <div class="field-group">
          <label class="field-label">Title *</label>
          <input v-model="form.title" class="field-input" placeholder="Story title" />
        </div>
        <div class="field-group">
          <label class="field-label">Description *</label>
          <textarea v-model="form.description" class="field-textarea" rows="4"
            placeholder="What is this story about?" />
        </div>
        <div class="field-row">
          <div class="field-group flex-1">
            <label class="field-label">Categories</label>
            <select v-model="form.category" multiple class="field-select">
              <option v-for="cat in availableCategories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
            <p class="field-help">Hold Ctrl/Cmd to select multiple</p>
          </div>
          <div class="field-group flex-1">
            <label class="field-label">Languages</label>
            <select v-model="form.languages" multiple class="field-select">
              <option v-for="lang in availableLanguages" :key="lang.id" :value="lang.id">
                {{ lang.name }}
              </option>
            </select>
            <p class="field-help">Hold Ctrl/Cmd to select multiple</p>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Authors (comma-separated)</label>
          <input v-model="authorInput" class="field-input" placeholder="Author names…" />
        </div>
        <div class="field-group">
          <label class="field-label">Snippet (optional)</label>
          <textarea v-model="snippetInput" class="field-textarea" rows="2" placeholder="Short teaser text…"
            maxlength="300" />
        </div>
        <div class="field-row">
          <div class="field-group flex-1">
            <label class="field-label">Organisation</label>
            <select v-model="selectedOrg" class="field-input">
              <option value="">None</option>
              <option v-for="org in orgs" :key="org.id" :value="org.id">{{ org.name }}</option>
            </select>
          </div>
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </div>

      <!-- Step 1: Cover Image -->
      <div v-if="currentStep === 1" class="step-panel">
        <h2 class="step-heading">Cover image</h2>
        <div class="field-group">
          <label class="field-label">Cover image *</label>
          <input type="file" accept="image/*" class="file-input" @change="onCoverPick" :disabled="uploading" />
        </div>
        <div v-if="uploading" class="upload-status">Uploading…</div>
        <img v-if="coverPreview" :src="coverPreview" class="cover-preview" alt="Cover preview" />
        <p v-if="!coverPreview" class="ph-sub">Upload a cover image. You can skip and add one later.</p>
      </div>

      <!-- Step 2: Review -->
      <div v-if="currentStep === 2" class="step-panel">
        <h2 class="step-heading">Review</h2>
        <div class="publish-summary">
          <div class="summary-row"><span class="sum-lbl">Title</span><span class="sum-val">{{ form.title || '—'
          }}</span></div>
          <div class="summary-row">
            <span class="sum-lbl">Categories</span>
            <span class="sum-val">{{ selectedCategoryNames || '—' }}</span>
          </div>
          <div class="summary-row">
            <span class="sum-lbl">Languages</span>
            <span class="sum-val">{{ selectedLanguageNames || '—' }}</span>
          </div>
          <div class="summary-row"><span class="sum-lbl">Cover</span><span class="sum-val">{{ form.cover ? 'Uploaded' :
            'None' }}</span></div>
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
      </div>
    </div>

    <!-- Navigation -->
    <div class="wizard-nav">
      <button v-if="currentStep > 0" class="btn-ghost" @click="currentStep--" :disabled="saving || uploading">←
        Back</button>
      <div class="spacer" />
      <button v-if="currentStep < steps.length - 1" class="btn-primary" @click="advance"
        :disabled="saving || uploading">Next →</button>
      <button v-else class="btn-primary" @click="submit" :disabled="saving || !!successMsg || uploading">{{ saving ?
        'Creating…' : 'Create story' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { createBook, getSignedUrl } from '@/services/admin/book';
import { getOrgs } from '@/services/admin/organization';
import { getUserProfiles } from '@/services/admin/users';
import { getLanguages } from '@/services/admin/language';
import { getCategories } from '@/services/common';
import type { BOOK } from '~/types/book';
import type { OrganizationType } from '~/types/admin/organization'
import type { LanguageType } from '~/types/admin/language'
import type { Categories } from '~/types/common'

definePageMeta({ title: 'Add story', middleware: 'admin', layout: 'admin-layout' });

const router = useRouter();

const steps = [
  { id: 'identify', label: 'Identify' },
  { id: 'cover', label: 'Cover' },
  { id: 'review', label: 'Review' },
];

const currentStep = ref(0);
const saving = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const authorInput = ref('');

const orgs = ref<OrganizationType[]>([])
const availableLanguages = ref<LanguageType[]>([])
const availableCategories = ref<Categories[]>([])
const coverFile = ref<File | null>(null)
const coverPreview = ref('')
const uploading = ref(false)
const snippetInput = ref('')
const selectedOrg = ref('')

const form = reactive<BOOK>({
  title: '',
  description: '',
  category: [],
  languages: [],
  authors: [],
  associates: [],
  cover: 'cover',
  meta: { played: 0, views: 0, likes: 0, dislikes: 0, comments: 0 },
});

const { generateSignedUrl, uploadFile } = useAWS()

const selectedLanguageNames = computed(() => {
  return form.languages
    .map(id => availableLanguages.value.find(l => l.id === id)?.name)
    .filter(Boolean)
    .join(', ')
})

const selectedCategoryNames = computed(() => {
  return form.category
    .map(id => availableCategories.value.find(c => c.id === id)?.name)
    .filter(Boolean)
    .join(', ')
})

watch(authorInput, v => { form.authors = v.split(',').map(s => s.trim()).filter(Boolean); });
watch(snippetInput, v => { (form as any).snippet = v })
watch(selectedOrg, v => { (form as any).organization = v })

onMounted(async () => {
  const [orgsRes, assocRes, langsRes, catsRes] = await Promise.all([
    getOrgs(),
    getUserProfiles({ search: '', account: USER_ROLES.ASSOCIATE }),
    getLanguages(),
    getCategories(USER_ROLES.ADMIN),
  ])
  if (orgsRes?.data) orgs.value = orgsRes.data as any
  if (langsRes?.data) availableLanguages.value = langsRes.data as any
  if (catsRes?.data) availableCategories.value = catsRes.data as any
})

const onCoverPick = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
  uploading.value = true
  try {
    const { signedURL } = await generateSignedUrl(file)
    if (!signedURL) throw new Error('No signed URL returned')
    const uploadRes = await uploadFile(file, signedURL)
    form.cover = uploadRes ?? signedURL.split('?')[0] // Fallback to URL without query if response is empty
  } catch (error) {
    console.error('Cover upload error:', error)
    errorMsg.value = 'Cover upload failed. Try again.'
    coverPreview.value = ''
    form.cover = ''
  } finally {
    uploading.value = false
  }
}

const advance = () => {
  errorMsg.value = '';
  if (currentStep.value === 0) {
    if (!form.title.trim()) { errorMsg.value = 'Title is required.'; return; }
    if (!form.description.trim()) { errorMsg.value = 'Description is required.'; return; }
  }
  currentStep.value++;
};

const submit = async () => {
  errorMsg.value = '';
  if (!form.title.trim()) { errorMsg.value = 'Title is required.'; currentStep.value = 0; return; }
  saving.value = true;
  try {
    const { data } = await createBook(form);
    if (data && (data.id || (data as any)._id)) {
      successMsg.value = 'Story created!';
      const bookId = data.id || (data as any)._id
      setTimeout(() => router.push(`/admin/books/${bookId}`), 1200);
    }
  } catch (e) {
    errorMsg.value = (e as Error).message ?? 'Failed to create story.';
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.wizard {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 700px;
}

.wizard-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-link {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--ochre);
}

.wizard-title {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--ink);
  margin: 0;
}

.steps {
  display: flex;
  gap: 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--hairline);
  transition: border-color 0.2s;
}

.step.active {
  border-color: var(--ochre);
}

.step.done {
  border-color: var(--ochre);
  opacity: 0.6;
}

.step-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--hairline);
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.step.active .step-dot {
  background: var(--ochre);
  color: var(--cream);
}

.step.done .step-dot {
  background: var(--ochre);
  color: var(--cream);
  font-size: 9px;
}

.step-label {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.step.active .step-label {
  color: var(--ochre);
  font-weight: 600;
}

.wizard-body {
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 28px;
}

.step-heading {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--ink);
  margin: 0 0 20px;
}

.step-subtext {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--muted);
  margin: -10px 0 20px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.field-label {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-input,
.field-textarea,
.field-select {
  padding: 10px 14px;
  background: var(--paper);
  border: 1px solid var(--hairline);
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--ink);
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  border-color: var(--ochre);
}

.field-textarea {
  resize: vertical;
}

.field-select {
  min-height: 100px;
}

.field-row {
  display: flex;
  gap: 16px;
}

.flex-1 {
  flex: 1;
}

.field-help {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}

.publish-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  gap: 16px;
}

.sum-lbl {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  width: 90px;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sum-val {
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--ink);
}

.error-msg {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--hibiscus);
  margin: 0;
}

.success-msg {
  font-family: var(--font-sans);
  font-size: 13px;
  color: #2e7d32;
  margin: 0;
}

.wizard-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spacer {
  flex: 1;
}

.btn-ghost {
  padding: 9px 18px;
  background: none;
  border: 1px solid var(--hairline);
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--muted);
  cursor: pointer;
  transition: border-color 0.15s;
}

.btn-ghost:hover {
  border-color: var(--calabash);
  color: var(--ink);
}

.btn-primary {
  padding: 9px 20px;
  background: var(--ochre);
  border: none;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--cream);
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover {
  background: var(--ochre-deep);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.file-input {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
}

.upload-status {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--muted);
  margin-top: 8px;
}

.upload-panel {
  background: var(--paper);
  border: 1px solid var(--hairline);
  border-radius: 8px;
  padding: 16px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-success {
  font-family: var(--font-sans);
  font-size: 13px;
  color: #2e7d32;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-icon {
  font-weight: bold;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}

.clear-btn:hover {
  color: var(--hibiscus);
}

.cover-preview {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  margin-top: 12px;
}
</style>
