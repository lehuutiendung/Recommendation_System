<template>
    <div class="card">
        <div class="avatar" @click="redirectToPageFriend(friend._id)">
            <cld-image 
                :publicId="friend.avatar.cloudinaryID" 
                loading="lazy">
                <cld-transformation gravity="south" crop="fill"/>
            </cld-image>
        </div>
        <div class="wrap-info" @click="redirectToPageFriend(friend._id)">
            <div class="name">{{ friend.userName }}</div>
        </div>
        <div class="icon-32 option" v-if="userID == ownerID" @click="showOption" v-click-outside="hidePopupOption">
            <div class="icon-16 icon-three-dots"></div>
        </div>
        <div class="popup-option" v-if="isShowOption">
            <div class="item-option item-delete" @click="deleteFriend(friend._id)">Hủy kết bạn</div>
        </div>
    </div>
</template>
<script>
import ClickOutSide from "@/mixins/detectoutside.js"
export default {
    name: "CardFriend",
    directives: {
        ClickOutSide
    },
    props:{
        friend: {
            type: Object,
            default: () => {}
        },
        userID: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            ownerID: "",                //ID của người dùng account
            isShowOption: false,
        }
    },
    created() {
        let userInfor = this.$store.getters.userInfor;
        this.ownerID = userInfor._id;
    },
    methods: {
        //Hủy kết bạn
        deleteFriend(friendID){
            this.$emit('deleteFriend', friendID);
        },
        // Hiện option (3 dots)
        showOption(){
            this.isShowOption = !this.isShowOption;
        },
        // Ẩn option (3 dots)
        hidePopupOption(){
            this.isShowOption = false;
        },
        /**
         * Chuyển hướng đến trang cá nhân bạn bè
         */
        redirectToPageFriend(userID){
            this.$router.push({
                name: 'Personal',
                params: { id: userID }
            }).catch(()=>{});
        }
    },
}
</script>
<style lang="scss" scoped>
.card{
    position: relative;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    box-shadow: rgba(3, 8, 20, 0.1) 0px 0.15rem 0.5rem, rgba(2, 8, 20, 0.1) 0px 0.075rem 0.175rem;
    height: 100%;
    width: 100%;
    border-radius: 4px;
    transition: all 500ms;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 0;
    margin: 0;
}
.avatar {
    margin-left: 10px;
    width: 80px;
    height: 80px;
    cursor: pointer;
    img{
        width: 100%;
        height: 100%;
        border-radius: 6px;
        object-fit: cover;
    }
    
}
.wrap-info{
    margin-left: 10px;
    .name:hover{
        text-decoration: underline;
        cursor: pointer;
    }
}
.option{
    position: absolute;
    right: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.option:hover{
    background-color: #dddddd;
}  
.icon-three-dots{
    background: url(../../../../assets/svg/three-dots-svgrepo-com.svg);
    background-size: contain; 
    -webkit-filter: var(--filter-secondary-icon);
}
.popup-option{
    position: absolute;
    top: 40px;
    right: 14px;
    padding: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 2px 0 rgb(0 0 0 / 50%);
    border-radius: 4px;
    font-weight: 500;
    z-index: 99999;
    font-size: 15px;
}
.popup-option .item-option{
    padding: 10px;
    cursor: pointer;
}
.popup-option .item-delete{
    color: #ff3217!important;
}
.popup-option .item-option:hover{
    background-color: #F2F7FC;
}
</style>