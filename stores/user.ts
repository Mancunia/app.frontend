import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { type USER } from "@/types/auth";
import { USER_ROLES } from "~/constants";

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
    playing: useLocalStorage("playing", {}),
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
  },
});
