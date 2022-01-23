<template>
  <div id="app">
    <header-app v-if="showHeader"></header-app>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import {EventBus} from "./main"
import HeaderApp from "@/components/header-app/HeaderApp.vue"
export default {
  name: 'App',
  components: {
    HeaderApp
  },
  data() {
    return {
      showHeader: false,
      jwt: "",
    }
  },
  created() {
    this.jwt = this.$cookie.get('jwtToken');
    // Bắn socket chứa userID khi user online
    if(this.$cookie.get('jwtToken')){
      this.$socket.emit('user-online', this.$cookie.get('u_id'));
    }
    // Bắt sự kiện sau khi đăng nhập => hiển thị header app
    EventBus.$on('showHeaderApp', ()=>{
      this.showHeader = true;
    })
  },
  mounted() {
    this.$socket.on("get_notification", (data) => {
        EventBus.$emit('notification_addfriend', data);
    })
  },
  watch:{
    jwt: function(){
      if(this.jwt == null){
        this.showHeader = false;
      }else{
        this.showHeader = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../src/css/main.css";
</style>
