<template>

    <div ref="root" />

</template>

<script setup lang="ts">

const root = ref(null)



const observer = ref<IntersectionObserver | null>(null)

const emit = defineEmits(['more'])
const props = defineProps({

    options: {
        type: Object
    }

})



onMounted(() => {

    const observerOptions = props.options ?? {};

    observer.value = new IntersectionObserver(([entry]) => {

        if (entry?.isIntersecting) {
            emit('more')

        }

    }, observerOptions);

    observer.value.observe(root.value!);

})

</script>