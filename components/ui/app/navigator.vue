<template>
    <div class="nav">
        <div class="icon" :class="{'active':true}">
            <img class="" alt="" src="@/assets/images/home.png" />
        </div>
        <div class="icon">
            <img class="" alt="" src="@/assets/images/search.png" />
        </div>
        <div class="icon">
            <img class="" alt="" src="@/assets/images/bookmark.png" />
        </div>
        <div class="icon">
            <img class="" alt="" src="@/assets/images/profile.png" />
        </div>
    </div>
</template>
<script setup lang="ts">

</script>

<style scoped>
.nav {
    display: flex;
    width: 345px;
    height: 70px;
    padding: 13px;
    justify-content: space-evenly;
    align-items: center;
    flex-shrink: 0;
    border-radius: 33px;
    background: #191413;
}

.nav .icon {
    display: flex;
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}
.nav .icon :hover {
    background: #2d2d2d;
    border-radius: 20%;
}
.active {
    background: #2d2d2d;
    border-radius: 20%;
}
</style>