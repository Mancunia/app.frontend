<template>
    <div
        :id="id"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="sendReminderLabel"
        style="display: none"
        aria-hidden="true"
    >
        <div
            class="modal-dialog modal-dialog-centered"
            :class="size"
            role="document"
        >
            <div class="modal-content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    id: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: false,
        default: null
    }
});
</script>
