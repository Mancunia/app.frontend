<template>
  <div class="email-page">
    <header class="page-hdr">
      <h1 class="page-title">Email</h1>
    </header>

    <div class="email-grid">
      <div class="compose panel">
        <div class="panel-title">Compose</div>
        <div class="field-group">
          <label class="field-label">To</label>
          <input v-model="form.to" class="field-input" placeholder="email@example.com or 'all'" />
        </div>
        <div class="field-group">
          <label class="field-label">Subject</label>
          <input v-model="form.subject" class="field-input" placeholder="Email subject" />
        </div>
        <div class="field-group">
          <label class="field-label">Body (HTML)</label>
          <textarea v-model="form.body" class="field-textarea" rows="12" placeholder="<p>Your message here</p>" />
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
        <button class="btn-primary" @click="handleSend" :disabled="sending || !form.to.trim() || !form.subject.trim()">
          {{ sending ? 'Sending…' : 'Send email' }}
        </button>
      </div>

      <div class="preview panel">
        <div class="panel-title">Preview</div>
        <div class="preview-body" v-html="form.body || '<p style=\'color:#888\'>Preview will appear here…</p>'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendEmail } from '@/services/admin/email'

definePageMeta({ title: 'Email', middleware: 'admin', layout: 'admin-layout' })

const form = reactive({ to: '', subject: '', body: '' })
const sending = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleSend = async () => {
  sending.value = true; errorMsg.value = ''; successMsg.value = ''
  try {
    await sendEmail({
      email: { to: form.to.trim(), subject: form.subject.trim() },
      body: { header: form.subject.trim(), body: form.body },
    })
    successMsg.value = 'Email sent successfully.'
    form.to = ''; form.subject = ''; form.body = ''
  } catch (e) {
    errorMsg.value = (e as Error).message ?? 'Failed to send email.'
  } finally { sending.value = false }
}
</script>

<style scoped>
.email-page { display: flex; flex-direction: column; gap: 20px; }
.page-hdr { display: flex; align-items: center; }
.page-title { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 0; }
.email-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
.panel { background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.panel-title { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
.field-input, .field-textarea { padding: 9px 14px; background: var(--paper); border: 1px solid var(--hairline); border-radius: 8px; font-family: var(--font-sans); font-size: 13px; color: var(--ink); outline: none; width: 100%; box-sizing: border-box; }
.field-input:focus, .field-textarea:focus { border-color: var(--ochre); }
.field-textarea { resize: vertical; }
.btn-primary { align-self: flex-start; padding: 9px 20px; background: var(--ochre); border: none; border-radius: 8px; font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { font-family: var(--font-sans); font-size: 13px; color: var(--hibiscus); margin: 0; }
.success-msg { font-family: var(--font-sans); font-size: 13px; color: #2e7d32; margin: 0; }
.preview-body { font-family: var(--font-sans); font-size: 13.5px; color: var(--ink); line-height: 1.7; min-height: 200px; }
</style>
