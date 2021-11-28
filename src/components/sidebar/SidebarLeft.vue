<template>
    <div class="sidebar-left">
        <div class="wrap-sidebar">
            <div class="">
                <router-link to="/personal" class="wrap-item flex">
                    <div class="icon-32 icon-avatar"></div>
                    <div class="name-item">
                        <div class="username">{{ userName }}</div>
                        <div class="title">Trang cá nhân</div>
                    </div>
                </router-link>
                <router-link to="/" class="wrap-item">
                    <div class="icon-32 icon-newsfeed"></div>
                    <div class="name-item">Bảng tin</div>
                </router-link>
                <div class="wrap-item">
                    <div class="icon-32 icon-group"></div>
                    <div class="name-item">Nhóm</div>
                </div>
                <div class="wrap-item">
                    <div class="icon-32 icon-message"></div>
                    <div class="name-item">Tin nhắn</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SidebarLeft',
    props:{
        userName:{
            type: String,
            default: "",
        }
    }
}
</script>
<style scoped>
.sidebar-left{
    height: 100%;
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
</style>