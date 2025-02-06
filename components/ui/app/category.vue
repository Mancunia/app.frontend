<template>
    <button class="chip" :title="title">{{ title }}</button>
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
    display: inline-block;
    width: 100px;
    padding: 10px;
    /* margin-right:10px; */
    border-radius: 10px;
    background-color: #d9d9d9;
    color: #000;
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    border: none;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
}

.chip:hover {
    background-color: #4d2316;
    color: #fff;
}
</style>