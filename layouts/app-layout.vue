<template>
    <div class="page">
        <div class="body">
            <LayoutAppNavBar />

            <div class="container">
                <div class="content">
                    <div class="items-container">
                        <slot />
                    </div>
                    <div class="navigator">
                        <UiAppNavigator />
                    </div>
                </div>

                <div class="player" id="player">
                    <UiAppPlayerDetails />
                </div>
            </div>

        </div>
    </div>

</template>

<script setup lang="ts">

</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Rammetto One";
}

.body {
    width: 100%;
    height: 100%;

}

.page {
    background-color: #f5f5f5;
}

.container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.container.content {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0 20px;
    margin-bottom: 5%;
    overflow: scroll;

}

.items-container {
    position: relative;
    width: 100%;
    height: 80vh;
    margin-bottom: 5%;
    overflow-y: auto;
}

.container .content .navigator {
    padding: 0px 10px;
}

.container .player {
    position: fixed;
    align-self: center;
    width: 90%;
    padding: 20px;
    border-radius: 12px;
    transition: 0.5s ease-in-out;
    transform: translateX(96%);
}

.container .player:hover {
    transform: translateX(0%);
}

@media only screen and (min-width: 750px) {
    .container {
        flex-direction: row;
        justify-content: space-around;
    }

    .container .content {
        width: 68%;
        height: 100vh;
    }

    .items-container {
        padding: 10px;
        border-radius: 10px;
        /* box-shadow: #565656 -2px 3px 13px 0px; */
        margin: 10px;
    }

    .container .content .navigator {
        padding: 0% 35%;
    }

    .container .player {
        position: relative;
        width: 30%;
        height: 80vh;
        margin: 10px;
        border-radius: 30px;
        align-self: unset;
        padding: 10px;
        /* box-shadow: #565656 4px 3px 13px 0px; */
        background: unset;
        transform: unset;
    }

}
</style>