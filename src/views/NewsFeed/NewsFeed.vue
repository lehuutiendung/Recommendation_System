<template>
    <div class="visonet">
        <!-- Bạn muốn chia sẻ điều gì? -->
        <div class="box-status">
            <div class="wrap-content flex">
                <div class="icon-40 icon-avatar"></div>
                <div class="ask-content" @click="isShowStatus = true">{{ $t('i18nNewsFeed.BoxCreatePost.AskContent') }}</div>
            </div>
            <div class="wrap-active flex">
                <div class="item flex">
                    <div class="icon-32 icon-picture"></div>
                    <div class="name-item">{{ $t('i18nNewsFeed.BoxCreatePost.PictureAndVideo') }}</div>
                </div>
                <div class="item flex">
                    <div class="icon-32 icon-emotion"></div>
                    <div class="name-item">{{ $t('i18nNewsFeed.BoxCreatePost.QuickEmotion') }}</div>
                </div>
            </div>
        </div>
        <div class="wrap-posts" v-for="item in listDataPost" :key="item._id">
            <PostsBox :dataPost="item" @deletePost="deletePost"/>
        </div>
        <PopupCreateStatus v-if="isShowStatus" 
        v-model="contentStatus" 
        :isShowStatus="isShowStatus" 
        @hideStatus="hideStatus" 
        @createPost="createPost"/>
    </div>
</template>
<script>
import PostsBox from "@/components/posts-box/PostsBox.vue"
import PopupCreateStatus from "@/components/popup-create-status/PopupCreateStatus.vue"
import PostAPI from "@/api/PostAPI.js"
export default {
    name: 'NewsFeed',
    components: {
        PostsBox,
        PopupCreateStatus
    },
    data() {
        return {
            isShowStatus: false,    //Ẩn-hiện popup tạo bài viết     
            contentStatus: "",      //Nội dung text bài viết
            listDataPost: [],       //Danh sách dữ liệu bài viết
        }
    },
    created() {
        this.getAllPost();
    },
    methods: {
        //Ẩn box tạo bài viết
        hideStatus(){
            this.contentStatus = "";
            this.isShowStatus = false;
        },
        /**
         * Lấy tất cả bài viết
         * @created 25/11/2021
         */
        getAllPost(){
            PostAPI.getAll().then(  res => {
            this.listDataPost = res.data.data.doc;
        });
        },
        /**
         * Gọi API lưu bài viết
         * @created 25/11/2021
         */
        createPost(files){
            // let post = {
            //     owner: this.$cookie.get('u_id'),
            //     content: this.contentStatus,
            // }
            let formData = new FormData();
            formData.append('owner', this.$cookie.get('u_id'));
            formData.append('content', this.contentStatus);
            formData.append('image', files[0]);

            // for( var i = 0; i < files.length; i++ ){
            //     let file = files[i];
            //     formData.append('image[' + i + ']', file);
            // }
            PostAPI.save(formData).then(() => {
                this.hideStatus();
                this.getAllPost();
            });
        },
        /**
         * Gọi API xóa bài viết
         */
        deletePost(id){
            PostAPI.deleteByID(id).then(() => {
                this.getAllPost();
            })
        }
    },
}
</script>
<style scoped>
@import "../../css/views/NewsFeed/newsfeed.css";
</style>