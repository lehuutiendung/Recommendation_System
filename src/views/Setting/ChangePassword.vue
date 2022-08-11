<template>
    <div>
        <Overview>
            <template v-slot:left-bar>
                <div class="left-bar">
                    <div class="custom-left-bar">
                        <div class="wrap-item" >
                            <div class="icon-32 icon-security"></div>
                            <div class="name-item">Bảo mật</div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:center>
                <div class="center">
                    <div class="box">
                        <div>
                            <div class="title">Thay đổi mật khẩu</div>
                        </div>
                        <div class="item">  
                            <div class="label-item">Mật khẩu hiện tại</div>
                            <Input v-model="currentPassword" :isPassword="true"/>
                        </div>
                        <div class="item">  
                            <div class="label-item">Mật khẩu mới</div>
                            <Input v-model="password" :isPassword="true" />
                        </div>
                        <div class="item">  
                            <div class="label-item">Nhập lại mật khẩu mới</div>
                            <Input v-model="passwordSame" :isPassword="true" @blur="checkSamePassword"/>
                        </div>
                        <div class="note-error" v-if="emptyValue">Nhập thiếu các trường dữ liệu. Vui lòng kiểm tra lại.</div>
                        <div class="note-error" v-if="currentPasswordInvalid">Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại.</div>
                        <div class="note-error" v-if="!isSamePass">Mật khẩu không khớp. Vui lòng kiểm tra lại.</div>
                        <div class="success-change flex" v-if="doneChangePass">
                            <div class="icon-48 icon-success"></div>
                            <div class="content-noti">Thay đổi mật khẩu thành công</div>
                        </div>
                        <ButtonIcon class="btn-save" :text="$t('i18nCommon.Save')" color="blue" @click.native="clickSave"/>

                    </div>
                </div>
            </template>
            <template v-slot:right-bar>
                <div class="right-bar"></div>
            </template>
        </Overview>
    </div>
</template>
<script>
import Overview from "@/views/Overview/Overview.vue";
import Input from "@/components/input/BaseInput.vue";
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue"
import UserAPI from "@/api/UserAPI.js"

export default {
    components:{
        Overview,
        Input,
        ButtonIcon
    },
    data() {
        return {
            currentPassword: "",    //Mật khẩu hiện tại
            password: "",           //Mật khẩu mới
            passwordSame: "",       //Nhập lại mật khẩu mới
            isSamePass: true,
            currentPasswordInvalid: false,  //Check mật khẩu hiện tại
            emptyValue: false,               //Nhập thiếu các trường
            doneChangePass: false
        }
    },
    methods: {
        //Check nhập đúng mật khẩu lần 2
        checkSamePassword(){
            if(this.password == this.passwordSame){
                this.isSamePass = true;
            }else{
                this.isSamePass = false;
            }
        },
        //Lưu mật khẩu
        clickSave(){
            let userInfo = this.$store.getters.userInfor;
            let param = {
                currentPassword: this.currentPassword,
                newPassword: this.password,
                userID: userInfo._id
            }
            this.currentPasswordInvalid = false;
            this.emptyValue = false;
            this.doneChangePass = false;
            if(!this.isSamePass){
                return;
            }

            UserAPI.changePasswordSetting(param).then((res) => {
                if(res.data && res.data.success){
                    this.isSamePass = true;
                    this.doneChangePass = true;
                }else{
                    let codeError = res.data.code;
                    if(codeError == "PASSWORD_INVALID"){
                        this.currentPasswordInvalid = true;
                    }else if(codeError == "EMPTY_VALUE"){
                        this.emptyValue = true;
                    }
                }
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.custom-left-bar{
    width: 100%;
    height: 100%;
    border-right: 1px solid #cccccc;
}
.wrap-item{
    position: relative;
    display: flex;
    align-items: center;
    height: 50px;
    margin-left: 10px;
    padding: 6px 13px;
    cursor: pointer;
    border-radius: 5px;
}
.wrap-item:hover{
    background-color: #DEE4ED;
}
.wrap-item .name-item{
    margin-left: 10px;
    font-weight: 500;
    font-size: 15px;
    color: #313131;
}
.icon-security{
    background-image: url("../../assets/svg/security-svgrepo-com.svg");
    background-size: contain;
}
.item{
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .label-item{
        width: 16vw;
        margin-right: 8px;
    }
}
.title{
    font-weight: 450;
    font-size: 16px;
    margin: 20px 0px;
}
.box{
    display: flex;
    align-items: center;
    flex-direction: column;
}
.btn-save{
    margin-top: 20px;
}
.note-error{
    margin-top: 10px;
    color: rgb(233, 7, 7);
}
.success-change{
    font-size: 18px;
    font-style: italic;
    .icon-success{
        background: url("../../assets/icon/Sprites.svg");
        background-position: -984px -456px;
        margin-right: 10px;
    }
}
</style>