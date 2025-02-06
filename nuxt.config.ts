// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },

  devServer: {
    host: "0.0.0.0",
    port: 3080,
  },

  ssr: false,

  app: {
    head: {
      link: [
        {
          href: "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css",
          rel: "stylesheet",
        },
        // {
        //   href: `${APP_BASE_URL}/favicon.png`,
        //   rel: "icon",
        // },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_BASE_URL,
      defaultToken: "",
    },
  },

  modules: ["@pinia/nuxt"],

  imports: {
    dirs: ["stores", "composables", "constants"],
  },

  compatibilityDate: "2024-09-14",
});
