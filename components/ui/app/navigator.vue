<template>
  <div class="nav">
    <NuxtLink :to="routes.app.home" class="tab-item" :class="{ active: activeRoute === routes.app.home }">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
      <span class="tab-label">Home</span>
    </NuxtLink>

    <NuxtLink :to="routes.app.search" class="tab-item" :class="{ active: activeRoute === routes.app.search }">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
      <span class="tab-label">Search</span>
    </NuxtLink>

    <NuxtLink :to="routes.app.library" class="tab-item" :class="{ active: activeRoute === routes.app.library }">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 6.5C2 5.1 3.1 4 4.5 4h15C20.9 4 22 5.1 22 6.5v11c0 1.4-1.1 2.5-2.5 2.5h-15C3.1 20 2 18.9 2 17.5v-11z"/>
        <path d="M12 4v16M2 12h20"/>
      </svg>
      <span class="tab-label">Library</span>
    </NuxtLink>

    <NuxtLink :to="routes.app.profile" class="tab-item" :class="{ active: activeRoute === routes.app.profile }">
      <img v-if="user.dp" :src="checkForOldFile(user.dp)" class="avatar-tab" alt="" />
      <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
      <span class="tab-label">Profile</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import routes from '~/routes';
const { activeRoute } = useNavigation();
const user = useAuthStore().getUser;
const { checkForOldFile } = useUtils();
</script>

<style scoped>
.nav {
  display: flex;
  width: 345px;
  padding: 10px 0;
  justify-content: space-around;
  align-items: center;
  border-radius: 33px;
  background: var(--ink);
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: var(--cream);
  opacity: 0.5;
  text-decoration: none;
  transition: opacity 0.15s, color 0.15s;
  padding: 4px 12px;
}
.tab-item:hover { opacity: 0.8; }
.tab-item.active { color: var(--ochre); opacity: 1; }
.tab-label {
  font-family: var(--font-sans);
  font-size: 0.625rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.avatar-tab {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
}

@media (min-width: 750px) {
  .nav { display: none; }
}
</style>
