<template>
    <div v-if="book" class="bookDetails" :class="{ show: showDetails }">
        <div v-if="false" class="nav">
            <button>
                <img src="@/assets/images/player/previous.png" alt="previous button" />
            </button>
            <button>
                <img src="@/assets/images/player/backward.png" alt="backward button" />
            </button>
        </div>
        <div class="bookCover">
            <img :src="checkForOldFile(book.cover)" alt="book art" />
        </div>
        <div class="bookInfo">
            <div><img src="@/assets/images/playerDetails/star.png" />{{ book.meta?.views }}</div>
            <div v-if="book.languages?.length"><img src="@/assets/images/playerDetails/language-circle.png" />{{
                languages.find((lang) => lang.id == book.languages[0])?.name}}</div>
            <div><img src="@/assets/images/playerDetails/microphone-2.png" />{{ book.meta?.comments }}</div>
        </div>
        <div class="bookTitle">
            <h2>{{ book?.title }}</h2>
        </div>

    </div>
</template>

<script setup lang="ts">

const store = useAuthStore();
const { languages } = useCommon()
const book = computed(() => store.getPlaying.book ?? null)
const showDetails = computed(() => store.getPlayer.showDetails)

const { checkForOldFile } = useUtils()

</script>

<style scoped>
.bookDetails {
    display: flex;
    flex-direction: column;
    gap: 30px;
    background-color: rgba(255, 255, 255, 0.805);
    padding: 20px 5%;
    border-radius: 20px;
    transition: all 1s ease-in-out;
}

.show {
    display: none;
}

.bookDetails .nav {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}

.bookDetails .bookCover {
    width: inherit;
    height: 26rem;
    justify-content: center;
}

.bookDetails .bookCover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.bookDetails .bookInfo {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.bookDetails .bookInfo div {
    display: flex;
    justify-content: center;
    align-items: center;
}

.bookDetails .bookTitle {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}


@media only screen and (min-width: 750px) {
    .bookDetails {
        background: rgba(255, 255, 255, 0.2);
        width: 80%;
    }

    .bookDetails .bookCover {
        width: 28rem;
        height: 30rem;
        align-self: center;
    }
}
</style>