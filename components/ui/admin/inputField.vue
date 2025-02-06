<template>
    <div class="input-group">
        <span class="input-label">{{ label }}</span>
        <input :type="type" :required="required" :placeholder="placeHolder" v-model="inputField"
            @input="$emit('update:modelValue', inputField)" />
    </div>
    <div v-if="type.toLowerCase() === 'textArea'" class="input-group">
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
    }
})
const emits = defineEmits(['update:modelValue'])
const inputField = ref(props.value)
</script>

<style scoped>
.input-group {
    display: flex;
    flex-direction: column;
    width: 100%;
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
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
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
    .input-group {
        width: 50%;
    }

    input[type="email"],
    input[type="text"],
    input[type="password"] {
        height: 50px;
    }
}
</style>