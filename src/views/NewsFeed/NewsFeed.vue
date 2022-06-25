<template>
    <div class="visonet">
        <!-- Bạn muốn chia sẻ điều gì? -->
        <div class="box-status">
            <div class="wrap-content flex">
                <div class="icon-40 icon-avatar">
                    <cld-image 
                        :publicId="avatar.cloudinaryID">
                        <cld-transformation gravity="south" crop="fill"/>
                    </cld-image>
                </div>
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
        <div class="wrap-posts" v-for="(skeleton, index) in 4" :key="`skeleton-${index}`" v-show="showSkeleton">
            <Skeleton></Skeleton>
        </div>
        <div class="wrap-posts" v-for="(item,index) in listDataPost" :key="index" v-show="!showSkeleton">
            <PostsBox :userID="userID" :avatar="avatar" :dataPost="item" @deletePost="deletePost" @forwardData="forwardData"/>
        </div>
        <Observer @getPaging="getPagingData"/>
        <PopupCreateStatus v-if="isShowStatus" 
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
import PostsBox from "@/components/posts-box/PostsBox.vue"
// import PopupCreateStatus from "@/components/popup-create-status/PopupCreateStatus.vue"
import PostAPI from "@/api/PostAPI.js"
import {State} from "@/models/enums/State.js"
import Observer from "@/components/observer/Observer.vue"
import Skeleton from "@/components/skeleton/Skeleton.vue"
const PopupCreateStatus = () => import("@/components/popup-create-status/PopupCreateStatus.vue");
// import {EventBus} from "../../main"

export default {
    name: 'NewsFeed',
    components: {
        PostsBox,
        PopupCreateStatus,
        Observer,
        Skeleton
    },
    props:{
        avatar:{
            type: Object,
            default(){
                return {}
            }
        }
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
            userID: "",                 //ID của người dùng tài khoản
            showSkeleton: true,
        }
    },
    created() {
        this.getPagingData();

        //Lắng nghe sự kiện refresh trang
        this.$eventBus.$on('refresh', ()=>{
            this.pageIndex = 0;
            this.totalPage = 0;
            this.listDataPost = [];
            this.getPagingData();
        })
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
        /**
         * Lấy dữ liệu phân trang bài viết
         */
        getPagingData(){
            if(this.pageIndex > this.totalPage){
                return;
            }
            this.pageIndex++;
            let dataReq = {
                userID: this.$cookie.get('u_id'),
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            }
            PostAPI.getPaging(dataReq).then( res => {
                this.totalPage = res.data.data.totalPage;
                //Push thêm data vào listDataPost
                let lstResData = res.data.data.doc;
                lstResData.forEach(item => {
                    if(!this.listDataPost.find(x => x._id === item._id)){
                        this.listDataPost.push(item);
                    }
                });
                this.showSkeleton = false;
            })
        },
        /**
         * Gọi API lấy bài viết mới nhất
         */
        getTopData(){
            let dataReq = {
                userID: this.$cookie.get('u_id')
            }
            PostAPI.getTopInNewsfeed(dataReq).then( res => {
                //Push thêm data vào đầu listDataPost
                this.listDataPost.unshift(res.data.doc[0]);
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
        async createPost(files, oldImage){
            let formData = new FormData();
            formData.append('owner', this.$cookie.get('u_id'));
            formData.append('content', this.contentStatus);
            formData.append('oldImage', oldImage);
            for( var i = 0; i < files.length; i++ ){
                let file = files[i];
                formData.append('image', file);
            }

            this.pageIndex = 0;
            this.totalPage = 0;

            if(this.statePopup == State.Insert){
                await PostAPI.save(formData).then((res)=>{
                    if(res.data.status === "Success"){
                        this.hideStatus();
                        // this.getTopData();
                        this.listDataPost = [];
                        this.getPagingData();
                    }else{
                        this.hideStatus();
                    }
                });
            }else{
                PostAPI.update(this.dataPost._id, formData).then(() => {
                    this.hideStatus();
                    this.listDataPost = [];
                    this.getPagingData();
                })
            }
            
        },
        /**
         * Gọi API xóa bài viết
         */
        deletePost(id){
            PostAPI.deleteByID(id).then(() => {
                this.listDataPost = [];
                this.pageIndex = 0;
                this.totalPage = 0;
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
    destroyed () {
        this.$eventBus.$off('refresh');
    },
}
</script>
<style scoped>
@import "../../css/views/NewsFeed/newsfeed.css";
</style>