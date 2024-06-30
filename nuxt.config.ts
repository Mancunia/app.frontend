// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  devServer: {
    host: "0.0.0.0",
    port: 3080,
  },
  ssr:false,
  app: {
    head: {
      link: [],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3030",
      defaultToken: "",
    },
  },
  modules: ["@pinia/nuxt"],
  imports: {
    dirs: ["stores", "composables", "constants"],
  },
});
