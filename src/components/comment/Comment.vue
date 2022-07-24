<template>
    <div class="write-comment" @mouseleave="hidePopupOption">
        <div class="icon-32 icon-avatar avatar-comment">
            <cld-image 
                :publicId="avatar.cloudinaryID" v-if="isEdit">
                <cld-transformation gravity="south" crop="fill"/>
            </cld-image>
            <cld-image 
                :publicId="dataComment.owner.avatar.cloudinaryID" v-else>
                <cld-transformation gravity="south" crop="fill"/>
            </cld-image>
        </div>
        <div class="content-cmt-write" :class="{'auto-w' : !isEdit}">
            <div class="username" v-if="!isEdit">{{ dataComment.owner.userName }}</div>
            <div class="comment" contenteditable="true" 
            v-if="isEdit"
            v-on="listeners" 
            ref="editcomment" 
            @keydown.enter.prevent="submitComment"
            ></div>
            <div class="comment" v-if="!isEdit">{{ dataComment.content }}</div>
            <div class="item-comment" v-if="isEdit">
                <div class="icon-24 icon-filter-invert item-image">
                    <input class="input-file" ref="inputfile" type="file" accept=".jpg, .jpeg, .png, .gif" multiple @change="onFileChange">
                </div>
            </div>
            <div class="preview-image" v-if="previewImages.length > 0">
                <div class="image" v-for="(image, key) in previewImages" :key="key">
                    <img ref="image" :src="image">
                    <div class="icon-24 clear-img" v-if="isEdit" @click="clearImage(key)">
                        <div class="icon-16 icon-exit"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="icon-24 option-comment" v-if="!isEdit && dataComment.owner._id == userID" @click="showOption" v-click-outside="hidePopupOption">
            <div class="icon-14 icon-three-dots"></div>
            <div class="popup-option" v-if="isShowOption">
                <div class="item-option" @click="updateComment">Chỉnh sửa bình luận</div>
                <div class="item-option item-delete" @click="deleteComment">Xóa bình luận</div>
            </div>
        </div>
    </div>
</template>
<script>
import CommentAPI from "@/api/CommentAPI.js"
import UserAPI from "@/api/UserAPI.js"
import {Notification} from "@/models/enums/Notification.js"
import {RequestEnum} from "@/models/enums/Request.js"

export default {
    name: 'Comment',
    props:{
        value: {
            type: String,
            default: '',
        },
        //ID của người dùng tài khoản
        userID:{
            type: String,
            default: ''
        },
        //Dữ liệu của bài viết
        dataPost:{
            type: Object,
            default(){
                return {}
            }
        },
        //Dữ liệu của 1 comment
        dataComment:{
            type: Object,
            default(){
                return {}
            }
        },
        // Có phải là box comment có thể sửa nội dung hay không
        isEdit:{
            type: Boolean,
            default: false
        },
        isUpdateState: {
            type: Boolean,
            default: false,
        },
        avatar:{
            type: Object,
            default(){
                return {}
            }
        }
    },
    data() {
        return {
            isShowOption: false,    // Ẩn/hiện popup option
            commentImages: [],      //Ảnh trong comment
            imgSrc: null,           //Source base 64 của hình ảnh
            previewImages: [],      //Danh sách các src ảnh base 64 -> Preview Image
            listOldImage: []        //Danh sách hình ảnh khi cập nhật comment 
        }
    },
    computed: {
        listeners() {
            return { ...this.$listeners, input: this.onInput };
        },
    },
    mounted() {
        // Comment ở trạng thái chỉ đọc
        if(!this.isEdit){
            let arraySrc = this.dataComment.image.map(x => x.imageURL);
            this.previewImages = arraySrc;
        }else{
            // Comment ở trạng thái box tạo mới - chỉnh sửa
            this.$refs.editcomment.innerText = this.value;
        }
    },
    methods: {
        onInput(e) {
            this.$emit('input', e.target.innerText);
        },
        /**
         * Render preview image
         */
        onFileChange(e) {
            let arrayImages = e.target.files;
            // Lưu vào mảng images dùng làm data call api
            this.commentImages = e.target.files;
            for (let i = 0; i < arrayImages.length; i++) {
                let reader = new FileReader();
                reader.readAsDataURL(arrayImages[i]);
                reader.onload = () => {
                    this.imgSrc = reader.result;
                    this.previewImages.push(this.imgSrc);
                };
            }
        },
        /**
         * Xóa image preview
         */
        clearImage(key){
            this.$refs.inputfile.value = "";
            //Không thể splice với array File, cần convert sang Array.
            let tempArr = Array.from(this.commentImages);
            tempArr.splice(key, 1);
            this.commentImages = tempArr;
            this.previewImages.splice(key, 1);
        },
        /**
         * Tạo bình luận
         */
        submitComment(){
            if(this.value == '' && this.previewImages.length == 0){
                return;
            }

            // Gửi thông báo bình luận bài viết
            let userInfor = this.$store.getters.userInfor;
            if(userInfor._id != this.dataPost.owner._id){
                let socketNoti = {
                    avatar: userInfor.avatar.cloudinaryID,
                    userName: userInfor.userName,
                    userRequestID: userInfor._id,
                    userRecipientID: this.dataPost.owner._id,
                    typeNoti: Notification.POST,    //typeNoti: 1 (Post)
                    status: RequestEnum.NONE,
                    postID: this.dataPost._id,
                    seen: false
                }
                this.$socket.emit('notification', socketNoti);
                UserAPI.saveRequestNoti(socketNoti);
            }

            this.$eventBus.$emit('loading', true);
            let formData = new FormData();
            formData.append('post', this.dataPost._id);
            formData.append('owner', this.$cookie.get('u_id'));
            formData.append('content', this.value);
            //Push các hình ảnh có trong bình luận muốn update vào listOldImage
            this.previewImages.forEach(element => {           
                if(!this.isBase64(element)){
                    this.listOldImage.push(element);
                }
            });
            formData.append('oldImage', this.listOldImage);
            for( var i = 0; i < this.commentImages.length; i++ ){
                let file = this.commentImages[i];
                formData.append('image', file);
            }
            if(!this.isUpdateState){
                // Bình luận mới
                CommentAPI.save(formData).then(() => {
                    this.commentImages = [];
                    this.previewImages = [];
                    this.$eventBus.$emit('loading', false);
                }).then(()=>{
                    this.$emit('updatePagingComment');
                }); 
            }else{
                //Cập nhật bình luận
                CommentAPI.update(this.dataComment._id, formData).then(() => {
                    this.commentImages = [];
                    this.previewImages = [];
                    this.listOldImage = [];
                    this.$eventBus.$emit('loading', false);
                }).then(()=>{
                    this.$emit('updatePagingComment');
                }); 
            }
            
        },
        //Hiển thị popup lựa chọn comment
        showOption(){
            this.isShowOption = !this.isShowOption;
        },
        // Ẩn option (3 dots)
        hidePopupOption(){
            this.isShowOption = false;
        },
        /**
         * Xóa bình luận
         */
        deleteComment(){
            this.$eventBus.$emit('loading', true);
            CommentAPI.deleteByID(this.dataComment._id).then(() => {
                this.$emit('updatePagingComment');
                this.$eventBus.$emit('loading', false);
            })
        },
        async updateComment(){
            await this.$emit('updateComment', this.dataComment._id);
            this.$refs.editcomment.innerText = this.dataComment.content;    //Gán text vào contenteditable
            this.$emit('input', this.$refs.editcomment.innerText);          //$emit value vào input
            let arraySrc = this.dataComment.image.map(x => x.imageURL);     
            this.previewImages = arraySrc;                      
        },
        //Check image định dạng base64
        isBase64(str) {
            if(str.includes("data:image/jpeg;base64") 
            || str.includes("data:image/png;base64") 
            || str.includes("data:image/jpg;base64") 
            || str.includes("data:image/gif;base64")){
                return true;
            }else{
                return false;
            }
        },
    },
    watch:{
        value: function(){
            if(this.value == ""){
                this.$refs.editcomment.innerText = this.value;
            }
        }
    }
}
</script>
<style scoped>
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
.border-box-comment .write-comment .content-cmt-write .username{
    margin-left: 10px;
    margin-top: 10px;
    font-weight: 450;
    cursor: pointer;
}
.border-box-comment .write-comment .content-cmt-write .username:hover{
    text-decoration: underline;
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
    padding-left: 10px;
    padding-bottom: 4px;
    padding-top: 4px;
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
/* Css comment dưới dạng xem */
.auto-w{
    width: auto!important;
    background-color: #F0F2F5;
    border-radius: 10px;
    padding-right: 10px;
}
.auto-w .comment{
    padding-top: 2px!important;
}
.write-comment:hover .option-comment{
    visibility: visible;
}
.write-comment .option-comment{
    position: relative;
    visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
}
.write-comment .option-comment:hover{
    border-radius: 50%;
    background-color: #F2F2F2;
    cursor: pointer;
}
.icon-exit{
    background: url(../../assets/svg/x-svgrepo-com.svg);
    background-size: contain;
}
.icon-three-dots{
    background: url(../../assets/svg/three-dots-svgrepo-com.svg);
    background-size: contain; 
}
.write-comment .popup-option{
    position: absolute;
    top: 0px;
    left: 30px;
    z-index: 9999;
    padding: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 2px 0 rgb(0 0 0 / 50%);
    border-radius: 4px;
    font-weight: 500;
}
.write-comment .popup-option .item-option{
    padding: 10px;
    cursor: pointer;
    white-space: nowrap;
}
.write-comment .popup-option .item-delete{
    color: #ff3217;
}
.write-comment .popup-option .item-option:hover{
    background-color: #F2F7FC;
}
</style>