import Vue from 'vue'
import Vuex from 'vuex'
// import App from './App.vue'
import Main from './Main.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookie from 'vue-cookie'
import router from './router'
import Cloudinary, { CldImage, CldVideo, CldTransformation } from "cloudinary-vue";
import Spinner from 'vue-spinkit'
// import VueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'

// Vuex 
import store from './store/store'

//Global component
import i18n from './i18n/i18n';
import { _getLocalStorage, _setLocalStorage, _removeLocalStorage , _getSessionStorage, _setSessionStorage, _removeSessionStorage } from "@/utils/cacheClient.js"

export const EventBus = new Vue();

Vue.component('Spinner', Spinner);

Vue.use(Vuex);
Vue.use(VueCookie);
Vue.use(VueAxios, axios);

// Thiết lập kết nối Cloudinary
Vue.use(Cloudinary, {
  configuration: { cloudName: "visonetcloud" },
  components: {
    CldImage,
    CldVideo,
    CldTransformation,
  }
});

window.$store = store;
window.$function = Vue.prototype.$function = {
  _getLocalStorage,
  _setLocalStorage,
  _removeLocalStorage,
  _getSessionStorage,
  _setSessionStorage,
  _removeSessionStorage
}
// Thiết lập kết nối Socket
// const socketConnection = io('http://localhost:3000');
// Vue.use(new VueSocketIO({
//     debug: true,
//     connection:socketConnection 
//   })
// );

/**
 * Khai báo toàn cục socket - sử dụng qua biến $socket
 */ 
Vue.prototype.$socket = io('http://localhost:3000');
Vue.prototype.$eventBus = EventBus;
Vue.config.productionTip = false

// new Vue({
//   el: '#app',
//   router,
//   store,
//   i18n,
//   components: { App },
//   template: '<App/>'
//   // render: h => h(App),
// })

new Vue({
  router,
  store,
  i18n,
  render: h => h(Main),
}).$mount('#app')