<template>
    <div class="">
        <Overview>
            <template v-slot:left-bar>
                <div class="left-bar"></div>
            </template>
            <template v-slot:center>
                <div class="center">
                    <div v-if="!notFound">
                        <div class="wrap-posts" v-if="showSkeleton">
                            <Skeleton></Skeleton>
                        </div>
                        <div class="wrap-posts" v-if="!showSkeleton">
                            <PostsBox :userID="ownerID" :avatar="avatar" :dataPost="dataPost" @deletePost="deletePost" @forwardData="forwardData"/>
                        </div>
                    </div>
                    <NotFound v-else></NotFound>
                </div>
            </template>
            <template v-slot:right-bar>
                <div class="right-bar"></div>
            </template>
        </Overview>
        <PopupCreateStatus 
        v-if="isShowStatus"
        v-model="contentStatus" 
        :avatar="avatar"
        :isShowStatus="isShowStatus" 
        :dataPost="dataPost"
        :statePopup="statePopup"
        @hideStatus="hideStatus" 
        @createPost="createPost"/>
    </div>
</template>
<script>
import Overview from "@/views/Overview/Overview.vue"
import PostsBox from "@/components/posts-box/PostsBox.vue"
import PostAPI from "@/api/PostAPI.js"
import {State} from "@/models/enums/State.js"
import Skeleton from "@/components/skeleton/Skeleton.vue"
const NotFound = () => import("@/components/not-found/NotFound.vue")
const PopupCreateStatus = () => import("@/components/popup-create-status/PopupCreateStatus.vue");

export default {
    name: 'DetailPost',
    components: {
        Overview,
        PostsBox,
        Skeleton,
        PopupCreateStatus,
        NotFound
    },
    data() {
        return {
            isShowStatus: false,
            contentStatus: "",          //Nội dung text bài viết
            dataPost: {},               //Dữ liệu của một bài viết
            statePopup: State.Update,   //Trạng thái đầu tiên "Thêm mới"
            ownerID: "",                 //ID của người dùng tài khoản
            showSkeleton: true,
            postID: "",                 //ID bài viết
            avatar: {},
            notFound: false,
        }
    },
    created() {
        let userInfor = this.$store.getters.userInfor;
        this.ownerID = userInfor._id;
        this.postID = this.$route.params.id;
        this.getPostData(this.postID);
    },
    methods: {
        /**
         * Lấy dữ liệu bài viết
         */
        getPostData(postID){
            PostAPI.getByID(postID).then((res) => {
                if(res.data && res.data.success){
                    this.dataPost = res.data.doc;
                    this.avatar = this.dataPost.owner.avatar;
                    this.showSkeleton = false;
                }else{
                    this.notFound = true;
                    this.showSkeleton = false;
                }
            })
        },
        //Hiển thị popup tạo bài viết
        showPopupPost(){
            this.isShowStatus = true;
            this.statePopup = State.Insert;
        },
        //Ẩn box tạo bài viết
        hideStatus(){
            this.contentStatus = "";
            this.isShowStatus = false;
        },
        /**
         * Gọi API cập nhật bài viết
         */
        async createPost(files, oldImage){
            let formData = new FormData();
            formData.append('owner', this.$cookie.get('u_id'));
            formData.append('content', this.contentStatus);
            formData.append('oldImage', oldImage);
            for( var i = 0; i < files.length; i++ ){
                let file = files[i];
                formData.append('image', file);
            }
            
            PostAPI.update(this.dataPost._id, formData).then(() => {
                this.hideStatus();
                this.getPostData(this.postID);
            })
            
        },
        /**
         * Gọi API xóa bài viết
         */
        deletePost(id){
            PostAPI.deleteByID(id).then(() => {

            })
        },
        /**
         * Update bài viết
         */
        forwardData(data){
            this.isShowStatus = true;
            this.dataPost = data;
            this.statePopup = State.Update;
        }
    },
    destroyed () {
        this.$eventBus.$off('refresh');
    },
}
</script>
<style scoped>
@import "../../css/views/NewsFeed/newsfeed.css";
</style>