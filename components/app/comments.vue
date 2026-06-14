<template>
    <div class="comments-wrapper">
        <div class="comment-list">
            <div v-for="c in comments" :key="c.id" class="comment-card">
                <div class="comment-avatar">
                    <img :src="checkForOldFile(c.user?.picture)" v-if="c.user?.picture" alt="" />
                    <div v-else class="avatar-placeholder">{{ getAcronym(c.user?.name || 'User') }}</div>
                </div>
                <div class="comment-body">
                    <div class="comment-header">
                        <span class="user-name">{{ c.user?.name || 'Unknown User' }}</span>
                        <button class="report-btn" @click="triggerReport(c.id)" title="Report comment">
                            <i class='bx bx-flag'></i>
                        </button>
                    </div>
                    <p class="comment-text">{{ c.comment }}</p>
                </div>
            </div>
            <div v-if="comments && comments.length === 0" class="no-comments">
                No thoughts shared yet.
            </div>
        </div>

        <div class="comment-input-section">
            <form @submit.prevent="sendComment">
                <div class="input-container" :class="{ 'warning': charCount > 900, 'error': charCount >= 1000 }">
                    <textarea 
                        ref="commentInput"
                        v-model="draftComment" 
                        :placeholder="placeholder"
                        maxlength="1000"
                        @focus="shufflePlaceholder"
                    ></textarea>
                    <div class="input-actions">
                        <span class="counter">{{ charCount }}/1000</span>
                        <button type="submit" :disabled="!draftComment?.trim() || charCount > 1000">
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <CommonModal v-slot="{ close }" v-model="showReportModal">
            <div class="report-modal-content">
                <h3 class="modal-title">Report Comment</h3>
                <p class="modal-desc">Why are you reporting this comment?</p>
                <textarea 
                    v-model="reportReason" 
                    placeholder="Provide a reason (optional, max 500 characters)" 
                    maxlength="500"
                    class="report-textarea"
                ></textarea>
                <div class="modal-btns">
                    <button class="btn-secondary" @click="showReportModal = false">Cancel</button>
                    <button class="btn-primary" @click="confirmReport" :disabled="reporting">
                        {{ reporting ? 'Reporting...' : 'Submit Report' }}
                    </button>
                </div>
            </div>
        </CommonModal>
    </div>
</template>

<script setup lang="ts">
import { postComment, getComments, reportComment } from '~/services/book';
import { type Comment } from '~/types/book';

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const { checkForOldFile, getAcronym } = useUtils()
const { notify } = useNotification()
const store = useAuthStore()

const comments = ref<Comment[]>([])
const draftComment = ref('')
const charCount = computed(() => draftComment.value.length)
const commentInput = ref<HTMLTextAreaElement | null>(null)

const placeholders = [
    'nice book....', 'write something...', 'your thoughts...', 'say something...', 
    'share your opinion...', 'leave a comment...', 'what do you think?', 'express yourself...',
    'give your feedback...', 'let us know...', 'drop a comment...', 'share your thoughts...',
    'what are your views?', 'comment here...', 'join the discussion...', 'voice your opinion...',
    'tell us what you think...', 'add your comment...'
];
const placeholder = ref(placeholders[0])

const shufflePlaceholder = () => {
    if (!draftComment.value) {
        placeholder.value = placeholders[Math.floor(Math.random() * placeholders.length)];
    }
};

const fetchComments = async () => {
    try {
        const res = await getComments(props.id) as any
        if (res) {
            // Handle both { data: [...] } and { data: { results: [...] } }
            const data = res.data ?? res
            const results = Array.isArray(data) ? data : (data.results ?? [])
            comments.value = results
            console.log('Comments updated:', comments.value.length)
        }
    } catch (error) {
        console.error('Failed to fetch comments', error)
    }
}

const sendComment = async () => {
    const text = draftComment.value.trim()
    if (!text) return
    try {
        const res = await postComment(props.id, text) as any
        if (res) {
            const newComment = res.data ?? res
            if (newComment && typeof newComment === 'object') {
                comments.value = [newComment, ...comments.value]
                draftComment.value = ''
                shufflePlaceholder()
            }
        }
    } catch (error) {
        notify({ title: 'Error', message: 'Failed to post comment', type: 'error' })
    }
}

// Reporting
const showReportModal = ref(false)
const reporting = ref(false)
const reportReason = ref('')
const selectedCommentId = ref('')

const triggerReport = (commentId: string) => {
    selectedCommentId.value = commentId
    reportReason.value = ''
    showReportModal.value = true
}

const confirmReport = async () => {
    if (!selectedCommentId.value) return
    reporting.value = true
    try {
        await reportComment(selectedCommentId.value, reportReason.value)
        notify({ title: 'Success', message: 'Comment reported successfully', type: 'success' })
        showReportModal.value = false
    } catch (error) {
        notify({ title: 'Error', message: 'Failed to report comment', type: 'error' })
    } finally {
        reporting.value = false
    }
}

let interval: any
onMounted(() => {
    fetchComments()
    interval = setInterval(fetchComments, 10000)
})

onUnmounted(() => {
    if (interval) clearInterval(interval)
})
</script>

<style scoped>
.comments-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
}

.comment-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 500px;
    overflow-y: auto;
    padding-right: 8px;
}

.comment-card {
    display: flex;
    gap: 12px;
}

.comment-avatar img, .avatar-placeholder {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-placeholder {
    background: var(--calabash);
    color: var(--ochre);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
}

.comment-body {
    flex: 1;
    background: var(--paper);
    padding: 12px;
    border-radius: 12px;
    border: 1px solid var(--hairline);
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.user-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}

.report-btn {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
}

.report-btn:hover {
    color: var(--hibiscus);
    background: rgba(188, 71, 73, 0.1);
}

.comment-text {
    font-size: 14px;
    color: var(--ink);
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
}

.no-comments {
    text-align: center;
    padding: 40px;
    color: var(--muted);
    font-style: italic;
    font-size: 14px;
}

.comment-input-section {
    margin-top: auto;
}

.input-container {
    border: 2px solid var(--hairline);
    border-radius: 12px;
    padding: 12px;
    transition: border-color 0.2s;
    background: var(--paper);
}

.input-container:focus-within {
    border-color: var(--kola-2);
}

.input-container.warning .counter { color: #f59e0b; }
.input-container.error { border-color: var(--hibiscus); }
.input-container.error .counter { color: var(--hibiscus); }

textarea {
    width: 100%;
    border: none;
    outline: none;
    background: none;
    font-family: inherit;
    font-size: 14px;
    resize: none;
    min-height: 60px;
    color: var(--ink);
}

.input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

.counter {
    font-size: 11px;
    color: var(--muted);
    font-family: var(--font-mono);
}

button[type="submit"] {
    background: var(--kola-2);
    color: var(--cream);
    padding: 6px 16px;
    border: none;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

button[type="submit"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Modal styles */
.report-modal-content {
    padding: 20px;
    min-width: 300px;
    max-width: 400px;
}

.modal-title {
    font-family: var(--font-display);
    font-size: 18px;
    margin-bottom: 8px;
}

.modal-desc {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 16px;
}

.report-textarea {
    width: 100%;
    border: 1px solid var(--hairline);
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    min-height: 100px;
    margin-bottom: 20px;
}

.modal-btns {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.btn-secondary {
    background: none;
    border: 1px solid var(--hairline);
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
}

.btn-primary {
    background: var(--hibiscus);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
}
</style>