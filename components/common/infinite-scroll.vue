<template>
    <div ref="root" />
</template>

<script setup lang="ts">
const root = ref(null);

const observer = ref<IntersectionObserver | null>(null);
const emit = defineEmits(["intersect"]);
const props = defineProps({
    options: {
        type: Object,
        default: () => ({})
    }
});

onMounted(() => {
    const observerOptions = props.options || {};
    observer.value = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
            emit("intersect");
        }
    }, observerOptions);
    observer.value.observe(root.value!);
});
</script>
