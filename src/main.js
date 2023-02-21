import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { VueFire, VueFireAuth } from "vuefire";
import { auth, firebaseApp } from "./firebaseConfig";
import timeago from 'vue-timeago3'

import "./style.css";

import Vue3Toasity from "vue3-toastify";
import "vue3-toastify/dist/index.css";

let app;

const timeagoOptions = {
  converterOptions: {
      includeSeconds: true,
  }
}

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(createPinia());
    app.use(router);
    app.use(timeago, timeagoOptions)
    app.use(Vue3Toasity, {
      autoClose: 3000,
    });
    app.use(VueFire, {
      // imported above but could also just be created here
      firebaseApp,
      modules: [
        // we will see other modules later on
        VueFireAuth(),
      ],
    });
    app.mount("#app");
  }
});
