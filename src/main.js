import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookie from 'vue-cookie'
import router from './router'
import Cloudinary, { CldImage, CldTransformation } from "cloudinary-vue";
// import VueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'

//Global component
import i18n from './i18n/i18n';

export const EventBus = new Vue();

Vue.use(VueCookie);
Vue.use(VueAxios, axios);

// Thiết lập kết nối Cloudinary
Vue.use(Cloudinary, {
  configuration: { cloudName: "visonetcloud" },
  components: {
    CldImage,
    CldTransformation,
  }
});


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

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')