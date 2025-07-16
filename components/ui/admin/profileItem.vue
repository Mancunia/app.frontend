<template>

    <div class="card" :class="{ active }" :title="profile.email">
        <div class="dp">
            <img :src="checkForOldFile(profile.dp)" alt="Profile Image">
        </div>
        <div class="details">
            <div class="text">
                {{ profile.username }}
            </div>
            <div class="subtext">
                {{ profile.email }}
            </div>
        </div>
    </div>


</template>

<script setup lang="ts">
import type { USER_PROFILE } from '~/types/auth';

const { checkForOldFile } = useUtils()
defineProps({
    profile: {
        type: Object as PropType<USER_PROFILE>,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100px;
    padding: 5px;
    margin: 0px 20px;
    border-radius: 10px;
    /* box-shadow: 5px 6px 5px 3px rgba(0, 0, 0, 0.1); */
}

.card .dp {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
}

.card .dp img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card .details {
    display: flex;
    flex-direction: column;
    width: 100px;
}


.card .details .subtext {
    font-size: 8px;
    text-align: center;
    word-break: break-all;
}

.card .details .text {
    font-size: 12px;
    font-weight: bolder;
    text-align: center;
}

.active {
    background-color: #764f0677;
    color: #fff;
}
</style>