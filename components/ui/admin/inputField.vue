<template>
    <div v-if="common.includes(type.toLowerCase())" class="input-group" :style="`margin-bottom: ${marginBottom}`">
        <span class="input-label">{{ label }}</span>
        <input :type="type" :required="required" :placeholder="placeHolder" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    </div>
    <div v-else-if="type.toLowerCase() === 'password'" class="input-group" :style="`margin-bottom: ${marginBottom}`">
        <span class="input-label">{{ label }}</span>
        <input :type="isPasswordVisible ? 'text' : 'password'" :required="required" :placeholder="placeHolder"
            :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
        <button type="button" class="peek-btn" @click="togglePasswordVisibility" aria-label="Toggle password visibility">
            <i :class="isPasswordVisible ? 'bx bx-hide' : 'bx bx-show'"></i>
        </button>
    </div>
    <div v-else-if="type.toLowerCase() === 'textArea'" class="input-group">
        <span class="input-label">{{ label }}</span>
        <textarea :required="required" rows="4" cols="100" :placeholder="placeHolder" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)">
        </textarea>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    placeHolder: {
        type: String,
        default: ''
    },
    // Nuxt 3 v-model uses modelValue
    modelValue: {
        type: String,
        default: ''
    },
    // Keep value for backward compatibility if needed, but prefer modelValue
    value: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        default: 'text'
    },
    style: {
        type: String,
        default: 'input'
    },
    label: {
        type: String,
        default: ''
    },
    marginBottom: {
        type: String,
        default: '15px'
    }
})
const common = ['text', 'email', 'search', 'tel', 'url', 'number', 'date', 'time', 'datetime-local', 'month', 'week']

const emits = defineEmits(['update:modelValue'])

const isPasswordVisible = ref(false);
const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
}
</script>

<style scoped>
.input-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    border: 1px solid var(--calabash);
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
}

.input-label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: var(--ink);
    white-space: nowrap;
    margin-right: 10px;
}

input {
    width: 100%;
    padding: 10px 15px;
    border: unset;
    background: transparent;
    font-family: var(--font-sans);
    font-size: 1rem;
    color: var(--ink);
}

input:focus {
    outline: none;
}

.peek-btn {
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
    color: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
}

.peek-btn:hover {
    color: var(--ink);
}

.peek-btn i {
    font-size: 1.2rem;
}

textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid var(--calabash);
    border-radius: 5px;
}

@media (min-width: 768px) {
    input {
        height: inherit;
    }
}
</style>
