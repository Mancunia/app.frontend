<template>
    <div class="col card">
        <div class="img-placeholder">
            <img :src="checkForOldFile(profile.dp)">
        </div>
        <div>
            <h3>{{ profile.email }}</h3>
            <p><i class="fa-solid fa-user"></i> {{ profile.username }}</p>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { USER_PROFILE } from '~/types/auth';
const props = defineProps({
    profile: {
        type: Object as PropType<USER_PROFILE>,
        required: true
    }
})

const form = ref<USER_PROFILE>(props.profile);

const { checkForOldFile } = useUtils();

</script>

<style scoped>
.col {
    width: 100%;
}

.card {
    border: 1px solid #eee;
    border-radius: 15px;
    padding: 20px;
    background-color: #fff;
    display: flex;
    column-gap: 20px;
    box-shadow: 1px 1px 16px -6px rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 1px 1px 16px -6px rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 1px 1px 16px -6px rgba(0, 0, 0, 0.5);
}

.card img {
    max-width: 250px;
    transform: translateY(-15%);
}

.img-placeholder {
    position: relative;
    max-height: 200px;
    overflow: hidden;
    border-radius: 15px;
    box-shadow: 1px 1px 16px -6px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 1px 1px 16px -6px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 1px 1px 16px -6px rgba(0, 0, 0, 0.75);
}

h3 {
    font-weight: 400;
}

p {
    font-weight: 300;
}

a {
    color: #888;
    text-decoration: none;
}

a:hover {
    color: inherit;
}
</style>