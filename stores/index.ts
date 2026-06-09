import { defineStore } from "pinia";
import { ref } from "vue";
import { set, useLocalStorage } from "@vueuse/core";
import { type USER } from "@/types/auth";
import type { CHAPTER, PLAYER, QUEUE_ITEM } from "~/types/book";
import { USER_ROLES } from "~/constants";
import type { Languages, Categories, QUOTE } from "~/types/common";
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
      playbackRate: 1,
      showDrawer: false,
    } as Partial<PLAYER>),
    queue: ref([] as QUEUE_ITEM[]),
    queueIndex: ref(-1),
    languages: useLocalStorage("languages", [] as Languages[]),
    categories: useLocalStorage("categories", [] as Categories[]),
    quotes: useLocalStorage("quotes", [] as QUOTE[]),
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
    setPlayingPage(page: number) {
      set(this.playing, "page", page);
    },
    setPlayingSeek(seek: number) {
      set(this.playing, "seek", seek);
    },

    setPlayer(player: Partial<PLAYER>) {
      this.player = { ...this.player, ...player };
    },
    toggleDrawer(show?: boolean) {
      this.player.showDrawer = show ?? !this.player.showDrawer;
    },
    setLanguages(languages: Languages[]) {
      this.languages = languages;
    },
    setCategories(categories: Categories[]) {
      this.categories = categories;
    },
    setQuotes(quotes: QUOTE[]) {
      this.quotes = quotes;
    },
    clearPageAndSeek() {
      set(this.playing, "page", 1);
      set(this.playing, "seek", null);
    },
    setQueue(items: QUEUE_ITEM[]) {
      this.queue = items;
    },
    addToQueue(item: QUEUE_ITEM) {
      this.queue = [...this.queue, item];
    },
    removeFromQueue(index: number) {
      const q = [...this.queue];
      q.splice(index, 1);
      this.queue = q;
      if (this.queueIndex >= index) {
        this.queueIndex = this.queueIndex - 1;
      }
    },
    reorderQueue(from: number, to: number) {
      const q = [...this.queue];
      const [moved] = q.splice(from, 1);
      q.splice(to, 0, moved);
      this.queue = q;
      if (this.queueIndex === from) {
        this.queueIndex = to;
      }
    },
    clearQueue() {
      this.queue = [];
      this.queueIndex = -1;
    },
    setQueueIndex(index: number) {
      this.queueIndex = index;
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
    getQueue(state) {
      return state.queue;
    },
    getQueueIndex(state) {
      return state.queueIndex;
    },
    getPlayer(state) {
      return state.player;
    },
    getLanguages(state) {
      return state.languages;
    },
    getCategories(state) {
      return state.categories;
    },
    getQuotes(state) {
      return state.quotes;
    },
  },
});
