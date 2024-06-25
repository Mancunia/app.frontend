<template>
    <nav>
        <div class="nav">
            <NuxtLink href="">
                <img class="logo" src="~/assets/images/app_logo.png" alt="logo" />
            </NuxtLink>
            <div>
                <img class="logo" src="~/assets/images/app_logo.png" alt="logo" />
            </div>
        </div>


    </nav>
</template>

<script setup lang="ts">
import { checkConnection } from '~/services/common';

const check = async () => {
    await checkConnection();
};
</script>

<style scoped>
nav {
    background: #020202;
    color: #fff;
    width: 100%;
    height: 51px;
}
.nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-self: center;
    padding: 10px;
    flex-shrink: 0;
}

.logo {
    width: 67px;
    height: 37px;
    flex-shrink: 0;
}
</style>