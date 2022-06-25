<template>
    <div class="grid-card">
        <div v-for="(friend) in listFriends" :key="friend._id">
            <CardFriend :friend="friend" :userID="userID" @deleteFriend="deleteFriend"></CardFriend>
        </div>
        <div class="no-match m-t-20 p-l-10" v-if="listFriends.length == 0">
            <span>{{ $t('i18nCommon.NoMatch') }}</span> 
            <span>"{{searchValue}}"</span> 
        </div>
    </div>
</template>
<script>
import UserAPI from "@/api/UserAPI.js"
import ClickOutSide from "@/mixins/detectoutside.js"
import CardFriend from "../CardFriend/CardFriend.vue"
export default {
    name: 'TabAllFriend',
    directives: {
        ClickOutSide
    },
    components:{
        CardFriend,
    },
    props:{
        searchValue:{
            type: String,
            default: ""
        }
    },
    data() {
        return {
            pageIndex: 0,               //Phân trang dữ liệu
            listFriends: [],            //Danh sách bạn bè
            userID: "",                 //ID của người dùng trong trang cá nhân
            ownerID: "",                //ID của người dùng account
            isShowOption: false,
        }
    },
    created() {
        this.getPagingFriend();
        let userInfor = this.$store.getters.userInfor;
        this.ownerID = userInfor._id;
    },
    methods: {
        //Hủy kết bạn
        async deleteFriend(friendID){
            let param = {
                ownerID: this.ownerID,
                friendID: friendID
            }
            await UserAPI.deleteFriend(param).then(res => {
                if(res.data && res.data.success){
                    console.log(res);
                    this.getPagingFriend();
                }
            })
        },
        // Hiện option (3 dots)
        showOption(e, friendID){
            console.log(e, friendID);
            this.isShowOption = !this.isShowOption;
        },
        // Ẩn option (3 dots)
        hidePopupOption(){
            this.isShowOption = false;
        },
        getPagingFriend(){
            let filter = {
                userID: this.$route.params.id,
                userName: this.searchValue,             //Tìm bạn bè
                pageSize: 20,
                pageIndex: 1,
            }
            UserAPI.filterTopFriend(filter).then((res)=>{
                this.listFriends = res.data.doc.friends;
            })
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
    watch:{
        // Cập nhật thông tin khi thay đổi trang cá nhân 
        '$route.params.id': {
            handler: function(userIDCurrent) {
                if(this.userID != userIDCurrent){
                    this.getPagingFriend();
                    this.userID = userIDCurrent;
                }
            },
            deep: true,
            immediate: true
        },
        searchValue: {
            handler(){
                this.getPagingFriend();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.grid-card{
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-auto-rows: 100px;
    margin-top: 10px;
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