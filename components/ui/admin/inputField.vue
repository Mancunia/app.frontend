<template>
    <div class="input-container">
        <div class="label">
            <h4>{{ label }}</h4>
        </div>
        <input :type="type" :required="required" :placeholder="placeHolder" v-model="inputField"
            @input="$emit('update:modelValue', inputField)" />
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