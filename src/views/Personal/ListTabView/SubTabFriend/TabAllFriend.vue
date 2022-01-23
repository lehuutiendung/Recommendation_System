<template>
    <div class="grid-card">
        <div class="card" v-for="(friend, index) in listFriends" :key="index">
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
            <div class="icon-32 option">
                <div class="icon-16 icon-three-dots"></div>
            </div>
        </div>
    </div>
</template>
<script>
import UserAPI from "@/api/UserAPI.js"
export default {
    name: 'TabAllFriend',
    data() {
        return {
            pageIndex: 0,               //Phân trang dữ liệu
            listFriends: [],            //Danh sách bạn bè
            userID: "",                 //ID của người dùng trong trang cá nhân
        }
    },
    created() {
        this.getPagingFriend();
    },
    methods: {
        getPagingFriend(){
            let filter = {
                userID: this.$route.params.id,
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
    .card {
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
        .avatar {
            margin-left: 10px;
            width: 80px;
            height: 80px;
            cursor: pointer;
            img{
                width: 100%;
                height: 100%;
                border-radius: 6px;
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
    }
}    
.icon-three-dots{
    background: url(../../../../assets/svg/three-dots-svgrepo-com.svg);
    background-size: contain; 
    -webkit-filter: var(--filter-secondary-icon);
}
</style>