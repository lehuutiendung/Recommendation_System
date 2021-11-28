<template>
    <div class="background-popup">
        <div class="popup-register">
            <div class="title-register">
                <div class="title">ĐĂNG KÝ TÀI KHOẢN</div>
                <div class="icon-32 flex-justify-center hover-circle">
                    <div class="icon-24 btn-exit" @click="closeBox"></div>
                </div>
            </div>
            <div class="content-register">
                <div class="flex mg-b-10">
                    <!-- Họ tên -->
                    <BaseInput class="mg-r-10" 
                    v-model="user.userName" 
                    ref="firstField"
                    label="Họ tên" width="55%" 
                    :maxlength="100"
                    :required="true"/>
                    <!-- Số điện thoại -->
                    <BaseInput 
                    width="45%" 
                    v-model="user.phoneNumber" 
                    label="Số điện thoại" 
                    :required="true"
                    :maxlength="50"
                    />
                </div>
                <!-- Email -->
                <BaseInput class="mg-b-10" 
                v-model="user.email" 
                label="Email" width="100%" 
                :required="true"
                :maxlength="100"
                @blur="validateEmail(user.email)"
                />
                <!-- Mật khẩu -->
                <BaseInput class="mg-b-10" 
                v-model="user.password" 
                label="Mật khẩu" 
                :isPassword="true" 
                :required="true"
                />
                <!-- Ngày sinh -->
                <BaseInput class="mg-b-10" 
                v-model="user.dateOfBirth" 
                label="Ngày sinh" 
                :isInputDate="true" 
                @datepicker="getValueDatePicker"/>
                <!-- Giới tính -->
                <div class="flex mg-b-10">
                    <div class="label-gender">Giới tính</div>
                    <Radio nameRadio="Nam" @radio="getRadio" :indexRadio="indexRadio" :index="0"/>
                    <Radio nameRadio="Nữ" @radio="getRadio" :indexRadio="indexRadio" :index="1"/>
                    <Radio nameRadio="Khác" @radio="getRadio" :indexRadio="indexRadio" :index="2"/>
                </div>
                <div class="note-error" v-if="!passValidate">{{ $t('i18nGettingStarted.PopupRegister.TextRequired') }}</div>
                <div class="note-error" v-if="invalidEmail">{{ $t('i18nGettingStarted.PopupRegister.InvalidEmail') }}</div>
                <div class="note-error" v-if="duplicateEmail">{{ $t('i18nGettingStarted.PopupRegister.DuplicateEmail') }}</div>
                <div class="button-register" @click="handleRegister">Đăng ký</div>
            </div>
        </div>
    </div>
</template>
<script>
import BaseInput from "@/components/input/BaseInput.vue"
import Radio from "@/components/input-radio/BaseRadio.vue"
import { GenderEnum } from "@/models/enums/GenderEnum.js"
import moment from "moment"
import axios from "axios";
import { ConfigApiEnum } from "@/models/enums/ConfigApiEnum.js"
export default {
    name: 'PopupRegister',
    components:{
        BaseInput,
        Radio
    },
    mounted() {
        this.focusFirstField();
    },
    data() {
        return {
            user:{
                userName: "",
                phoneNumber: "",
                email: "",
                password: "",
                dateOfBirth: null,
                gender: GenderEnum.Male
            },
            indexRadio: 0,
            textError: "",
            passValidate: true,     //Check các trường bắt buộc nhập, mặc định ban đầu pass
            invalidEmail: false,     //Check email hợp lệ, mặc định ban đầu hợp lệ
            duplicateEmail: false,   //Check trùng email
        }
    },
    methods: {
        /**
         * Đóng box đăng ký
         * @created 13/11/2021
         */
        closeBox(){
            this.$emit('closeBoxRegister');
        },
        /**
         * Nhận giá trị của date-picker
         * @created 13/11/2021
         */
        getValueDatePicker(e){
            this.$set(this.user, "dateOfBirth", moment(e).format());
        },
        /**
         * Thay đổi giá trị và gán giá trị cho Gender
         * @created 13/11/2021
         */
        getRadio(value){ 
            this.$set(this.user, "gender", value);
            this.indexRadio = value;
        },
        /**
         * Sự kiện Click button "Đăng ký"
         * @created 13/11/2021
         */
        handleRegister(){
            if(!this.checkValidate()){
                this.passValidate = false;
            }
            if(this.validateEmail(this.user.email)){
                this.passValidate = true;
                axios.post( ConfigApiEnum.URL_API + `auth/sign-up`, this.user)
                .then(() => {
                    this.closeBox();
                    this.$emit('successRegister');
                })
                .catch(err => {
                    if(err.response.data.code_msg == "INVALID_EMAIL"){
                        this.invalidEmail = true;
                    }
                    console.error(err); 
                    if(err.response.data.code_msg == "DUPLICATE_EMAIL"){
                        this.duplicateEmail = true;
                    }
                })
            }
        },
        /**
         * Check các trường bắt buộc, validate email
         * @created 14/11/2021 
         */
        checkValidate(){
            // Check các trường bắt buộc và focus vào ô cần điền
            if(this.user.userName == "" 
            || this.user.phoneNumber == "" 
            || this.user.email == "" 
            || this.user.password == ""){
                var list = this.$el.querySelectorAll(`input.required`);
                for(let i = 0; i < list.length; i++){
                    if(list[i].value == ''){
                        list[i].focus();
                        return false;
                    }
                }
            }
            return true;
        },
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
        /**
         * Focus vào trường đầu tiên
         * @created 15/11/2021
         */
        focusFirstField(){
            this.$refs.firstField.$el.children[1].focus();
        }

    },
    watch:{
        deep:true,
        user: function(){
            this.invalidEmail = false;
            this.passValidate = true;
            this.duplicateEmail = false;
        },
    }
}
</script>
<style scoped>
    @import "../../css/views/GettingStartedCSS/popup-register.css";
</style>