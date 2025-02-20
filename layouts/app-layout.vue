<template>
    <div class="page">
        <div class="body">
            <LayoutAppNavBar />

            <div class="container">
                <div class="items-container">
                    <slot />
                </div>
                <div class="divider-container">
                    <div class="divider">
                    </div>
                </div>

                <div class="details-container">
                    <UiAppPlayerDetails class="details" />
                </div>
                <div class="bottom-bar-container">
                    <UiAppPlayer class="player" />
                    <UiAppNavigator class="navigator" />
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
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
}

.container {
    width: 100%;
    height: 100%;
    margin: auto;
    display: flex;
}

.items-container {
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

.divider-container {
    display: none;
}

.divider-container .divider {
    display: none;
}

.details-container {
    position: absolute;
}

.bottom-bar-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    padding: 10px 0px;
}

.bottom-bar-container .player {
    width: 100%;
}

@media only screen and (min-width: 750px) {
    .bottom-bar-container {
        flex-direction: row-reverse;
        justify-content: space-around;
        align-items: flex-end;
        padding: 10px 5%;
    }

    .bottom-bar-container div {
        bottom: 0;
    }

    .bottom-bar-container .player {
        width: unset;
    }

    .items-container {
        position: relative;
        width: 60%;
        height: 100vh;
        overflow-y: auto;
    }

    .divider-container {
        height: 100%;
        display: flex;
        align-items: center;
        border: 1px solid #d9d9d9;
    }

    .divider-container .divider {
        background-color: #d9d9d9;
        width: 100%;
        height: 80%;
        border-radius: 10px;
    }

    .details-container {
        position: relative;
        width: 30%;
        align-content: center;
    }

    .details-container :only-child {
        padding: 0% 5%;
    }
}
</style>