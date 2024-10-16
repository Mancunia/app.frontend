<template>
    <div class="comment">
        <div>
            <img src="" alt="">
        </div>
        <div>
            <p>Username</p>
            <p>Comment</p>
            <p>react</p>
        </div>
        <div>
            <p>action</p>
        </div>

    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.comment {
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    margin-bottom: 10%;
}

.comment img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.comment p {
    font-size: 14px;
}
</style>