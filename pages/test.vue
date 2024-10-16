<template>
    <div>
        <button @click="openModal">Open Modal</button>
        <CommonModal v-model="isModalOpen">
            <h2>Reusable Modal</h2>
            <p>This modal is reusable across the app!</p>
        </CommonModal>
    </div>
</template>

<script setup>

const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();
</script>
