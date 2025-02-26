<template>
    <button class="cat-tag" :title="title">{{ title }}</button>
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
.cat-tag {
    width: fit-content;
    background-color: #d9d9d9;
    color: #190a06;
    font-weight: 600;
    padding: 10px 30px;
    border-radius: 50px;
    text-align: center;
    cursor: pointer;
    transition: all .5s linear;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.cat-tag button{
    background: unset;
    border: unset;
}

.cat-tag.active {
    background-color: #4d2316;
    color: #ffffff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.cat-tag:hover {
    background-color: #7f4d3e;
    color: #ffffff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>