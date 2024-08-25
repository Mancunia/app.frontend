<template>
    <section>
        <div class="form">
            <slot />
        </div>
        <div class="sideImage">
            <img src="@/assets/images/bookShelve.png" alt="">
        </div>

    </section>
</template>

<script setup lang="ts">

</script>

<style scoped>
section {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh;
    background-image: url('/assets/images/bookShelve.png');
}

section .form {
    width: 100%;
    height: 80vh;
    align-items: center;
    background: #FFF;
    margin-top:50%;
    border-radius: 33px;
}

form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40% 20%;
}

.sideImage {
    display: none;
}


@media (min-width: 768px) {
    section {
        flex-direction: row;
        background-image: unset;
    }

    section .form {
        width: 50%;
        align-items: center;
        height: unset;
        margin: unset;
        border: unset;
    }

    form {
        padding: 40% 20%;
    }

    .sideImage {
        flex: 1;
        display: flex;
        width: 50%;
    }

    .sideImage img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover
    }
}

@media (min-width: 1024px) {
    section {
        flex-direction: row;
    }

    section .form {
        width: 50%;
        align-items: center;

    }

    form {
        padding: 30% 15%;
    }

    .sideImage {
        flex: 1;
        width: 50%;
    }
}
</style>