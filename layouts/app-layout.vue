<template>
  <div class="page">
    <div class="body">
      <LayoutAppNavBar />
      <div class="container">
        <div class="content">
          <div class="items-container">
            <slot />
          </div>
          <div class="content-spacer"></div>
        </div>
        
        <div class="navigator-container">
          <UiAppNavigator />
        </div>

        <UiAppHearthCard />

        <div class="player" id="player" :class="{ open: store.player.showDrawer }" data-dark="true">
          <UiAppPlayerDetails />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAuthStore();
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.page { background: var(--paper); }
.body { width: 100%; height: 100%; }

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.content {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 20px;
  overflow-y: auto;
}

.items-container {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 80vh;
}

.content-spacer {
  height: 120px; /* Space for fixed navigator and hearth card */
  flex-shrink: 0;
}

.navigator-container {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 100;
  pointer-events: none;
}

.navigator-container > * {
  pointer-events: auto;
}

.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90vh;
  width: 100%;
  padding: 20px;
  border-radius: 30px 30px 0 0;
  background: var(--ink);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(110%);
  z-index: 200;
}

.player.open {
  transform: translateY(0);
}

@media only screen and (min-width: 750px) {
  .container {
    flex-direction: row;
    align-items: stretch;
    height: 100vh;
  }
  .content {
    flex: 1;
    height: 100vh;
  }
  .items-container { padding: 10px; border-radius: 10px; margin: 10px; }
  .content-spacer { display: none; }
  .navigator-container { display: none; }
  .player {
    position: sticky;
    top: 0;
    width: 30%;
    height: 100vh;
    border-radius: 0;
    align-self: unset;
    padding: 10px;
    background: var(--ink);
    transform: none;
    margin: 0;
    flex-shrink: 0;
  }
}
</style>
