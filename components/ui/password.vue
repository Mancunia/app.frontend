<template>
    <div>
        <input :type="isPasswordVisible ? 'text' : 'password'" placeholder="Password" v-model="password" />
        <i @click="togglePasswordVisibility" :class="isPasswordVisible ? 'bx bx-hide' : 'bx bx-show'"></i>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['password'])
const password = ref('')
const isPasswordVisible = ref(false);
const togglePasswordVisibility = () => {

    isPasswordVisible.value = !isPasswordVisible.value;
}
watch(password, (value) => {
    emit('password', value)
})
</script>

<style scoped>
div {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    padding: 5%;
}

input {
    margin-bottom: 5px;
    width: 13rem;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>