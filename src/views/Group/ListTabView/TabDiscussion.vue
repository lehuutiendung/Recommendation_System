<template>
    <div class="visonet tab-discussion">
        <!-- Bạn muốn chia sẻ điều gì? -->
        <div class="box-status">
            <div class="wrap-content flex">
                <div class="icon-40 icon-avatar"></div>
                <div class="ask-content" @click="showPopupPost">{{ $t('i18nNewsFeed.BoxCreatePost.AskContent') }}</div>
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
            <PostsBox :userID="userID" :dataPost="item" :showInfoGroup="false" @deletePost="deletePost" @forwardData="forwardData"/>
        </div>
        <Observer @getPaging="getPagingData"/>
        <PopupCreateStatus v-if="isShowStatus" 
        v-model="contentStatus" 
        :isShowStatus="isShowStatus" 
        :dataPost="dataPost"
        :statePopup="statePopup"
        @hideStatus="hideStatus" 
        @createPost="createPost"/>
    </div>
</template>
<script>
import PostsBox from "@/components/posts-box/PostsBox.vue"
import PopupCreateStatus from "@/components/popup-create-status/PopupCreateStatus.vue"
import PostAPI from "@/api/PostAPI.js"
import {State} from "@/models/enums/State.js"
import Observer from "@/components/observer/Observer.vue"
export default {
    name: 'TabDiscussionGroup',
    components: {
        PostsBox,
        PopupCreateStatus,
        Observer
    },
    data() {
        return {
            isShowStatus: false,        //Ẩn-hiện popup tạo bài viết     
            contentStatus: "",          //Nội dung text bài viết
            listDataPost: [],           //Danh sách dữ liệu bài viết
            dataPost: {},               //Dữ liệu của một bài viết
            statePopup: State.Insert,   //Trạng thái đầu tiên "Thêm mới"
            pageIndex: 0,               //Phân trang dữ liệu
            pageSize: 3,                //Số bản ghi query trong 1 lần paging
            totalPage: 0,               //Tổng số bản ghi
            userID: "",
            groupID: "",
        }
    },
    created() {
        this.groupID = this.$route.params.id;
    },
    mounted() {
        this.userID = this.$cookie.get('u_id');
    },
    methods: {
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
        getPagingData(){
            if(this.pageIndex > this.totalPage){
                return;
            }
            this.pageIndex++;
            let dataReq = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                groupID: this.groupID
            }
            PostAPI.getPagingInGroup(dataReq).then( res => {
                this.totalPage = res.data.data.totalPage;
                //Push thêm data vào listDataPost
                this.listDataPost = [...this.listDataPost, ...res.data.data.doc];
            })
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
        createPost(files, oldImage){
            let formData = new FormData();
            formData.append('owner', this.$cookie.get('u_id'));
            formData.append('content', this.contentStatus);
            formData.append('oldImage', oldImage);
            formData.append('belongToGroup', this.groupID);
            for( var i = 0; i < files.length; i++ ){
                let file = files[i];
                formData.append('image', file);
            }
            if(this.statePopup == State.Insert){
                PostAPI.save(formData).then(() => {
                    this.hideStatus();
                    this.pageIndex = 0;
                    this.getPagingData();
                }); 
            }else{
                PostAPI.update(this.dataPost._id, formData).then(() => {
                    this.hideStatus();
                    this.getPagingData();
                })
            }
        },
        /**
         * Gọi API xóa bài viết
         */
        deletePost(id){
            PostAPI.deleteByID(id).then(() => {
                this.pageIndex = 0;
                this.getPagingData();
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
}
</script>
<style lang="scss" scoped>
@import "../../../css/views/NewsFeed/newsfeed.css";
.tab-discussion{
    display: flex;   
    flex-direction: column;
    justify-content: center;
    margin-top: 15px;
}    
</style>