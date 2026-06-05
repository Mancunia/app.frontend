<template>
  <div class="default-layout">
    <LayoutAppNavBar />
    <main class="main-content">
      <slot />
    </main>
    <div class="mobile-nav">
      <UiAppNavigator />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.default-layout {
  background: var(--paper);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--d-pad);
  padding-bottom: 100px; /* Space for mobile nav */
}

.mobile-nav {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 100;
}

@media (min-width: 750px) {
  .main-content {
    padding-bottom: var(--d-pad);
  }
  .mobile-nav {
    display: none;
  }
}
</style>
