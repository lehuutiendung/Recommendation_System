<template>
  <div>
    <header-app v-if="showHeader" @logout="hideHeader"></header-app>
    <router-view></router-view>
    <div class="wrap-box-chat">
      <ChatBox 
      v-if="isOpenChat"
      v-model="message"
      :dataFriend="dataFriend"
      :isOpenChat="isOpenChat"
      @clearMessage="message=''" 
      @exitChat="exitChat"
      ></ChatBox>
    </div>
    <Spinner className="spinner" name="fading-circle" color="#7442BD" width="46" height="46" v-if="isSpinner"/>
  </div>
</template>

<script>
import ChatBox from "@/components/chat-box/ChatBox.vue";
import {EventBus} from "./main";
import HeaderApp from "@/components/header-app/HeaderApp.vue";
export default {
  name: 'App',
  components: {
    HeaderApp,
    ChatBox
  },
  data() {
    return {
      showHeader: false,
      jwt: "",
      message: "",
      isOpenChat: false,
      dataFriend: null,
      isSpinner: false,
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

    //Nhận userID khi click chọn người nhắn tin
    EventBus.$on('chat-with-friend', (data) => {
        //TODO: Mở tắt độc lập các box chat
        this.dataFriend = data;
        this.isOpenChat = true;
    })

    //Eventbus exit chat
    EventBus.$on('exit-chat', () => {
        this.exitChat();
    })

    //Eventbus ẩn/hiện loading
    EventBus.$on('loading', (data) => {
        this.isSpinner = data;
    })
  },
  methods:{
    /**
     * Đăng xuất
     */
    hideHeader(){
      this.$cookie.delete('jwtToken');
      this.$socket.disconnect();
      this.$cookie.delete('u_id');
      this.$cookie.delete('u_name');
      this.showHeader = false;
      this.isOpenChat = false;
      this.$router.push('/login');
    },
    exitChat(){
      this.isOpenChat = false;
    }
  },
  watch:{
    jwt: function(){
      if(this.jwt == null){
        this.showHeader = false;
      }else{
        this.showHeader = true;
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "../src/css/main.css";
.wrap-box-chat{
    position: absolute;
    bottom: 0;
    right: 38px;
    display: flex;
}
</style>
