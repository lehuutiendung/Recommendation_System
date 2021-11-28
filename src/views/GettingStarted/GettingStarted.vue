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
                        <div class="content-noti">Đăng ký tài khoản thành công.</div>
                    </div>    
                    <div class="title">VISONET</div>
                    <input class="input-login" v-model="email" type="text" placeholder="Email">
                    <input class="input-login" v-model="password" type="password" placeholder="Mật khẩu">
                    <div class="text-noti" v-if="accoutNotFound">Tài khoản này không tồn tại.</div>
                    <div class="text-noti" v-if="accoutWrong">Mật khẩu không đúng.</div>
                    <div class="button-login" @click="clickLogin">Đăng nhập</div>
                    <div class="ask-forget-pass">Bạn quên mật khẩu?</div>
                </div>
            </div>
            <div class="right"></div> 
        </div>
        <PopupRegister v-if="isRegister" @closeBoxRegister="closeBoxRegister" @successRegister="successRegister"/>
    </div>
</template>
<script>
import axios from "axios";
import PopupRegister from "@/views/GettingStarted/PopupRegister.vue"
export default {
    name: 'GettingStarted',
    components:{
        PopupRegister,
    },
    data() {
        return {
            isLogin: false,         //Trạng thái popup đăng nhập
            isRegister: false,      //Trạng thái popup đăng ký
            doneRegister: false,    //Đăng ký tài khoản thành công
            email: "",
            password: "",
            accoutNotFound: false,  //Không tìm thấy tài khoản
            accoutWrong: false,     //Sai tài khoản
        }
    },
    methods: {
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
                this.$router.push('/');
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
<style scoped>
    @import "../../css/views/GettingStartedCSS/getting-started.css";
</style>