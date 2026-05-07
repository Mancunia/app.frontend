<template>
  <div class="page">
    <div class="body">
      <LayoutAppNavBar />
      <div class="container">
        <div class="content">
          <div class="items-container">
            <slot />
          </div>
          <div class="navigator">
            <UiAppNavigator />
          </div>
        </div>
        <div class="player" id="player" data-dark="true">
          <UiAppPlayerDetails />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  margin-bottom: 5%;
  overflow: scroll;
}

.items-container {
  position: relative;
  width: 100%;
  height: 80vh;
  margin-bottom: 5%;
  overflow-y: auto;
}

.content .navigator { padding: 0 10px; }

.player {
  position: fixed;
  align-self: center;
  width: 90%;
  padding: 20px;
  border-radius: 12px;
  background: var(--ink);
  transition: 0.5s ease-in-out;
  transform: translateX(96%);
}
.player:hover { transform: translateX(0%); }

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
  .content .navigator { padding: 0 35%; }
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
