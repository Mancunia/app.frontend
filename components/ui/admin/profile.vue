<template>
    <div class="profileWrapper">
        <div class="profilePicture">
            <img :src="checkForOldFile(profile.dp)">
        </div>
        <div class="profileDetails">
            <h3><i class='bx bxs-envelope'></i>{{ profile.email }}</h3>
            <p><i class='bx bx-user'></i> {{ profile.username }}</p>
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
.profileWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
}

.profilePicture {
    border-radius: 50%;
    height: 200px;
    margin: 10px 0px 20px 0px;
    overflow: hidden;
    width: 200px;
}

.profilePicture img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profileDetails {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.profileDetails h3 {
    font-size: 1.2rem;
    margin: 0;
}

.profileDetails p {
    font-size: 1rem;
    margin: 0;
}
</style>