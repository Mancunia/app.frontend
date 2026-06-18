<template>
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
          <QuillEditor v-model:content="form.description" contentType="html" placeholder="What is this story about?" />
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
        <div class="field-row">
          <div class="field-group flex-1">
            <label class="field-label">Authors</label>
            <UiSelectDropDown
              :data-list="authorOptions"
              placeHolder="Authors"
              generic="array"
              @selected="form.authors = $event"
              :selected-option="form.authors as unknown as string[]"
            />
          </div>
          <div class="field-group flex-1">
            <label class="field-label">Narrators</label>
            <UiSelectDropDown
              :data-list="narratorOptions"
              placeHolder="Narrators"
              generic="array"
              @selected="form.narrators = $event"
              :selected-option="form.narrators as unknown as string[]"
            />
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Genres</label>
          <UiSelectDropDown
            :data-list="availableGenres"
            placeHolder="Genres"
            generic="array"
            @selected="form.genres = $event"
            :selected-option="form.genres as unknown as string[]"
          />
        </div>
        <div class="field-row">
          <div class="field-group flex-1">
            <label class="field-label">Edition</label>
            <input v-model="form.edition" class="field-input" placeholder="e.g. 1st Edition" />
          </div>
          <div class="field-group flex-1">
            <label class="field-label">Published Year</label>
            <select v-model="form.publishedYear" class="field-input">
              <option value="" disabled>Select Year</option>
              <option v-for="year in yearOptions" :key="year.id" :value="year.id">
                {{ year.name }}
              </option>
            </select>
          </div>
          <div class="field-group flex-1">
            <label class="field-label">Duration</label>
            <input v-model="form.duration" class="field-input" placeholder="e.g. 2h 30m" />
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Associates</label>
          <UiSelectDropDown
            :data-list="associatesOptions"
            placeHolder="Search associates..."
            generic="array"
            @selected="form.associates = $event"
            @search="findAssociates"
            :selected-option="form.associates"
          />
        </div>
        <div v-if="false" class="field-row">
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
          <div class="summary-row"><span class="sum-lbl">Authors</span><span class="sum-val">{{ selectedAuthorNames || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Narrators</span><span class="sum-val">{{ selectedNarratorNames || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Genres</span><span class="sum-val">{{ selectedGenreNames || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Edition</span><span class="sum-val">{{ form.edition || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Published</span><span class="sum-val">{{ form.publishedYear || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Duration</span><span class="sum-val">{{ form.duration || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Associates</span><span class="sum-val">{{ selectedAssociateNames || '—' }}</span></div>
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
import { QuillEditor } from '@vueup/vue-quill'
import routes from '~/routes';
import { createBook, getSignedUrl } from '@/services/admin/book';
import { getAuthors } from '@/services/admin/author';
import { getNarrators } from '@/services/admin/narrator';
import { getOrgs } from '@/services/admin/organization';
import { getUserProfiles } from '@/services/admin/users';
import { getLanguages } from '@/services/admin/language';
import { getCategories } from '@/services/common';
import { getGenres } from '@/services/admin/genre';
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

const authorOptions = ref<{ id: string; name: string }[]>([])
const narratorOptions = ref<{ id: string; name: string }[]>([])
const associatesOptions = ref<{ id: string; name: string }[]>([])

const orgs = ref<OrganizationType[]>([])
const availableLanguages = ref<LanguageType[]>([])
const availableCategories = ref<Categories[]>([])
const availableGenres = ref<{ id: string; name: string }[]>([])
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
  genres: [],
  authors: [],
  narrators: [],
  associates: [],
  edition: '',
  publishedYear: '',
  duration: '',
  cover: 'cover',
  meta: { played: 0, views: 0, likes: 0, dislikes: 0, comments: 0 },
});

const yearOptions = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear + 5; i >= 1950; i--) {
    years.push({ id: i.toString(), name: i.toString() })
  }
  return years
})

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

const selectedAuthorNames = computed(() => {
  return (form.authors as unknown as string[])
    .map(id => authorOptions.value.find(a => a.id === id)?.name)
    .filter(Boolean)
    .join(', ')
})

const selectedNarratorNames = computed(() => {
  return (form.narrators as unknown as string[])
    .map(id => narratorOptions.value.find(n => n.id === id)?.name)
    .filter(Boolean)
    .join(', ')
})

const selectedGenreNames = computed(() => {
  return (form.genres as unknown as string[])
    .map(id => availableGenres.value.find(g => g.id === id)?.name)
    .filter(Boolean)
    .join(', ')
})

const selectedAssociateNames = computed(() => {
  return form.associates
    .map(id => associatesOptions.value.find(a => a.id === id)?.name)
    .filter(Boolean)
    .join(', ')
})


watch(snippetInput, v => { (form as any).snippet = v })
watch(selectedOrg, v => { (form as any).organization = v })

const extractList = (res: any) => {
  if (!res || !res.data) return []
  const data = res.data
  if (Array.isArray(data)) return data
  if (data.data && Array.isArray(data.data)) return data.data
  if (data.results && Array.isArray(data.results)) return data.results
  return []
}

const findAssociates = async (search: string) => {
  try {
    const res = await getUserProfiles({ account: USER_ROLES.ASSOCIATE, search })
    associatesOptions.value = extractList(res).map((user: any) => ({
      id: user.id || user._id,
      name: user.email || user.name || user.username
    }))
  } catch (error) {
    console.error('Error fetching associates:', error)
  }
}

onMounted(async () => {
  const [orgsRes, assocRes, langsRes, catsRes, authorsRes, narratorsRes, genresRes] = await Promise.all([
    getOrgs(),
    getUserProfiles({ search: '', account: USER_ROLES.ASSOCIATE }),
    getLanguages(),
    getCategories(USER_ROLES.ADMIN),
    getAuthors(),
    getNarrators(),
    getGenres(),
  ])
  if (orgsRes) orgs.value = extractList(orgsRes) as any
  if (assocRes) {
    associatesOptions.value = extractList(assocRes).map((u: any) => ({ id: u.id ?? u._id, name: u.email ?? (u.name || u.username) }))
  }
  if (langsRes) {
    availableLanguages.value = extractList(langsRes).map((l: any) => ({ ...l, id: l.id ?? l._id }))
  }
  if (catsRes) {
    availableCategories.value = extractList(catsRes).map((c: any) => ({ ...c, id: c.id ?? c._id }))
  }
  if (authorsRes) {
    authorOptions.value = extractList(authorsRes).map((a: any) => ({ id: a.id ?? a._id, name: a.name }))
  }
  if (narratorsRes) {
    narratorOptions.value = extractList(narratorsRes).map((n: any) => ({ id: n.id ?? n._id, name: n.name }))
  }
  if (genresRes) {
    availableGenres.value = extractList(genresRes).map((g: any) => ({ id: g.id ?? g._id, name: g.name }))
  }
})

const onCoverPick = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
  uploading.value = true
  try {
    const signedURL = await generateSignedUrl(file)
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

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim()

const advance = () => {
  errorMsg.value = '';
  if (currentStep.value === 0) {
    if (!form.title.trim()) { errorMsg.value = 'Title is required.'; return; }
    if (!stripHtml(form.description)) { errorMsg.value = 'Description is required.'; return; }
  }
  currentStep.value++;
};

const submit = async () => {
  errorMsg.value = '';
  if (!form.title.trim()) { errorMsg.value = 'Title is required.'; currentStep.value = 0; return; }
  if (!stripHtml(form.description)) { errorMsg.value = 'Description is required.'; currentStep.value = 0; return; }
  saving.value = true;
  try {
    const data = await createBook(form);
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

<style>
@import '@vueup/vue-quill/dist/vue-quill.snow.css';
</style>
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

:deep(.ql-editor) {
  min-height: 120px;
}
</style>
