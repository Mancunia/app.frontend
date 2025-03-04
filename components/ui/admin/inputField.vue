<template>
    <div v-if="common.includes(type.toLowerCase())" class="input-group" :style="`margin-bottom: ${marginBottom}`">
        <span class="input-label">{{ label }}</span>
        <input :type="type" :required="required" :placeholder="placeHolder" v-model="inputField"
            @input="$emit('update:modelValue', inputField)" />
    </div>
    <div v-else-if="type.toLowerCase() === 'password'" class="input-group" :style="`margin-bottom: ${marginBottom}`">
        <span class="input-label">{{ label }}</span>
        <input :type="isPasswordVisible ? 'text' : 'password'" :required="required" :placeholder="placeHolder"
            v-model="inputField" @input="$emit('update:modelValue', inputField)" />
        <i @click="togglePasswordVisibility" :class="isPasswordVisible ? 'bx bx-hide' : 'bx bx-show'"></i>
    </div>
    <div v-else-if="type.toLowerCase() === 'textArea'" class="input-group">
        <span class="input-label">{{ label }}</span>
        <textarea :required="required" rows="4" cols="100" :placeholder="placeHolder" v-model="inputField"
            @input="$emit('update:modelValue', inputField)">
        </textarea>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    placeHolder: {
        type: String,
        default: ''
    },
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
const inputField = ref(props.value)
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
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
}

.input-label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
}

input[type="email"],
input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 10px 15px;
    border: unset;

}

textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

input[type="email"]:focus,
input[type="text"]:focus,
input[type="password"]:focus {
    outline: none;
    border-color: #aaa;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

input[type="checkbox"] {
    margin-right: 5px;
}

@media (min-width: 768px) {

    input[type="email"],
    input[type="text"],
    input[type="password"] {
        height: 50px;
    }
}
</style>