<template>
    <nav>
        <div class="appbar">
            <img class="img" width="60" height="30" src="https://api.anansesemfie.com/public/images/logo_d.png"
                alt="" />

            <p class="anansesem">ANANSESEM</p>
            <button class="imgbtn">


            </button>
        </div>
    </nav>

</template>

<script setup lang="ts">
const user = useAuthStore().getUser
</script>

<style scoped>
.appbar {
    width: 100%;
    background-color: #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.appbar .imgbtn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    margin: 10px;
    cursor: pointer;
}

.appbar .anansesem {
    color: black;
    font-size: 30px;
    font-family: Pontano Sans;
    font-weight: 400;
    word-wrap: break-word;
}

.imgbtn .img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
</style>
