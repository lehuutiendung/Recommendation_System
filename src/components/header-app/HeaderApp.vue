<template>
    <div class="header">
        <div class="group-header-left">
            <router-link to="/" class="icon-app"></router-link>
            <div >
                <InputIcon 
                class="mg-l-10" 
                icon="icon-search" 
                placeholder="Tìm kiếm" 
                width="220" 
                v-model="inputSearch" 
                @input.native="handleSearch" 
                v-click-outside="hidePopupSearch"/>
                <div class="box-result-search" v-if="inputSearch && showResultSearch">
                    <div class="result">
                        <div class="item-result" v-for="(item,index) in listResultSearch" :key="index" @click="redirectToPersonal(item._id)">
                            <div class="icon-32 icon-avatar">
                                <cld-image 
                                    class="avatar-user"
                                    :publicId="item.avatar.cloudinaryID">
                                </cld-image>
                            </div>
                            <div class="m-l-10 username">{{ item.userName }}</div>
                        </div>
                    </div>
                    <div class="more-see">{{$t('i18nCommon.MoreSee')}}</div>
                </div>
            </div>
        </div>
        <div class="group-header">
            <div class="wrap-avatar-username" @click="redirectToPersonal(userID)">
                <div class="avatar-username flex">
                    <div class="icon-32 icon-avatar">
                        <cld-image 
                            :publicId="avatar.cloudinaryID">
                            <cld-transformation gravity="south" crop="fill"/>
                        </cld-image>
                    </div>
                    <div class="username">{{ userName }}</div>
                </div>
            </div>
            <!-- Tin nhắn -->
            <div class="icon-40 button-icon">
                <div class="icon-20 icon-message-noti"></div>
            </div>
            <!-- Thông báo ứng dụng -->
            <div class="icon-40 button-icon" @click="showPopupNotify" v-click-outside="hidePopupNotify">
                <div class="icon-20 icon-notify"></div>
                <div class="number-noti" v-if="listNotification.length > 0">{{ listNotification.length }}</div>
                <div class="box-noti" v-if="isShowNotify">
                    <div class="title-box">{{ $t('i18nCommon.Notification') }}</div>
                    <div class="group-request-fr">
                        <div class="noti-request-fr" v-for="(item,index) in listNotification" :key="index">
                            <div class="avatar icon-56">
                                <cld-image 
                                    :publicId="item.avatar">
                                    <cld-transformation width="100" gravity="south" crop="fill"/>
                                </cld-image>
                            </div>
                            <div class="content-request">
                                <div><span class="username">{{ item.userName }}</span> đã gửi cho bạn lời mời kết bạn.</div>
                                <div class="group-btn">
                                    <ButtonIcon text="Xác nhận" width="100" @click.native="handleAcceptFriend(item)"/>
                                    <ButtonIcon text="Xóa" width="100" color="white" @click.native="handleRejectFriend(item.id)"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Đăng xuất -->
            <div class="icon-40 button-icon" @click="handleLogOut">
                <div class="icon-20 icon-log-out"></div>
            </div>
        </div>
    </div>
</template>
<script>
import ClickOutSide from "@/mixins/detectoutside.js"
import {EventBus} from "../../main"
import axios from 'axios'
import { ConfigApiEnum } from '@/models/enums/ConfigApiEnum';
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue";
import InputIcon from "@/components/input-icon/InputIcon.vue"

export default {
    name: 'HeaderApp',
    directives: {
        ClickOutSide
    },
    components:{
        ButtonIcon,
        InputIcon
    },
    data() {
        return {
            userName: "",
            userID: "",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${this.$cookie.get('jwtToken')}`
            },
            listNotification: [],           //Danh sách thông báo
            isShowNotify: false,            //Có đang hiển thị box thông báo hay không
            showResultSearch: false,        //Có đang hiển thị box kết quả tìm kiếm hay không
            inputSearch: "",                //Giá trị tìm kiếm
            listResultSearch: [],
            avatar: "",                     //Avatar user
        }
    },
    async created() {
        this.userID = this.$cookie.get('u_id');
        await this.getCurrentUser(this.userID);
        //Lấy thông báo lần đầu khởi tạo HeaderApp
        if(this.$cookie.get('jwtToken')){
            let query = {
                userID: this.$cookie.get('u_id')
            }
            axios.post(ConfigApiEnum.URL_API + `users/notification-add-friend`, query,
            {
                headers: this.headers, 
            }).then((res) => {
                this.listNotification = res.data.dataRes;
            })
        }
    },
    mounted() {
        EventBus.$on('notification_addfriend', (data) =>  {
            this.listNotification.push(data);
        })

        EventBus.$on('updateInfor', () => {
            console.log("update name");
            this.userName = this.$store.getters.userInfor.userName;

        })
    },
    methods: {
        /**
         * Lấy thông tin user hiện tại
         */
        getCurrentUser(userID){
            try {
                axios.get(ConfigApiEnum.URL_API + `users/${userID}`,
                {
                    headers: this.headers, 
                }).then((res) => {
                    if(res && res.data.Success){
                        this.avatar = res.data.doc.avatar;
                        this.userName = res.data.doc.userName;
                        this.$store.dispatch('updateUserInfor', res.data.doc);
                    }
                })
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Chuyển hướng đến trang cá nhân
         */
        redirectToPersonal(ID){
            this.$router.push({
                name: 'Personal',
                params: { id: ID}
            }).catch(()=>{});
        },
        /**
         * Show popup notify
         */
        showPopupNotify(){
            this.isShowNotify = !this.isShowNotify;
        },
        /**
         * Ẩn popup thông báo
         */
        hidePopupNotify(){
            this.isShowNotify = false;  
        },
        /**
         * Ẩn popup kết quả tìm kiếm
         */
        hidePopupSearch(){
            this.showResultSearch = false;
        },
        /**
         * Xử lý sự kiện tìm kiếm người dùng
         */
        handleSearch(){
            if(this.inputSearch){
                this.showResultSearch = true;
                let dataQuery = {
                    name: this.inputSearch,
                    pageSize: 6,
                    pageIndex: 1,
                }
                axios.post(ConfigApiEnum.URL_API + `users/filter-user`, dataQuery,
                {
                    headers: this.headers, 
                }).then((res) => {
                    this.listResultSearch = res.data.doc;
                })
            }else{
                this.showResultSearch = false;
            }
        },
        /**
         * Xử lý sự kiện từ chối lời mời kết bạn
         */
        handleRejectFriend(notiID){
            axios.post(ConfigApiEnum.URL_API + `users/request-rejectfriend/${notiID}`,{},
            {
                headers: this.headers, 
            }).then(() => {
                this.listNotification = this.listNotification.filter(x => x.id !== notiID);
            })
        },
        /**
         * Xử lý sự kiện đồng ý lời mời kết bạn
         */
        handleAcceptFriend(noti){
            let data = {
                userRecipientID: noti.userRecipientID,
                userRequestID: noti.userRequestID,
            }
            axios.post(ConfigApiEnum.URL_API + `users/request-acceptfriend/${noti.id}`, data,
            {
                headers: this.headers, 
            }).then(() => {
                this.listNotification = this.listNotification.filter(x => x.id !== noti.id);
            })
        },
        /**
         * Xử lý sự kiện đăng xuất. emit tới App.vue
         */
        handleLogOut(){
            this.$emit("logout", true);
        }
    },
    beforeDestroy() {
        // this.EventBus.$off('display-notification');
    },
}
</script>
<style lang="scss" scoped>
.header{
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 18px;
    padding-right: 40px;
    background-color: #ffffff;
    border-bottom: 1px solid #dddddd;
    .button-icon{
        position: relative;
    }
}

.header .icon-app{
    height: 60px;
    width: 110px;
    background-image: url('../../../src/assets/logo_text.png');
    background-repeat: no-repeat;
    background-position: left;
    background-size: contain;
    cursor: pointer;
}

.header .group-header-left{
    display: flex;
    align-items: center;
    .box-result-search{
        position: absolute;
        width: 352px;
        height: 428px;
        top: 50px;
        left: 4px;
        background-color: #ffffff;
        border-radius: 0.5rem;
        box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%);
        -webkit-transition: all .3s ease-in-out;
        z-index: 100;
        .result{
            height: calc(100% - 33px);
            width: 100%;
            overflow: hidden;
            .item-result{
                display: flex;
                align-items: center;
                padding: 12px;
                margin: 0 10px;
                margin-top: 8px;
                border-radius: 5px;
                cursor: pointer;
                .username{
                    font-weight: 500;
                    color: #313131;
                }
            }
            .item-result:hover{
                background-color: #E3E4E5;
                -webkit-transition: all .1s ease-in-out;
            }
        }
        .more-see{
            margin-top: 6px;
            display: flex;
            justify-content: center;
            cursor: pointer;
            font-weight: 450;
        }
    }
}

.header .group-header{
    display: flex;
    align-items: center;
}

.header .wrap-avatar-username{
    border-radius: 25px;
    height: 40px;
    padding: 0 5px;
    display: flex;
    align-items: center;
}

.header .wrap-avatar-username:hover{
    cursor: pointer;
    background-color: #efefef;
}

.header .wrap-avatar-username .avatar-username .username{
    font-weight: 500;
    color: #313131;
    margin-left: 5px;
}

.header .group-header .icon-avatar{
    background-size: contain;
    border-radius: 50%;
    cursor: pointer;
    img{
        width: inherit;
        height: inherit;
        border-radius: 50%;
    }
} 
.header .number-noti{
    position: absolute;
    right: 2px;
    top: 0;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: red;
    border-radius: 50%;
    color: #ffffff;
    font-size: 10px;
}
.header .box-noti{
    position: absolute;
    right: 2px;
    top: 46px;
    z-index: 100;
    width: 350px;
    height: 500px;
    background-color: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%);
    -webkit-transition: all .3s ease-in-out;
    padding: 12px;
    overflow: auto;
    overflow-x: hidden;
    .title-box{
        font-size: 18px;
        font-weight: 500;
    }
    .group-request-fr{
        .noti-request-fr{
            display: flex;
            padding: 8px;
            border-radius: 5px;
            .avatar img{
                width: inherit;
                height: inherit;
                border-radius: 50%;
            }
            .content-request{
                padding: 0 10px;
                .username{
                    font-weight: 500;
                }
                .group-btn{
                    display: flex;
                    justify-content: space-between;
                    padding: 0 10px;
                    margin-top: 10px;
                }
            }
        }
        .noti-request-fr:hover{
            background-color: #F2F2F2;
            -webkit-transition: all .2s ease-in-out;
        }
    }
}
</style>