<template>
    <div class="m-t-10 wrap-card-recommend">
        <div class="flex space-between">
            <div class="flex">
                <div class="icon-32 icon-avatar avatar-comment" @click="redirectToPersonal"> 
                    <cld-image 
                        :publicId="detailData.owner.avatar.cloudinaryID">
                        <cld-transformation gravity="south" crop="fill"/>
                    </cld-image>
                </div>
                <div class="username">{{ detailData.owner.userName }}</div>
            </div>
            <div class="visit" @click="redirectToPersonal">{{$t('i18nCommon.Visit')}}</div>
        </div>
        <div class="content-text mg-b-10">{{ detailData.content }}</div>
        <div class="multiple-img">
            <div class="content-img" v-for="(image, key) in detailData.image" :key="key">
                <cld-image 
                    :publicId="image.imageURL" 
                    @click.native="viewFullImage(image.imageURL)">
                    <cld-transformation width="auto" gravity="south" crop="fill"/>
                </cld-image>
            </div>
        </div>
        <ZoomImage v-if="showZoomImage" :dataZoomImage="dataZoomImage" @exitDimmed="exitDimmed"></ZoomImage>
    </div>
</template>
<script>
import ZoomImage from "@/components/zoom-image/ZoomImage.vue"

export default {
    name: 'RecommendPostCard',
    components:{
        ZoomImage
    },
    props:{
        detailData:{
            type: Object,
            default(){
                return {}
            }
        }
    },
    data() {
        return {
            showZoomImage: false,
            dataZoomImage: ""
        }
    },
    methods: {
        /**
         * Chuyển hướng đến trang cá nhân
         */
        redirectToPersonal(){
            this.$router.push({
                name: 'Personal',
                params: { id: this.detailData.owner._id.$oid }
            }).catch(()=>{});
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
        },
    },
}
</script>
<style lang="scss" scoped>
.wrap-card-recommend{
    width: 100%;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 14px;
    border: 1px solid #eeeeee;
    box-shadow: 0 1px 2px rgba(41, 41, 41, 0.2);
    margin-bottom: 15px;
}
.username{
    margin-left: 10px;
    font-weight: 450;
}
.visit{
    color: #00B8FF;
    font-size: .875rem;
    font-weight: 700;
    line-height: 1.5;
    text-decoration: none;
}
.visit:hover{
    cursor: pointer;
    text-decoration: underline;
}
.wrap-card-recommend .content-text{
    white-space: pre-line;
    text-align: justify;
}
.wrap-card-recommend .multiple-img{
    display: flex;
}
.wrap-card-recommend .content-img{
    width: 100%;
    border: 1px solid #eeeeee;
}
.wrap-card-recommend .content-img img{
    max-width: 100%;
    height: auto;
    width: 100%;
}
</style>