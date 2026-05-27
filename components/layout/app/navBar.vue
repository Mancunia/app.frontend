<template>
  <nav class="navbar">
    <div class="nav-inner">
      <NuxtLink :to="routes.app.home" class="brand">
        <UiAseAnansiMark :size="24" color="var(--kola)" />
        <span class="wordmark">anansesemfie</span>
      </NuxtLink>

      <div class="nav-links">
        <NuxtLink :to="routes.app.home"    class="nav-link" :class="{ active: activeRoute === routes.app.home }">Home</NuxtLink>
        <NuxtLink :to="routes.app.library" class="nav-link" :class="{ active: activeRoute === routes.app.library }">Library</NuxtLink>
        <NuxtLink :to="routes.app.search"  class="nav-link" :class="{ active: activeRoute === routes.app.search }">Search</NuxtLink>
      </div>

      <NuxtLink :to="routes.app.profile" class="avatar-link">
        <img v-if="user.dp" :src="checkForOldFile(user.dp)" class="avatar" alt="Profile" />
        <div v-else class="avatar avatar-placeholder">
          {{ user.name?.[0]?.toUpperCase() ?? '?' }}
        </div>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import routes from '~/routes';
const { activeRoute } = useNavigation();
const user = useAuthStore().getUser;
const { checkForOldFile } = useUtils();
</script>

<style scoped>
.navbar {
  width: 100%;
  background: var(--paper);
  border-bottom: 1px solid var(--hairline);
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.wordmark {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--kola);
  letter-spacing: 0.03em;
}
.nav-links {
  display: none;
  gap: 24px;
}
.nav-link {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.15s;
}
.nav-link:hover { color: var(--ink); }
.nav-link.active { color: var(--kola); font-weight: 600; }

.avatar-link { display: flex; }
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--ochre);
}
.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--calabash);
  color: var(--kola);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
}

@media (min-width: 750px) {
  .nav-links { display: flex; }
}
</style>
