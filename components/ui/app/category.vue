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
    background-color: var(--calabash);
    color: var(--ink);
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
    background-color: var(--kola);
    color: var(--cream);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.cat-tag:hover {
    background-color: var(--kola-2);
    color: var(--cream);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>