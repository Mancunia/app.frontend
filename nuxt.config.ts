// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    host: "0.0.0.0",
    port: 3080,
  },
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
