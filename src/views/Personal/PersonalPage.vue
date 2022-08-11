<template>
    <div class="personal">
        <Overview :showPreContent="true" :showLeftBar="false" :showRightBar="false" :paddingTopContent="0">
            <template v-slot:pre-content>
                <div class="header-user">
                    <div class="background">
                        <img :src="previewBackground" alt="" v-if="previewBackground">
                        <!-- <img src="../../assets/groups-default-cover-photo-2x.png" alt="" v-else> -->
                        <cld-image 
                            class=""
                            :publicId="dataUser.background.cloudinaryID" loading="lazy" v-else>
                            <cld-transformation gravity="south" crop="fill"/>
                        </cld-image>
                        <ButtonIcon 
                        v-if="isMyPage && !file"
                        class="btn-update-image" 
                        text="Cập nhật ảnh" 
                        width="auto" 
                        color="white" 
                        icon="icon-camera" @click.native="openDropdown"/>
                    </div>
                    <div class="popup-option" v-if="isShowOption">
                        <InputFile 
                        color="#ffffff" 
                        textcolor="#000000" 
                        hovercolor="#e2e7ec" 
                        padding="10px" 
                        label="Cập nhật ảnh đại diện"
                        indexFile="avatar"
                        @getDataImage="getDataImageAvatar"/>

                        <InputFile 
                        color="#ffffff" 
                        textcolor="#000000" 
                        hovercolor="#e2e7ec" 
                        padding="10px" 
                        label="Cập nhật ảnh bìa" 
                        indexFile="background"
                        @getDataImage="getDataImageBackground"/>
                        
                    </div>
                    <div class="block-user">
                        <div class="avatar">
                            <img class="avatar-user" :src="previewAvatar" alt="" v-if="previewAvatar">
                            <cld-image 
                                class="avatar-user"
                                :publicId="dataUser.avatar.cloudinaryID" loading="lazy" v-else>
                                <cld-transformation gravity="south" crop="fill"/>
                            </cld-image>
                        </div>
                        <div class="info-name">
                            <div class="user-name">{{ dataUser.userName }}</div>    
                            <div class="flex-end" v-if="isMyPage && file != null">
                                <ButtonIcon :text="$t('i18nCommon.Cancel')" width="auto" color="white" @click.native="clickCancel"/>
                                <ButtonIcon :text="$t('i18nCommon.Save')" width="auto" color="blue" @click.native="clickSave"/>
                            </div>

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
                    <router-view :key="$route.path"></router-view>
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
import {RequestEnum} from "@/models/enums/Request.js"
import ClickOutSide from "@/mixins/detectoutside.js"
const InputFile = () => import("@/components/input-file/InputFile.vue")
import {EventBus} from "../../main";
export default {
    name: 'PersonalPage',
    directives: {
        ClickOutSide
    },
    components:{
        Overview,
        ButtonIcon,
        InputFile,
    },
    data() {
        return {
            dataUser: {
                avatar: {
                    cloudinaryID: "",
                },
                background: {
                    cloudinaryID: "",
                }
            },
            userID: "",
            ownerID: "",
            ownerInfor: {},
            listTab:[
                {
                    titleTab: 'Dòng thời gian',
                },
                {
                    titleTab: 'Giới thiệu',
                },
                {
                    titleTab: 'Hình ảnh',
                },
                {
                    titleTab: 'Bạn bè',
                }
            ],
            currentTab: 0,              //Tab dòng thời gian
            listFriendOwner: [],        //Danh sách bạn bè của người dùng account hiện tại
            isFriend: null,
            isShowOption: false,
            previewAvatar: "",          //base64 preview avatar
            previewBackground: "",      //base64 preview background
            file: null,
            typeChangeImage: null,      // 0: Thay đổi ảnh đại diện - 1: thay đổi ảnh bìa
            isMyPage: false,
            isProcessChooseImg: false,  // Đang trong quá trình chọn ảnh đại diện hoặc ảnh bìa
        }
    },   
    created() {
        this.detectActiveTab();
        this.userID = this.$route.params.id;
        this.ownerInfor = this.$store.getters.userInfor;
        this.ownerID = this.ownerInfor._id;
        this.listFriendOwner = this.ownerInfor.friends;
        this.isFriend = this.checkIsFriend(this.userID);
    }, 
    methods: {
        /**
         * Call API thông tin của người dùng trong trang cá nhân hiện tại
         */
        getInfoUser(){
            if(this.ownerInfor._id != this.$route.params.id){
                UserAPI.getByID(this.$route.params.id).then((res)=>{
                    this.dataUser = res.data.doc;
                })
            }else{
                this.dataUser = this.ownerInfor;
            }
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
        /**
         * Gửi yêu cầu kết bạn
         */
        requestAddFriend(){
            let dataMongo = {
                userRequestID: this.$cookie.get('u_id'),
                userRecipientID: this.$route.params.id,
                typeNoti: Notification.FRIEND,
                status: RequestEnum.REQUESTED,
                postID: null
            }
            UserAPI.saveRequestNoti(dataMongo).then((res)=>{
                if(res.data && res.data.success){
                    const dataRes = res.data.data.doc;
                    let dataSocket = {
                        id: dataRes._id,
                        userRequestID: dataRes.userRequestID,
                        userRecipientID: dataRes.userRecipientID,
                        typeNoti: Notification.FRIEND 
                    }
                    this.$socket.emit('send_notification', dataSocket);
                }
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
        },
        /**
         * Click button cập nhật ảnh mở dropdown
         */
        openDropdown(){
            this.isShowOption = !this.isShowOption;
        },
        /**
         * Nhận emit thay đổi từ input file
         */
        getDataImageAvatar(file, preview){
            this.typeChangeImage = 0;
            this.file = file;
            if(this.typeChangeImage == 0){
                this.previewAvatar = preview;
            }else{
                this.previewBackground = preview;
            }
            this.isShowOption = false;
        },
        getDataImageBackground(file, preview){
            this.typeChangeImage = 1;
            this.file = file;
            if(this.typeChangeImage == 0){
                this.previewAvatar = preview;
            }else{
                this.previewBackground = preview;
            }
            this.isShowOption = false;
        },
        /**
         * Click hủy cập nhật avatar, background
         */
        clickCancel(){
            this.file = null;
            this.previewAvatar = "";
            this.previewBackground = "";
        },
        /**
         * Click lưu cập nhật avatar, background
         */
        clickSave(){
            let formData = new FormData();
            this.$eventBus.$emit('loading', true);
            if(this.typeChangeImage == 0){
                formData.append("avatar", this.file);
                UserAPI.changeAvatar(this.ownerID, formData).then( res => {
                    if(res.data && res.data.success){
                        this.file = null;
                        this.$eventBus.$emit('loading', false);
                    }else{
                        this.$eventBus.$emit('loading', false);
                    }
                });
            }else{
                formData.append("background", this.file);
                UserAPI.changeBackground(this.ownerID, formData).then( res => {
                    if(res.data && res.data.success){
                        this.file = null;
                        this.$eventBus.$emit('loading', false);
                    }else{
                        this.$eventBus.$emit('loading', false);
                    }
                });
            }
            EventBus.$emit('updateInfor');
        }

    },
    watch:{
        // Cập nhật thông tin khi thay đổi trang cá nhân 
        '$route.params.id': {
            handler: function(userIDCurrent, newVal) {
                if(userIDCurrent != newVal){
                    this.currentTab = 0;
                }
                if(userIDCurrent){
                    this.getInfoUser();
                }
                let myID = this.$store.getters.userInfor._id;
                if(userIDCurrent == myID){
                    this.isMyPage = true;
                }else{
                    this.isMyPage = false;
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
        position: relative;
        background-color: #ffffff;
        .background{
            position: relative;
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
            .btn-update-image{
                position: absolute;
                right: 16%;
                bottom: 10px;
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
                    object-fit: cover;
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
.header-user .popup-option{
    position: absolute;
    right: 16%;
    bottom: 22%;
    padding: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 2px 0 rgb(0 0 0 / 50%);
    border-radius: 4px;
    font-weight: 500;
    z-index: 100;
}
</style>