<template>
    <div class="overview">
        <div class="content" ref="contentScroll" :style="{'padding-top' : paddingTopContent + 'px'}">
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
        <div class="scroll-top" @click="refreshPage" v-show="visibleRefresh">
            <div class="icon-scroll-top"></div>
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
            visibleRefresh: false,          //Hiển thị button refresh trang
        }
    },
    created() {
        let userInfor = this.$store.getters.userInfor;
        this.userName = userInfor.userName;
        this.avatar = userInfor.avatar;
    },
    mounted() {
        this.$refs.contentScroll.addEventListener("scroll", this.handleScroll);
    },
    methods: {
        /**
         * Sự kiện scroll và ẩn hiện button refresh
         */
        handleScroll(e){
            this.visibleRefresh = e.target.scrollTop > window.innerHeight ? true : false;
        },
        /**
         * Scroll tới đầu trang
         */
        refreshPage(){
            this.$refs.contentScroll.scrollTo(0,0);
            this.$eventBus.$emit('refresh');
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
    },
    beforeDestroyed() {
        this.$refs.contentScroll.removeEventListener("scroll", this.handleScroll);
    },
}
</script>
<style lang="scss" scoped>
@import "../../css/views/Overview/overview.css";
.button-icon{
    position: relative;
}
.scroll-top{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 15px;
    right: 14px;
    bottom: 24px;
    cursor: pointer;
    transform: scale(1.5);
}
</style>