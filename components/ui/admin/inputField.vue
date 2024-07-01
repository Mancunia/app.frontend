<template>
    <div class="input">
        <input :type="type" :required="required" :placeholder="placeHolder" v-model="inputField" 
            @input="$emit('update:modelValue', $event.target.value)" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    placeHolder: {
        type: String,
        default: 'Enter Text Here'
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
    }
})
const emits = defineEmits(['update:modelValue'])
const inputField = ref(props.value)
</script>

<style scoped>
.input {
    display: flex;
    padding: 12px;
    flex-direction: row;
    width: 100%;
    height: 80px;
}

.input input {
    width: inherit;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
}
input:focus {
    outline: none;
    border-color: #007bff;
}
</style>