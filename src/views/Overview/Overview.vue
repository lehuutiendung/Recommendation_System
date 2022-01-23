<template>
    <div class="overview">
        <!-- <div class="header">
            <router-link to="/" class="icon-app">
            </router-link>
            <div class="group-header">
                <div class="wrap-avatar-username" @click="redirectToPersonal">
                    <div class="avatar-username flex">
                        <div class="icon-32 icon-avatar"></div>
                        <div class="username">{{ userName }}</div>
                    </div>
                </div>
                <div class="icon-40 button-icon">
                    <div class="icon-20 icon-message-noti"></div>
                </div>
                <div class="icon-40 button-icon">
                    <div class="icon-20 icon-notify"></div>
                    <div class="number-noti" v-if="listNotification.length > 0">{{ listNotification.length }}</div>
                </div>
            </div>
        </div> -->
        
        <div class="content" :style="{'padding-top' : paddingTopContent + 'px'}">
            <div class="pre-content" v-if="showPreContent">
                <slot name="pre-content"></slot>
            </div>
            <div class="body-content">
                <slot name="left-bar">
                    <div class="left-bar" v-if="showLeftBar">
                        <SidebarLeft :userName="userName" :avatar="avatar"/>
                    </div>
                </slot>
                <slot name="center">
                    <div class="center">
                        <router-view :key="$route.fullPath" :avatar="avatar"></router-view>
                    </div>
                </slot>
                <slot name="right-bar">
                    <div class="right-bar" v-if="showRightBar">
                        <SidebarRight/>
                    </div>
                </slot>
            </div>
        </div>
    </div>
</template>
<script>
import SidebarLeft from "@/components/sidebar/SidebarLeft.vue"
import SidebarRight from "@/components/sidebar/SidebarRight.vue"
import UserAPI from "@/api/UserAPI.js";
export default {
    name: 'Overview',
    components:{
        SidebarLeft,
        SidebarRight
    },
    props:{
        // Ẩn/hiện left-bar -> Custom
        showLeftBar: {
            type: Boolean,
            default: true
        },
        //Ẩn/hiện right-bar -> Custom
        showRightBar: {
            type: Boolean,
            default: true
        },
        //Ẩn/hiện pre-content -> Custom
        showPreContent:{
            type: Boolean,
            default: false
        },
        paddingTopContent: {
            type: Number,
            default: 16
        }
    },
    data() {
        return {
            userName: "",
            avatar: {},
        }
    },
    created() {
        this.userName = this.$cookie.get('u_name');
        UserAPI.getByID(this.$cookie.get('u_id')).then((res) => {
            this.avatar = res.data.doc.avatar;
        })
    },
    methods: {
        /**
         * Chuyển hướng đến trang cá nhân
         */
        redirectToPersonal(){
            this.$router.push({
                name: 'Personal',
                params: { id: this.$cookie.get('u_id')}
            }).catch(()=>{});
        },
    },
}
</script>
<style lang="scss" scoped>
@import "../../css/views/Overview/overview.css";
.button-icon{
    position: relative;
}
</style>