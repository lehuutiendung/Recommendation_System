<template>
    <div class="background-create-posts">
        <div class="create-posts">
            <div class="wrap-content">
                <div class="icon-40 icon-avatar"></div>
                <div class="wrap-text-image">
                        <div class="post-content" contenteditable="true" v-on="listeners" ref="editable"></div>
                        <div class="preview-image">
                            <div class="image" v-for="(image, key) in images" :key="key">
                                <img ref="image">
                                <div class="icon-24 clear-img" @click="clearImage">
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
                        <input class="input-file" type="file" accept="image/jpg, image/jpeg, image/png, image/gif" multiple @change="onFileChange">
                    </div>
                    <div class="item flex">
                        <div class="icon-32 icon-emotion"></div>
                        <div class="name-item">{{ $t('i18nNewsFeed.BoxCreatePost.QuickEmotion') }}</div>
                    </div>
                </div>
                <div class="button-accept">
                    <ButtonText text="Chia sẻ" :disable="disableButton" @click.native="createPost"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ButtonText from "../buttontext/ButtonText.vue"
export default {
    name: "PopupCreateStatus",
    components:{
        ButtonText,
    },
    props: {
        value: {
            type: String,
            default: '',
        },
        isShowStatus:{
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            disableButton: true,
            images: [],                 //Danh sách các file được chọn 
        }
    },
    computed: {
        listeners() {
            return { ...this.$listeners, input: this.onInput };
        },
    },
    mounted() {
        this.autoFocus();
        this.$refs.editable.innerText = this.value;
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
            if(this.disableButton){
                return;
            }
            this.$emit('createPost', this.images);
        },
        onFileChange(e) {
            this.images = e.target.files;

            for (let i = 0; i < this.images.length; i++) {
                let reader = new FileReader();
                reader.onload = () => {
                    this.$refs.image[i].src = reader.result;
                };
                reader.readAsDataURL(this.images[i]);
            }
        },
        clearImage(e){
            console.log(e);
        }
    },
    watch:{
        value: function(){
            if(this.value){
                this.disableButton = false;
            }else{
                this.disableButton = true;
            }
        }
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
    padding: 18px;
    padding-bottom: 10px;
    padding-right: 10px;
    border-radius: 8px;
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
.preview-image .image .clear-img{
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
.preview-image .image .clear-img:hover{
    background-color: #dfdfdf;
}
.wrap-text-image .preview-image img{
    max-width: 200px;
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
    top: 5px;
    right: 5px;
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