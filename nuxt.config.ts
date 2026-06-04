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
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Pontano+Sans:wght@300..700&family=Rammetto+One&family=JetBrains+Mono:wght@400..700&display=swap",
          rel: "stylesheet",
        },
        {
          href: "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css",
          rel: "stylesheet",
        },
        {
          href: `${process.env.NUXT_BASE_URL}/favicon.png`,
          rel: "icon",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_BASE_URL,
      defaultToken: "",
      oldResource: process.env.NUXT_OLD_RESOURCE || "https://api.anansesemfie.com",
    },
  },

  routeRules: {
  "/": { redirect: "/app" },
  "/**": {
    headers: {
      "Cross-Origin-Embedder-Policy": "unsafe-none",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
},

  plugins: ["~/plugins/chartjs.client.ts"],

  modules: ["@pinia/nuxt"],

  imports: {
    dirs: ["stores", "composables", "constants"],
  },

  compatibilityDate: "2024-09-14",
});
