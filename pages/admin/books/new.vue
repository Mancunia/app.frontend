<template>
  <div class="wizard">
    <header class="wizard-header">
      <NuxtLink :to="routes.admin.books" class="back-link">← Stories</NuxtLink>
      <h1 class="wizard-title">Add story</h1>
    </header>

    <!-- Step indicator -->
    <div class="steps">
      <div
        v-for="(step, i) in steps"
        :key="step.id"
        class="step"
        :class="{ active: currentStep === i, done: currentStep > i }"
      >
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
          <textarea v-model="form.description" class="field-textarea" rows="4" placeholder="What is this story about?" />
        </div>
        <div class="field-row">
          <div class="field-group flex-1">
            <label class="field-label">Categories (comma-separated)</label>
            <input v-model="categoryInput" class="field-input" placeholder="Folklore, History…" />
          </div>
          <div class="field-group flex-1">
            <label class="field-label">Languages (comma-separated)</label>
            <input v-model="languageInput" class="field-input" placeholder="English, Twi…" />
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Authors (comma-separated)</label>
          <input v-model="authorInput" class="field-input" placeholder="Author names…" />
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </div>

      <!-- Step 1: Compose (placeholder) -->
      <div v-if="currentStep === 1" class="step-panel">
        <h2 class="step-heading">Compose</h2>
        <div class="placeholder-panel">
          <span class="ph-icon">◇</span>
          <p>eBook content upload — coming soon.</p>
          <p class="ph-sub">You can skip this step and add content later from the book's detail page.</p>
        </div>
      </div>

      <!-- Step 2: Voice (placeholder) -->
      <div v-if="currentStep === 2" class="step-panel">
        <h2 class="step-heading">Voice</h2>
        <div class="placeholder-panel">
          <span class="ph-icon">◇</span>
          <p>Audio recording / upload — coming soon.</p>
          <p class="ph-sub">You can skip this step and add audio chapters individually later.</p>
        </div>
      </div>

      <!-- Step 3: Chapters (placeholder) -->
      <div v-if="currentStep === 3" class="step-panel">
        <h2 class="step-heading">Chapters</h2>
        <div class="placeholder-panel">
          <span class="ph-icon">◇</span>
          <p>Chapter management — coming soon.</p>
          <p class="ph-sub">After creating the story, manage chapters from the Stories list.</p>
        </div>
      </div>

      <!-- Step 4: Publish -->
      <div v-if="currentStep === 4" class="step-panel">
        <h2 class="step-heading">Publish</h2>
        <div class="publish-summary">
          <div class="summary-row"><span class="sum-lbl">Title</span><span class="sum-val">{{ form.title || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Categories</span><span class="sum-val">{{ form.category.join(', ') || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Languages</span><span class="sum-val">{{ form.languages.join(', ') || '—' }}</span></div>
          <div class="summary-row"><span class="sum-lbl">Authors</span><span class="sum-val">{{ form.authors.join(', ') || '—' }}</span></div>
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
      </div>
    </div>

    <!-- Navigation -->
    <div class="wizard-nav">
      <button v-if="currentStep > 0" class="btn-ghost" @click="currentStep--" :disabled="saving">← Back</button>
      <div class="spacer" />
      <button
        v-if="currentStep < steps.length - 1"
        class="btn-primary"
        @click="advance"
        :disabled="saving"
      >Next →</button>
      <button
        v-else
        class="btn-primary"
        @click="submit"
        :disabled="saving"
      >{{ saving ? 'Creating…' : 'Create story' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
import { createBook } from '@/services/admin/book';
import type { BOOK } from '~/types/book';

definePageMeta({ title: 'Add story', middleware: 'admin', layout: 'admin-layout' });

const router = useRouter();

const steps = [
  { id: 'identify', label: 'Identify' },
  { id: 'compose',  label: 'Compose'  },
  { id: 'voice',    label: 'Voice'    },
  { id: 'chapters', label: 'Chapters' },
  { id: 'publish',  label: 'Publish'  },
];

const currentStep = ref(0);
const saving = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const categoryInput = ref('');
const languageInput = ref('');
const authorInput = ref('');

const form = reactive<BOOK>({
  title: '',
  description: '',
  category: [],
  languages: [],
  authors: [],
  associates: [],
  cover: '',
  meta: { played: 0, views: 0, likes: 0, dislikes: 0, comments: 0 },
});

watch(categoryInput, v => { form.category = v.split(',').map(s => s.trim()).filter(Boolean); });
watch(languageInput, v => { form.languages = v.split(',').map(s => s.trim()).filter(Boolean); });
watch(authorInput,   v => { form.authors   = v.split(',').map(s => s.trim()).filter(Boolean); });

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
    if (data) {
      successMsg.value = 'Story created!';
      setTimeout(() => router.push(routes.admin.books), 1200);
    }
  } catch (e) {
    errorMsg.value = (e as Error).message ?? 'Failed to create story.';
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.wizard { display: flex; flex-direction: column; gap: 24px; max-width: 700px; }

.wizard-header { display: flex; align-items: center; gap: 20px; }
.back-link { font-family: var(--font-sans); font-size: 13px; color: var(--muted); text-decoration: none; }
.back-link:hover { color: var(--ochre); }
.wizard-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }

.steps { display: flex; gap: 0; }
.step {
  display: flex; align-items: center; gap: 8px; flex: 1;
  padding-bottom: 12px; border-bottom: 2px solid var(--hairline);
  transition: border-color 0.2s;
}
.step.active { border-color: var(--ochre); }
.step.done { border-color: var(--ochre); opacity: 0.6; }
.step-dot {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--hairline); color: var(--muted);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-family: var(--font-mono); flex-shrink: 0;
}
.step.active .step-dot { background: var(--ochre); color: var(--cream); }
.step.done .step-dot { background: var(--ochre); color: var(--cream); font-size: 9px; }
.step-label { font-family: var(--font-sans); font-size: 12px; color: var(--muted); white-space: nowrap; }
.step.active .step-label { color: var(--ochre); font-weight: 600; }

.wizard-body { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 28px; }
.step-heading { font-family: var(--font-display); font-size: 18px; color: var(--ink); margin: 0 0 20px; }

.field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.field-label { font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.field-input, .field-textarea {
  padding: 10px 14px; background: var(--paper); border: 1px solid var(--hairline);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13.5px; color: var(--ink);
  outline: none; width: 100%; box-sizing: border-box;
  transition: border-color 0.15s;
}
.field-input:focus, .field-textarea:focus { border-color: var(--ochre); }
.field-textarea { resize: vertical; }
.field-row { display: flex; gap: 16px; }
.flex-1 { flex: 1; }

.placeholder-panel {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 48px 20px; color: var(--muted); text-align: center;
}
.ph-icon { font-size: 28px; color: var(--ochre); opacity: 0.4; }
.ph-sub { font-size: 12px; max-width: 320px; line-height: 1.6; }

.publish-summary { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.summary-row { display: flex; gap: 16px; }
.sum-lbl { font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: var(--muted); width: 90px; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.05em; }
.sum-val { font-family: var(--font-sans); font-size: 13.5px; color: var(--ink); }

.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
.success-msg { font-family: var(--font-sans); font-size: 13px; color: #2e7d32; margin: 0; }

.wizard-nav { display: flex; align-items: center; gap: 12px; }
.spacer { flex: 1; }
.btn-ghost {
  padding: 9px 18px; background: none; border: 1px solid var(--hairline);
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px;
  color: var(--muted); cursor: pointer; transition: border-color 0.15s;
}
.btn-ghost:hover { border-color: var(--calabash); color: var(--ink); }
.btn-primary {
  padding: 9px 20px; background: var(--ochre); border: none;
  border-radius: 8px; font-family: var(--font-sans); font-size: 13px;
  font-weight: 600; color: var(--cream); cursor: pointer; transition: background 0.15s;
}
.btn-primary:hover { background: var(--ochre-deep); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
