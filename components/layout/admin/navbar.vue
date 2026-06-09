<template>
    <nav>
        <div class="nav">
            <NuxtLink href="">
                <img class="logo" src="/favicon.png" alt="logo" />
            </NuxtLink>
            <div>
                <img class="logo" src="/favicon.png" alt="logo" />
            </div>
        </div>


    </nav>
</template>

<script setup lang="ts">


</script>

<style scoped>
nav {
    background: var(--ink);
    color: var(--cream);
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