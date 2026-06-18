<template>
  <div class="book-detail" v-if="book">
    <header class="detail-header">
      <NuxtLink :to="routes.admin.books" class="back-link">← Stories</NuxtLink>
      <div class="book-meta">
        <div class="cover-wrapper" @click="triggerCoverInput">
          <img v-if="book.cover" :src="book.cover" class="cover-img" alt="" />
          <div v-else class="cover-placeholder">◆</div>
          <div class="cover-overlay"><span>Change</span></div>
          <input type="file" ref="coverInput" accept="image/*" class="hidden-input" @change="onCoverChange" />
        </div>
        <div>
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-authors">{{ Array.isArray(book.authors) ? book.authors.map(a => typeof a === 'string' ? a : (a as any).name).join(', ') : '—' }}</p>
          <p v-if="Array.isArray(book.narrators) && book.narrators.length" class="book-narrators">Narrators: {{ book.narrators.map(n => typeof n === 'string' ? n : (n as any).name).join(', ') }}</p>
          <div v-if="coverUpdating" class="upload-status">Updating cover…</div>
        </div>
      </div>
    </header>

    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'edit' }" @click="tab = 'edit'">Edit</button>
      <button class="tab" :class="{ active: tab === 'analytics' }" @click="tab = 'analytics'">Analytics</button>
    </div>

    <!-- Edit tab -->
    <div v-if="tab === 'edit'" class="tab-panel">
      <div class="fields-grid">
        <div class="field-group span-2">
          <label class="field-label">Title</label>
          <input v-model="editForm.title" class="field-input" />
        </div>
        <div class="field-group span-2">
          <label class="field-label">Description</label>
          <QuillEditor :key="book?.id" v-model:content="editForm.description" contentType="html" placeholder="Book description" />
        </div>
        <div class="field-group">
          <label class="field-label">Categories</label>
          <select v-model="editForm.category" multiple class="field-select">
            <option v-for="cat in availableCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
          <p class="field-help">Hold Ctrl/Cmd to select multiple</p>
        </div>
        <div class="field-group">
          <label class="field-label">Languages</label>
          <select v-model="editForm.languages" multiple class="field-select">
            <option v-for="lang in availableLanguages" :key="lang.id" :value="lang.id">{{ lang.name }}</option>
          </select>
          <p class="field-help">Hold Ctrl/Cmd to select multiple</p>
        </div>
        <div class="field-group span-2">
          <label class="field-label">Authors</label>
          <UiSelectDropDown
            :data-list="authorOptions"
            placeHolder="Authors"
            generic="array"
            @selected="editForm.authors = $event"
            :selected-option="editForm.authors"
          />
        </div>
        <div class="field-group span-2">
          <label class="field-label">Narrators</label>
          <UiSelectDropDown
            :data-list="narratorOptions"
            placeHolder="Narrators"
            generic="array"
            @selected="editForm.narrators = $event"
            :selected-option="editForm.narrators"
          />
        </div>
        <div class="field-group span-2">
          <label class="field-label">Genres</label>
          <UiSelectDropDown
            :data-list="availableGenres"
            placeHolder="Genres"
            generic="array"
            @selected="editForm.genres = $event"
            :selected-option="editForm.genres"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Edition</label>
          <input v-model="editForm.edition" class="field-input" placeholder="e.g. 1st Edition" />
        </div>
        <div class="field-group">
          <label class="field-label">Published Year</label>
          <select v-model="editForm.publishedYear" class="field-input">
            <option value="" disabled>Select Year</option>
            <option v-for="year in yearOptions" :key="year.id" :value="year.id">
              {{ year.name }}
            </option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Duration</label>
          <input v-model="editForm.duration" class="field-input" placeholder="e.g. 2h 30m" />
        </div>
        <div class="field-group">
          <label class="field-label">Organisation</label>
          <select v-model="editForm.organization" class="field-input">
            <option value="">None</option>
            <option v-for="org in orgs" :key="org.id" :value="org.id">{{ org.name }}</option>
          </select>
        </div>
        <div class="field-group span-2">
          <label class="field-label">Associates</label>
          <UiSelectDropDown
            :data-list="associatesOptions"
            placeHolder="Search associates..."
            generic="array"
            @selected="editForm.associates = $event"
            @search="findAssociates"
            :selected-option="editForm.associates"
          />
        </div>
      </div>
      <p v-if="saveError" class="error-msg">{{ saveError }}</p>
      <p v-if="saveSuccess" class="success-msg">Saved.</p>
      <button class="btn-primary" @click="saveBook" :disabled="saving">{{ saving ? 'Saving…' : 'Save changes'
        }}</button>

      <!-- Chapter management -->
      <div class="section-hdr"><span class="section-title">Chapters</span></div>
      <div v-if="loadingChapters" class="loading">Loading chapters…</div>
      <div v-else class="chapters-list">
        <div v-for="ch in chapters" :key="ch.id || (ch as any)._id" class="chapter-row">
          <span class="ch-title">{{ ch.title }}</span>
          <span class="ch-type-pill" :class="ch.type === 'audio' ? 'pill-audio' : 'pill-ebook'">{{ ch.type }}</span>
          <div class="ch-actions">
            <button class="ch-edit" @click="handleEditChapter(ch)">Edit</button>
            <button class="ch-del" @click="handleDeleteChapter(ch.id || (ch as any)._id)">Delete</button>
          </div>
        </div>
        <p v-if="chapters.length === 0" class="empty">No chapters yet.</p>
      </div>

      <button class="btn-ghost add-ch-btn" @click="toggleChapterForm">
        {{ showChapterForm ? '− Cancel' : '+ Add chapter' }}
      </button>
      <div v-if="showChapterForm" class="chapter-form">
        <div class="field-group">
          <label class="field-label">Title</label>
          <input v-model="chForm.title" class="field-input" />
        </div>
        <div class="field-group">
          <label class="field-label">Description</label>
          <textarea v-model="chForm.description" class="field-textarea" rows="2" />
        </div>
        <div class="field-group">
          <label class="field-label">File (audio or PDF)</label>
          <input type="file" accept="audio/*,application/pdf" @change="onChapterFilePick" :disabled="chUploading"
            class="file-input" />
          <p v-if="chForm.id && !chUploading" class="field-help">Current: {{ chForm.file.split('/').pop()?.split('?')[0] }} (pick a new file to replace)</p>
        </div>
        <div v-if="chForm.mimetype.includes('pdf')" class="field-group">
          <label class="field-label">PDF Password (if encrypted)</label>
          <UiPassword v-model="chForm.password" />
        </div>
        <div v-if="chUploading" class="upload-status">Uploading…</div>
        <p v-if="chError" class="error-msg">{{ chError }}</p>
        <button class="btn-primary" @click="submitChapter" :disabled="chSaving || chUploading">
          {{ chSaving ? (chForm.id ? 'Saving...' : 'Adding…') : (chForm.id ? 'Save changes' : 'Add chapter') }}
        </button>
      </div>
    </div>

    <!-- Analytics tab -->
    <div v-if="tab === 'analytics'" class="tab-panel">
      <div class="period-row">
        <label class="field-label">Period</label>
        <select v-model="selectedPeriod" class="period-select" @change="loadMetrics">
          <option value="">Latest</option>
          <option v-for="p in periods" :key="p.id" :value="p.id">
            {{ p.year }}-{{ String(p.month).padStart(2, '0') }}
          </option>
        </select>
      </div>

      <div class="kpi-strip">
        <div v-for="kpi in metricKpis" :key="kpi.label" class="kpi-tile">
          <span class="kpi-label">{{ kpi.label }}</span>
          <span class="kpi-value">{{ kpi.value }}</span>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">Metrics breakdown</div>
        <div style="height:200px; position:relative;">
          <ClientOnly>
            <Bar v-if="metricsChartData" :data="metricsChartData" :options="metricsChartOptions" />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Loading…</div>
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import routes from '~/routes'
import { getBook, getChapters } from '@/services/book'
import { updateBook, getMetrics, getSignedUrl } from '@/services/admin/book'
import { createChapter, updateChapter, deleteChapter, getChapterSignedUrl } from '@/services/admin/chapter'
import { getAuthors } from '@/services/admin/author'
import { getNarrators } from '@/services/admin/narrator'
import { getPeriods } from '@/services/admin/period'
import { getLanguages } from '@/services/admin/language'
import { getCategories } from '@/services/common'
import { getOrgs } from '@/services/admin/organization'
import { getGenres } from '@/services/admin/genre'
import { getUserProfiles } from '@/services/admin/users'
import { Bar } from 'vue-chartjs'
import type { BOOK } from '~/types/book'
import type { OrganizationType } from '~/types/admin/organization'
import type { LanguageType } from '~/types/admin/language'
import type { Categories } from '~/types/common'

definePageMeta({ title: 'Book Detail', middleware: 'admin', layout: 'admin-layout' })

const route = useRoute()
const id = route.params.id as string

const book = ref<BOOK | null>(null)
const tab = ref<'edit' | 'analytics'>('edit')

// Metadata options
const availableLanguages = ref<LanguageType[]>([])
const availableCategories = ref<Categories[]>([])
const availableGenres = ref<{ id: string; name: string }[]>([])
const orgs = ref<OrganizationType[]>([])

// Edit form
const authorOptions = ref<{ id: string; name: string }[]>([])
const narratorOptions = ref<{ id: string; name: string }[]>([])
const associatesOptions = ref<{ id: string; name: string }[]>([])

const editForm = reactive({
  title: '',
  description: '',
  category: [] as string[],
  languages: [] as string[],
  genres: [] as string[],
  authors: [] as string[],
  narrators: [] as string[],
  associates: [] as string[],
  organization: '',
  edition: '',
  publishedYear: '',
  duration: '',
})

const yearOptions = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear + 5; i >= 1950; i--) {
    years.push({ id: i.toString(), name: i.toString() })
  }
  return years
})

const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

// Cover update
const coverInput = ref<HTMLInputElement | null>(null)
const coverUpdating = ref(false)

const triggerCoverInput = () => coverInput.value?.click()

const { generateSignedUrl, uploadFile } = useAWS(USER_ROLES.ADMIN)
const { decryptJWT } = useUtils()

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
      id: String(user.id || user._id),
      name: user.email || user.name || user.username
    }))
  } catch (error) {
    console.error('Error fetching associates:', error)
  }
}

const onCoverChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  coverUpdating.value = true
  try {
    const signedURL = await generateSignedUrl(file)
    if (!signedURL) throw new Error('No signed URL')
    const fileLoc = await uploadFile(file, signedURL)
    const coverUrl = fileLoc || signedURL.split('?')[0]
    await updateBook(id, { ...editForm, cover: coverUrl } as any)
    if (book.value) book.value.cover = coverUrl
  } catch (e) {
    saveError.value = 'Cover update failed.'
  } finally { coverUpdating.value = false }
}



const saveBook = async () => {
  saving.value = true; saveError.value = ''; saveSuccess.value = false
  try {
    await updateBook(id, editForm as any)
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 2500)
  } catch (e) {
    saveError.value = (e as Error).message ?? 'Save failed'
  } finally { saving.value = false }
}

// Chapters
const chapters = ref<any[]>([])
const loadingChapters = ref(false)
const showChapterForm = ref(false)
const chForm = reactive({
  id: '',
  title: '',
  description: '',
  file: '',
  mimetype: '',
  book: id,
  password: '',
  type: null as 'audio' | 'ebook' | null
})
const chSaving = ref(false)
const chUploading = ref(false)
const chError = ref('')

const loadChapters = async () => {
  loadingChapters.value = true
  const res = await getChapters(id, USER_ROLES.ADMIN)
  chapters.value = extractList(res)
  loadingChapters.value = false
}

const toggleChapterForm = () => {
  if (showChapterForm.value) {
    Object.assign(chForm, { id: '', title: '', description: '', file: '', mimetype: '', password: '', type: null })
  }
  showChapterForm.value = !showChapterForm.value
}

const handleDeleteChapter = async (chapterId: string) => {
  if (!window.confirm('Delete this chapter?')) return
  await deleteChapter(chapterId)
  chapters.value = chapters.value.filter(c => (c.id || c._id) !== chapterId)
}

const handleEditChapter = (ch: any) => {
  let decodedPassword = ch.password || ''
  if (decodedPassword && decodedPassword.includes('.')) {
    try {
      decodedPassword = decryptJWT<{ id: string }>(decodedPassword).id
    } catch (e) {
      console.error('Failed to decrypt chapter password:', e)
    }
  }

  Object.assign(chForm, {
    id: ch.id || ch._id,
    title: ch.title,
    description: ch.description || '',
    file: ch.content,
    mimetype: ch.type === 'ebook' ? 'application/pdf' : 'audio/mpeg',
    book: id,
    password: decodedPassword,
    type: ch.type
  })
  showChapterForm.value = true
}

const onChapterFilePick = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  chForm.mimetype = file.type
  chForm.type = file.type.includes('pdf') ? 'ebook' : 'audio'
  chUploading.value = true; chError.value = ''
  try {
    const signedURL = await generateSignedUrl(file)
    if (!signedURL) throw new Error('No signed URL')
    const fileLoc = await uploadFile(file, signedURL)
    chForm.file = fileLoc || signedURL.split('?')[0]
  } catch { chError.value = 'File upload failed.' } finally { chUploading.value = false }
}

const submitChapter = async () => {
  if (!chForm.title || !chForm.file) { chError.value = 'Title and file are required.'; return }
  chSaving.value = true; chError.value = ''
  try {
    const payload = {
      ...chForm,
      content: chForm.file,
      bookId: id,
      book: id
    }
    
    if (chForm.id) {
      const res = await updateChapter(payload as any)
      if (res?.data) {
        const index = chapters.value.findIndex(c => (c.id || c._id) === chForm.id)
        if (index !== -1) chapters.value[index] = res.data
      }
    } else {
      const res = await createChapter(payload as any)
      if (res?.data) chapters.value.push(res.data)
    }
    
    Object.assign(chForm, { id: '', title: '', description: '', file: '', mimetype: '', password: '', type: null })
    showChapterForm.value = false
  } catch (e) { chError.value = (e as Error).message ?? 'Failed to save chapter.' }
  finally { chSaving.value = false }
}

// Analytics
const periods = ref<any[]>([])
const selectedPeriod = ref('')
const metrics = ref<{ label: string; data: number }[]>([])

const metricKpis = computed(() => metrics.value.map(m => ({ label: m.label, value: m.data })))

const metricsChartData = computed(() => metrics.value.length ? {
  labels: metrics.value.map(m => m.label),
  datasets: [{ label: 'Count', data: metrics.value.map(m => m.data), backgroundColor: '#C97A3A', borderRadius: 4 }],
} : null)

const metricsChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#888' } },
    y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#888' } },
  },
}

const loadMetrics = async () => {
  const res = await getMetrics(id, selectedPeriod.value ? { period: selectedPeriod.value } : {})
  metrics.value = extractList(res)
}

onMounted(async () => {
  const [bookRes, periodsRes, langsRes, catsRes, orgsRes, authorsRes, narratorsRes, genresRes, assocRes] = await Promise.all([
    getBook(id, USER_ROLES.ADMIN),
    getPeriods(),
    getLanguages(),
    getCategories(USER_ROLES.ADMIN),
    getOrgs(),
    getAuthors(),
    getNarrators(),
    getGenres(),
    getUserProfiles({ account: USER_ROLES.ASSOCIATE, search: '' }),
    loadChapters(),
    loadMetrics(),
  ])

  if (langsRes) availableLanguages.value = extractList(langsRes).map((l: any) => ({ ...l, id: String(l.id ?? l._id) }))
  if (catsRes) availableCategories.value = extractList(catsRes).map((c: any) => ({ ...c, id: String(c.id ?? c._id) }))
  if (orgsRes) orgs.value = extractList(orgsRes).map((o: any) => ({ ...o, id: String(o.id ?? o._id) })) as any
  if (assocRes) {
    associatesOptions.value = extractList(assocRes).map((u: any) => ({ id: String(u.id ?? u._id), name: u.email ?? (u.name || u.username) }))
  }

  if (authorsRes) {
    authorOptions.value = extractList(authorsRes).map((a: any) => ({ id: String(a.id ?? a._id), name: a.name }))
  }
  if (narratorsRes) {
    narratorOptions.value = extractList(narratorsRes).map((n: any) => ({ id: String(n.id ?? n._id), name: n.name }))
  }
  if (genresRes) {
    availableGenres.value = extractList(genresRes).map((g: any) => ({ id: String(g.id ?? g._id), name: g.name }))
  }

  if (bookRes?.data) {
    book.value = bookRes.data as any
    const b = book.value!
    editForm.title = b.title || ''
    editForm.description = b.description ?? ''
    
    const findId = (val: any, list: any[]) => {
      if (!val) return ''
      let idOrName = typeof val === 'string' ? val : (val.id ?? val._id)
      if (!idOrName) return ''
      idOrName = String(idOrName)
      const name = typeof val === 'string' ? val : val.name
      const found = list.find(item => String(item.id) === idOrName || item.name === name)
      return found?.id ?? idOrName
    }

    const ensureArray = (val: any) => Array.isArray(val) ? val : []

    editForm.category = ensureArray(b.category).map(c => findId(c, availableCategories.value)).filter(Boolean)
    editForm.languages = ensureArray(b.languages).map(l => findId(l, availableLanguages.value)).filter(Boolean)
    editForm.authors = ensureArray(b.authors).map(a => findId(a, authorOptions.value)).filter(Boolean)
    editForm.narrators = ensureArray(b.narrators).map(n => findId(n, narratorOptions.value)).filter(Boolean)
    editForm.genres = ensureArray(b.genres).map(g => findId(g, availableGenres.value)).filter(Boolean)
    editForm.associates = ensureArray(b.associates).map(a => findId(a, associatesOptions.value)).filter(Boolean)
    editForm.organization = String(b.organization?.id ?? b.organization?._id ?? (typeof b.organization === 'string' ? b.organization : '') ?? '')
    editForm.edition = b.edition ?? ''
    editForm.publishedYear = Array.isArray(b.publishedYear) ? b.publishedYear[0] : (b.publishedYear ?? '')
    editForm.duration = b.duration ?? ''
  }
  if (periodsRes) periods.value = extractList(periodsRes) as any
})
</script>

<style>
@import '@vueup/vue-quill/dist/vue-quill.snow.css';
</style>
<style scoped>
.book-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.book-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cover-wrapper {
  position: relative;
  width: 48px;
  height: 64px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: var(--calabash);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--ochre);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-family: var(--font-sans);
  opacity: 0;
  transition: opacity 0.2s;
}

.cover-wrapper:hover .cover-overlay {
  opacity: 1;
}

.hidden-input {
  display: none;
}

.upload-status {
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--ochre);
  margin-top: 4px;
}

.book-title {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--ink);
  margin: 0 0 4px;
}

.book-authors,
.book-narrators {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--muted);
  margin: 0;
}

.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--hairline);
}

.tab {
  padding: 8px 16px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
}

.tab.active {
  color: var(--ochre);
  border-bottom-color: var(--ochre);
  font-weight: 600;
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.span-2 {
  grid-column: span 2;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.field-input,
.field-textarea,
.field-select {
  padding: 9px 14px;
  background: var(--paper);
  border: 1px solid var(--hairline);
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  outline: none;
  width: 100%;
  box-sizing: border-box;
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

.field-help {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}

:deep(.ql-editor) {
  min-height: 120px;
}

.btn-primary {
  align-self: flex-start;
  padding: 9px 20px;
  background: var(--ochre);
  border: none;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--cream);
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-ghost {
  align-self: flex-start;
  padding: 8px 16px;
  background: none;
  border: 1px solid var(--hairline);
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--muted);
  cursor: pointer;
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

.section-hdr {
  border-top: 1px solid var(--hairline);
  padding-top: 16px;
  margin-top: 8px;
}

.section-title {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--muted);
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chapter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--hairline);
}

.ch-title {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  flex: 1;
}

.ch-type-pill {
  padding: 2px 8px;
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
}

.pill-audio {
  background: rgba(201, 122, 58, 0.12);
  color: var(--ochre);
}

.pill-ebook {
  background: rgba(31, 23, 20, 0.08);
  color: var(--ink);
}

.ch-actions {
  display: flex;
  gap: 12px;
}

.ch-edit {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ochre);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.ch-edit:hover {
  text-decoration: underline;
}

.ch-del {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--hibiscus);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.add-ch-btn {
  margin-top: 8px;
}

.chapter-form {
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
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
}

.empty {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--muted);
  padding: 12px 0;
}

.loading {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--muted);
  padding: 40px;
  text-align: center;
}

.period-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.period-select {
  padding: 8px 12px;
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  outline: none;
}

.kpi-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.kpi-tile {
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kpi-label {
  font-family: var(--font-sans);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.kpi-value {
  font-family: var(--font-serif);
  font-size: 24px;
  color: var(--ink);
  line-height: 1;
}

.panel {
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 20px;
}

.panel-title {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--muted);
  margin-bottom: 16px;
}
</style>
