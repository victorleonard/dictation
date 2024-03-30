import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: "",
    learnedWord: [],
    nbWords: 0,
  }),
  getters: {},
  actions: {
    setUser(value) {
      this.user = value;
    },
    getMyLearnedWords() {
      api.get("/api/users/me/words").then((res) => {
        this.learnedWord = res.data["hydra:member"];
      });
    },
    getNbWords() {
      api.get("/api/words").then((res) => {
        this.nbWords = res.data["hydra:totalItems"];
      });
    },
  },
});
