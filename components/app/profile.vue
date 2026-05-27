<template>
    <div class="profile">
        <div class="dp">
            <img v-if="user.dp" :src="checkForOldFile(user.dp)" alt="profile" />
            <img v-else src="@/assets/images/user.png" alt="profile" />
        </div>
        <div class="info">
            <div class="name">{{ user.username }}</div>
            <div v-if="user.bio" class="bio">{{ user.bio }}</div>
            <div v-if="user.whatsappNumber" class="whatsapp-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 23.571a.75.75 0 0 0 .937.937l5.726-1.478A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.865 0-3.612-.5-5.115-1.371l-.366-.215-3.798.979.999-3.662-.236-.381A9.955 9.955 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                </svg>
                {{ user.whatsappNumber }}
            </div>
        </div>
        <div class="edit">
            <button class="edit-btn" @click="pageSettings.isEditFormOpen = true" aria-label="Edit profile">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333 2 14l.667-3.333L11.333 2z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Edit
            </button>
        </div>
    </div>

    <CommonModal v-model="pageSettings.isEditFormOpen" :close-on-backdrop-click="!profile.loading.value">
        <div class="edit-form">
            <h2 class="edit-title">Edit Profile</h2>

            <!-- Skeleton while fetching profile from server -->
            <div v-if="profile.fetchingProfile.value" style="display:contents">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-fields">
                    <div class="skeleton-line" style="width:60%"></div>
                    <div class="skeleton-line" style="width:100%;height:72px"></div>
                    <div class="skeleton-line" style="width:80%"></div>
                </div>
            </div>

            <div v-else style="display:contents">
                <!-- Avatar picker -->
                <div class="avatar-wrap">
                    <button type="button" class="avatar-label" :class="{ uploading: profile.uploadingDp.value }"
                        aria-label="Change profile picture" @click="dpInputRef?.click()">
                        <img v-if="profile.dpPreview.value" :src="profile.dpPreview.value" class="avatar-img"
                            alt="preview" />
                        <img v-else src="@/assets/images/user.png" class="avatar-img" alt="profile" />
                        <div class="avatar-overlay">
                            <svg v-if="!profile.uploadingDp.value" width="22" height="22" viewBox="0 0 24 24"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span v-else class="dp-spinner"></span>
                        </div>
                    </button>
                    <input ref="dpInputRef" type="file" accept="image/jpeg,image/png,image/webp"
                        class="dp-input" @change="profile.handleDpChange" />
                    <p class="avatar-hint">Tap to change photo</p>
                </div>

                <!-- Form fields -->
                <div class="fields">
                    <div class="field">
                        <label class="field-label" for="username-input">Name</label>
                        <input id="username-input" v-model="profile.form.username" type="text" class="field-input"
                            placeholder="Your display name" maxlength="48" autocomplete="nickname" />
                    </div>
                    <div class="field">
                        <label class="field-label" for="bio-input">Bio</label>
                        <textarea id="bio-input" v-model="profile.form.bio" class="field-textarea"
                            placeholder="A short note about yourself…" rows="3" maxlength="200"
                            autocomplete="off"></textarea>
                        <span class="char-count">{{ profile.form.bio.length }}/200</span>
                    </div>
                    <div class="field">
                        <label class="field-label" for="whatsapp-input">
                            WhatsApp Number
                            <span class="field-optional">(optional)</span>
                        </label>
                        <input id="whatsapp-input" v-model="profile.form.whatsappNumber" type="tel"
                            class="field-input" :class="{ 'field-input--error': profile.phoneError.value }"
                            placeholder="+233241234567" autocomplete="tel"
                            inputmode="tel" />
                        <span v-if="profile.phoneError.value" class="field-error" role="alert">
                            {{ profile.phoneError.value }}
                        </span>
                        <span v-else class="field-helper">Include your country code, e.g. +233 for Ghana</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="form-actions">
                    <button class="btn-cancel" :disabled="profile.loading.value"
                        @click="pageSettings.isEditFormOpen = false">
                        Cancel
                    </button>
                    <button class="btn-save"
                        :disabled="profile.loading.value || profile.uploadingDp.value || !!profile.phoneError.value"
                        @click="profile.submit().then(ok => { if (ok) pageSettings.isEditFormOpen = false })">
                        <span v-if="profile.loading.value" class="btn-spinner"></span>
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </div>
    </CommonModal>
</template>

<script setup lang="ts">
const pageSettings = ref<{ isEditFormOpen: boolean }>({ isEditFormOpen: false })

const user = useAuthStore().getUser
const { checkForOldFile } = useUtils()
const dpInputRef = ref<HTMLInputElement | null>(null)

const profile = useProfile()

// Fetch fresh profile from server each time the edit modal opens
watch(() => pageSettings.value.isEditFormOpen, (open) => {
    if (open) profile.initProfile()
})
</script>

<style scoped>
/* ── Profile card ───────────────────────────────────── */
.profile {
    width: inherit;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-radius: var(--d-radius);
    background-color: var(--ochre);
    margin-top: 10%;
    gap: 12px;
}

.profile .dp img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--cream);
    flex-shrink: 0;
}

.profile .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.profile .name {
    font-family: var(--font-display);
    font-size: 1.35rem;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.profile .bio {
    font-family: var(--font-sans);
    font-size: 0.8rem;
    color: var(--ink);
    opacity: 0.7;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.whatsapp-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    color: var(--ink);
    opacity: 0.75;
}

.edit-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-sans);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--ink);
    background: var(--cream);
    border: none;
    padding: 6px 14px;
    border-radius: 999px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s, transform 0.1s;
}

.edit-btn:hover {
    background: var(--paper);
    transform: translateY(-1px);
}

.edit-btn:active {
    transform: translateY(0);
}

/* ── Edit modal form ────────────────────────────────── */
.edit-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 8px 4px 4px;
    min-width: min(320px, 80vw);
}

.edit-title {
    font-family: var(--font-display);
    font-size: 1.4rem;
    color: var(--ink);
    margin: 0;
    align-self: flex-start;
}

/* Loading skeleton */
.skeleton-avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: var(--calabash);
    animation: shimmer 1.4s ease-in-out infinite;
}

.skeleton-fields {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.skeleton-line {
    height: 40px;
    border-radius: 12px;
    background: var(--calabash);
    animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
}

/* Avatar picker */
.avatar-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.avatar-label {
    position: relative;
    display: block;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    transition: box-shadow 0.15s;
}

.avatar-label:focus-visible {
    box-shadow: 0 0 0 3px var(--ochre);
}

.avatar-img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid var(--ochre);
    display: block;
}

.avatar-overlay {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(31, 23, 20, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    opacity: 0;
    transition: opacity 0.2s;
}

.avatar-label:hover .avatar-overlay,
.avatar-label.uploading .avatar-overlay,
.avatar-label:focus-visible .avatar-overlay {
    opacity: 1;
}

.avatar-hint {
    font-family: var(--font-sans);
    font-size: 0.73rem;
    color: var(--muted);
}

.dp-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
}

/* Spinner inside avatar overlay */
.dp-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2.5px solid rgba(241, 238, 227, 0.4);
    border-top-color: var(--cream);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

/* Fields */
.fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative;
}

.field-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-sans);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.field-optional {
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    font-size: 0.72rem;
}

.field-input,
.field-textarea {
    font-family: var(--font-sans);
    font-size: 0.95rem;
    color: var(--ink);
    background: var(--calabash);
    border: 1.5px solid var(--hairline);
    border-radius: 12px;
    padding: 10px 14px;
    outline: none;
    resize: none;
    transition: border-color 0.15s, background 0.15s;
    line-height: 1.5;
    width: 100%;
    box-sizing: border-box;
}

.field-input:focus,
.field-textarea:focus {
    border-color: var(--ochre);
    background: var(--paper);
}

.field-input--error {
    border-color: var(--hibiscus) !important;
    background: color-mix(in srgb, var(--hibiscus) 6%, var(--paper)) !important;
}

.field-input::placeholder,
.field-textarea::placeholder {
    color: var(--muted);
    opacity: 0.6;
}

.char-count {
    align-self: flex-end;
    font-family: var(--font-sans);
    font-size: 0.7rem;
    color: var(--muted);
}

.field-helper {
    font-family: var(--font-sans);
    font-size: 0.73rem;
    color: var(--muted);
}

.field-error {
    font-family: var(--font-sans);
    font-size: 0.73rem;
    color: var(--hibiscus);
    font-weight: 500;
}

/* Actions */
.form-actions {
    display: flex;
    gap: 12px;
    width: 100%;
}

.btn-cancel,
.btn-save {
    flex: 1;
    font-family: var(--font-display);
    font-size: 1rem;
    padding: 10px 0;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s, opacity 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-cancel {
    color: var(--ink);
    background: var(--calabash);
}

.btn-cancel:hover:not(:disabled) {
    background: var(--ochre);
    color: var(--cream);
}

.btn-save {
    color: var(--cream);
    background: var(--ink);
}

.btn-save:hover:not(:disabled) {
    background: var(--kola);
}

.btn-cancel:disabled,
.btn-save:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-cancel:active:not(:disabled),
.btn-save:active:not(:disabled) {
    transform: scale(0.97);
}

/* Button spinner */
.btn-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(241, 238, 227, 0.35);
    border-top-color: var(--cream);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
