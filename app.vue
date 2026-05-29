<template>
    <div>
        <NuxtLoadingIndicator />
        <Toaster
            close-button
            rich-colors
            :expand="false"
            position="top-right"
        />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<script lang="ts" setup>
import LogRocket from 'logrocket';
LogRocket.init('y8dnyu/anansesemfie');


</script>
