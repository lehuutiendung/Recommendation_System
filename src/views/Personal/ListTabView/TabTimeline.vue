<template>
    <div class="body-timeline-personal">
        <div class="left-bar">
            <!-- Giới thiệu -->
            <div class="box box-about">
                <div class="title">{{ $t('i18nPersonal.TabTimeline.About' )}}</div>
                <div class="line">
                    <div class="icon-20 icon-quotes"></div>
                    <div class="m-l-10">Trích dẫn ý nghĩa: {{ dataUser.quotes }}</div>
                </div>
                <div class="line">
                    <div class="icon-20 icon-live"></div>
                    <div class="m-l-10">Đến từ {{ dataUser.hometown }}</div>
                </div>
                <div class="line">
                    <div class="icon-20 icon-email"></div>
                    <div class="m-l-10">{{ dataUser.email }}</div>
                </div>
                <div class="line">
                    <div class="icon-20 icon-clock"></div>
                    <div class="m-l-10">Tham gia ngày {{ joinDate }}</div>
                </div>
            </div>
            <!-- Bạn bè -->
            <div class="box box-friend">
                <div class="flex-spacebetween">
                    <div class="title">{{ $t('i18nPersonal.TabTimeline.Friend') }}</div>
                    <div class="button-more" @click="redirectToTabAllFriend(dataUser._id)">{{ $t('i18nPersonal.TabTimeline.ViewAllFriend' )}}</div>
                </div>
                <div class="m-t-10">100 {{ $t('i18nPersonal.TabTimeline.FriendText' )}}</div>
                <div class="grid-friend">
                    <div class="grid-item" v-for="(friend, index) in topFriend" :key="index">
                        <div class="picture" @click="redirectToPageFriend(friend._id)">
                            <cld-image 
                                :publicId="friend.avatar.imageURL" 
                                loading="lazy">
                                <cld-transformation width="100" gravity="south" crop="fill"/>
                            </cld-image>
                        </div>
                        <span class="name-fr" @click="redirectToPageFriend(friend._id)">{{ friend.userName }}</span>
                    </div>
                </div>
            </div>
            <!-- Gợi ý trang -->
            <div class="box box-suggest-page m-b-10">
                <div class="title">{{ $t('i18nPersonal.TabTimeline.SuggestPage' )}}</div>
                <div class="item-group">
                    <div class="avatar-gr">
                        <cld-image 
                            :publicId="imageDefault" 
                            loading="lazy">
                            <cld-transformation width="100" gravity="south" crop="fill"/>
                        </cld-image>
                    </div>
                    <div class="name-gr">Nhóm sinh viên đại học Bách Khoa Hà Nội</div>
                </div>
                <div class="item-group">
                    <div class="avatar-gr">
                        <cld-image 
                            :publicId="imageDefault" 
                            loading="lazy">
                            <cld-transformation width="100" gravity="south" crop="fill"/>
                        </cld-image>
                    </div>
                    <div class="name-gr">Nhóm sinh viên trường công nghệ thông tin - ĐHBKHN</div>
                </div>
                <div class="item-group">
                    <div class="avatar-gr">
                        <cld-image 
                            :publicId="imageDefault" 
                            loading="lazy">
                            <cld-transformation width="100" gravity="south" crop="fill"/>
                        </cld-image>
                    </div>
                    <div class="name-gr">Viện CNTT&TT</div>
                </div>
                <div class="item-group">
                    <div class="avatar-gr">
                        <cld-image 
                            :publicId="imageDefault" 
                            loading="lazy">
                            <cld-transformation width="100" gravity="south" crop="fill"/>
                        </cld-image>
                    </div>
                    <div class="name-gr">Nhóm sinh viên đại học Bách Khoa Hà Nội</div>
                </div>
            </div>
        </div>
        <!-- Center -->
        <div class="center">
            <div class="visonet center-timeline">
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
                <div class="wrap-posts" v-for="item in listDataPost" :key="item._id">
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
        </div>
        <div class="right-bar">
            <!-- Hình ảnh gần đây -->
            <div class="box box-picture">
                <div class="title">{{ $t('i18nPersonal.TabTimeline.LatestPhotos' )}}</div>
                <div class="grid-picture">
                    <div class="grid-item" v-for="(picture, index) in 9" :key="index">
                        <div class="picture">
                            <cld-image 
                                :publicId="imageDefault" 
                                loading="lazy">
                                <cld-transformation gravity="south" crop="fill"/>
                            </cld-image>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Gợi ý bạn bè -->
            <div class="box box-suggest-friend m-b-10">
                <div class="title">{{ $t('i18nPersonal.TabTimeline.SuggestFriend' )}}</div>
                <div class="item-friend" v-for="(friend, index) in 8" :key="index">
                    <div class="flex">
                        <div class="avatar-fr">
                            <cld-image 
                                :publicId="imageDefault" 
                                loading="lazy">
                                <cld-transformation width="100" gravity="south" crop="fill"/>
                            </cld-image>
                        </div>
                        <div class="name-fr">Đỗ Đình Đức</div>
                    </div>
                    <div class="quick-add-friend">
                        <div class="icon-16 icon-add-friend"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PostsBox from "@/components/posts-box/PostsBox.vue"
import PopupCreateStatus from "@/components/popup-create-status/PopupCreateStatus.vue"
import PostAPI from "@/api/PostAPI.js"
import UserAPI from "@/api/UserAPI.js"
import {State} from "@/models/enums/State.js"
import Observer from "@/components/observer/Observer.vue"
import moment from "moment"

export default {
    name: 'TabTimelinePersonal',
    components:{
        PostsBox,
        PopupCreateStatus,
        Observer
    },
    data() {
        return {
            imageDefault: "Image Default/groups-default-cover-photo-2x_k8zc6f",
            isShowStatus: false,        //Ẩn-hiện popup tạo bài viết     
            contentStatus: "",          //Nội dung text bài viết
            listDataPost: [],           //Danh sách dữ liệu bài viết
            dataPost: {},               //Dữ liệu của một bài viết
            statePopup: State.Insert,   //Trạng thái đầu tiên "Thêm mới"
            pageIndex: 0,               //Phân trang dữ liệu
            pageSize: 3,                //Số bản ghi query trong 1 lần paging
            totalPage: 0,               //Tổng số bản ghi
            userID: "",                 //ID của người dùng tại trang cá nhân
            topFriend: [],              //Danh sách top 4 bạn bè
            dataUser:{},                 //Object user
            joinDate: "",
            avatar: {},                 //Avatar account
        }
    },
    created() {
        let userInfor = this.$store.getters.userInfor;
        this.avatar= userInfor.avatar;
        this.groupID = this.$route.params.id;
        this.getTopFriend();
        this.getInfoUser();
    },
    mounted() {
        this.userID = this.$route.params.id;
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
        // getPagingData(){
        //     if(this.pageIndex > this.totalPage){
        //         return;
        //     }
        //     this.pageIndex++;
        //     let dataReq = {
        //         pageIndex: this.pageIndex,
        //         pageSize: this.pageSize,
        //     }
        //     PostAPI.getPaging(dataReq).then( res => {
        //         this.totalPage = res.data.data.totalPage;
        //         //Push thêm data vào listDataPost
        //         this.listDataPost = [...this.listDataPost, ...res.data.data.doc];
        //     })
        // },
        getPagingData(){
            if(this.pageIndex > this.totalPage){
                return;
            }
            this.pageIndex++;
            let dataReq = {
                userID: this.$route.params.id,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            }
            PostAPI.getPagingInWall(dataReq).then( res => {
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
            
            this.listDataPost = [];
            this.pageIndex = 0;
            this.totalPage = 0;
            
            if(this.statePopup == State.Insert){
                PostAPI.save(formData).then(() => {
                    this.hideStatus();
                    console.log('tab timeline');
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
                // this.getPagingData();
                this.listDataPost = [];
            })
        },
        /**
         * Update bài viết
         */
        forwardData(data){
            this.isShowStatus = true;
            this.dataPost = data;
            this.statePopup = State.Update;
        },
        /**
         * Lấy top 4 người bạn
         */
        getTopFriend(){
            let filter = {
                userID: this.$route.params.id,
                pageSize: 4,
                pageIndex: 1,
            }
            UserAPI.filterTopFriend(filter).then((res)=>{
                this.topFriend = res.data.doc.friends;
            })
        },
        /**
         * Call API thông tin của người dùng
         */
        getInfoUser(){
            UserAPI.getByID(this.$route.params.id).then((res)=>{
                this.dataUser = res.data.doc;
                this.joinDate = moment(this.dataUser.createdAt).format('DD-MM-YYYY');
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
        },
        /**
         * Chuyển hướng đến tab bạn bè trong trang cá nhân
         */
        redirectToTabAllFriend(userID){
            this.$router.push({
                name: 'Personal.TabFriendPersonal',
                params: { id: userID }
            }).catch(()=>{});
        }
    },
    watch:{
        // Cập nhật thông tin khi thay đổi trang cá nhân 
        '$route.params.id': {
            handler: function(userIDCurrent) {
                if(this.userID != userIDCurrent){
                    this.getTopFriend();
                    this.getInfoUser();
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
@import "../../../css/views/NewsFeed/newsfeed.css";
.body-timeline-personal{
    display: flex;
    box-sizing: border-box;
    min-height: 400px;
    height: 100%;
    // Common
    .box{
        background-color: #ffffff;
        border-radius: 0.5rem;
        box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%);
        -webkit-transition: all .3s ease-in-out;
        margin-bottom: 10px;
        padding: 12px;
        .title{
            font-size: 18px;
            font-weight: 500;
        }
        .line{
            display: flex;
            align-items: center;
            font-size: 15px;
            margin-top: 10px;
        }
    }
    /** Left bar */
    .left-bar{
        width: var(--sidebarLeft-width-personal);
        background-color: var(--background-app);
        padding: 10px;
        padding-left: 2%;
        padding-right: 4%;
        overflow: inherit!important;
        position: relative;
        .box-friend{
            .flex-spacebetween{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .grid-friend{
                display: grid;
                margin-top: 10px;
                grid-column-gap: 10px;
                grid-row-gap: 10px;
                grid-template-columns: 1fr 1fr 1fr;
                .grid-item{
                    aspect-ratio: 1;
                    -webkit-transition: all .2s ease-in-out;
                    .picture{
                        width: 100%;
                        height: 100%;
                        img{
                            border-radius: 4px;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                    .name-fr{
                        font-size: 14px;
                        font-weight: 450;
                        margin-top: 2px;
                    }
                    .name-fr:hover{
                        text-decoration: underline;
                        cursor: pointer;
                    }
                }
            }
        }
        .box-suggest-page{
            .item-group{
                display: flex;
                margin-top: 10px;
                .avatar-gr{
                    width: 46px;
                    height: 46px;
                }
                .avatar-gr img{
                    width: inherit;
                    height: inherit;
                    object-fit: cover;
                    border-radius: 30px;
                }
                .name-gr{
                    margin-left: 10px;
                    font-weight: 450;
                }
                .name-gr:hover{
                    text-decoration: underline;
                }
            }
        }
    }

    /* Center */
    .center{
        width: var(--content-width-personal);
        padding: 0;
    }

    /* Right-bar */
    .right-bar{
        width: var(--sidebarRight-width-personal);
        background-color: var(--background-app);
        padding: 10px;
        padding-left: 4%;
        padding-right: 2%;
        overflow: inherit!important;
        .box-picture{
            .grid-picture{
                display: grid;
                margin-top: 10px;
                grid-column-gap: 10px;
                grid-row-gap: 10px;
                grid-template-columns: 1fr 1fr 1fr;
                .grid-item{
                    aspect-ratio: 1;
                    -webkit-transition: all .2s ease-in-out;
                    .picture{
                        width: 100%;
                        height: 100%;
                        img{
                            border-radius: 4px;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                }
                .grid-item:hover{
                    transform: scale(1.2);
                    cursor: pointer;
                }
            }
        }
        .box-suggest-friend{
            .item-friend{
                display: flex;
                margin-top: 10px;
                justify-content: space-between;
                align-items: center;
                .avatar-fr{
                    width: 46px;
                    height: 46px;
                }
                .avatar-fr img{
                    width: inherit;
                    height: inherit;
                    object-fit: cover;
                    border-radius: 30px;
                }
                .name-fr{
                    margin-left: 10px;
                    font-weight: 450;
                }
                .name-fr:hover{
                    text-decoration: underline;
                }
                .quick-add-friend{
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgb(120, 180, 248);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: width 0.3s ease 0s, height 0.3s ease 0s, opacity 0.3s ease 0s;
                }
                .quick-add-friend:hover{
                    background-color: #F4F3FE;
                }
            }
        }
    }
    .button-more{
        color: #216FDB;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
    }
    .button-more:hover{
        background-color: #F2F2F2;
    }
}  
.body-timeline-personal .center-timeline{
    margin-top: 10px;
}
.icon-live{
    background-image: url(../../../assets/icon/icon-live.png);
    -webkit-filter: var(--filter-placeholder-icon);
}  
.icon-add-friend{
    background-image: url(../../../assets/svg/add-friend.svg);
    background-size: contain;
    -webkit-filter: var(--filter-placeholder-icon);

}
</style>