<template>
    <aside>
        <nav>
            <ul>
                <li v-for="(nav, index) in navItems" :key="index">
                    <NuxtLink v-if="nav.hasAccess.includes(admin.role)" :to="nav.url" :class="{ active: nav.url === activeRoute }">
                        <i :class="nav.icon"></i>
                        <span>{{ nav.title }}</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="routes.app.home">
                        <i class="bx bx-left-arrow"></i>
                        <span>App</span>
                    </NuxtLink>
                    <a @click="admin_logout">
                        <i class="bx bx-log-out"></i>
                        <span>Log Out</span>
                    </a>
                </li>
            </ul>
        </nav>
    </aside>
</template>
<script setup lang="ts">
import routes from '~/routes';
const { navItems, activeRoute } = useNavigation()
const { admin_logout } = useAuth()
const admin = useAuthStore().getAdmin


</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    --sb-width: 10%;
    font-family: system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: var(--ink);
    background-color: var(--paper);
}

body.sb-expanded {
    --sb-width: 12.5rem;
}

h1 {
    font-size: 1.5rem;
    font-weight: bold;
}

p {
    margin-bottom: 1.5rem;
}

aside {
    position: fixed;

    inset: 0 auto 0 0;
    padding: 1rem;
    width: 17%;
    background: var(--ink);
    transition: width 0.5s ease-in-out;
}

nav {
    height: 100%;
}

nav .app-logo {
    width: 70px;
    height: 35px;
    position: relative;
}

nav ul {
    list-style: none;
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
    gap: 0.25rem;
}

nav li:last-child {
    margin-top: auto;
}

nav a {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 0.875rem;
    font-size: 1.25rem;
    line-height: 1;
    color: var(--cream);
    text-decoration: none;
    border-radius: 0.375rem;
    transition: background-color 0.5s ease-in-out, color 0.5s ease-in-out;
}

nav a.active,
nav a:hover,
nav a:focus-visible {
    outline: none;
    color: var(--kola);
    background-color: var(--paper);
}

nav a.active span,
nav a:hover span {
    color: var(--kola);
}

nav a span {
    font-size: 0.875rem;
    visibility: hidden;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
}

.sb-expanded nav a span {
    opacity: 1;
    visibility: visible;
}

.sb-expanded aside .bx-chevrons-right {
    rotate: 180deg;
}

@media (min-width: 768px) {
    aside {
        width: 10%;
    }

    nav a span {
        font-size: 0.875rem;
        opacity: 1;
        visibility: unset;
        color: var(--cream);
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    }
}

@media (min-width: 1024px) {
    aside {
        width: 10%;
    }
}
</style>