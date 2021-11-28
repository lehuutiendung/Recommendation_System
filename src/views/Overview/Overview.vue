<template>
    <div class="overview">
        <!-- <div class="header-fake">
            <router-link to="/">new feed</router-link>
            <br>
            <router-link to="/personal">personal</router-link>
        </div> -->
        <div class="header">
            <router-link to="/" class="icon-app">
            </router-link>
            <div class="group-header">
                <router-link to="/personal" class="wrap-avatar-username">
                    <div class="avatar-username flex">
                        <div class="icon-32 icon-avatar"></div>
                        <div class="username">{{ userName }}</div>
                    </div>
                </router-link>
                <div class="icon-40 button-icon">
                    <div class="icon-20 icon-message"></div>
                </div>
                <div class="icon-40 button-icon">
                    <div class="icon-20 icon-notify"></div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="left-bar">
                <SidebarLeft :userName="userName"/>
            </div>
            <div class="center">
                <router-view></router-view>
            </div>
            <div class="right-bar">
                <SidebarRight/>
            </div>
        </div>
    </div>
</template>
<script>
import SidebarLeft from "@/components/sidebar/SidebarLeft.vue"
import SidebarRight from "@/components/sidebar/SidebarRight.vue"
export default {
    name: 'Overview',
    components:{
        SidebarLeft,
        SidebarRight
    },
    data() {
        return {
            userName: "",
        }
    },
    created() {
        this.userName = this.$cookie.get('u_name');
    },
}
</script>
<style scoped>
    @import "../../css/views/Overview/overview.css";
</style>