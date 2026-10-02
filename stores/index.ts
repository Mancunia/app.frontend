import { defineStore } from "pinia";
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
    queue: useLocalStorage("queue", [] as QUEUE_ITEM[]),
    queueIndex: useLocalStorage("queueIndex", -1),
    languages: useLocalStorage("languages", [] as Languages[]),
    categories: useLocalStorage("categories", [] as Categories[]),
    genres: useLocalStorage("genres", [] as any[]),
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
    setGenres(genres: any[]) {
      this.genres = genres;
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
    addToQueue(item: QUEUE_ITEM): boolean {
      if (this.queue.some((q) => q.chapter.id === item.chapter.id)) return false;
      this.queue = [...this.queue, item];
      return true;
    },
    insertNext(item: QUEUE_ITEM) {
      // Places the chapter right after the current one (or moves it there if
      // already queued) and returns its new index.
      const q = this.queue.filter((i) => i.chapter.id !== item.chapter.id);
      const currentId = this.queue[this.queueIndex]?.chapter.id;
      const currentIdx = q.findIndex((i) => i.chapter.id === currentId);
      const at = currentIdx + 1;
      q.splice(at, 0, item);
      this.queue = q;
      this.queueIndex = currentIdx;
      return at;
    },
    removeFromQueue(index: number) {
      const q = [...this.queue];
      q.splice(index, 1);
      this.queue = q;
      // queueIndex is the last-played position, so removing it (or anything
      // before it) steps back one; "next" then plays whatever slid into place.
      if (index <= this.queueIndex) {
        this.queueIndex = this.queueIndex - 1;
      }
    },
    reorderQueue(from: number, to: number) {
      if (to < 0 || to >= this.queue.length || from === to) return;
      const currentId = this.queue[this.queueIndex]?.chapter.id;
      const q = [...this.queue];
      const [moved] = q.splice(from, 1);
      q.splice(to, 0, moved);
      this.queue = q;
      this.queueIndex = q.findIndex((i) => i.chapter.id === currentId);
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
        this.clearQueue();
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
    getGenres(state) {
      return state.genres;
    },
    getQuotes(state) {
      return state.quotes;
    },
  },
});
