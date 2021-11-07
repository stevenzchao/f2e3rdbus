import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'jquery';
import 'bootstrap';
import 'popper.js';
// import "@/assets/scss/main.scss"

Vue.config.productionTip = false;
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
