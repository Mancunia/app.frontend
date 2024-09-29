<template>
    <div class="bookDetails">
        <div class="nav">
            <button>
                <img src="@/assets/images/player/previous.png" alt="previous button" />
            </button>
            <button>
                <img src="@/assets/images/player/backward.png" alt="backward button" />
            </button>
        </div>
        <div class="bookCover">
            <img src="@/assets/images/Rectangle_433.png" alt="book art" />
            <div class="bookInfo">
                <p>1</p>
                <p>2</p>
                <p>3</p>
            </div>
        </div>
        <div class="bookTitle">
            <h2>title</h2>
        </div>

    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.bookDetails .nav {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}

.bookDetails .bookCover {
    justify-content: center;
}

.bookDetails .bookCover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.bookDetails .bookCover .bookInfo {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
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
    }
}
</style>