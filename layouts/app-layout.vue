<template>
  <div class="page">
    <div class="body">
      <LayoutAppNavBar />
      <div class="container">
        <div class="content">
          <div class="items-container">
            <slot />
          </div>
          <div class="content-spacer" :class="{ 'has-player': isPlaying }"></div>
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
const isPlaying = computed(() => !!store.getPlaying?.id);
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.page { background: var(--paper); height: 100vh; overflow: hidden; }
.body { width: 100%; height: 100%; display: flex; flex-direction: column; }

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow: hidden;
}

.content {
  position: relative;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 20px;
}

.items-container {
  position: relative;
  width: 100%;
  height: auto;
}

.content-spacer {
  height: calc(140px + env(safe-area-inset-bottom)); /* Space for fixed navigator */
  flex-shrink: 0;
  transition: height 0.3s ease;
}

.content-spacer.has-player {
  height: calc(240px + env(safe-area-inset-bottom)); /* Extra space for mini player + navigator */
}

.navigator-container {
  position: fixed;
  bottom: calc(20px + env(safe-area-inset-bottom));
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
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
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
  }
  .content {
    flex: 1;
    height: 100%;
  }
  .items-container { padding: 10px; border-radius: 10px; margin: 10px; }
  .content-spacer { display: none; }
  .navigator-container { display: none; }
  .player {
    position: relative;
    top: 0;
    width: 30%;
    height: 100%;
    border-radius: 0;
    align-self: stretch;
    padding: 0;
    background: var(--ink);
    transform: none;
    margin: 0;
    flex-shrink: 0;
    overflow: hidden;
  }
}
</style>
