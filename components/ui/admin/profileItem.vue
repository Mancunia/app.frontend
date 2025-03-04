<template>

    <div class="card">
        <img :src="profile.dp" alt="Profile Image">
        <h5>{{ profile.email }}</h5>
        <p>{{ profile.username }}</p>
    </div>


</template>

<script setup lang="ts">
import type { USER_PROFILE } from '~/types/auth';
defineProps({
    profile: {
        type: Object as PropType<USER_PROFILE>,
        required: true
    }
})
</script>

<style scoped>
.title {
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeIn 1.5s ease-in-out forwards;
}


@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}


.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}


.card {
    width: 250px;
    padding: 25px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transition: all 0.4s ease-in-out;
    overflow: hidden;
    position: relative;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}


.card:hover {
    transform: translateY(-5px) scale(1.08);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}


.card::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 150%;
    background: rgba(255, 255, 255, 0.1);
    transform: translate(-50%, -50%) scale(0);
    border-radius: 50%;
    transition: transform 0.6s ease;
}


.card:hover::before {
    transform: translate(-50%, -50%) scale(2);
}


.card img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
    border: 5px solid rgba(255, 255, 255, 0.5);
}


.card h3 {
    font-size: 22px;
    margin: 8px 0;
    color: #fff;
}


.card p {
    font-size: 16px;
    color: #ddd;
}
</style>