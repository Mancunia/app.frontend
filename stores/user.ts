import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { type USER } from "@/types/auth";
import { USER_ROLES } from "~/constants";

const users = {
  user: "user",
  admin: "admin",
};
export const useAuthStore = defineStore("user", {
  state: () => ({
    user: useLocalStorage(users.user, {} as USER),
    admin: useLocalStorage(users.admin, {} as USER),
  }),

  actions: {
    setUser(user: USER) {
      this.user = user;
    },
    setAdmin(admin: USER) {
      this.admin = admin;
    },

    logout(user: USER_ROLES) {
      switch (user) {
        case USER_ROLES.ADMIN:
          this.admin = {} as USER;
          this.clearLocalStorage(users.admin);
          break;
        default:
          this.user = {} as USER;
          this.clearLocalStorage(users.user);
          break;
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
  },
});
