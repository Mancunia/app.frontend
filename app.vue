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
