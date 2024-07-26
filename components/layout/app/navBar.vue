<template>
    <nav>
        <div class="appbar">
            <button class="imgbtn">
                <img class="img" src="@/assets/images/Ellipse_9.png" alt="" />
            </button>
            <p class="anansesem">ANANSESEM</p>
            <button class="imgbtn">
                <img v-if="user.dp.length" class="img" :src="user.dp" alt="user_profile" />

                <img v-else style="
    background-color: orange;" class="img" src="@/assets/images/profile.png" alt="user_profile" />


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
