<template>
    <div class="sidebar-left">
        <div class="wrap-sidebar">
            <div class="">
                <div class="wrap-item flex" @click="redirectToPersonal">
                    <div class="icon-32 icon-avatar">
                        <cld-image 
                            :publicId="avatar.cloudinaryID">
                            <cld-transformation gravity="south" crop="fill"/>
                        </cld-image>
                    </div>
                    <div class="name-item">
                        <div class="username">{{ userName }}</div>
                        <div class="title">Trang cá nhân</div>
                    </div>
                </div>
                <router-link to="/" class="wrap-item" >
                    <div class="icon-32 icon-newsfeed"></div>
                    <div class="name-item">Bảng tin</div>
                </router-link>
                <router-link to="/group" class="wrap-item" >
                    <div class="icon-32 icon-group"></div>
                    <div class="name-item">Nhóm</div>
                </router-link>
                <router-link to="/chat" class="wrap-item">
                    <div class="icon-32 icon-message"></div>
                    <div class="name-item">Tin nhắn</div>
                </router-link>
                <div class="wrap-online" v-if="lstGroups.length > 0">
                    <div class="title-online m-l-20">{{$t('i18nCommon.GroupJoined')}}</div>
                    <div class="wrap-item flex m-b-4" v-for="group in lstGroups" :key="group._id" @click="redirectToGroup(group._id)">
                        <div class="flex">
                            <div class="icon-32 icon-avatar">
                                <cld-image 
                                    :publicId="group.background.cloudinaryID">
                                    <cld-transformation gravity="south" crop="fill"/>
                                </cld-image>
                            </div>
                            <div class="name-item">{{group.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="wrap-online">
                    <div class="title-online m-l-20">{{$t('i18nCommon.Online')}}</div>
                    <div class="wrap-item flex m-b-4" v-for="friend in lstFriends" :key="friend.userID" @click="chatWithFriend(friend)">
                        <div class="icon-online m-r-4" v-if="friend.isOnline"></div>
                        <div class="icon-offline m-r-4" v-else></div>
                        <div class="flex">
                            <div class="icon-32 icon-avatar">
                                <cld-image 
                                    :publicId="friend.avatar.cloudinaryID">
                                    <cld-transformation gravity="south" crop="fill"/>
                                </cld-image>
                            </div>
                            <div class="name-item">{{friend.userName}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UserAPI from "@/api/UserAPI.js"
import {EventBus} from "../../main";

export default {
    name: 'SidebarLeft',
    props:{
        userName:{
            type: String,
            default: "",
        },
        avatar: {
            type: Object,
            default(){
                return {}
            }
        }
    },
    data() {
        return {
            lstFriends: [],             //Danh sách bạn bè của người dùng
            lstGroups: [],              //Danh sách nhóm đã tham gia của người dùng tài khoản
        }
    },
    created() {
        this.statusFriends();
    },
    methods: {
        /**
         * Chuyển hướng đến nhóm được chọn
         */
        redirectToGroup(groupID){
            this.$router.push({
                name: "GroupDetail",
                params: { id: groupID },
            });
        },
        /**
         * Chuyển hướng đến trang cá nhân
         */
        redirectToPersonal(){
            this.$router.push({
                name: 'Personal',
                params: { id: this.$cookie.get('u_id')}
            }).catch(()=>{});
        },
        statusFriends(){
            let param = {
                userID: this.$cookie.get('u_id')
            }
            UserAPI.getStatusOfFriends(param).then(res => {
                if(res.data && res.data.success){
                    this.lstFriends = res.data.lstFriends;
                    this.lstGroups = res.data.lstGroups;
                }
            })
        },
        //Click chọn chat với bạn bè
        chatWithFriend(friend){
            EventBus.$emit('chat-with-friend', friend);
        }
    },
}
</script>
<style scoped>
.sidebar-left{
    height: calc(100% - 72px);
    overflow: hidden;
}
.sidebar-left:hover{
    overflow-y: scroll;
}
.wrap-sidebar{
    height: inherit;
}

/* Start: Css cho item */
.wrap-sidebar .wrap-item{
    position: relative;
    display: flex;
    align-items: center;
    height: 50px;
    margin-left: 10px;
    padding: 6px 13px;
    cursor: pointer;
    border-radius: 5px;
}
.wrap-sidebar .wrap-item:hover{
    background-color: #DEE4ED;
}
.wrap-item .name-item{
    margin-left: 10px;
    font-weight: 500;
    font-size: 15px;
    color: #313131;
}
.wrap-item .name-item .username{
    font-weight: 500;
}
.wrap-item .name-item .title{
    font-weight: 400;
    color: #747575;
}
/* End: Css cho item */

.wrap-sidebar .wrap-online{
    display: flex;
    flex-direction: column;
    padding: 6px 0px;
    padding-right: 13px;
    cursor: pointer;
    border-top: 1px solid #dddddd;
    height: 100%;
}
.title-online{
    font-weight: 450;
    margin-bottom: 10px;
    margin-top: 6px;
}
/* CSS icon */
.icon-newsfeed{
    background: url(../../assets/icon/ICON.svg) -384px -320px no-repeat;
}
.icon-group{
    background: url(../../assets/icon/ICON.svg) -320px -290px no-repeat;
}
.icon-message{
    background-image: url(../../assets/png/bubbles-alt-svgrepo-com.png);
}
.icon-online{
    width: 18px;
    height: 18px;
    background-size: contain;
    background-image: url(../../assets/png/online.png);
}
.icon-offline{
    width: 18px;
    height: 18px;
    background-size: contain;
    background-image: url(../../assets/png/offline.png);
}
</style>