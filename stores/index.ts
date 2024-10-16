import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { type USER } from "@/types/auth";
import type { CHAPTER, PLAYER } from "~/types/book";
import { USER_ROLES } from "~/constants";
import type { Languages, Categories } from "~/types/common";
import { getCategories } from "~/services/common";

const users = {
  user: "user",
  admin: "admin",
  web: "web",
};
export const useAuthStore = defineStore("user", {
  state: () => ({
    user: useLocalStorage(users.user, {} as USER),
    admin: useLocalStorage(users.admin, {} as USER),
    web: useLocalStorage(users.web, {}),
    playing: useLocalStorage("playing", {} as CHAPTER),
    player: useLocalStorage("player", {
      playing: false,
      autoplay: false,
      loop: false,
      muted: false,
      volume: 1,
    } as Partial<PLAYER>),
    languages: useLocalStorage("languages", [] as Languages[]),
    categories: useLocalStorage("categories", [] as Categories[]),
  }),

  actions: {
    setUser(user: USER) {
      this.user = user;
    },
    setAdmin(admin: USER) {
      this.admin = admin;
    },
    setPlaying(playing: any) {
      this.playing = playing;
    },
    setPlayer(player: Partial<PLAYER>) {
      this.player = player;
    },
    setLanguages(languages: Languages[]) {
      this.languages = languages;
    },
    setCategories(categories:Categories[]){
      this.categories = categories
    },

    logout(user: USER_ROLES) {
      if (user === USER_ROLES.ADMIN) {
        this.admin = {} as USER;
        this.clearLocalStorage(users.admin);
      } else {
        this.user = {} as USER;
        this.clearLocalStorage(users.user);
      }
    },
    clearLocalStorage(user: string = users.user) {
      localStorage.setItem(user, JSON.stringify({}));
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getAdmin(state) {
      return state.admin;
    },
    getPlaying(state) {
      return state.playing;
    },
    getPlayer(state) {
      return state.player;
    },
    getLanguages(state) {
      return state.languages;
    },
    getCategories(state){
      return state.categories
    }
  },
});
