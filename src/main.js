import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookie from 'vue-cookie'
import router from './router'

//Global component
import i18n from './i18n/i18n';

export const EventBus = new Vue();

Vue.use(VueAxios, axios);
Vue.use(VueCookie);

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
