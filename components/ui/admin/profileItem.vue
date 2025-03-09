<template>

    <div class="card" :class="{ active }">
        <div class="dp">
            <img :src="checkForOldFile(profile.dp)" alt="Profile Image">
        </div>
        <div class="details">
            <h3>{{ profile.email }}</h3>
            <p>{{ profile.username }}</p>
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
    flex-direction: row;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: 5px 6px 5px 3px rgba(0, 0, 0, 0.1);
}

.card .dp {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
}

.card .dp img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card .details {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.card .details h3 {
    font-size: 1.2rem;
    margin: 0;
}

.active {
    background-color: #604108;
    color: #fff;
}
</style>