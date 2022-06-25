<template>
    <div id="getting-started">
        <div class="header">
            <div class="icon-app" @click="backGettingStarted"></div>
            <div class="group-header">
                <div class="btn-header btn-register" @click="showBoxRegister">Đăng ký</div>
                <div class="btn-header btn-team">Đội ngũ</div>
            </div>
        </div>
        <div class="container">
            <div class="left">
                <!-- Getting Started -->
                <div class="container-general" v-if="!isLogin">
                    <div class="title">VISONET</div>
                    <div class="content">
                        Kết nối muôn nơi cùng <span id="visonet">Visonet.</span>
                    </div>
                    <div class="flex">
                        <div class="button-login" @click="showLoginBox">Đăng nhập</div>
                        <div class="ask-register" @click="showBoxRegister">Bạn chưa có tài khoản?</div>
                    </div>
                </div>
                <!-- Box đăng nhập -->
                <div class="box-login" v-if="isLogin">
                    <div class="success-register flex" v-if="doneRegister">
                        <div class="icon-48 icon-success"></div>
                        <div class="content-noti">Đăng ký tài khoản thành công</div>
                    </div>  
                      
                    <div class="title">VISONET</div>
                    <input class="input-login" v-model="email" type="text" placeholder="Email" v-on:keyup.enter="clickLogin">
                    <div class="wrap-pass">
                        <input 
                        v-if="!isShowPass"
                        class="input-login" 
                        v-model="password" 
                        type="password" 
                        placeholder="Mật khẩu" 
                        v-on:keyup.enter="clickLogin">
                        <input 
                        v-if="isShowPass"
                        class="input-login" 
                        v-model="password" 
                        type="text" 
                        placeholder="Mật khẩu" 
                        v-on:keyup.enter="clickLogin">
                        <div class="eye-pass" :class="{'icon-show-pass' : isShowPass, 'icon-hide-pass': !isShowPass}" @click="clickEyePass"></div>
                    </div>
                    <div class="text-noti" v-if="accoutNotFound">Tài khoản này không tồn tại.</div>
                    <div class="text-noti" v-if="accoutWrong">Mật khẩu không đúng.</div>
                    <div class="button-login" @click="clickLogin">Đăng nhập</div>
                    <div class="ask-forget-pass" @click="isForgetPass = true">Bạn quên mật khẩu?</div>
                </div>
            </div>
            <div class="right"></div> 
        </div>
        <PopupRegister v-if="isRegister" @closeBoxRegister="closeBoxRegister" @successRegister="successRegister"/>
        <PopupForgetPassword v-if="isForgetPass" @closeForgetPass="closeForgetPass"></PopupForgetPassword>
    </div>
</template>
<script>
import axios from "axios";
import PopupRegister from "@/views/GettingStarted/PopupRegister.vue"
import {EventBus} from "../../main"
import PopupForgetPassword from "@/views/GettingStarted/PopupForgetPassword.vue"
export default {
    name: 'GettingStarted',
    components:{
        PopupRegister,
        PopupForgetPassword
    },
    data() {
        return {
            isLogin: false,         //Trạng thái popup đăng nhập
            isRegister: false,      //Trạng thái popup đăng ký
            isForgetPass: false,    //Trạng thái popup quên mật khẩu
            doneRegister: false,    //Đăng ký tài khoản thành công
            email: "",
            password: "",
            accoutNotFound: false,  //Không tìm thấy tài khoản
            accoutWrong: false,     //Sai tài khoản,
            userID: "",
            isShowPass: false,
        }
    },
    methods: {
        clickEyePass(){
            this.isShowPass = !this.isShowPass;
        },
        backGettingStarted(){
            this.isLogin = false;
        },
        /**
         * Hiển thị form đăng nhập
         */
        showLoginBox(){
            this.isLogin = true;
        },
        /**
         * Hiển thị box đăng ký tài khoản
         */
        showBoxRegister(){
            this.isRegister = true;
        },
        /**
         * Đóng box đăng ký tài khoản
         */
        closeBoxRegister(){
            this.isRegister = false;
        },
        closeForgetPass(){
            this.isForgetPass = false;
        },
        /**
         * Đăng nhập
         * @created 12/11/2021
         */
        clickLogin(){
            let objectLogin = {
                email: this.email,
                password: this.password
            };
            axios.post(`http://localhost:3000/api/auth/sign-in`, objectLogin)
            .then(res => {
                this.$cookie.set('jwtToken', res.data.accessToken, { expires: '1D' });
                this.$cookie.set('u_id', res.data.id, {expires: '1D'});
                this.$cookie.set('u_name', res.data.userName, {expires: '1D'});
                this.userID = res.data.id;
                this.$store.dispatch('updateUserInfor', res.data);
            }).then(() => {
                EventBus.$emit('showHeaderApp');
                this.$router.push('/');
                // Bắn socket chứa userID khi user online
                this.$socket.emit('user-online', this.userID);
            })
            .catch(err => {
                if(err.response.status == 404){
                    this.accoutNotFound = true;
                    this.accoutWrong = false;
                }
                if(err.response.status == 401){
                    this.accoutWrong = true;
                    this.accoutNotFound = false;
                }
                console.error(err); 
            })
        },
        /**
         * Thông báo sau khi đăng ký thành công
         * @created 15/11/2021
         */
        successRegister(){
            this.isLogin = true;
            this.doneRegister = true;
        }
    },
}
</script>
<style lang="scss" scoped>
    @import "../../css/views/GettingStartedCSS/getting-started.css";
.wrap-pass{
    position: relative;
    .eye-pass{
        position: absolute;
        top: 10px;
        right: 14px;
        cursor: pointer;
    }
}
</style>