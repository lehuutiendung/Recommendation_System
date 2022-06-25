<template>
    <div id="change-password">
        <div class="header" v-if="!logged">
            <div class="icon-app"></div>
            <div class="group-header">
                <div class="btn-header btn-team" @click="homePage">Trang chủ</div>
            </div>
        </div>
        <div class="container">
            <div class="monitor-main" v-if="existCode && !doneChangePass">
                <div class="title">Vui lòng nhập mật khẩu mới cho tài khoản của bạn:</div>
                <div class="content">
                    <div class="flex m-t-20 m-b-20">
                        <div class="icon-48 icon-avatar avatar-comment">
                            <cld-image 
                                :publicId="avatar.cloudinaryID">
                                <cld-transformation gravity="south" crop="fill"/>
                            </cld-image>
                        </div>
                        <div class="m-l-10">{{userName}}</div>
                    </div>
                    <BaseInput 
                    class="m-t-10"
                    label="Mật khẩu mới" 
                    v-model="password" 
                    width="50%"
                    :isPassword="true" 
                    :required="true"
                    ></BaseInput>   
                    <BaseInput 
                    class="m-t-10"
                    label="Nhập lại mật khẩu" 
                    v-model="passwordSame" 
                    width="50%"
                    :isPassword="true" 
                    :required="true"
                    @blur="checkSamePassword"
                    ></BaseInput>
                    <div class="note-error" v-if="!isSamePass">Mật khẩu không khớp, vui lòng kiểm tra lại.</div>
                    <div class="btn-confirm" @click="confirmSave">Xác nhận mật khẩu mới</div>
                </div>
            </div>
            <div class="monitor-privacy" v-if="!existCode && !doneChangePass">
                <img src="../../assets/svg/lock-monitor-privacy.svg" width="300">
                <div class="text">Trang này hiện không khả dụng.</div>
            </div>
            <div class="success-change flex" v-if="doneChangePass">
                <div class="icon-48 icon-success"></div>
                <div class="content-noti">Thay đổi mật khẩu thành công</div>
            </div>
        </div>
    </div>
</template>
<script>
import BaseInput from "@/components/input/BaseInput.vue"
import EmailAPI from "@/api/EmailAPI.js"

export default {
    name: "ChangePassword",
    components:{
        BaseInput
    },
    data() {
        return {
            existCode: true,
            resetCode: "",
            email: "",
            avatar: {
                cloudinaryID: ""
            },
            userName: "",
            password: "",
            passwordSame: "",
            isSamePass: true,
            doneChangePass: false,  //Thay đổi mật khẩu thành công
            logged: false,          //Đã đăng nhập
        }
    },
    created() {
        if(this.$store.getters.userInfor){
            this.logged = true;
        }
        this.resetCode = this.$route.params.id;
        this.checkExistCode(this.resetCode);
    },
    methods: {
        //Click homepage
        homePage(){
            this.$router.push('/login');
        },
        //Check tồn tại mã yêu cầu reset password
        checkExistCode(resetCode){
            let param = {
                resetCode: resetCode
            }
            EmailAPI.checkExistForgetPass(param).then(res =>{
                if(res.data && res.data.success){
                    this.existCode = true;
                    let data = res.data.data;
                    this.userName = data.userName;
                    this.avatar = data.avatar;
                    this.email = data.email;
                }else{
                    this.existCode = false;
                }
            })
        },
        //Check nhập đúng mật khẩu lần 2
        checkSamePassword(){
            if(this.password == this.passwordSame){
                this.isSamePass = true;
            }else{
                this.isSamePass = false;
            }
        },
        //Lưu mật khẩu mới
        confirmSave(){
            let param = {
                email: this.email,
                resetCode: this.resetCode,
                password: this.password
            }
            EmailAPI.updatePassword(param).then(() => {
                this.doneChangePass = true;
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.note-error{
    margin-top: 10px;
    color: rgb(233, 7, 7);
}
.monitor-main{
    width: inherit;
    height: inherit;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin-top: -40px;
}
.monitor-privacy{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img{
        background-color: transparent;
    }
    .text{
        font-size: 20px;
        font-weight: 450;
        margin-top: -30px;
    }
}
#change-password{
    overflow: hidden;
    width: 100%;
    height: 100%;
}

#change-password .header{
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 18px;
    padding-right: 40px;
    box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
}

#change-password .header .icon-app{
    height: 60px;
    width: 110px;
    background-image: url('../../assets/logo_text.png');
    background-repeat: no-repeat;
    background-position: left;
    background-size: contain;
    cursor: pointer;
}

/* Start: Css cho nhóm các button trên header */
#change-password .header .group-header{
    display: flex;
}

.header .group-header .btn-header{
    width: 80px;
    margin-left: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.header .group-header .btn-header:hover{
    height: 30px;
    border-radius: 30px;
    background-color: #1877F2;
    color: #ffffff;
    background-image: linear-gradient(144deg,#AF40FF, #1877F2 50%,#00DDEB);
    box-sizing: border-box;
}

/* End: Css cho nhóm các button trên header */

#change-password .container{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .title{
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: 450;
    }
    .content{
        width: 40%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .btn-confirm{
        width: fit-content;
        padding: 0 20px;
        height: 36px;
        background-color: #2FA751;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 20px;
    }
    .btn-confirm:hover{
        background-color: #13b942;
    }
}
.success-change{
    font-size: 18px;
    font-style: italic;
    margin-top: -40px;
    .icon-success{
        background: url("../../assets/icon/Sprites.svg");
        background-position: -984px -456px;
        margin-right: 10px;
    }
}
</style>