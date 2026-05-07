<template>
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-mark">◆</span>
      <span class="brand-name">Anansesem</span>
    </div>

    <nav class="nav">
      <NuxtLink
        v-for="item in navItems"
        :key="item.url"
        :to="item.url"
        class="nav-item"
        :class="{ active: isActive(item.url) }"
      >
        <span class="diamond">{{ isActive(item.url) ? '◆' : '◇' }}</span>
        <span class="label">{{ item.title }}</span>
      </NuxtLink>
    </nav>

    <div class="spacer" />

    <div class="proverb-card">
      <p class="proverb-text">"Wisdom is like a baobab tree; no one person can embrace it."</p>
    </div>

    <div class="footer-links">
      <NuxtLink :to="routes.app.home" class="footer-link">
        <span class="diamond">◇</span>
        <span>Back to app</span>
      </NuxtLink>
      <button class="footer-link logout-btn" @click="admin_logout">
        <span class="diamond">◇</span>
        <span>Log out</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import routes from '~/routes';
const { navItems } = useNavigation();
const { admin_logout } = useAuth();
const route = useRoute();

const isActive = (url: string) => {
  if (url === routes.admin.home) return route.path === url;
  return route.path.startsWith(url);
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 232px;
  background: var(--ink);
  display: flex;
  flex-direction: column;
  padding: 24px 0 20px;
  overflow: hidden;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 24px;
  border-bottom: 1px solid rgba(241,238,227,0.08);
}

.brand-mark {
  color: var(--ochre);
  font-size: 18px;
  line-height: 1;
}

.brand-name {
  font-family: var(--font-display);
  font-size: 15px;
  color: var(--cream);
  letter-spacing: 0.04em;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 16px 12px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: rgba(241,238,227,0.85);
  font-family: var(--font-sans);
  font-size: 13.5px;
  font-weight: 400;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background: rgba(201,122,58,0.10);
  color: var(--cream);
}

.nav-item.active {
  background: rgba(201,122,58,0.18);
  color: var(--ochre);
  font-weight: 600;
}

.nav-item.active .diamond {
  color: var(--ochre);
}

.diamond {
  font-size: 9px;
  line-height: 1;
  flex-shrink: 0;
  color: rgba(241,238,227,0.40);
}

.label {
}

.spacer {
  flex: 1;
}

.proverb-card {
  margin: 0 12px 16px;
  padding: 12px 14px;
  background: rgba(201,122,58,0.12);
  border: 1px solid rgba(201,122,58,0.18);
  border-radius: 10px;
}

.proverb-text {
  font-family: var(--font-serif);
  font-size: 11px;
  font-style: italic;
  line-height: 1.6;
  color: rgba(241,238,227,0.70);
  margin: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 12px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: rgba(241,238,227,0.50);
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: color 0.15s;
}

.footer-link:hover {
  color: rgba(241,238,227,0.80);
}

.logout-btn {
  font-family: var(--font-sans);
}
</style>
