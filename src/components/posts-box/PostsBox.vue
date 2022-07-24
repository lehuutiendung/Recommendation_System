<template>
    <div>
        <div class="posts-box">
            <div class="wrap-item mg-b-10">
                <div class="icon-40 icon-avatar" @click="redirectToPersonal">
                    <cld-image 
                        :publicId="ownerPost.cloudinaryID">
                        <cld-transformation gravity="south" crop="fill"/>
                    </cld-image>
                </div>
                <div class="name-item">
                    <span class="wrap-username">
                        <div class="username" @click="redirectToPersonal">{{ownerPost.ownerName}}</div>
                        <div class="flex" v-if="dataPost.belongToGroup != null && showInfoGroup">
                            <div class="arrow-group"></div>
                            <div class="name-group">{{ dataPost.belongToGroup.name }}</div>
                        </div>
                    </span>
                    <div class="time">{{ dayOfCreated }}</div>
                </div>
            </div>
            <!-- Three dots -->
            <div class="icon-32 option-post" v-if="dataPost.owner._id == userID" @click="showOption" v-click-outside="hidePopupOption">
                <div class="icon-16 icon-three-dots"></div>
            </div>
            <!-- Popup lựa chọn của bài viết -->
            <div class="popup-option" v-if="isShowOption">
                <div class="item-option" @click="updatePost">Chỉnh sửa bài viết</div>
                <div class="item-option item-delete" @click="deletePost">Xóa bài viết</div>
            </div>
            <div class="content-text mg-b-10">{{ dataPost.content }}</div>
            <div class="multiple-img">
                <div class="content-img" v-for="(image, key) in dataPost.image" :key="key">
                    <!-- <img :src="image.imageURL" alt="" @click.native="viewFullImage(image.imageURL)"> -->
                    <cld-image 
                        v-if="image.resourceType == 'image'"
                        :publicId="image.imageURL" 
                        loading="lazy" @click.native="viewFullImage(image.imageURL)">
                        <cld-transformation width="auto" gravity="south" crop="fill"/>
                    </cld-image>
                    <cld-video 
                        v-if="image.resourceType == 'video'"
                        :publicId="image.imageURL" controls="true">
                    </cld-video>
                </div>
            </div>
            <div class="view-number">
                <div class="view-react"></div>
                <div class="group-comment-share flex">
                    <div class="view-comment" v-if="totalRecord > 0">{{ totalRecord }} bình luận</div>
                </div>
            </div>
            <div class="view-button">
                <!-- Thích -->
                <div class="group-btn" @mouseleave="hideEmoticon" @click.exact="clickReactDefault">
                    <div class="flex reaction-hover" @mouseover="showEmoticon">
                        <div class="icon-18 icon-like" 
                        :class="{'icon-like-active':isLike, 
                                'icon-love':isLove, 
                                'icon-haha':isHaha, 
                                'icon-wow':isWow,       
                                'icon-sad':isSad, 
                                'icon-angry':isAngry }"></div>
                        <div class="btn-name" v-if="isNoReaction">{{ $t('i18nNewsFeed.PostsCard.Like') }}</div>
                        <div class="btn-name text-like" v-if="isLike">{{ $t('i18nNewsFeed.PostsCard.Like') }}</div>
                        <div class="btn-name text-love" v-if="isLove">{{ $t('i18nNewsFeed.PostsCard.Love') }}</div>
                        <div class="btn-name text-haha" v-if="isHaha">{{ $t('i18nNewsFeed.PostsCard.Haha') }}</div>
                        <div class="btn-name text-wow" v-if="isWow">{{ $t('i18nNewsFeed.PostsCard.Wow') }}</div>
                        <div class="btn-name text-sad" v-if="isSad">{{ $t('i18nNewsFeed.PostsCard.Sad') }}</div>
                        <div class="btn-name text-angry" v-if="isAngry">{{ $t('i18nNewsFeed.PostsCard.Angry') }}</div>
                    </div>
                    <div class="group-emoticon" v-if="isShowEmoticon">
                        <div class="icon-36 mg-r-10 icon-emoticon like-emoticon" @click="clickEmoticon($event,4)"></div>
                        <div class="icon-36 mg-r-10 icon-emoticon love-emoticon" @click="clickEmoticon($event,6)"></div>
                        <div class="icon-36 mg-r-10 icon-emoticon haha-emoticon" @click="clickEmoticon($event,5)"></div>
                        <div class="icon-36 mg-r-10 icon-emoticon wow-emoticon" @click="clickEmoticon($event,3)"></div>
                        <div class="icon-36 mg-r-10 icon-emoticon sad-emoticon" @click="clickEmoticon($event,2)"></div>
                        <div class="icon-36 mg-r-10 icon-emoticon angry-emoticon" @click="clickEmoticon($event,1)"></div>
                    </div>
                </div>
                <!-- Bình luận -->
                <div class="group-btn">
                    <div class="icon-18 icon-comment"></div>
                    <div class="btn-name">{{ $t('i18nNewsFeed.PostsCard.Comment') }}</div>
                </div>
                <!-- Chia sẻ -->
                <!-- <div class="group-btn">
                    <div class="icon-18 icon-share"></div>
                    <div class="btn-name">{{ $t('i18nNewsFeed.PostsCard.Share') }}</div>
                </div> -->
            </div>
            <div class="border-box-comment">
                <Comment v-model="commentText" 
                :avatar="avatar" 
                :isEdit="true" 
                :dataPost="dataPost" 
                @updatePagingComment="updatePagingComment"/>
                <div class="box-comment" v-for="(item, index) of listDataComment" :key="index">
                    <Comment v-model="commentText" 
                    :isEdit="item._id == commentEditID && isUpdateState ? true : false" 
                    :isUpdateState="isUpdateState" 
                    :dataComment="item" 
                    :dataPost="dataPost" 
                    :userID="userID" 
                    @updatePagingComment="updatePagingComment" 
                    @updateComment="updateComment"/>
                </div>
                <div class="load-more-comment" v-if="pageIndex < totalPage" @click="handleMoreLoad">Xem thêm bình luận</div>
            </div> 
        </div>
        <ZoomImage v-if="showZoomImage" :dataZoomImage="dataZoomImage" @exitDimmed="exitDimmed"></ZoomImage>
    </div>
</template>
<script>
import ClickOutSide from "@/mixins/detectoutside.js"
import {Reaction} from "@/models/enums/Reaction.js"
import CommentAPI from "@/api/CommentAPI.js"
import Comment from "@/components/comment/Comment.vue"
import CommonFunction from "@/common/commonFunction.js"
import {State} from "@/models/enums/State.js"
import PostAPI from "@/api/PostAPI.js"
import ZoomImage from "@/components/zoom-image/ZoomImage.vue"
// import UserAPI from "@/api/UserAPI.js"
// import {EventBus} from "../../main"
/**
 * Quy thang điểm rating: 
 * 1 angry
 * 2 sad
 * 3 wow
 * 4 like
 * 5 haha
 * 6 love
 */
export default {
    name: "PostsBox",
    directives: {
        ClickOutSide
    },
    components:{
        Comment,
        ZoomImage
    },
    props:{
        value: {
            type: String,
            default: '',
        },
        //Dữ liệu của bài viết
        dataPost:{
            type: Object,
            default(){
                return {}
            }
        },
        //ID người dùng tài khoản
        userID:{
            type: String,
            default: ''
        },
        //Chỉ hiển thị tiêu đề (tên owner > tên nhóm) trên trang Newfeed
        showInfoGroup:{
            type: Boolean,
            default: true,
        },
        //Avatar của người đang dùng tài khoản
        avatar:{
            type: Object,
            default(){
                return {}
            }
        }
    },
    data() {
        return {
            isShowEmoticon: false,  // Ẩn/hiện emoticon
            isShowOption: false,    // Ẩn/hiện popup option
            timeOutID: "",
            isLike: false,          //Reaction like
            isLove: false,          //Reaction love
            isHaha: false,          //Reaction haha
            isWow: false,           //Reaction wow  
            isSad: false,           //Reaction sad
            isAngry: false,         //Reaction angry
            isNoReaction: true,     //Bài viết không có reaction
            commentText: "",        //Nội dung viết comment (text)
            pageIndex: 1,               //Phân trang dữ liệu
            pageSize: 3,                //Số bản ghi query trong 1 lần paging
            totalPage: 1,               //Tổng số bản ghi
            totalRecord: 0,             //Số bản ghi comment
            listDataComment: [],        //Danh sách chứa bình luận của bài viết
            commentEditID: "",  
            isUpdateState: false,       //Trạng thái component comment: có phải trạng thái update hay không
            ownerPost: {
                cloudinaryID: "",
                ownerName: "",
                ownerID: "",
            },
            dayOfCreated: "",  
            showZoomImage: false,
            dataZoomImage: ""
        }
    },
    computed: {
        listeners() {
            return { ...this.$listeners, input: this.onInput };
        },
    },
    created() {
        this.ownerPost.cloudinaryID = this.dataPost.owner.avatar.cloudinaryID;
        this.ownerPost.ownerName = this.dataPost.owner.userName;
        this.ownerPost.ownerID = this.dataPost.owner._id;
        this.getPagingComment();
        this.getDifferentDay();
        this.getReactionOfOwner();
    },
    methods: {
        getPagingComment(){
            if(this.pageIndex > this.totalPage && this.totalPage != 0){
                return;
            } 
            let dataReq = {
                post: this.dataPost._id,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            }
            CommentAPI.getPaging(dataReq).then( res => {
                this.totalRecord = res.data.data.totalRecord;
                this.totalPage = res.data.data.totalPage;
                //Push thêm data vào listDataPost
                this.listDataComment = [...this.listDataComment, ...res.data.data.doc];
            })
        },
        getReactionOfOwner(){
            let userInfor = this.$store.getters.userInfor;
            let lstReact = this.dataPost.react;
            let reactOfOwner = lstReact.find(x => x.userID == userInfor.userID);
            if(!reactOfOwner){
                return;
            }
            switch (reactOfOwner.reactType) {
                case 4:
                    this.isLike = true;
                    this.isNoReaction = false;
                    break;
                case 6:
                    this.isLove = true;
                    this.isNoReaction = false;
                    break;
                case 5: 
                    this.isHaha = true;
                    this.isNoReaction = false;
                    break;
                case 3:
                    this.isWow = true;
                    this.isNoReaction = false;
                    break;
                case 2: 
                    this.isSad = true;
                    this.isNoReaction = false;
                    break;
                case 1: 
                    this.isAngry = true;
                    this.isNoReaction = false;
                    break;
                default:
                    break;
            }
        },
        onInput(e) {
            this.$emit('input', e.target.innerText);
        },

        // Hover 500ms button like hiển thị emoticon
        showEmoticon(){
            this.timeOutID = setTimeout(() => {
                this.isShowEmoticon = true;
            }, 500);
        },
        // Ẩn emoticon
        hideEmoticon(){
            clearTimeout(this.timeOutID);
            this.isShowEmoticon = false;
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
         * Xóa bài viết
         * @created 25/11/2021
         */
        deletePost(){
            this.$emit('deletePost', this.dataPost._id);
        },
        /**
         * Click chỉnh sửa bài viết
         * @created 30/11/2021
         */
        updatePost(){
            this.$emit('forwardData', this.dataPost);
        },
        /**
         * Sự kiện click reaction bài viết mặc định LIKE
         */
        clickReactDefault(){
            if(!this.isNoReaction){
                this.isLike = false;
                this.isLove = false;
                this.isHaha = false;
                this.isWow = false;
                this.isSad = false;
                this.isAngry = false;
                this.isNoReaction = true;
            }else{
                this.isLike = !this.isLike;
                this.isNoReaction = false;
            }

            let userInfor = this.$store.getters.userInfor;
            let param = {
                owner: userInfor.userID,
                postID: this.dataPost.postID,
                reactType: 4,          //Click default mặc định là hành động like
                state: null
            }
        
            if(this.isNoReaction){
                param.state = State.Delete;
            }else{
                param.state = State.Update;
            }
            
            PostAPI.interactivePost(param).then((res) => {
                console.log(res);
            })
        },
        /**
         * Click emoticon
         * @created 2/12/2021
         */
        clickEmoticon(event,typeEmoticon){
            event.stopPropagation();
            switch (typeEmoticon) {
                case Reaction.Like:
                    this.isLike = true;
                    this.isLove = false;
                    this.isHaha = false;
                    this.isWow = false;
                    this.isSad = false;
                    this.isAngry = false;
                    this.isNoReaction = false;
                    break;
                case Reaction.Love:
                    this.isLike = false;
                    this.isLove = true;
                    this.isHaha = false;
                    this.isWow = false;
                    this.isSad = false;
                    this.isAngry = false;
                    this.isNoReaction = false;
                    break;
                case Reaction.Haha:
                    this.isLike = false;
                    this.isLove = false;
                    this.isHaha = true;
                    this.isWow = false;
                    this.isSad = false;
                    this.isAngry = false;
                    this.isNoReaction = false;
                    break;
                case Reaction.Wow:
                    this.isLike = false;
                    this.isLove = false;
                    this.isHaha = false;
                    this.isWow = true;
                    this.isSad = false;
                    this.isAngry = false;
                    this.isNoReaction = false;
                    break;
                case Reaction.Sad:
                    this.isLike = false;
                    this.isLove = false;
                    this.isHaha = false;
                    this.isWow = false;
                    this.isSad = true;
                    this.isAngry = false;
                    this.isNoReaction = false;
                    break;
                case Reaction.Angry:
                    this.isLike = false;
                    this.isLove = false;
                    this.isHaha = false;
                    this.isWow = false;
                    this.isSad = false;
                    this.isAngry = true;
                    this.isNoReaction = false;
                    break;
                default:
                    break;
            }
            let userInfor = this.$store.getters.userInfor;
            let param = {
                owner: userInfor.userID,
                postID: this.dataPost.postID,
                reactType: typeEmoticon,
                state: null
            }
            if(!this.isNoReaction){
                param.state = State.Update;
            }
            PostAPI.interactivePost(param).then((res) => {
                console.log(res);
            })
        },
        /**
         * Paging sau khi cập nhật xong dữ liệu bình luận
         */
        updatePagingComment(){
            this.pageIndex = 1;
            this.commentText = "";
            this.listDataComment = [];
            this.isUpdateState = false;
            this.getPagingComment();
        },
        updateComment(commentID){
            this.commentEditID = commentID;
            this.isUpdateState = true;
        },
        /**
         * Load thêm dữ liệu comment
         */
        handleMoreLoad(){
            this.pageIndex++;
            this.getPagingComment();
        },
        /**
         * Chuyển hướng đến trang cá nhân
         */
        redirectToPersonal(){
            this.$router.push({
                name: 'Personal',
                params: { id: this.dataPost.owner._id }
            }).catch(()=>{});
        },
        /**
         * Tính khoảng cách từ thời điểm tạo bài viết đến hiện tại
         */
        getDifferentDay(){
            this.dayOfCreated = CommonFunction.getDayOfTimeWithMinutes(this.dataPost.createdAt, new Date());
            if(this.dayOfCreated == 0){
                this.dayOfCreated = "Vừa xong";
            }
            if(this.dayOfCreated <= 59){
                this.dayOfCreated += " phút";
            }
            else if(this.dayOfCreated > 59 && this.dayOfCreated <= 1399){
                this.dayOfCreated = CommonFunction.getDayOfTimeWithHour(this.dataPost.createdAt, new Date());
                this.dayOfCreated += " giờ";
            }else if(this.dayOfCreated > 1399){
                this.dayOfCreated = CommonFunction.getDayOfTimeWithDay(this.dataPost.createdAt, new Date());
                this.dayOfCreated += " ngày";
            }
        },
        /**
         * Click ảnh để xem chế độ toàn ảnh
         */
        viewFullImage(cloudinaryID){
            this.showZoomImage = true;
            this.dataZoomImage = cloudinaryID;
        },
        /**
         * Tắt xem phóng to ảnh
         */
        exitDimmed(){
            this.showZoomImage = false;
        }
        
    }
}
</script>
<style scoped>
.posts-box{
    /* position: relative; */
    position: sticky;
    width: 100%;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 14px;
    border: 1px solid #eeeeee;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    margin-bottom: 15px;
}    
.posts-box .option-post{
    position: absolute;
    top: 10px;
    right: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.posts-box .option-post:hover{
    background-color: #dddddd;
}
/* Popup lựa chọn bài viết */
.posts-box .popup-option{
    position: absolute;
    top: 40px;
    right: 14px;
    padding: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 2px 0 rgb(0 0 0 / 50%);
    border-radius: 4px;
    font-weight: 500;
    z-index: 99999;
}
.posts-box .popup-option .item-option{
    padding: 10px;
    cursor: pointer;
}
.posts-box .popup-option .item-delete{
    color: #ff3217;
}
.posts-box .popup-option .item-option:hover{
    background-color: #F2F7FC;
}

.posts-box .wrap-item{
    display: inline-flex;
}
.posts-box .name-item{
    margin-left: 5px;
}
.posts-box .name-item .wrap-username{
    color: #111111;
    font-weight: 500;
    display: flex;
    align-items: center;
}
.posts-box .name-item .username{
    color: #111111;
    font-weight: 500;
    display: flex;
    align-items: center;
}
.posts-box .name-item .username:hover{
    cursor: pointer;
    text-decoration: underline;
}
.posts-box .name-item .time{
    color: #656565;
}
.posts-box .multiple-img{
    display: flex;
}
.posts-box .content-text{
    white-space: pre-line;
    text-align: justify;
}
.posts-box .content-img{
    width: 100%;
    border: 1px solid #eeeeee;
}
.posts-box .content-img img{
    max-width: 100%;
    height: auto;
    width: 100%;
}
.posts-box .content-img video{
    max-width: 100%;
    height: auto;
    width: 100%;
}
.posts-box .view-number{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #cccccc;
    padding: 8px;
}
.posts-box .view-number .group-comment-share .view-comment{
    margin-right: 12px;
    cursor: pointer;
}
.posts-box .view-number .group-comment-share .view-share{
    cursor: pointer;
}
.posts-box .view-button{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    height: 44px;
    padding: 0 15%;
}
.posts-box .view-button .group-btn{
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
}
.group-btn .btn-name{
    margin-left: 5px;
    font-size: 15px;
}
/* Start: CSS comment */
.avatar-comment{
    margin-top: 3px;
}
.posts-box .border-box-comment{
    border-top: 1px solid #cccccc;
}
.border-box-comment .write-comment{
    display: flex;
    margin-top: 10px;
    width: 100%;
}
.border-box-comment .write-comment .content-cmt-write{
    position: relative;
    width: calc(100% - 32px);
    margin-left: 5px;
}
.border-box-comment .write-comment .content-cmt-write .comment{
    width: 100%;
    padding: 10px;
    padding-right: 28px;
    border-radius: 10px;
    background-color: #F0F2F5;
    overflow: hidden;

}
.border-box-comment .write-comment .content-cmt-write .item-comment{
    display: flex;
    position: absolute;
    top: 6px;
    right: 6px;
}
.border-box-comment .load-more-comment{
    font-weight: 450;
    color: #65676B;
    margin-top: 10px;
    cursor: pointer;
}
.border-box-comment .load-more-comment:hover{
    text-decoration: underline;
}
.item-comment .item-image{
    background: url(../../assets/icon/ICON.svg) -336px -216px no-repeat;
    cursor: pointer;
}
.item-comment .icon-filter-invert:hover {
    filter: invert(.5) sepia(1) hue-rotate(180deg) saturate(4) brightness(1);
}
.input-file{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: inherit;
    opacity: 0;
    cursor: pointer;
}
.content-cmt-write .preview-image{
    width: 100%;
    display: flex;
    margin-top: 10px;
    overflow-y: scroll;
}
.content-cmt-write .preview-image .image{
    position: relative;
    margin-right: 10px;
}
.content-cmt-write .preview-image .image .clear-img{
    position: absolute;
    top: 0;
    right: 0;
    background-color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
    cursor: pointer;
}
.content-cmt-write .preview-image .image .clear-img:hover{
    background-color: #dfdfdf;
}
.content-cmt-write .preview-image img{
    max-width: 100px;
}
/* End: CSS comment */
.icon-exit{
    background: url(../../assets/svg/x-svgrepo-com.svg);
    background-size: contain;
}
.icon-like{
    background: url(../../assets/svg/like-svgrepo-com.svg);
    /* background: url(../../assets/png/like.png); */
    background-size: contain;
}
.icon-comment{
    background: url(../../assets/svg/comment-svgrepo-com.svg);
    background-size: contain;
}
.icon-share{
    background: url(../../assets/svg/share-svgrepo-com.svg);
    background-size: contain;
}
.group-emoticon{
    top: -45px;
    left: -10px;
    position: absolute;
    display: inline-flex;
    background-color: #ffffff;
    border: 1px solid #dddddd;
    padding: 4px;
    border-radius: 25px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    animation: zoom 0.2s ease-in-out;
}
@keyframes zoom{
    from {transform: scale(0.9); }
    to {transform: scale(1); }
}
.group-emoticon .icon-emoticon:hover{
    transform: scale(1.4);
}
.group-emoticon .mg-r-10{
    margin-right: 10px;
}
.group-emoticon .like-emoticon{
    background: url(../../assets/emoticon/like_emoticon.gif);
    background-size: contain;
}
.group-emoticon .love-emoticon{
    background: url(../../assets/emoticon/love_emoticon.gif);
    background-size: contain;
}
.group-emoticon .haha-emoticon{
    background: url(../../assets/emoticon/haha_emoticon.gif);
    background-size: contain;
}
.group-emoticon .wow-emoticon{
    background: url(../../assets/emoticon/wow_emoticon.gif);
    background-size: contain;
}
.group-emoticon .sad-emoticon{
    background: url(../../assets/emoticon/sad_emoticon.gif);
    background-size: contain;
}
.group-emoticon .angry-emoticon{
    background: url(../../assets/emoticon/angry_emoticon.gif);
    background-size: contain;
}
.icon-three-dots{
    background: url(../../assets/svg/three-dots-svgrepo-com.svg);
    background-size: contain; 
    -webkit-filter: var(--filter-secondary-icon);
}
.icon-like-active{
    background: url(../../assets/png/icon-like.png);
    background-size: contain;
}
.icon-love{
    background: url(../../assets/png/icon-love.png);
    background-size: contain;
}
.icon-haha{
    background: url(../../assets/png/icon-haha.png);
    background-size: contain;
}
.icon-wow{
    background: url(../../assets/png/icon-wow.png);
    background-size: contain;
}
.icon-sad{
    background: url(../../assets/png/icon-sad.png);
    background-size: contain;
}
.icon-angry{
    background: url(../../assets/png/icon-angry.png);
    background-size: contain;
}
.text-like{
    color: #056BE1;
    font-weight: 500;
}
.text-love{
    color: #DD1E41;
    font-weight: 500;
}
.text-haha, .text-wow, .text-sad{
    color: #EAA823;
    font-weight: 500;
}
.text-angry{
    color: #DD6B0E;
    font-weight: 500;
}
.arrow-group{
    background: url(../../assets/svg/drop-right-svgrepo-com.svg);
    width: 20px;
    height: 20px;
    background-size: contain;

}
</style>