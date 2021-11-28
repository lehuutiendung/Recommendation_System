<template>
    <div class="posts-box">
        <router-link to="/personal" class="wrap-item mg-b-10">
            <div class="icon-40 icon-avatar"></div>
            <div class="name-item">
                <div class="username">Lê Hữu Tiến Dũng</div>
                <div class="time">50 phút</div>
            </div>
        </router-link>
        <!-- Three dots -->
        <div class="icon-32 option-post" @click="showOption" v-click-outside="hidePopupOption">
            <div class="icon-16 icon-three-dots"></div>
        </div>
        <!-- Popup lựa chọn của bài viết -->
        <div class="popup-option" v-if="isShowOption">
            <div class="item-option">Chỉnh sửa bài viết</div>
            <div class="item-option item-delete" @click="deletePost">Xóa bài viết</div>
        </div>
        <div class="content-text mg-b-10">{{ dataPost.content }}</div>
        <div class="content-img">
            <img :src="dataPost.imageURL" alt="">
        </div>
        <div class="view-number">
            <div class="view-react"></div>
            <div class="group-comment-share flex">
                <div class="view-comment">10 bình luận</div>
                <div class="view-share">2 lượt chia sẻ</div>
            </div>
        </div>
        <div class="view-button">
            <div class="group-btn" @mouseleave="hideEmoticon">
                <div class="flex reaction-hover" @mouseover="showEmoticon">
                    <div class="icon-18 icon-like"></div>
                    <div class="btn-name">{{ $t('i18nNewsFeed.PostsCard.Like') }}</div>
                </div>
                <div class="group-emoticon" v-if="isShowEmoticon">
                    <div class="icon-36 mg-r-10 icon-emoticon like-emoticon"></div>
                    <div class="icon-36 mg-r-10 icon-emoticon love-emoticon"></div>
                    <div class="icon-36 mg-r-10 icon-emoticon haha-emoticon"></div>
                    <div class="icon-36 mg-r-10 icon-emoticon wow-emoticon"></div>
                    <div class="icon-36 mg-r-10 icon-emoticon sad-emoticon"></div>
                    <div class="icon-36 mg-r-10 icon-emoticon angry-emoticon"></div>
                </div>
            </div>
            <div class="group-btn">
                <div class="icon-18 icon-comment"></div>
                <div class="btn-name">{{ $t('i18nNewsFeed.PostsCard.Comment') }}</div>
            </div>
            <div class="group-btn">
                <div class="icon-18 icon-share"></div>
                <div class="btn-name">{{ $t('i18nNewsFeed.PostsCard.Share') }}</div>
            </div>
        </div>
    </div>
</template>
<script>
import ClickOutSide from "@/mixins/detectoutside.js"
export default {
    name: "PostsBox",
    directives: {
        ClickOutSide
    },
    props:{
        dataPost:{
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
        }
    },
    methods: {
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
        }
    },
}
</script>
<style scoped>
.posts-box{
    position: relative;
    width: 100%;
    background-color: #ffffff;
    border-radius: 12px;
    padding-top: 14px;
    padding-left: 14px;
    padding-right: 14px;
    border: 1px solid #dddddd;
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
.posts-box .name-item .username{
    color: #111111;
    font-weight: 500;
}
.posts-box .name-item .time{
    color: #656565;
}
.posts-box .content-img{
    display: flex;
    justify-content: center;
}
.posts-box .content-img img{
    max-width: 100%;
    max-height: 400px;
    height: auto;
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
    padding: 0 10px;
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
}
</style>