<template>
    <div class="background-create-posts">
        <div class="create-posts">
            <div class="title-popup" v-if="statePopup == 1">{{ $t('i18nNewsFeed.BoxCreatePost.InsertTitle') }}</div> 
            <div class="title-popup" v-if="statePopup == 2">{{ $t('i18nNewsFeed.BoxCreatePost.UpdateTitle') }}</div> 
            <div class="wrap-content">
                <div class="icon-40 icon-avatar">
                    <cld-image 
                        :publicId="avatar.cloudinaryID">
                        <cld-transformation gravity="south" crop="fill"/>
                    </cld-image>
                </div>
                <div class="wrap-text-image">
                        <div class="post-content" contenteditable="true" v-on="listeners" ref="editable"></div>
                        <div class="preview-image">
                            <div class="image" v-for="(image, key) in previewImages" :key="key">
                                <img ref="image" :src="image">
                                <div class="icon-24 clear-img" @click="clearImage(key, 1)">
                                    <div class="icon-16 icon-exit"></div>
                                </div>
                            </div>
                        </div>
                        <div class="preview-video">
                            <div class="video" v-for="(video, key) in previewVideos" :key="key">
                                <video ref="prevideo" :src="video" controls></video>
                                <div class="icon-24 clear-img" @click="clearImage(key, 2)">
                                    <div class="icon-16 icon-exit"></div>
                                </div>
                            </div>
                        </div>
                </div>
                <div class="icon-34 button-exit" @click="clickExit()">
                    <div class="icon-16 icon-exit"></div>
                </div>
            </div>
            <div class="wrap-button">
                <div class="wrap-active flex">
                    <div class="item flex">
                        <div class="icon-32 icon-picture"></div>
                        <div class="name-item">{{ $t('i18nNewsFeed.BoxCreatePost.PictureAndVideo') }}</div>
                        <input class="input-file" type="file" accept=".jpg, .jpeg, .png, .gif, .mp4, .mov, .fla" multiple @change="onFileChange">
                    </div>
                    <div class="item flex">
                        <div class="icon-32 icon-emotion"></div>
                        <div class="name-item">{{ $t('i18nNewsFeed.BoxCreatePost.QuickEmotion') }}</div>
                    </div>
                </div>
                <div class="button-accept">
                    <ButtonText text="Chia sẻ" :disable="disableButton && (images.length == 0)" @click.native="createPost"/>
                </div>
            </div>
            <Loader v-if="isShowLoader"/>
        </div>
    </div>
</template>
<script>
import ButtonText from "../buttontext/ButtonText.vue"
import Loader from "../loader/Loader.vue"
import {State} from "@/models/enums/State.js"
export default {
    name: "PopupCreateStatus",
    components:{
        ButtonText,
        Loader
    },
    props: {
        value: {
            type: String,
            default: '',
        },
        isShowStatus:{
            type: Boolean,
            default: false,
        },
        dataPost:{
            type: Object,
            default(){
                return {}
            }
        },
        statePopup:{
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            disableButton: true,
            previewImages: [],          //Danh sách các src ảnh base 64 -> Preview Image 
            images: [],                 //Danh sách các file được chọn (ListFile) (Data call api)
            imgSrc : null,              //Source base 64 của hình ảnh
            isShowLoader: false,
            avatar: {},
            previewVideos: [],
        }
    },
    created() {
        let userInfor = this.$store.getters.userInfor;
        this.avatar = userInfor.avatar;
    },
    computed: {
        listeners() {
            return { ...this.$listeners, input: this.onInput };
        },
    },
    mounted() {
        this.autoFocus();
        this.$refs.editable.innerText = this.value;
        if(this.statePopup == State.Update){
            this.disableButton = false;
            this.$refs.editable.innerText = this.dataPost.content;
            this.$emit('input', this.$refs.editable.innerText);
            let lstSrcImg = this.dataPost.image.filter(x => x.resourceType.includes('image'));
            let lstSrcVideo = this.dataPost.image.filter(x => x.resourceType.includes('video'));
            this.previewImages = lstSrcImg.map(x => x.imageURL);
            this.previewVideos = lstSrcVideo.map(x => x.imageURL);
        }  
    },
    methods: {
        onInput(e) {
            this.$emit('input', e.target.innerText);
        },

        //Click exit popup
        clickExit(){
            this.$emit('hideStatus');
        },
        /**
         * Autofocus
         * @created 24/11/2021
         */
        autoFocus(){
            this.$refs.editable.focus();
        },
        /**
         * Emit sự kiện tạo bài viết
         * @created 25/11/2021
         */
        createPost(){
            if(this.disableButton && (this.images.length == 0)){
                return;
            }
            this.isShowLoader = true;
            if(this.statePopup == State.Update){
                // Emit khi trạng thái: sửa bài viết
                // Check chuỗi có phải là base64 hay không? (Base64: ảnh mới add, URL cloudinary: ảnh cũ)
                let listOldImage = [];
                this.previewImages.forEach(element => {
                    if(!this.isBase64(element)){
                        listOldImage.push(element);
                    }
                });
                this.previewVideos.forEach(element => {
                    if(!this.isBase64(element)){
                        listOldImage.push(element);
                    }
                });
                this.$emit('createPost', this.images, listOldImage);
            }else{
                // Emit khi trạng thái: tạo bài viết mới
                this.$emit('createPost', this.images, null);
            }
        },
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
        /**
         * Render preview image
         */
        onFileChange(e) {
            let lstFiles = e.target.files;
            lstFiles.forEach(element => {
                this.images.push(element);
            });
            let arrayImages = [...lstFiles].filter(x => x.type.includes('image'));
            let arrayVideos = [...lstFiles].filter(x => x.type.includes('video'));
            // Lưu vào mảng images dùng làm data call api
            // this.images = e.target.files;
            if(arrayImages.length > 0){
                this.handlePreviewImage(arrayImages);
            }
            if(arrayVideos.length > 0){
                this.handlePreviewVideo(arrayVideos);
            }
            // for (let i = 0; i < arrayImages.length; i++) {
            //     let reader = new FileReader();
            //     reader.readAsDataURL(arrayImages[i]);
            //     reader.onload = () => {
            //         this.imgSrc = reader.result;
            //         this.previewImages.push(this.imgSrc);
            //     };
            // }
        },
        handlePreviewImage(imageFiles){
            for (let i = 0; i < imageFiles.length; i++) {
                let reader = new FileReader();
                reader.readAsDataURL(imageFiles[i]);
                reader.onload = () => {
                    this.imgSrc = reader.result;
                    this.previewImages.push(this.imgSrc);
                };
            }
        },
        /**
         * Preview video
         */
        handlePreviewVideo(videoFiles){
            for (let i = 0; i < videoFiles.length; i++) {
                let reader = new FileReader();
                reader.readAsDataURL(videoFiles[i]);
                reader.onload = () => {
                    let videoSrc = reader.result;
                    this.previewVideos.push(videoSrc);
                };
            }
        },
        /**
         * Xóa image preview
         */
        clearImage(key, type){
            //Không thể splice với array File, cần convert sang Array.
            let tempArr = Array.from(this.images);
            tempArr.splice(key, 1);
            this.images = tempArr;
            if(type == 1){
                this.previewImages.splice(key, 1);
            }else{
                this.previewVideos.splice(key, 1);
            }
        }
    },
    watch:{
        value: function(){
            if(this.value){
                this.disableButton = false;
            }else{
                this.disableButton = true;
            }
        },
    }
}
</script>
<style scoped>
.background-create-posts{
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
}
.create-posts{
    display: flex;
    flex-direction: column;
    position: relative;
    top: 74px;
    left: calc(50vw - 325px);
    width: 650px;
    background-color: #ffffff;
    padding: 10px 18px;
    padding-right: 10px;
    border-radius: 8px;
}
.create-posts .title-popup{
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    font-weight: 500;
    padding-bottom: 8px;
}
.create-posts .wrap-content{
    padding-bottom: 10px;
    border-bottom: 1px solid #dddddd;
    display: flex;
    box-sizing: border-box;
    width: 100%;
}
.wrap-content .wrap-text-image{
    width: 90%;
    max-height: 380px;
    overflow: hidden;
    overflow-y: scroll;

}
.create-posts .wrap-content .post-content{
    font-size: 15px;
    color: #444649;
    width: 100%;
    padding: 0 10px;
    margin-top: 18px;
    overflow: hidden;
    overflow-y: scroll;
    text-align: justify;
}
.wrap-content .wrap-text-image .preview-image{
    width: 100%;
    display: flex;
    margin-top: 10px;
    overflow-y: scroll;
}
.wrap-content .wrap-text-image .preview-image .image{
    position: relative;
    margin-right: 10px;
    
}
.clear-img{
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
.clear-img:hover{
    background-color: #dfdfdf;
}
.wrap-text-image .preview-image img{
    max-width: 200px;
}
.wrap-content .wrap-text-image .preview-video{
    width: 100%;
    display: flex;
    margin-top: 10px;
    overflow-y: scroll;
}
.wrap-content .wrap-text-image .preview-video .video{
    position: relative;
    margin-right: 10px;
    
}
.preview-video video{
    max-width: 300px;
}
.create-posts .wrap-button{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    margin-right: 10px;
    font-size: 15px;
}
.wrap-active .item{
    position: relative;
    padding: 5px 5px;
    margin-right: 5px;
    overflow: hidden;
}
.wrap-active .item:hover{
    background-color: #F2F7FC;
    cursor: pointer;
    border-radius: 4px;
}
.wrap-active .item .name-item{
    font-weight: 500;
    font-size: 15px;
    margin-left: 5px;
    color: #444649;
}
.button-exit{
    position: absolute;
    top: 8px;
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    cursor: pointer;
}
.button-exit:hover{
    background-color: #dddddd;
}
.icon-exit{
    background: url(../../assets/svg/x-svgrepo-com.svg);
    background-size: contain;
}
.icon-picture{
    background: url(../../assets/svg/picture-photo-svgrepo-com.svg);
    background-size: contain;
}
.icon-emotion{
    background: url(../../assets/svg/emoticon.svg);
    background-size: contain;
}  
.background-create-posts ::-webkit-scrollbar-track {
    display: none;
} 
.input-file{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 112px;
    opacity: 0;
    cursor: pointer;
}

</style>