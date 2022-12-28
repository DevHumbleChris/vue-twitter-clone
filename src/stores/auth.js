import { defineStore } from "pinia";

export const useAuthentification = defineStore("auth", {
  state: () => ({
    authenticated: false
  }),
  actions: {
    setAuthentication() {
      this.authenticated = true;
      localStorage.setItem("authenticated", "true");
    },
    logOut() {
      this.authenticated = false;
      localStorage.setItem("authenticated", "false");
    },
  },
});
