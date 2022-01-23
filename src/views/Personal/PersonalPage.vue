<template>
    <div class="personal">
        <Overview :showPreContent="true" :showLeftBar="false" :showRightBar="false" :paddingTopContent="0">
            <template v-slot:pre-content>
                <div class="header-user">
                    <div class="background"><img src="../../assets/groups-default-cover-photo-2x.png" alt=""></div>
                    <div class="block-user">
                        <div class="avatar">
                            <img class="avatar-user" src="../../assets/Avatar.jpg" alt="">
                        </div>
                        <div class="info-name">
                            <div class="user-name">{{ dataUser.userName }}</div>    
                            <ButtonIcon class="btn-addfriend" text="Thêm bạn bè" width="auto" icon="fb-icon-addfr" v-if="!isFriend && userID != ownerID" @click.native="requestAddFriend"/>
                            <ButtonIcon class="btn-addfriend" text="Bạn bè" width="auto" color="white" icon="fb-icon-isFriend" v-if="isFriend"/>
                        </div>
                    </div>
                    <div class="wrap-header-item">
                        <div class="tab-item" v-for="(tab, index) in listTab" :key="index" @click="changeTab(index)">
                            {{ tab.titleTab }}
                            <div class="focus-tab" :class="{'active-tab' : currentTab == index ? true : false}"></div>
                        </div>    
                    </div>
                </div>
            </template>
            <template v-slot:center>
                <div class="w-full">
                    <router-view></router-view>
                </div>
            </template>
        </Overview>
    </div>
</template>
<script>
import Overview from "@/views/Overview/Overview.vue"
import UserAPI from "@/api/UserAPI.js"
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue"
import {Notification} from "@/models/enums/Notification.js"
export default {
    name: 'PersonalPage',
    components:{
        Overview,
        ButtonIcon
    },
    data() {
        return {
            dataUser: {},
            userID: "",
            ownerID: "",
            listTab:[
                {
                    titleTab: 'Dòng thời gian'
                },
                {
                    titleTab: 'Giới thiệu'
                },
                {
                    titleTab: 'Hình ảnh'
                },
                {
                    titleTab: 'Bạn bè'
                }
            ],
            currentTab: 0,              //Tab dòng thời gian
            listFriendOwner: [],        //Danh sách bạn bè của người dùng account hiện tại
            isFriend: null,
        }
    },   
    created() {
        this.getInfoUser();
        this.getInfoOwner();
        this.detectActiveTab();
        this.userID = this.$route.params.id;
    }, 
    methods: {
        /**
         * Call API thông tin của owner tài khoản 
         */
        getInfoOwner(){
            this.ownerID = this.$cookie.get('u_id');
            UserAPI.getByID(this.ownerID).then((res)=>{
                this.listFriendOwner = res.data.doc.friends;
                this.isFriend = this.checkIsFriend(this.userID);
            })
        },
        /**
         * Call API thông tin của người dùng trong trang cá nhân hiện tại
         */
        getInfoUser(){
            UserAPI.getByID(this.$route.params.id).then((res)=>{
                this.dataUser = res.data.doc;
            })
        },
        /**
         * Phát hiện tab hiện tại và bật active tab tương ứng
         */
        detectActiveTab(){
            let nameRoute = this.$route.name;
            if(nameRoute == "Personal.TabTimelinePersonal"){
                this.currentTab = 0;
            }else if(nameRoute == "Personal.TabAboutPersonal"){
                this.currentTab = 1;
            }else if(nameRoute == "Personal.TabLibraryPersonal"){
                this.currentTab = 2;
            }else{
                this.currentTab = 3;
            }
        },
        /**
         * Thay đổi màn các tab
         */
        changeTab(index){
            this.currentTab = index;
            //ID của người dùng truy cập trang cá nhân
            let userID = this.$route.params.id;
            switch (index) {
                case 0:
                    this.$router.push({
                        name: 'Personal.TabTimelinePersonal',
                        params: { id: userID }
                    }).catch(()=>{});
                    break;
                case 1:
                    this.$router.push({
                        name: 'Personal.TabAboutPersonal',
                        params: { id: userID }
                    }).catch(()=>{});
                    break;
                case 2: 
                    this.$router.push({
                        name: 'Personal.TabLibraryPersonal',
                        params: { id: userID }
                    }).catch(()=>{});
                    break;
                case 3: 
                    this.$router.push({
                        name: 'Personal.TabFriendPersonal',
                        params: { id: userID }
                    }).catch(()=>{});
                    break;
                default:
                    break;
            }
        },
        // TODO:
        /**
         * Gửi yêu cầu kết bạn
         */
        requestAddFriend(){
            let dataMongo = {
                userRequestID: this.$cookie.get('u_id'),
                userRecipientID: this.$route.params.id
            }
            UserAPI.createdRequestAddFriend(dataMongo).then((res)=>{
                const dataRes = res.data.data.doc;
                let dataSocket = {
                    id: dataRes._id,
                    userRequestID: dataRes.userRequestID,
                    userRecipientID: dataRes.userRecipientID,
                    typeNotification: Notification.FRIEND 
                }
                this.$socket.emit('send_notification', dataSocket);
            })
        },
        /**
         * Check một trang cá nhân người dùng có phải bạn của owner account không
         */
        checkIsFriend(userID){
            let index = this.listFriendOwner.indexOf(userID);
            if(index == -1){
                return false;
            }else{
                return true;
            }
        }
    },
    watch:{
        // Cập nhật thông tin khi thay đổi trang cá nhân 
        '$route.params.id': {
            handler: function(userIDCurrent) {
                if(this.userID != userIDCurrent){
                    this.getInfoUser();
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
<style lang="scss" scoped>
.personal{
    .header-user{
        background-color: #ffffff;
        .background{
            width: 100%;
            height: 350px;
            display: flex;
            justify-content: center;
            background-color: #FFDEE9;
            background-image: linear-gradient(0deg, #FFFFFF 0%, #B5FFFC 100%);
            img{
                width: 70%;
                height: inherit;
                object-fit: cover;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }
        }
        .block-user{
            display: flex;
            width: 100%;
            padding-top: 16px;
            padding-left: 15%;
            padding-right: 15%;
            .avatar{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 160px;
                height: 160px;
                background-color: #ffffff;
                border-radius: 50%;
                margin-top: -49px;
                margin-left: 40px;
                position: relative;
                .avatar-user{
                    width: 96%;
                    height: 96%;
                    border-radius: 50%;
                }
            }
            .info-name{
                display: flex;
                position: relative;
                flex-direction: column;
                width: calc(100% - 200px);
                .user-name{
                    font-size: 30px;
                    font-weight: 600;
                    margin-left: 10px;
                }
                .btn-addfriend{
                    position: absolute;
                    right: 0;
                }
            }
            
        }
        .wrap-header-item{
            display: flex;
            margin: 0 15%;
            margin-top: 16px;
            padding: 4px 9%;
            border-top: 1px solid #cccccc;
            .tab-item{
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #65676B;
                font-weight: 500;
                height: 46px;
                width: 100px;
                cursor: pointer;
                margin-right: 4px;
                border-radius: 5px;
                .focus-tab{
                    position: absolute;
                    bottom: -4px;
                    height: 3px;
                    width: 100%;
                }
                .active-tab{
                    background-color: #1876F2;
                }
            }
            .tab-item:hover{
                background-color: #F2F2F2;
            }
        }
    }
}
</style>