<template>
    <nav>
        <div class="appbar">
            <img class="img" width="60" height="30" src="https://api.anansesemfie.com/logo_d.png" alt="" />

            <p class="anansesem">ANANSESEM</p>
            <NuxtLink to="/app/profile" class="imgbtn" >
                <img v-if="user.dp" width="30" height="30" :src="checkForOldFile(user.dp)" alt="">
                <img v-else width="30" height="30" src="@/assets/images/user.png" alt="profile" />
            </NuxtLink>
        </div>
    </nav>

</template>

<script setup lang="ts">
import routes from '~/routes';
const user = useAuthStore().getUser
const {checkForOldFile} = useUtils()
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
    border-radius: 20px;
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
