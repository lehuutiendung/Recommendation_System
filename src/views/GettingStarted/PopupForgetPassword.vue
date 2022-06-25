<template>
    <div class="background-popup">
        <div class="popup-register">
            <div class="title-register">
                <div class="title">QUÊN MẬT KHẨU</div>
                <div class="icon-32 flex-justify-center hover-circle">
                    <div class="icon-24 btn-exit" @click="closeBox"></div>
                </div>
            </div>
            <div class="content-register">
                <div v-if="!sendEmailSuccess">
                    <!-- Email -->
                    <BaseInput class="mg-b-10" 
                    v-model="email" 
                    label="Email" width="100%" 
                    :required="true"
                    :maxlength="100"
                    @blur="validateEmail(email)"
                    />
                    <div class="note-error" v-if="invalidEmail">{{ $t('i18nGettingStarted.PopupRegister.InvalidEmail') }}</div>
                    <div class="button-register" @click="sendEmail">Yêu cầu đặt lại mật khẩu</div>
                </div>
                <div class="sent-mail" v-else>
                    <div class="text">Chúng tôi đã gửi yêu cầu xác nhận khôi phục mật khẩu đến email của bạn. Vui lòng kiểm tra.</div> 
                    <ButtonIcon text="Đóng" width="100" color="white" @click.native="closeBox"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BaseInput from "@/components/input/BaseInput.vue"
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue";
import EmailAPI from "@/api/EmailAPI.js"

export default {
    name: "PopupForgetPassword",
    components:{
        BaseInput,
        ButtonIcon
    },
    data() {
        return {
            email: "",
            invalidEmail: false,     //Check email hợp lệ, mặc định ban đầu hợp lệ
            sendEmailSuccess: false,
        }
    },
    methods: {
        /**
         * Đóng box đăng ký
         * @created 13/11/2021
         */
        closeBox(){
            this.$emit('closeForgetPass');
        },
        //Check email hợp lệ
        validateEmail(value) {
            if(value){
                var patternEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!patternEmail.test(value)) {
                    this.invalidEmail = true;
                    return false;
                } else {
                    this.invalidEmail = false;
                    return true;
                }
            }
        },
        //Gửi email lấy lại mật khẩu
        sendEmail(){
            let param = {
                email: this.email
            }
            EmailAPI.sendEmailForgetPass(param).then(res => {
                console.log(res);
                if(res.data && res.data.success){
                    this.sendEmailSuccess = true;
                }
            })
        }
    },
}
</script>
<style lang="scss" scoped>
@import "../../css/views/GettingStartedCSS/popup-register.css";   
.sent-mail{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .text{
        font-size: 16px;
        font-style: italic;
        margin-bottom: 10px;
    }
}
</style>