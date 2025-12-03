<template>
    <div v-if="book" class="layout">
        <div class="peripherals">
            <NuxtLink :to="`${routes.app.book}${book.id}`"><i class='bx  bx-reply'></i> View Book</NuxtLink>
        </div>
        <div class="cover">
            <img :src="checkForOldFile(book.cover)" alt="book art" />
        </div>
        <!-- <div class="details">
            <div class="details_item">Views: {{ book.meta?.views ?? 0 }}</div>
            <div class="details_item" v-if="book.languages?.length">Language: {{
                languages.find((lang) => lang.id == book?.languages[0])?.name}}</div>
        </div> -->
        <div class="title">
            {{ book.title }}
        </div>
        <div class="controls">
            <UiAppPlayer />
        </div>
    </div>
</template>

<script setup lang="ts">
import routes from '~/routes';

const store = useAuthStore();
const { languages } = useCommon(USER_ROLES.USER)
const book = computed(() => store.getPlaying.book ?? null)
const showDetails = computed(() => store.getPlayer.showDetails)

const { checkForOldFile } = useUtils()
</script>

<style scoped>
.layout {
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 10%;
}

.peripherals {
    display: flex;
    flex-direction: row;
}
.peripherals a {
    text-decoration: none;
    color: #000;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 5px;
}
.peripherals button:hover {
    color: #454343;
    scale: 1.2;
    transition-duration: 0.5s ease-in-out;
}

.cover {
    width: 90%;
    height: 60%;
}

.cover img {
    object-fit: cover;
    width: inherit;
    height: inherit;
    border-radius: 20px;
}

.details {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.details_item {
    display: flex;
    flex-direction: row;
}


@media only screen and (min-width: 750px) {
    .layout {
        background: rgb(215 214 214);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

    }

    .cover {
        width: 370px;
        height: 400px;
    }
}
</style>