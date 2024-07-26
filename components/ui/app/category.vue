<template>
    <button class="chip">{{ title }}</button>
</template>

<script setup lang="ts">
const props = defineProps({
    title:{
        type:String,
        required:true
    }
})
</script>

<style scoped>
.chip {
    width: 100px;
    padding: 8px;
    border-radius: 60px;
    background-color: #d9d9d9;
    color: #000;
    font-size: 14px;
    font-family: Pontano Sans;
    font-weight: 400;
    word-wrap: break-word;
    text-align: center;
    border: none;
    cursor: pointer;
}

.chip:hover {
    background-color: #4d2316;
    color: #fff;
}
</style>