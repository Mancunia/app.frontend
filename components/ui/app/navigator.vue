<template>
    <div class="nav">
        <NuxtLink :to="links.home.link" class="icon" :class="{ 'active': links.home.link == activeRoute }">
            <img class="" alt="" width="30" height="30" src="@/assets/images/element-3.png" />
        </NuxtLink>
        <NuxtLink :to="links.search.link" class="icon" :class="{ 'active': links.search.link == activeRoute }">
            <img class="" alt="" width="30" height="30" src="@/assets/images/search-normal.png" />
        </NuxtLink>
        <NuxtLink :to="links.library.link" class="icon" :class="{ 'active': links.library.link == activeRoute }">
            <img class="" alt="" width="30" height="30" src="@/assets/images/book.png" />
        </NuxtLink>
        <NuxtLink :to="links.profile.link" class="icon profile" :class="{ 'active': links.profile.link == activeRoute }">
            <img v-if="user.dp" width="30" height="30" :src="checkForOldFile(user.dp)" alt="">
            <img v-else width="30" height="30" src="@/assets/images/user.png" alt="profile" />
        </NuxtLink>
    </div>
</template>
<script setup lang="ts">
const links = {
    home: {
        name: 'Home',
        icon: 'element-3.png',
        link: '/app',
        active: true
    },
    search: {
        name: 'Search',
        icon: 'search-normal.png',
        link: '/app/search',
        active: false
    },
    library: {
        name: 'Library',
        icon: 'book.png',
        link: '/app/library',
        active: false
    },
    profile: {
        name: 'Profile',
        icon: 'profile.png',
        link: '/app/profile',
        active: false
    }
}

const { activeRoute } = useNavigation()
const user = useAuthStore().getUser
const {checkForOldFile} = useUtils()

</script>

<style scoped>
.nav {
    display: flex;
    width: 345px;
    height: 70px;
    justify-content: space-evenly;
    align-items: center;
    justify-self: center;
    flex-shrink: 0;
    border-radius: 33px;
    background: #191413;
    bottom: 0;
    transition-duration: 1s;
}

.nav .icon {
    display: flex;
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}

.nav .profile img{
    border-radius: 20px;
}
.nav .icon.active {
    border-bottom: 2px solid #fff;
    padding: 2%;
    transition-duration: 0.5s;
}

@media only screen and (min-width: 750px) {
    .nav .icon:hover {
        border-bottom: 2px solid #fff;
        border-radius: 1px;
        transition-duration: 0.5s;
    }
}
</style>